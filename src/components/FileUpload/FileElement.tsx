import { IonIcon } from "@ionic/react";
import { Row } from "react-bootstrap"
import { closeOutline } from "ionicons/icons";
interface Props {
    file: File;
    removeFile: (file: File) => void;
    index: number
}

function FileElement({ file, removeFile, index }: Props) {
    return (
        <div className="file-element-row">
            <div className="file-element-span-wrapper">
                <span>{index + ". " + file.name}</span>
            </div>
            <IonIcon id="close-icon" icon={closeOutline} onClick={() => removeFile(file)} />
        </div>
    )
}

export default FileElement