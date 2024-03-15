import {
  IonButton,
  IonContent,
  IonIcon,
  IonModal,
  IonToolbar,
} from "@ionic/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { closeOutline } from "ionicons/icons";
import AysUtils from "../../utils/AysUtils";
import { BulletinApi } from "../../../api/api";
import { AYS_BASEPATH } from "../../utils/AysConfiguration";
import PDFViewer from "../PDFViewer";
import { BulletinDto } from "../../../api/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";

interface BulletinModalProps {
  title: string;
  from: string;
  to: string[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  bulletinId: string | undefined;
}

function BulletinModal({
  title,
  from,
  to,
  isOpen,
  setIsOpen,
  bulletinId,
}: BulletinModalProps) {
  const bulletinApi = new BulletinApi({
    basePath: AYS_BASEPATH,
  });

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string>();
  const [previewFile, setPreviewFile] = useState<boolean>(false);

  useEffect(() => {
    const fetchPdf = async () => {
      if (bulletinId && isOpen) {
        try {
          let fileName;

          const bulletinResponse = await bulletinApi.bulletinControllerFindOne(
            bulletinId
          );
          if (bulletinResponse && bulletinResponse.data) {
            fileName = (bulletinResponse.data as BulletinDto).fileName;
            setFileName(fileName);
          }

          if (fileName) {
            const response = await bulletinApi.bulletinControllerFindFiles(
              bulletinId
            );
            if (response && response.data) {
              setPdfBlob(response.data);
            }
          }
        } catch (error) {
          console.error("Error fetching PDF:", error);
        }
      }
    };

    fetchPdf();
  }, [isOpen]);

  const downloadTest = () => {
    if (pdfBlob && fileName) {
      const url = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);

      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <IonModal
      onDidDismiss={() => setIsOpen(false)}
      className="announcement-modal"
      isOpen={isOpen}
    >
      <IonContent>
        <IonToolbar className="announcement-modal-toolbar">
          <IonIcon
            style={{ paddingTop: "5px", paddingRight: "5px" }}
            onClick={() => setIsOpen(false)}
            size="large"
            icon={closeOutline}
          />
        </IonToolbar>
        <div className="announcement-detail">
          <span>
            <span style={{ padding: "0", fontWeight: "bold" }}>
              Yayınlayan:{" "}
            </span>
            {from}
          </span>
          <span>
            <span style={{ padding: "0", fontWeight: "bold" }}>
              Gönderilen:{" "}
            </span>
            {AysUtils.arrayJoin(to, ", ")}
          </span>
          <span>{title}</span>
          {fileName && (
            <>
              <div>
                <span style={{ padding: "5px", fontWeight: "bold" }}>
                  Eklenti:
                </span>
                <span className="hover-span" onClick={() => downloadTest()}>
                  {fileName}
                </span>
              </div>
              <div>
                <IonButton
                  onClick={() => setPreviewFile(!previewFile)}
                  style={{ padding: "4px" }}
                >
                  Dosya Ön İzleme
                  <FontAwesomeIcon
                    style={{ paddingLeft: "5px" }}
                    size="xl"
                    icon={previewFile ? faCaretDown : faCaretRight}
                  />
                </IonButton>
              </div>
              {previewFile &&
                (pdfBlob && pdfBlob.type === "application/pdf" ? (
                  <PDFViewer uploadedFile={pdfBlob} />
                ) : (
                  pdfBlob && (
                    <img src={URL.createObjectURL(pdfBlob)} alt="Preview" />
                  )
                ))}
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
}

export default BulletinModal;
