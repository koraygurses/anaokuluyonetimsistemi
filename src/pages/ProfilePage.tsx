import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useAppSelector } from "../reducers/hooks";
import { UserApi } from "../../api/api";
import { IUser } from "../reducers/userReducer";
import { AYS_BASEPATH } from "../utils/AysConfiguration";
import { useEffect, useState } from "react";
import { UserDto } from "../../api/models";

const userApi = new UserApi({ basePath: AYS_BASEPATH });

function ProfilePage() {
  const userStorage = JSON.parse(
    localStorage.getItem("user") as string
  ) as IUser;

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const [activeUser, setActiveUser] = useState<UserDto>();

  useEffect(() => {

  }, [user]);

  const logout = () => {
    localStorage.clear();

    window.location.reload();
  };

  return (
    <>
      <IonContent fullscreen={true} forceOverscroll={false}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div>
          <IonList>
            <IonItem>
              <IonLabel>Kullanıcı Tel No: </IonLabel>
              <IonLabel>{user.gsm}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Kullanıcı Rolü: </IonLabel>
              <IonLabel>{user.roles}</IonLabel>
            </IonItem>
          </IonList>
        </div>
        <IonButtons className="ion-justify-content-center ays-p16">
          <IonButton onClick={logout} fill="solid" color={"danger"}>
            Çıkış Yap
          </IonButton>
        </IonButtons>
      </IonContent>
    </>
  );
}

export default ProfilePage;
