import { IonButtons, IonButton } from "@ionic/react";
import { ActivityPageView } from "../../utils/AysUtils";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { setActivityPageView } from "../../reducers/activityViewReducer";

function ActivityViewChooser() {

    const activityView = useAppSelector((state) => state.rootReducer.activityPageView.value);
    const dispatch = useAppDispatch();

    return (
        <IonButtons style={{ position: 'absolute' }}>
            <IonButton
                className={activityView === ActivityPageView.day ? "activity-view-button-active" : "activity-view-button-inactive"}
                onClick={() => dispatch(setActivityPageView(ActivityPageView.day))}
            >
                Gün
            </IonButton>
            <IonButton
                className={activityView === ActivityPageView.week ? "activity-view-button-active" : "activity-view-button-inactive"}
                onClick={() => dispatch(setActivityPageView(ActivityPageView.week))}
            >
                Hafta
            </IonButton>
            <IonButton
                className={activityView === ActivityPageView.month ? "activity-view-button-active" : "activity-view-button-inactive"}
                onClick={() => dispatch(setActivityPageView(ActivityPageView.month))}
            >
                Ay
            </IonButton>
        </IonButtons>
    )
}

export default ActivityViewChooser