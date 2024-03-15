import { useRef, useState } from "react";
import FileElement from "./FileElement";
import { useMediaQuery } from "react-responsive";
import { IonButton, IonLabel } from "@ionic/react";

interface FileUploaderProps {
  onFileUploaded?: (files: File) => void;
}

function AysFileUploader({ onFileUploaded }: FileUploaderProps) {
  const isWideScreen = useMediaQuery({ query: "(min-width:768px" });

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setDragging] = useState(false);

  const supportedFileTypes = ".xls, .xlsx, .txt, .png, .jpeg, .jpg, .pdf";

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragging(false);
    onFileUpload(event.dataTransfer.files);
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragging(true);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragging(false);
    }
  };

  const filePicker = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileUpload = (fileList: FileList) => {
    if (fileList) {
      let files: File[] = [...uploadedFiles];

      if (files.length === 0) {

        for (let i = 0; i < fileList.length; i++) {
          files.push(fileList[i]);
        }
      } else {

        for (let i = 0; i < fileList.length; i++) {
          files[0] = (fileList[i]);
        }
      }

      if (files.length > 0) {
        setUploadedFiles(files);

        if (onFileUploaded) {
          onFileUploaded(files[0]);
        }
      }
    } else {
      //TODO Hata döndür
    }
  };

  const removeFile = (removedFile: File) => {
    let temp: File[] = [...uploadedFiles];

    let removedIndex = temp.findIndex((file) => file.name === removedFile.name);

    temp.splice(removedIndex, 1);

    setUploadedFiles(temp);
  };

  const getFileUploader = (isWideScreen: boolean) => {
    if (isWideScreen) {
      return (
        <div
          onDragOver={(e) => handleDrag(e)}
          onDrop={(e) => handleDrop(e)}
          onDragLeave={(e) => handleDragEnd(e)}
          onDragExit={(e) => handleDragEnd(e)}
          onClick={filePicker}
          className={isDragging ? "file-uploader-drag" : "file-uploader"}
        >
          <div id="drop-target">
            {isDragging ? (
              <p>Buraya Bırakın</p>
            ) : (
              <p>
                Dosyaları Sürükleyin
                <br /> Ya Da <span>İçe Aktarın</span>
              </p>
            )}
          </div>
          {/* multiple koymak gerekebilir */}
          <input
            type="file"
            value=""
            style={{ visibility: "hidden", opacity: 0 }}
            ref={inputRef}
            accept={supportedFileTypes}
            onChange={(event) =>
              event.target.files && onFileUpload(event.target.files)
            }
          />
        </div>
      );
    } else {
      return (
        <div>
          <div
            style={{
              paddingTop: "10px",
              display: "inline-flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IonButton onClick={() => filePicker()}>Dosya Yükle</IonButton>
            <IonLabel style={{ paddingLeft: "5px" }}>
              {uploadedFiles.length > 0 &&
                uploadedFiles.length + " Dosya Yüklendi."}
            </IonLabel>
            {/* multiple koymak gerekebilir */}
            <input
              style={{ width: "0px", visibility: "hidden", opacity: 0 }}
              type="file"
              value=""
              ref={inputRef}
              accept={supportedFileTypes}
              onChange={(event) =>
                event.target.files && onFileUpload(event.target.files)
              }
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {getFileUploader(isWideScreen)}
      <div style={{ paddingTop: "10px" }}>
        {uploadedFiles.length > 0 &&
          uploadedFiles.map((file, index) => (
            <FileElement
              key={index}
              index={index + 1}
              file={file}
              removeFile={removeFile}
            />
          ))}
      </div>
    </div>
  );
}

export default AysFileUploader;
