import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { closeOutline, createOutline, arrowBackOutline } from "ionicons/icons";
import { ClassApi, StudentApi } from "../../../api/api";
import AysUtils from "../../utils/AysUtils";
import { ClassDto, StudentDto, UpdateStudentDto } from "../../../api/models";
import DateSelector from "../../utils/DateSelector";
import { RoleEnum } from "../../utils/enum/RoleEnum";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import AysLetterInput, {
  AysLetterInputElement,
} from "../../utils/AysInput/AysLetterInput";
import AysNumberInput, {
  AysNumberInputElement,
} from "../../utils/AysInput/AysNumberInput";
import { Col, Form, FormGroup, Row } from "react-bootstrap";
import AysPhoneInput from "../../utils/AysInput/AysPhoneInput";
import { useMediaQuery } from "react-responsive";

interface StudentInfoProps {
  student: StudentDto;
  studentClazz?: ClassDto;
  role: string;
  isModal: boolean;
  closeModal?: () => void;
  editMode: boolean;
  setEditMode?: (isEditMode: boolean) => void;
  confirmEdit?: () => void;
}

function StudentInfo({
  student,
  studentClazz,
  role,
  isModal,
  closeModal,
  editMode,
  setEditMode,
  confirmEdit,
}: StudentInfoProps) {
  // Eğer bütün bilgiler burda yok diye sıkıntı varsa öğrenci id'den bi daha çekim yapmak bence mantıklı olabilir.

  const nameRef = useRef<AysLetterInputElement>(null);
  const classRef = useRef<HTMLSelectElement>(null);
  const schoolRef = useRef<AysNumberInputElement>(null);

  const studentApi = new StudentApi({ basePath: AYS_BASEPATH });
  const classApi = new ClassApi({ basePath: AYS_BASEPATH });

  let dateSelector = new DateSelector({ dateAsMs: student.birth });

  const initToastInfo = {
    isToastOpen: false,
    toastMsg: "",
    color: "danger",
  };

  const [toastInfo, setToastInfo] = useState(initToastInfo);
  const [classList, setClassList] = useState([] as ClassDto[]);
  const clazz = role === RoleEnum.instructor ? studentClazz : student.classid;

  useEffect(() => {
    if (RoleEnum.admin === role) {
      const initPage = async () => {
        const classList = await classApi.classControllerFindAll();
        setClassList(classList.data);
      };

      initPage();
    }
  }, []);

  const proceedConfirmEdit = async () => {
    try {
      if (classRef.current && schoolRef.current && nameRef.current) {
        schoolRef.current.activate();
        nameRef.current.activate();

        if (
          !nameRef.current.isValid() ||
          !schoolRef.current.isValid() ||
          !dateSelector.getDate() ||
          !classRef.current.value
        ) {
          setToastInfo({
            isToastOpen: true,
            toastMsg: "Girilen Bilgiler Eksik Veya Hatalı",
            color: "danger",
          });

          return;
        } else {
          let updatedStudent: UpdateStudentDto = {
            id: (student as any)._id,
            name: nameRef.current.getValue() as string,
            classid: classRef.current.value,
            birth: dateSelector.getDateAsMs(),
            studentid: schoolRef.current
              ? parseInt(schoolRef.current.getValue() as string, 10)
              : 0,
          };

          await studentApi
            .studentControllerUpdateStudent(updatedStudent)
            .then((res) => {
              if (confirmEdit) {
                confirmEdit();

                setToastInfo({
                  isToastOpen: true,
                  toastMsg: "Öğrenci Bilgileri Başarıyla Güncellendi",
                  color: "success",
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
        }
      } else {
        setToastInfo({
          isToastOpen: true,
          toastMsg: "Öğrenci Bilgileri Güncellenirken Hata Oluştu",
          color: "danger",
        });
      }
    } catch (e) { }
  };

  function getReadOnlyContent() {
    return (
      <>
        <div
          style={{
            justifyContent: "center",
            margin: "auto",
            fontWeight: "bold",
            fontSize: "22px",
            textAlign: "center",
          }}
        >
          {student.name}
        </div>
        <Form className="p-1 ps-3 pe-3 pt-3">
          <Row className="mb-3">
            <Col>
              <AysNumberInput
                label="Öğrenci No"
                labelPlacement="stacked"
                value={student.studentid}
                readonly
                isRequired={false}
              />
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Sınıf</Form.Label>
                <Form.Control
                  defaultValue={(clazz as any).name}
                  readOnly
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <FormGroup>
              <Form.Label>Doğum Tarihi</Form.Label>
              <Form.Control
                defaultValue={new Date(student.birth).toLocaleDateString("tr")}
                readOnly
              ></Form.Control>
            </FormGroup>
          </Row>
          {Array.isArray(student.parents) &&
            student.parents.map((parent, index) => (
              <div key={(parent as any).gsm}>
                <Row className="mb-3">
                  <AysLetterInput
                    ref={nameRef}
                    label={"Veli " + (index + 1)}
                    value={student.name}
                    readonly
                    isRequired={false}
                  />
                </Row>
                <Row className="mb-3">
                  <AysPhoneInput
                    label={"İletişim " + (index + 1)}
                    placeholder="Örn. 555 555 5555"
                    value={AysUtils.getGsmString((parent as any).gsm)}
                    readonly
                    isRequired={false}
                  />
                </Row>
              </div>
            ))}
        </Form>
      </>
    );
  }

  function getEditableContent() {
    return (
      <Form className="p-1 ps-3 pe-3">
        <Row className="mb-3">
          <AysLetterInput
            ref={nameRef}
            label="Ad Soyad"
            labelPlacement="stacked"
            value={student.name}
          />
        </Row>
        <Row className="mb-3">
          <Col>
            <AysNumberInput
              ref={schoolRef}
              label="Öğrenci No"
              labelPlacement="stacked"
              value={student.studentid}
            />
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Sınıf</Form.Label>
              <Form.Select ref={classRef} defaultValue={(clazz as any)._id}>
                {classList.map((clazz) => (
                  <option key={(clazz as any)._id} value={(clazz as any)._id}>
                    {clazz.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">{dateSelector.render()}</Row>
        <IonButtons className="ays-p16 student-info-confirm-btn-container">
          <IonButton
            className="student-info-confirm-btn"
            fill="solid"
            shape="round"
            color="primary"
            onClick={proceedConfirmEdit}
          >
            Onayla
          </IonButton>
        </IonButtons>
      </Form>
    );
  }
  const isWideScreen = useMediaQuery({ query: "(min-width:620px" });
  return (
    <IonContent forceOverscroll={false}>
      <IonHeader translucent={true}>
        <IonToolbar>
          {isWideScreen ? (
            <IonButtons slot="start">
              <IonButton color={"medium"} onClick={closeModal}>
                <IonIcon size="large" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
          ) : (
            <IonButtons slot="end">
              <IonButton color={"medium"} onClick={closeModal}>
                <IonIcon size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
          )}

          <IonTitle>Öğrenci Detay</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="edit-modal">
        <div className="centered-avatar ays-p16 ays-m16">
          <IonAvatar>
            <FontAwesomeIcon size="4x" icon={faUser} />
          </IonAvatar>
        </div>
        {editMode ? getEditableContent() : getReadOnlyContent()}
        {RoleEnum.admin === role && (
          <IonFab
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            color="primary"
          >
            <IonFabButton onClick={() => setEditMode && setEditMode(!editMode)}>
              <IonIcon icon={editMode ? closeOutline : createOutline}></IonIcon>
            </IonFabButton>
          </IonFab>
        )}
        <IonToast
          isOpen={toastInfo.isToastOpen}
          message={toastInfo.toastMsg}
          color={toastInfo.color}
          onDidDismiss={() => setToastInfo(initToastInfo)}
          duration={1600}
        ></IonToast>
      </div>
    </IonContent>
  );
}

export default StudentInfo;
