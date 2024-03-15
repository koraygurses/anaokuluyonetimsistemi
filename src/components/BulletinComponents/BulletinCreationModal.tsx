import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonModal, IonSelect, IonSelectOption, IonToast, IonToolbar } from "@ionic/react"
import { ClassDto, CreateBulletinDto } from "../../../api/models";
import { Form } from "react-bootstrap";
import AysFileUploader from "../FileUpload/AysFileUploader";
import { useEffect, useRef, useState } from "react";
import { BulletinApi } from "../../../api/api";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import axios from "axios";

interface Props {
    userId: string
    isOpen: boolean
    closeModal: (created: boolean) => void;
    classList: ClassDto[];
}

function BulletinCreationModal({ userId, isOpen, closeModal, classList }: Props) {

    const bulletinApi = new BulletinApi({
        basePath: AYS_BASEPATH
    });

    const classRef = useRef<HTMLIonSelectElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const initToastInfo = {
        isToastOpen: false,
        toastMsg: {} as string,
        color: "danger",
    };

    const [toastInfo, setToastInfo] = useState(initToastInfo);
    const [selectedClasses, setSelectedClasses] = useState<ClassDto[]>(classList);
    const [uploadedFiles, setUploadedFiles] = useState<File>();

    useEffect(() => {

        setSelectedClasses(classList);
    }, [classList]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;

        if (isChecked) {

            setSelectedClasses(classList);
        }
    };

    const onUploadFile = (uploadedFile: File) => {
        setUploadedFiles(uploadedFile);
    };

    const createAnnouncement = async () => {

        if (classRef.current && descriptionRef.current) {

            let classIds: string[] = selectedClasses.map((clazz) => (clazz as any)._id);

            if (classIds.length === 0 || descriptionRef.current.value.length === 0) {

                setToastInfo({
                    isToastOpen: true,
                    toastMsg: "Sınıf ve İçerik Alanı Boş Olamaz.",
                    color: "danger"
                });
                return;
            }

            let newBulletin: CreateBulletinDto = {
                classids: classIds,
                createdBy: userId,
                createdDate: new Date(),
                title: descriptionRef.current.value,
                description: descriptionRef.current.value
            };

            let response = await bulletinApi.bulletinControllerCreate(newBulletin);

            let id = (response.data as any)._id;

            // if (uploadedFiles && uploadedFiles.length > 0 && uploadedFiles[0]) {
            if (uploadedFiles) {
                var formData = new FormData();
                // formData.append("bulletinid", "65c0c0a734bb2be8cf831c53");
                // formData.append("file", uploadedFiles[0] as File);
                formData.append("file", uploadedFiles as File);
                axios({
                    method: "post",
                    url: `${AYS_BASEPATH}/bulletin/upload/${id}`,
                    data: formData,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "multipart/form-data",
                    },
                })
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }

            close(true);
        } else {

            //TODO hata attır.
        }
    };

    const close = (created: boolean) => {

        closeModal(created);
        setSelectedClasses(classList);
    }

    return (
        <IonModal className="announcement-creation-modal" isOpen={isOpen} onWillDismiss={() => close(false)}>
            <IonContent forceOverscroll={false}>
                <IonHeader translucent={true} mode="md" style={{ '--ion-background-color': 'var(--ion-color-primary)' }}>
                    <IonToolbar className="ion-text-center"><h4 style={{ color: 'var(--ion-color-light)' }}>Duyuru Oluştur</h4></IonToolbar>
                </IonHeader>
                <div id="content">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Group style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Form.Label>Duyurulacak Sınıflar <span style={{ color: 'red' }}> *</span></Form.Label>
                                <Form.Check
                                    reverse
                                    disabled={classList.length === selectedClasses.length}
                                    checked={classList.length === selectedClasses.length}
                                    label={"Hepsi"}
                                    onChange={handleCheckboxChange}
                                >

                                </Form.Check>
                            </Form.Group>
                            <IonSelect className="edit-select"
                                interfaceOptions={{
                                    header: 'Sınıf'
                                }}
                                cancelText="İptal"
                                okText="Tamam"
                                multiple={true}
                                ref={classRef}
                                value={selectedClasses}
                                onIonChange={(e) => setSelectedClasses(e.detail.value)}>
                                {classList.map((clazz, index) => (
                                    <IonSelectOption key={index} value={clazz}>
                                        {clazz.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Duyuru İçeriği <span style={{ color: 'red' }}> *</span>
                            </Form.Label>
                            <Form.Control ref={descriptionRef} as="textarea" rows={4}></Form.Control>
                        </Form.Group>
                    </Form>
                    <AysFileUploader onFileUploaded={onUploadFile}></AysFileUploader>
                    <IonButtons style={{ display: 'flex', justifyContent: 'space-evenly', paddingTop: '20px' }}>
                        <IonButton fill="solid" color={"success"} style={{ flex: 0.4 }} onClick={createAnnouncement}>Onayla</IonButton>
                        <IonButton fill="solid" color={"danger"} style={{ flex: 0.4 }} onClick={() => close(false)}>Kapat</IonButton>
                    </IonButtons>
                </div>
                <IonToast
                    isOpen={toastInfo.isToastOpen}
                    message={toastInfo.toastMsg}
                    color={toastInfo.color}
                    onDidDismiss={() => setToastInfo(initToastInfo)}
                    duration={1600}
                ></IonToast>
            </IonContent>
        </IonModal>
    )
}

export default BulletinCreationModal