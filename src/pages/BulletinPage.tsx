import { IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../reducers/hooks";
import { IUser } from "../reducers/userReducer";
import { RoleEnum } from "../utils/enum/RoleEnum";
import { BulletinApi, ClassApi, StudentApi, TeacherApi } from "../../api/api";
import { AYS_BASEPATH } from "../utils/AysConfiguration";
import { BulletinDto, ClassDto } from "../../api/models";
import React from "react";
import BulletinCreationModal from "../components/BulletinComponents/BulletinCreationModal";
import BulletinCard from "../components/BulletinComponents/BulletinCard";

function BulletinPage() {

    const tempUser = localStorage.getItem("user");
    const userStorage = tempUser
        ? (JSON.parse(tempUser) as IUser)
        : ({} as IUser);
    const user: IUser = useAppSelector((state) =>
        state.rootReducer.user.value.id ? state.rootReducer.user.value : userStorage
    );

    const apis = useMemo(() => ({
        teacherApi: new TeacherApi({ basePath: AYS_BASEPATH }),
        studentApi: new StudentApi({ basePath: AYS_BASEPATH }),
        classApi: new ClassApi({ basePath: AYS_BASEPATH }),
        bulletinApi: new BulletinApi({ basePath: AYS_BASEPATH }),
    }), []);

    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [classList, setClassList] = useState<ClassDto[]>([] as ClassDto[]);
    const [bulletinList, setBulletinList] = useState<BulletinDto[]>([] as BulletinDto[]);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const refreshCounter = useAppSelector(state => state.rootReducer.bulletinRefresh);

    const MemoizedAnnouncementCard = React.memo(BulletinCard);

    const initBulletins = async () => {

        if (isCreateModalOpen === false) {

            const bulletinList = await apis.bulletinApi.bulletinControllerFindAll();

            switch (user.roles[0]) {

                case RoleEnum.admin:

                    const classList = await apis.classApi.classControllerFindAll();

                    if (classList.data && classList.data.length > 0) {

                        setClassList(classList.data);
                    }

                    if (bulletinList.data && bulletinList.data.length > 0) {

                        setBulletinList(bulletinList.data.reverse());
                    }

                    break;

                case RoleEnum.instructor:

                    const teacher = (await apis.teacherApi.teacherControllerFindOneByGSM(user.gsm));
                    const classResponse = await apis.classApi.classControllerGetClassesByTeacherID((teacher.data as any)._id);

                    if (classResponse.data && classResponse.data.length > 0) {

                        setClassList(classResponse.data);

                        let teacherBulletinList: BulletinDto[] = [];

                        if (classResponse.data && classResponse.data.length > 0) {

                            let classIdList: string[] = (classResponse.data as ClassDto[]).map(clazz => ((clazz) as any)._id);

                            const teacherBulletinMapping = classIdList.map(async (classid) => {
                                let response = await apis.bulletinApi.bulletinControllerFindByFilter(classid);
                                teacherBulletinList.push(...response.data);
                            });

                            await Promise.all(teacherBulletinMapping);
                        }
                        setBulletinList(teacherBulletinList.reverse());
                    }

                    break;

                case RoleEnum.parent:

                    const students = await apis.studentApi.studentControllerGetStudentByParentID(user.id);
                    let studentTempBulletinList: BulletinDto[] = [];

                    if (students.data && students.data.length > 0) {
                        const studentBulletinMapping = students.data.map(async (student) => {
                            if (student.classid && (student.classid as any)._id) {
                                let response = await apis.bulletinApi.bulletinControllerFindByFilter((student.classid as any)._id);
                                studentTempBulletinList.push(...response.data);
                            }
                        });

                        await Promise.all(studentBulletinMapping);
                    }

                    setBulletinList(studentTempBulletinList.reverse());

                    break;
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                if (!isCreateModalOpen) {
                    await initBulletins();
                }
            } catch (e) {
                console.error(e);
            }
        })();

        if (refreshFlag === true) {

            setRefreshFlag(false);
        }
    }, [refreshFlag, refreshCounter]);

    const mapBulletinsWithCreationDate = useMemo(() => {
        let date: Date | null = null;

        const elements = bulletinList.map((bulletin, index) => {

            if (date === null || date.toDateString() !== new Date(bulletin.createdDate).toDateString()) {

                date = new Date(bulletin.createdDate);
                const isDifferentDay = new Date().toDateString() !== date.toDateString();

                return (
                    <React.Fragment key={index}>
                        <div style={{ paddingLeft: '15px', paddingTop: '20px', paddingBottom: '20px' }}>
                            <span className="primary-color">{!isDifferentDay ? "Bugün" : date.toLocaleDateString()}</span>
                        </div>
                        <div>
                            <MemoizedAnnouncementCard
                                bulletin={bulletin}
                                key={index}
                                isDifferentDay={true}
                            />
                        </div>
                    </React.Fragment>
                );
            } else {
                return (
                    <MemoizedAnnouncementCard
                        key={index}
                        isDifferentDay={false}
                        bulletin={bulletin} />
                );
            }
        });

        return <>{elements}</>;
    }, [bulletinList]);

    const closeCreationModal = useCallback((created: boolean) => {

        if (created) {

            setRefreshFlag(true);
        }
        setCreateModalOpen(false);
    }, []);

    return (
        <IonContent>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Duyurular</IonTitle>
                </IonToolbar>
            </IonHeader>
            {user.roles.includes(RoleEnum.parent) === false &&
                <IonButton onClick={() => setCreateModalOpen(true)} className="announcement-create-btn" fill="clear"><IonIcon style={{ paddingBottom: '1px' }} icon={addOutline} />Duyuru Oluştur</IonButton>}
            {isCreateModalOpen === false && mapBulletinsWithCreationDate}
            <BulletinCreationModal userId={user.id} isOpen={isCreateModalOpen} closeModal={closeCreationModal} classList={classList} />
        </IonContent>
    )
}

export default BulletinPage