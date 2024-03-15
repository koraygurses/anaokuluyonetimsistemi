import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonRow,
  IonToast,
} from "@ionic/react";
import React, { RefObject, useRef, useState } from "react";
import { AuthApi } from "../../api/api";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bcrypt from "bcryptjs";
import jwt from "jwt-decode"; // import dependency
import { useAppDispatch } from "../reducers/hooks";
import { setRole } from "../reducers/roleReducer";
import { setUser } from "../reducers/userReducer";
import { AYS_BASEPATH } from "../utils/AysConfiguration";

interface Props {
  setTokenSet: React.Dispatch<React.SetStateAction<boolean>>;
}

const saltRounds = 10;
//bunu güvenli saklamamız lazım
const salt = "$2a$10$mfwcEhLpEKI4v7hgDDfMgu"; //bcrypt.genSaltSync(saltRounds);

function LoginPage(props: Props) {
  //state
  const [isToastOpen, setToastOpen] = useState<{
    isOpen: boolean;
    color: string;
    message: string;
  }>({ isOpen: false, color: "", message: "" });
  const [isGSMTouched, setIsGSMTouched] = useState(false);
  const [isPassTouched, setIsPassTouched] = useState(false);
  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isPassValid, setIsPassValid] = useState<boolean>();
  const [isGSMValid, setIsGSMValid] = useState<boolean>();

  //ref
  const gsm = useRef() as RefObject<HTMLIonInputElement>;
  const password = useRef() as RefObject<HTMLIonInputElement>;

  //api
  const authApi = new AuthApi({ basePath: AYS_BASEPATH });

  //dispatch
  const dispatch = useAppDispatch();

  //const
  const extension = "90";
  const extensionPrefix = "+";

  const refHookNullChecker = (value: any | null) => {
    if (value || value !== null) {
      return value;
    } else {
      return "";
    }
  };

  const prefixGSM = (gsm: string | number | null | undefined) => {
    if (gsm) {
      return extensionPrefix + extension + gsm;
    } else {
      return "";
    }
  };

  // burada daha düzgün bi validator kullanıcaz
  const validateGSMRegex = (gsm: string) => {
    if (/^(?:\d{10}|\+90\d{10})$/.test(prefixGSM(gsm))) {
      return true;
    } else {
      return false;
    }
  };

  //burada daha düzgün bi validator kullanıcaz
  const validatePassRegex = (password: string) => {
    return password.length >= 8;
  };

  const valideLogin = () => {
    if (gsm && gsm.current && password && password.current) {
      return (
        validateGSMRegex(refHookNullChecker(gsm.current.value)) &&
        validatePassRegex(refHookNullChecker(password.current.value))
      );
    }
  };
  const focusGSM = () => {
    (gsm.current as HTMLIonInputElement).focus;
  };
  const focusPass = () => {
    (password.current as HTMLIonInputElement).focus;
  };
  const validateGSM = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsGSMValid(false);

    if (value === "") return;

    validateGSMRegex(value) !== true
      ? setIsGSMValid(true)
      : setIsGSMValid(false);
  };

  const validatePass = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

    setIsPassValid(undefined);

    if (value === "") return;

    validatePassRegex(value) !== null
      ? setIsPassValid(true)
      : setIsPassValid(false);
  };

  const markGSMTouched = () => {
    setIsGSMTouched(true);
  };
  const markPassTouched = () => {
    setIsPassTouched(true);
  };

  const togglePassword = () => {
    setIsPassVisible(!isPassVisible);
  };

  const login = () => {
    if (valideLogin() && password && password.current && gsm && gsm.current) {
      let hashedPassword = bcrypt.hashSync(
        refHookNullChecker(password.current.value),
        salt
      );

      authApi
        .authControllerLogin({
          gsm: prefixGSM(gsm.current.value),
          password: hashedPassword,
        })
        .then((response) => {
          if (response.status === 401) {
            setToastOpen({
              isOpen: true,
              color: "danger",
              message: "Bağlantı için izin yok",
            });
          } else if (response.status === 200) {
            setToastOpen({
              isOpen: true,
              color: "success",
              message: "Başarıyla giriş yapıldı",
            });

            setTimeout(() => {
              // ya bu typescript çok nazlı
              const token = (response.data as any).accessToken;
              const user: any = jwt(token);

              localStorage.setItem("auth", token);
              localStorage.setItem("user", JSON.stringify(user));

              dispatch(setRole(user.roles[0]));
              dispatch(setUser(user));

              props.setTokenSet(true);
            }, 500);
          }
        })
        .catch((error) => {
          setToastOpen({
            isOpen: true,
            color: "danger",
            message: error,
          });
        });
    } else {
      setToastOpen({
        isOpen: true,
        color: "danger",
        message: "Geçersiz bilgi",
      });
    }
  };

  return (
    <IonContent forceOverscroll={false}>
      <IonToast
        isOpen={isToastOpen.isOpen}
        message={isToastOpen.message}
        color={isToastOpen.color}
        onDidDismiss={() =>
          setToastOpen({
            isOpen: false,
            color: "",
            message: "",
          })
        }
        duration={3000}
      ></IonToast>
      <IonGrid className="h100">
        <IonRow className="ion-align-items-center h100">
          <IonCol
            size="12"
            sizeSm="8"
            offsetSm="2"
            sizeMd="6"
            offsetMd="3"
            sizeLg="4"
            offsetLg="4"
          >
            <IonCard mode="ios" className="shadow-light" color="light">
              <IonCardHeader>
                <IonCardTitle>AYS</IonCardTitle>
                <IonCardSubtitle>Giriş</IonCardSubtitle>
              </IonCardHeader>
              <IonCard className="ays-pb16 shadow-light">
                <IonItem
                  mode="ios"
                  lines="none"
                  className={` ${isGSMValid && "ion-valid"} ${isGSMValid === false && "ion-invalid"
                    } ${isGSMTouched && "ion-touched"}`}
                >
                  <IonInput
                    label="GSM:"
                    labelPlacement="floating"
                    fill="solid"
                    required
                    ref={gsm}
                    inputmode="tel"
                    type="tel"
                    pattern="tel"
                    helperText="Örn. 5556667788"
                    errorText="Geçersiz Numara"
                    onIonInput={(event) => {
                      focusGSM();
                      validateGSM(event);
                    }}
                    onIonBlur={() => markGSMTouched()}
                  ></IonInput>
                </IonItem>
                <IonItem
                  mode="ios"
                  lines="none"
                  className={` ${isPassValid === true && "ion-valid"} ${isPassValid === false && "ion-invalid"
                    } ${isPassTouched && "ion-touched"}`}
                >
                  <IonInput
                    label="Şifre : "
                    labelPlacement="floating"
                    fill="solid"
                    required
                    ref={password}
                    type={isPassVisible ? "text" : "password"}
                    pattern="password"
                    onIonInput={(event) => {
                      validatePass(event);
                    }}
                    onIonBlur={() => markPassTouched()}
                  ></IonInput>
                  <IonButton fill="outline" item-right>
                    <FontAwesomeIcon
                      icon={isPassVisible ? faEye : faEyeSlash}
                      onClick={() => {
                        togglePassword();
                      }}
                    />
                  </IonButton>
                </IonItem>
              </IonCard>
              <IonCard color="primary">
                <IonButton
                  className="ays-no-m"
                  expand="block"
                  fill="clear"
                  color="light"
                  onClick={() => {
                    login();
                  }}
                >
                  Giriş Yap
                </IonButton>
              </IonCard>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
}

export default LoginPage;
