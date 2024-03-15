import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBarsStaggered,
  faBell,
  faBug,
  faChalkboardTeacher,
  faChild,
  faSchool,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { PageEnum } from "./PageEnum";
import StudentPage from "../../pages/StudentPage";
import ClassPage from "../../pages/ClassPage";
import ProfilePage from "../../pages/ProfilePage";
import TeacherPage from "../../pages/TeacherPage";
import ActivityPage from "../../pages/Activity/ActivityPage";
import BulletinPage from "../../pages/BulletinPage";

export interface Pages {
  name: string;
  pageName: PageEnum;
  path: string;
  tabIcon: IconProp;
  authorization: string[];
}

export const pageMap = {
  pages: [
    {
      name: "Öğrenci",
      pageName: PageEnum.StudentPage,
      element: StudentPage,
      path: "/student",
      tabIcon: faChild,
      authorization: ["parent"],
    },
    {
      name: "Sınıf",
      pageName: PageEnum.ClassPage,
      element: ClassPage,
      path: "/class",
      tabIcon: faSchool,
      authorization: ["instructor", "admin"],
    },
    {
      name: "Öğretmen",
      pageName: PageEnum.TeacherPage,
      element: TeacherPage,
      path: "/teacher",
      tabIcon: faChalkboardTeacher,
      authorization: ["admin"],
    },
    {
      name: "Aktivite",
      pageName: PageEnum.ActivityPage,
      element: ActivityPage,
      path: "/activity",
      tabIcon: faBarsStaggered,
      authorization: ["parent", "instructor", "admin"],
    },
    {
      name: "Duyurular",
      pageName: PageEnum.BulletinPage,
      element: BulletinPage,
      path: "/bulletin",
      tabIcon: faBell,
      authorization: ["parent", "instructor", "admin"],
    },
    {
      name: "Debug",
      pageName: PageEnum.ProfilePage,
      element: ProfilePage,
      path: "/profile",
      tabIcon: faBug,
      authorization: ["parent", "instructor", "admin"],
    },
    // {
    //   name: "Profil",
    //   pageName: PageEnum.ProfilePage,
    //   element: ProfilePage,
    //   path: "/profile",
    //   tabIcon: faUser,
    //   authorization: ["parent", "instructor", "admin"],
    // },
  ],
};

export const RoleAuthenticator = (
  role: string,
  componentName: string
): boolean => {
  let result = pageMap.pages.find(
    (page) =>
      page.pageName === componentName && page.authorization.includes(role)
  );

  return result ? true : false;
};
