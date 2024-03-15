import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  ClassDto,
  ObjectId,
  TeacherDto,
  UpdateTeacherDto,
} from "../../../api/models";
import {
  closeOutline,
  createOutline,
  arrowBackOutline,
  trashOutline,
} from "ionicons/icons";
import { useRef, useState } from "react";
import DateSelector from "../../utils/DateSelector";
import { TeacherApi } from "../../../api/api";
import AysUtils from "../../utils/AysUtils";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import AysLetterInput, {
  AysLetterInputElement,
} from "../../utils/AysInput/AysLetterInput";
import AysPhoneInput, {
  AysPhoneInputElement,
} from "../../utils/AysInput/AysPhoneInput";
import AysEmailInput, {
  AysEmailInputElement,
} from "../../utils/AysInput/AysEmailInput";
import { Form, FormGroup, Row } from "react-bootstrap";
import { View } from "react-native";
import { useMediaQuery } from "react-responsive";

interface Props {
  teacher: TeacherDto;
  isModalOpen: boolean;
  closeModal: () => void;
  isEditMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  setToastInfo: React.Dispatch<
    React.SetStateAction<{
      isToastOpen: boolean;
      toastMsg: string;
      color: string;
    }>
  >;
  classList: ClassDto[];
  confirmEdit: () => void;
  deleteTeacher: (teacherid: string) => void;
}

