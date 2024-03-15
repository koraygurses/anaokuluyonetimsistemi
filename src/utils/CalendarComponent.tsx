import { Calendar, momentLocalizer, Event, ToolbarProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Children, cloneElement, ReactNode } from "react";
import 'moment/locale/tr';
import React from 'react';
import { IonButton, IonCol, IonHeader, IonIcon, IonLabel, IonSelect, IonSelectOption, IonToolbar, SelectChangeEventDetail } from '@ionic/react';
import { faChevronLeft, faChevronRight, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ClassDto, StudentDto } from '../../api/models';
import { menuOutline } from 'ionicons/icons';
import { useMediaQuery } from 'react-responsive';
import ActivityViewChooser from '../components/Header/ActivityViewChooser';

moment.updateLocale('tr', {
    months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
    monthsShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
    week: {
        dow: 1,
    },
    weekdays: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
    weekdaysShort: ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
});

const localizer = momentLocalizer(moment);

interface Props {
    eventList: Event[]
    classList: ClassDto[]
    activeClass: ClassDto
    setActiveClass: (clazz: ClassDto) => void
    setActiveStudent: (student: StudentDto) => void
    activeStudent: StudentDto
    studentList: StudentDto[]
    selectedDate?: Date
    onDateSelect: (date: Date) => void
    view: 'week' | 'month'
    menuRef: React.RefObject<HTMLIonMenuElement>
}

function CalendarComponent({ menuRef, eventList, activeClass, classList, activeStudent, studentList, selectedDate, onDateSelect, view, setActiveClass, setActiveStudent }: Props) {

    const wideScreenWidth = useMediaQuery({ query: '(min-width:768px' });

    const openMenu = () => {
        if (menuRef.current) {
            menuRef.current.open();
        }
    }

    interface TouchCellWrapperProps {
        children: ReactNode;
        value: Date;
        onSelectSlot: (args: { action: string; slots: Date[] }) => void;
    }

    const TouchCellWrapper = ({ children, value, onSelectSlot }: TouchCellWrapperProps) =>
        cloneElement(Children.only(children) as React.ReactElement, {
            onTouchEnd: () => onSelectSlot({
                action: "click", slots: [value]
            }),
            className: `${(children as React.ReactElement).props.className}`
        });

    const onSelectSlot = ({ action, slots }: { action: string; slots: Date[] }) => {
        if (action === "select" || action === "click") {
            if (slots.length > 1) {
                return false;
            } else {
                const selectedDate = slots[0];
                onDateSelect(selectedDate);
            }
        } else {
            return false;
        }
    };

    const handleSelecting = (slot: { start: Date; end: Date }): boolean => {
        return false;
    };

    class CustomToolbar extends React.Component<ToolbarProps> {
        handleClassChange = (event: CustomEvent<SelectChangeEventDetail<any>>) => {
            setActiveClass(event.detail.value);
        };

        handleStudentChange = (event: CustomEvent<SelectChangeEventDetail<any>>) => {
            setActiveStudent(event.detail.value);
        };

        handleNavigate = (action: 'TODAY' | 'PREV' | 'NEXT') => {
            this.props.onNavigate(action);
        };

        getLabel = () => {
            return this.props.label;
        }

        render() {
            const { label } = this.props;

            return (
                <div>
                    <IonHeader>
                        <IonToolbar>
                            {wideScreenWidth ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        paddingTop: '16px',
                                        paddingBottom: '16px',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <ActivityViewChooser />
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            margin: 'auto',
                                            paddingTop: '5px',
                                            paddingBottom: '1px'
                                        }}
                                    >
                                        <IonLabel style={{ fontWeight: 'bold', fontSize: '18px' }}>{label}</IonLabel>
                                    </div>
                                </div>
                            ) : (
                                <div className='align-items-center'>
                                    <IonButton onClick={openMenu} style={{ fontSize: '20px' }} fill='clear' color={'dark'}><IonIcon slot='start' icon={menuOutline} /></IonButton>
                                    <IonCol className="ion-text-start ays-pl10">
                                        <IonLabel style={{ fontWeight: 'bold', fontSize: '18px' }}>{label}</IonLabel>
                                    </IonCol>
                                </div>
                            )}
                        </IonToolbar>
                    </IonHeader>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IonButton fill='clear' onClick={() => this.handleNavigate('TODAY')}>
                            <FontAwesomeIcon icon={faRotateLeft} />
                        </IonButton>
                        <IonButton fill='clear' onClick={() => this.handleNavigate('PREV')}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </IonButton>
                        <IonButton fill='clear' onClick={() => this.handleNavigate('NEXT')}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </IonButton>

                        {activeClass ? (
                            <IonSelect
                                value={activeClass}
                                onIonChange={(e) => this.handleClassChange(e)}
                                interfaceOptions={{
                                    header: 'Sınıf'
                                }}
                                style={{ marginLeft: 'auto', width: 'auto', paddingRight: '15px' }}
                            >
                                {classList.map((c) => (
                                    <IonSelectOption key={(c as any)._id} value={c}>
                                        {c.name}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        ) :
                            (
                                <IonSelect
                                    value={activeStudent}
                                    onIonChange={(e) => this.handleStudentChange(e)}
                                    interfaceOptions={{
                                        header: 'Sınıf'
                                    }}
                                    style={{ marginLeft: 'auto', width: 'auto', paddingRight: '15px' }}
                                >
                                    {studentList.map((s) => (
                                        <IonSelectOption key={(s as any)._id} value={s}>
                                            {s.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            )}
                    </div>
                </div>
            );
        }
    }

    return (
        <Calendar
            components={{
                dateCellWrapper: (props) => (
                    <TouchCellWrapper {...props} onSelectSlot={onSelectSlot} />
                ),
                toolbar: (props) => (
                    <CustomToolbar
                        {...props}
                    />
                ),
            }}
            localizer={localizer}
            culture="tr"
            events={eventList}
            formats={{
                timeGutterFormat: 'HH:mm',
                eventTimeRangeFormat: ({ start, end }) => {
                    return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`;
                },
            }}
            messages={{
                today: "Bugün",
                previous: "Önceki",
                next: "Sonraki",
                month: "Ay",
                week: "Hafta",
                day: "Gün",
                agenda: "Gündem"
            }}
            view={view}
            showAllEvents
            selectable
            longPressThreshold={10}
            defaultDate={selectedDate}
            onSelectSlot={onSelectSlot}
            onSelecting={handleSelecting}
            onView={(newView) => {
                // Koyulmadığında inciniyor
            }}
        />
    );
};

export default CalendarComponent;
