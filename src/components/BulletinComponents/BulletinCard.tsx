import { IonRippleEffect } from "@ionic/react"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faUser } from "@fortawesome/free-solid-svg-icons";
import AnnouncementModal from "./BulletinModal";
import { BulletinDto } from "../../../api/models";

interface BulletinCardProps {
    bulletin: BulletinDto;
    isDifferentDay: boolean
}

function BulletinCard({ bulletin, isDifferentDay }: BulletinCardProps) {

    const [cardTitle, setCardTitle] = useState<string>("");
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const updatedTitle = getUpdatedTitle(window.innerWidth);
            if (updatedTitle !== cardTitle) {
                setCardTitle(updatedTitle);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [cardTitle]);

    const getClassNameList = () => {
        return (bulletin.classids).map(clazz => (clazz as any).name);
    }

    const getUpdatedTitle = (max_width: number): string => {
        const context = document.createElement('canvas').getContext('2d');
        let truncatedText = '';
        let overflow = false;

        if (context) {
            let currentWidth = 0;

            for (let i = 0; i < bulletin.title.length; i++) {
                const charWidth = context.measureText(bulletin.title[i]).width;

                if (currentWidth + charWidth > max_width) {
                    overflow = true;
                    break;
                }

                truncatedText += bulletin.title[i];
                currentWidth += charWidth;
            }

            if (overflow === true) {
                truncatedText = truncatedText + "...";
            }
        }

        return truncatedText;
    };

    useEffect(() => {
        setCardTitle(getUpdatedTitle(window.innerWidth));
    }, []);

    return (
        <>
            <div onClick={() => setDetailModalOpen(true)} className={isDifferentDay ? "top-shadow ion-activatable announcement-card" : "bottom-shadow ion-activatable announcement-card"}>
                <div className="announcement-info">
                    <span>{cardTitle}</span>
                    <div className="end-content">
                        <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                </div>
                <div className="announcer-info">
                    <span><FontAwesomeIcon size="xs" style={{ paddingRight: '5px', paddingBottom: '2px' }} color="dark" icon={faUser}></FontAwesomeIcon>{(bulletin.createdBy as any).name}</span>
                </div>
                <IonRippleEffect></IonRippleEffect>

            </div>

            <AnnouncementModal bulletinId={(bulletin as any)._id} from={(bulletin.createdBy as any).name} title={bulletin.title} to={getClassNameList()} isOpen={isDetailModalOpen} setIsOpen={setDetailModalOpen}></AnnouncementModal>
        </>
    );
}

export default BulletinCard