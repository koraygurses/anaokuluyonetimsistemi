import {
  Link,
  Redirect,
  Switch,
  useLocation,
} from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/App.css";
import "./theme/ays-margin.css";
import "./theme/ays-padding.css";
import "./theme/variables.css";
import ProtectedPageRouter from "./router/ProtectedPageRouter";
import { RoleAuthenticator, pageMap } from "./utils/enum/PageMap";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginPage from "./pages/LoginPage";
import { useAppDispatch, useAppSelector } from "./reducers/hooks";
import { IUser, initIUser } from "./reducers/userReducer";

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { RotateProp } from "@fortawesome/fontawesome-svg-core";
import { PushNotifications } from "@capacitor/push-notifications";
import { UserApi } from "../api/api";
import { AYS_BASEPATH } from "./utils/AysConfiguration";
import { RegisterDeviceTokenDto } from "../api/models";
import { Capacitor } from "@capacitor/core";
import { refreshBulletinPage } from "./reducers/bulletinPageReducer";

setupIonicReact();

const classId = "650c279e9d7cc3744a2ed843";

function App() {
  const token = localStorage.getItem("auth");
  const expand = "sm";

  let userStorage: IUser = initIUser;
  const location = useLocation();

  try {
    const tempUser = localStorage.getItem("user");

    if (tempUser) {
      userStorage = JSON.parse(tempUser) as IUser;
    }
  } catch (error) {
    // console.log(error);
  }

  const user: IUser = useAppSelector((state) =>
    state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
  );

  const dispatch = useAppDispatch();

  const pages = pageMap.pages;
  const [tokenSet, setTokenSet] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState(true);
  const [isMenuCollapsed, setMenuCollapsed] = useState(false);

  // bunu yaptığımz için çift renderlıyor. yapmaması lazım. ama yapmazsam da /login'e gidiyo mal. Çözücem
  if (window.location.href.includes("login")) {
    window.location.href = "";
  }

  const userApi = new UserApi({ basePath: AYS_BASEPATH });

  useEffect(() => {

    //Notifikasyon İçin Dinleme Yeri

    if (Capacitor.isNativePlatform() && tokenSet) {

      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();
        }
      });

      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        let tokenDto: RegisterDeviceTokenDto = {
          userId: userStorage.id,
          token: token.value
        }
        console.log(tokenDto.token);
        userApi.userControllerRegisterDeviceToken(tokenDto);
      });

      PushNotifications.addListener('pushNotificationReceived', notification => {

        dispatch(refreshBulletinPage());
      });
    }
  }, [tokenSet]);

  useEffect(() => { }, [location.pathname]);

  return (
    <IonApp>
      {!token && <LoginPage setTokenSet={setTokenSet}></LoginPage>}
      {token && (
        <>
          <Navbar
            collapseOnSelect
            fixed="bottom"
            className="shadow-lg bg-body-tertiary p-0 d-md-none"
          >
            <Container fluid className="w100">
              <Nav
                fill
                className="justify-content-center ays-navbar w100 "
                activeKey="/activity"
              >
                {pages.map(
                  (page, index) =>
                    RoleAuthenticator(
                      user.roles[0].toString(),
                      page.pageName
                    ) && (
                      <Nav.Item key={index}>
                        <Nav.Link
                          className="p-0 pt-1 align-baseline"
                          key={index}
                          as={Link}
                          to={page.path}
                        >
                          <div
                            className={`${location.pathname.includes(page.path)
                              ? "ays-color-primary"
                              : "ays-color-dark"
                              } text-center`}
                          >
                            <FontAwesomeIcon size="lg" icon={page.tabIcon} />
                            <p className="ion-no-margin ays-tabbar-font">
                              {page.name}
                            </p>
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    )
                )}
              </Nav>
            </Container>
          </Navbar>
          <Container
            fluid
            className={`${isMenuOpen ? "ays-bgcolor-primary" : ""
              } ays-bgcolor-light p-0`}
            style={{ height: "100%" }}
          >
            <div className="d-flex flex-row " style={{ height: "100%" }}>
              <div
                className={`${isMenuOpen ? `ays-menu-shadow ` : `ays-menu-shadow-slim`
                  } ays-menu-wrapper d-none d-md-flex flex-column`}
              >
                <Button
                  type="button"
                  className="d-flex flex-row justify-content-center text-center align-middle mt-3 ms-1 ays-color-secondary ays-menu-button ays-color-dusk ays-bgcolor-light "
                  style={{ border: "none", textAlign: "left" }}
                  onClick={() => {
                    setMenuOpen(!isMenuOpen);
                    setMenuCollapsed(!isMenuCollapsed);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    size="2xl"
                    rotation={(isMenuOpen ? 270 : 0) as RotateProp}
                  />
                  {/* TODO : burada hata çıkabliyor, yazı ile ikon yanyana çıkmıyor, hep olmuyor */}
                  <h4 className={`${isMenuOpen ? `` : `d-none`} m-1`}> AYS</h4>
                </Button>
                <div
                  className={`${isMenuOpen ? "" : "ays-menu-collapsed"
                    } ays-menu`}
                >
                  <Container fluid className={`d-flex flex-column p-0 mt-2`}>
                    {pages.map(
                      (page, index) =>
                        RoleAuthenticator(
                          user.roles[0].toString(),
                          page.pageName
                        ) && (
                          <Nav.Item
                            key={index}
                            className={`${isMenuOpen
                              ? "justify-content-start"
                              : "justify-content-center"
                              } 
                            ${location.pathname.includes(page.path)
                                ? `border-left-slim-primary`
                                : ``
                              }
                            ays-menu-item ripple d-flex `}
                          >
                            <Nav.Link
                              className={` w100`}
                              key={index}
                              as={Link}
                              to={page.path}
                            >
                              <div className="d-flex justify-content-start">
                                <FontAwesomeIcon
                                  size={`${isMenuOpen ? "xl" : "2xl"}`}
                                  icon={page.tabIcon}
                                  className={`${isMenuOpen
                                    ? location.pathname.includes(page.path)
                                      ? "ays-color-primary"
                                      : "ays-color-dark"
                                    : location.pathname.includes(page.path)
                                      ? "ays-color-primary"
                                      : "ays-color-madium"
                                    } ps-3 py-2 `}
                                />
                                <h5
                                  className={`${isMenuOpen
                                    ? ""
                                    : "ays-menu-inner-collapsed d-none w100"
                                    } ays-menu-inner ays-color-medium m-0 pt-2 ps-2 d-flex`}
                                >
                                  {page.name}
                                </h5>
                              </div>
                            </Nav.Link>
                          </Nav.Item>
                        )
                    )}
                  </Container>
                </div>
              </div>
              <Container fluid className="p-0">
                <Switch>
                  <Redirect exact from="/" to="activity" />
                  {pages.map((page, index) => (
                    <ProtectedPageRouter
                      key={index}
                      path={page.path}
                      token={token}
                    >
                      {/* (page.element, {}) yerine (page.element {...this.props}, {}) yazıp prop atabiliyomuşuz */}
                      {React.createElement(page.element, {
                        classId,
                      })}
                    </ProtectedPageRouter>
                  ))}
                </Switch>
              </Container>
            </div>
          </Container>
        </>
      )}
    </IonApp>
  );
}

export default App;
