import {
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonToast,
} from "@ionic/react";
import { useRef, useState } from "react";
import { StudentApi } from "../../../../api/api";
import DateSelector from "../../../utils/DateSelector";
import {
  ClassDto,
  CreateStudentDto,
  CreateStudentDtoGenderEnum,
  StudentDtoGenderEnum,
} from "../../../../api/models";
import { closeOutline, arrowBackOutline } from "ionicons/icons";
import AysLetterInput, {
  AysLetterInputElement,
} from "../../../utils/AysInput/AysLetterInput";
import AysNumberInput, {
  AysNumberInputElement,
} from "../../../utils/AysInput/AysNumberInput";
import { AYS_BASEPATH } from "../../../utils/AysConfiguration";
import { Col, Form, FormGroup, FormLabel, Row } from "react-bootstrap";
import AysUtils from "../../../utils/AysUtils";
import { useMediaQuery } from "react-responsive";

interface Props {
  isModalOpen: boolean;
  closeModal: (toast: {
    isToastOpen: boolean;
    toastMsg: string;
    color: string;
  }) => void;
  classInfo: {
    classList: ClassDto[];
    activeClass: ClassDto;
  };
}

function AddStudentModal({ isModalOpen, closeModal, classInfo }: Props) {
  const initToastInfo = {
    isToastOpen: false,
    toastMsg: "",
    color: "danger",
  };

  const [toastInfo, setToastInfo] = useState(initToastInfo);

  let dateSelector = new DateSelector({ required: true });

  const nameRef = useRef<AysLetterInputElement>(null);
  const classRef = useRef<HTMLSelectElement>(null);
  const schoolRef = useRef<AysNumberInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

  const studentApi = new StudentApi({ basePath: AYS_BASEPATH });

  const createStudent = async () => {
    try {
      if (
        nameRef.current &&
        schoolRef.current &&
        genderRef.current &&
        classRef.current
      ) {
        nameRef.current.activate();
        schoolRef.current.activate();

        let birthDate = dateSelector.getDate();
        let name = AysUtils.capitalizeName(
          nameRef.current.getValue() as string
        );
        let schoolNo = schoolRef.current.getValue() as number;

        if (
          (birthDate && isNaN(birthDate.getTime())) ||
          !nameRef.current.isValid() ||
          genderRef.current.value === undefined ||
          genderRef.current.value === "blank" ||
          classRef.current.value === "blank" ||
          !schoolRef.current.isValid()
        ) {
          setToastInfo({
            isToastOpen: true,
            toastMsg: "Girilen Bilgiler Eksik Veya Hatalı",
            color: "danger",
          });
          return;
        }

        let newStudent: CreateStudentDto = {
          studentid: parseInt(schoolNo as any),
          name: name as string,
          gender:
            genderRef.current.value === "male"
              ? CreateStudentDtoGenderEnum.Male
              : CreateStudentDtoGenderEnum.Female,
          birth: (birthDate as any).getTime() as number,
          classid: classRef.current.value,
        };

        // console.log(typeof (parseInt(newStudent.studentid as any) as number));

        await studentApi
          .studentControllerCreateStudent(newStudent)
          .then((res) => {
            closeModal({
              isToastOpen: true,
              toastMsg:
                (name as string) + " İsimli Öğrenci Başarıyla Oluşturuldu",
              color: "success",
            });
          })
          .catch((res) => {
            setToastInfo({
              isToastOpen: true,
              toastMsg: res.response.data.studentid,
              color: "danger",
            });
          });
      } else {
        setToastInfo({
          isToastOpen: true,
          toastMsg: "Öğrenci Oluşturulurken Hata Oluştu",
          color: "danger",
        });
      }
    } catch (e) {}
  };

  const isWideScreen = useMediaQuery({ query: "(min-width:620px" });

  return (
    <IonModal isOpen={isModalOpen} className="fullscreen-modal">
      <IonContent forceOverscroll={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Öğrenci Oluşturma</IonTitle>
            {isWideScreen ? (
              <IonButtons slot="start">
                <IonButton
                  onClick={() => closeModal(initToastInfo)}
                  color="medium"
                >
                  <IonIcon size="large" icon={arrowBackOutline} />
                </IonButton>
              </IonButtons>
            ) : (
              <IonButtons slot="end">
                <IonButton
                  onClick={() => closeModal(initToastInfo)}
                  color="medium"
                >
                  <IonIcon size="large" icon={closeOutline} />
                </IonButton>
              </IonButtons>
            )}
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
                <AysNumberInput
                  ref={schoolRef}
                  label="Öğrenci No"
                  labelPlacement="stacked"
                />
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>
                    {AysUtils.getLabelWithRequiredIndicator("Sınıf")}
                  </Form.Label>
                  <Form.Select ref={classRef}>
                    <option hidden value={"blank"}>
                      {" "}
                    </option>
                    {classInfo.classList.map((clazz) => (
                      <option
                        key={(clazz as any)._id}
                        value={(clazz as any)._id}
                      >
                        {clazz.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
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
                    <option value={StudentDtoGenderEnum.Female}>Kadın</option>
                    <option value={StudentDtoGenderEnum.Male}>Erkek</option>
                  </Form.Select>
                </FormGroup>
              </Col>
            </Row>
            <Row className="mb-3">{dateSelector.render()}</Row>
          </Form>
          <IonButtons className="student-info-confirm-btn-container ays-p16">
            <IonButton
              color="primary"
              fill="solid"
              className="student-info-confirm-btn"
              shape="round"
              onClick={createStudent}
            >
              Öğrenci Oluşturma
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

export default AddStudentModal;