function TeacherInfo({
  teacher,
  isModalOpen,
  closeModal,
  isEditMode,
  setEditMode,
  setToastInfo,
  classList,
  confirmEdit,
  deleteTeacher,
}: Props) {
  const teacherApi = new TeacherApi({ basePath: AYS_BASEPATH });

  const nameRef = useRef<AysLetterInputElement>(null);
  const telRef = useRef<AysPhoneInputElement>(null);
  const emailRef = useRef<AysEmailInputElement>(null);
  const classRef = useRef<HTMLIonSelectElement>(null);

  let dateSelector = new DateSelector({
    dateAsMs: teacher.birth,
    required: true,
  });

  const getClassNames = () => {
    let classNames: string[] = [];

    if (teacher.classid) {
      teacher.classid.forEach((clazz) => {
        classNames.push((clazz as any).name);
      });
    }

    let result: string = classNames.join(", ");

    return result;
  };

  const getTeacherClassList = () => {
    let teacherClassList: ClassDto[] = [];

    if (teacher.classid) {
      for (let i = 0; i < classList.length; i++) {
        for (let j = 0; j < (teacher.classid as ObjectId[]).length; j++) {
          if ((classList[i] as any)._id === (teacher.classid[j] as any)._id) {
            teacherClassList.push(classList[i]);
          }
        }
      }
    }

    return teacherClassList;
  };

  const closingModal = () => {
    setEditMode(false);
    closeModal();
  };

  const proceedConfirmEdit = async () => {
    try {
      if (
        nameRef.current &&
        telRef.current &&
        emailRef.current &&
        classRef.current
      ) {
        nameRef.current.activate();
        telRef.current.activate();
        emailRef.current.activate();

        if (
          !nameRef.current.isValid() ||
          !telRef.current.isValid() ||
          !emailRef.current.isValid() ||
          (classRef.current.value as ClassDto[]).length === 0 ||
          !dateSelector.getDate()
        ) {
          setToastInfo({
            isToastOpen: true,
            toastMsg: "Girilen Bilgiler Eksik Veya Hatalı",
            color: "danger",
          });
          return;
        }

        let gsm = (telRef.current.getValue() as string).replace(/\s/g, "");

        let classIdList: string[] = [];

        (
          (classRef.current as HTMLIonSelectElement).value as ClassDto[]
        ).forEach((clazz) => {
          classIdList.push((clazz as any)._id);
        });

        let updatedTeacher: UpdateTeacherDto = {
          id: (teacher as any)._id,
          name: (nameRef.current.getValue() as string) || teacher.name,
          birth: dateSelector.getDateAsMs(),
          email: (emailRef.current.getValue() as string) || teacher.email,
          gsm: AysUtils.prefixGSM(gsm),
          classid: classIdList,
        };

        await teacherApi
          .teacherControllerUpdate(updatedTeacher)
          .then((res) => {
            setToastInfo({
              isToastOpen: true,
              toastMsg: "Öğretmen Bilgileri Başarıyla Güncellendi",
              color: "success",
            });

            confirmEdit();
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
          toastMsg: "Öğretmen Bilgileri Güncellenirken Hata Oluştu",
          color: "danger",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  function getReadOnlyContent() {
    return (
      <>
        <div className="centered-avatar ays-p16 ays-m16">
          <IonAvatar>
            <FontAwesomeIcon size="4x" icon={faUser} />
          </IonAvatar>
        </div>
        <div
          style={{
            justifyContent: "center",
            margin: "auto",
            fontWeight: "bold",
            fontSize: "22px",
            textAlign: "center",
          }}
        >
          {teacher.name}
        </div>
        <Form className="p-1 ps-3 pe-3">
          <Row className="mb-3 pt-3">
            <AysPhoneInput
              ref={telRef}
              label="Tel No"
              labelPlacement="stacked"
              placeholder="Örn. 555 555 5555"
              value={AysUtils.getGsmString(teacher.gsm)}
              readonly
              isRequired={false}
            />
          </Row>
          <Row className="mb-3">
            <AysEmailInput
              ref={emailRef}
              label="Email"
              labelPlacement="stacked"
              value={teacher.email}
              readonly
              isRequired={false}
            />
          </Row>
          <Row className="mb-3">
            <FormGroup>
              <Form.Label>Doğum Tarihi</Form.Label>
              <Form.Control
                defaultValue={new Date(teacher.birth).toLocaleDateString("tr")}
                readOnly
              ></Form.Control>
            </FormGroup>
          </Row>
          <Row className="mb-3">
            <FormGroup>
              <Form.Label>Sınıf</Form.Label>
              <Form.Control
                as="textarea"
                defaultValue={getClassNames()}
                readOnly
              ></Form.Control>
            </FormGroup>
          </Row>
        </Form>
      </>
    );
  }
  const [isAlertOpen, setAlertOpen] = useState(false);
  function getEditableContent() {
    // function deleteTeacher(teacher: TeacherDto) {
    //   console.log("ALOO");
    //   deleteTeacher(teacher);
    // }

    return (
      <>
        <div className="centered-avatar ays-p16 ays-m16">
          <IonAvatar>
            <FontAwesomeIcon size="4x" icon={faUser} />
          </IonAvatar>
        </div>
        <Form className="p-1 ps-3 pe-3">
          <Row className="mb-3">
            <AysLetterInput
              ref={nameRef}
              label="Ad Soyad"
              labelPlacement="stacked"
              value={teacher.name}
            />
          </Row>
          <Row className="mb-3">
            <AysPhoneInput
              ref={telRef}
              label="Tel No"
              labelPlacement="stacked"
              placeholder="Örn. 555 555 5555"
              value={AysUtils.getGsmString(teacher.gsm)}
            />
          </Row>
          <Row className="mb-3">
            <AysEmailInput
              ref={emailRef}
              label="Email"
              labelPlacement="stacked"
              value={teacher.email}
            />
          </Row>
          <Row className="mb-3">{dateSelector.render()}</Row>
          <Row className="mb-3">
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
                value={getTeacherClassList()}
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
          <IonButtons className="d-flex">
            <IonButton
              color="primary"
              fill="solid"
              className="flex-grow-1"
              shape="round"
              onClick={() => proceedConfirmEdit()}
            >
              Onayla
            </IonButton>
            <IonButton
              color="danger"
              fill="solid"
              className="flex-grow-1"
              shape="round"
              onClick={() => setAlertOpen(true)}
            >
              <IonIcon icon={trashOutline} /> Sil
            </IonButton>
          </IonButtons>
          <IonAlert
            isOpen={isAlertOpen}
            message={
              teacher.name +
              " İsimli Öğretmeni Silmek İstediğinizden Emin Misiniz?"
            }
            buttons={[
              {
                text: "Hayır",
                handler: () => {
                  setAlertOpen(false);
                },
              },
              {
                text: "Evet",
                handler: () => {
                  deleteTeacher((teacher as any)._id as string);
                  setAlertOpen(false);
                  closeModal();
                },
              },
            ]}
          />
        </Form>
      </>
    );
  }

  const isWideScreen = useMediaQuery({ query: "(min-width:620px" });
  return (
    <IonModal
      isOpen={isModalOpen}
      onDidDismiss={() => closingModal()}
      className="fullscreen-modal"
    >
      <IonContent forceOverscroll={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Öğretmen Detay</IonTitle>
            {isWideScreen ? (
              <IonButtons slot="start">
                <IonButton color="medium" onClick={() => closingModal()}>
                  <IonIcon size="large" icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
            ) : (
              <IonButtons slot="end">
                <IonButton color="medium" onClick={() => closingModal()}>
                  <IonIcon size="large" icon={closeOutline} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <div className="edit-modal">
          {isEditMode ? getEditableContent() : getReadOnlyContent()}

          <IonFab
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            color="primary"
          >
            <IonFabButton onClick={() => setEditMode(!isEditMode)}>
              <IonIcon
                icon={isEditMode ? closeOutline : createOutline}
              ></IonIcon>
            </IonFabButton>
          </IonFab>
        </div>
      </IonContent>
    </IonModal>
  );
}

export default TeacherInfo;
