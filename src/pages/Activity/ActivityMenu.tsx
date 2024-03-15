import { IonButton, IonCol, IonContent, IonGrid, IonLabel, IonMenu, IonRippleEffect, IonRow } from "@ionic/react";
import { ActivityPageView } from "../../utils/AysUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    IconDefinition,
    faClipboard, faGripVertical, faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface MenuProps {
    menuRef: React.RefObject<HTMLIonMenuElement>,
    activeView: ActivityPageView,
    toggleView: (view: ActivityPageView) => void
}

function ActivityMenu({ menuRef, activeView, toggleView }: MenuProps) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getMenuItem = (label: string, icon: IconDefinition, view: ActivityPageView) => {
        return (
            <IonRow className={activeView === view ? "background-tint-light" : ""}>
                <IonButton fill="clear" color="dark" style={{ width: '100%' }} onClick={() => toggleView(view)} className="ion-activatable">
                    <IonCol className="ion-text-start" size="1.5">
                        <FontAwesomeIcon icon={icon} />
                    </IonCol>
                    <IonCol className="ion-text-start" size="10.5">
                        <IonLabel>{label}</IonLabel>
                    </IonCol>
                    <IonRippleEffect type="unbounded"></IonRippleEffect>
                </IonButton>
            </IonRow>
        )
    }

    return (
        <IonMenu swipeGesture={isMenuOpen} onIonDidOpen={() => setIsMenuOpen(true)} onIonDidClose={() => setIsMenuOpen(false)} ref={menuRef} contentId="activity-menu-content" side="start" >
            <IonContent forceOverscroll={false}>
                <IonGrid style={{ fontSize: '18px' }}>
                    {getMenuItem("Gün", faClipboard, ActivityPageView.day)}
                    {getMenuItem("Hafta", faGripVertical, ActivityPageView.week)}
                    {getMenuItem("Ay", faTableCells, ActivityPageView.month)}
                </IonGrid>
            </IonContent>
        </IonMenu>
    )
}

export default ActivityMenu;