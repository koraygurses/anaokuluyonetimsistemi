import { useEffect, useRef, useState } from "react";
import DateSelector from "../../utils/DateSelector";
import { ClassApi, TeacherApi } from "../../../api/api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import {
  ClassDto,
  CreateTeacherDto,
  CreateTeacherDtoGenderEnum,
  TeacherDtoGenderEnum,
} from "../../../api/models";
import AysLetterInput, {
  AysLetterInputElement,
} from "../../utils/AysInput/AysLetterInput";
import AysPhoneInput, {
  AysPhoneInputElement,
} from "../../utils/AysInput/AysPhoneInput";
import AysEmailInput, {
  AysEmailInputElement,
} from "../../utils/AysInput/AysEmailInput";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import { Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
import AysUtils from "../../utils/AysUtils";

interface Props {
  isModalOpen: boolean;
  closeModal: (toast: {
    isToastOpen: boolean;
    toastMsg: string;
    color: string;
  }) => void;
}

function AddTeacherModal({ isModalOpen, closeModal }: Props) {
  const extension = "90";
  const extensionPrefix = "+";

  const initToastInfo = {
    isToastOpen: false,
    toastMsg: "",
    color: "danger",
  };

  const [toastInfo, setToastInfo] = useState(initToastInfo);
  const [classList, setClassList] = useState<ClassDto[]>([]);

  const teacherApi = new TeacherApi({ basePath: AYS_BASEPATH });
  const classApi = new ClassApi({ basePath: AYS_BASEPATH });

  let dateSelector = new DateSelector({ required: true });

  const nameRef = useRef<AysLetterInputElement>(null);
  const gsmRef = useRef<AysPhoneInputElement>(null);
  const emailRef = useRef<AysEmailInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const classRef = useRef<HTMLIonSelectElement>(null);

  const prefixGSM = (gsm: string | number | null | undefined) => {
    if (gsm) {
      return extensionPrefix + extension + gsm;
    } else {
      return "";
    }
  };

  const getClassSelect = async () => {
    const response = await classApi.classControllerFindAll();
    const classListData: ClassDto[] = response.data;
    setClassList(classListData);
  };

  useEffect(() => {
    getClassSelect();
  }, [isModalOpen]);

  const confirmTeacherCreation = async () => {
    try {
      if (
        nameRef.current &&
        genderRef.current &&
        emailRef.current &&
        gsmRef.current &&
        classRef.current
      ) {
        nameRef.current.activate();
        emailRef.current.activate();
        gsmRef.current.activate();

        let birthDate = dateSelector.getDate();
        let email = (
          emailRef.current as AysEmailInputElement
        ).getValue() as string;
        let gsm = (
          (gsmRef.current as AysPhoneInputElement).getValue() as string
        ).replace(/\s/g, "");
        let name = nameRef.current
          ? AysUtils.capitalizeName(nameRef.current.getValue() as string)
          : undefined;

        if (
          (birthDate && isNaN(birthDate.getTime())) ||
          !nameRef.current.isValid() ||
          genderRef.current.value === "blank" ||
          !emailRef.current.isValid() ||
          !gsmRef.current.isValid() ||
          classRef.current.value === undefined ||
          classRef.current.value.length === 0
        ) {
          setToastInfo({
            isToastOpen: true,
            toastMsg: "Girilen Bilgiler Eksik Veya Hatalı",
            color: "danger",
          });
          return;
        }

        let classIdList: string[] = [];

        if (classRef.current) {
          (classRef.current.value as string[]).forEach((clazz) => {
            classIdList.push((clazz as any)._id);
          });
        }

        let newTeacher: CreateTeacherDto = {
          gsm: prefixGSM(gsm),
          name: name as string,
          email: email as string,
          gender:
            genderRef.current.value === "male"
              ? CreateTeacherDtoGenderEnum.Male
              : CreateTeacherDtoGenderEnum.Female,
          birth: (birthDate as any).getTime() as number,
          classid: classIdList,
        };

        let response = await teacherApi
          .teacherControllerCreate(newTeacher)
          .then((res) => {
            if (res.status === 200 || 201) {
              closeModal({
                isToastOpen: true,
                toastMsg:
                  (name as string) + " İsimli Öğretmen Başarıyla Oluşturuldu",
                color: "success",
              });
            } else if (res.status === 400 || 401 || 402 || 403 || 404) {
              closeModal({
                isToastOpen: true,
                toastMsg: (name as string) + " İsimli Öğretmen Oluşturulamadı",
                color: "danger",
              });
            }
          })
          .catch((res) => {
            setToastInfo({
              isToastOpen: true,
              toastMsg: res.response.data.message,
              color: "danger",
            });
          });
      } else {
        setToastInfo({
          isToastOpen: true,
          toastMsg: "Öğretmen Oluşturulurken Hata Oluştu",
          color: "danger",
        });
      }
    } catch (e) {
      setToastInfo({
        isToastOpen: true,
        toastMsg: "Öğretmen Oluşturulurken Hata Oluştu",
        color: "danger",
      });
    }
  };

  return (
    <IonModal isOpen={isModalOpen} className="fullscreen-modal">
      <IonContent forceOverscroll={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Öğretmen Oluşturma</IonTitle>
            <IonButtons slot="end">
              <IonButton
                color="medium"
                onClick={() => closeModal(initToastInfo)}
              >
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <div className="edit-modal">
          <Form className="p-1 ps-3 pe-3 pt-3">
            <Row className="mb-3">
              <AysLetterInput
                label="Ad Soyad"
                ref={nameRef}
                labelPlacement="stacked"
                errorText="Geçersiz Karakter"
              />
            </Row>
            <Row className="mb-3">
              <Col>
                <AysPhoneInput
                  ref={gsmRef}
                  label="Tel No"
                  placeholder="Örn. 555 555 5555"
                  labelPlacement="stacked"
                />
              </Col>
              <Col>
                <FormGroup>
                  <FormLabel>
                    {AysUtils.getLabelWithRequiredIndicator("Cinsiyet")}
                  </FormLabel>
                  <Form.Select ref={genderRef}>
                    <option hidden value={"blank"}>
                      {" "}
                    </option>
                    <option value={TeacherDtoGenderEnum.Female}>Kadın</option>
                    <option value={TeacherDtoGenderEnum.Male}>Erkek</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row className="mb-3">
              <AysEmailInput
                ref={emailRef}
                label="Email"
                labelPlacement="stacked"
              />
            </Row>
            <Row className="mb-3">{dateSelector.render()}</Row>
            <Row>
              <FormGroup>
                <Form.Label>
                  {AysUtils.getLabelWithRequiredIndicator("Sınıf")}
                </Form.Label>
                <IonSelect
                  className="edit-select"
                  interfaceOptions={{
                    header: "Sınıf",
                  }}
                  cancelText="İptal"
                  okText="Tamam"
                  multiple={true}
                  ref={classRef}
                >
                  {classList.map((clazz, index) => (
                    <IonSelectOption key={index} value={clazz}>
                      {clazz.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </FormGroup>
            </Row>
          </Form>
          <IonButtons className="student-info-confirm-btn-container ays-p16">
            <IonButton
              color="primary"
              fill="solid"
              className="student-info-confirm-btn"
              shape="round"
              onClick={() => confirmTeacherCreation()}
            >
              Öğretmen Oluştur
            </IonButton>
          </IonButtons>
          <IonToast
            isOpen={toastInfo.isToastOpen}
            message={toastInfo.toastMsg}
            color={toastInfo.color}
            onDidDismiss={() => setToastInfo(initToastInfo)}
            duration={1600}
          ></IonToast>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default AddTeacherModal;
