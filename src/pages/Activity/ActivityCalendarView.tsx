import { IonContent } from "@ionic/react";
import { Event } from "react-big-calendar";
import { ClassDto, StudentDto } from "../../../api/models";
import CalendarComponent from "../../utils/CalendarComponent";

interface CalendarViewProps {
  eventList: Event[];
  view: "week" | "month";
  classList: ClassDto[];
  studentList: StudentDto[];
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  activeClass: ClassDto | undefined;
  activeStudent: StudentDto | undefined;
  setActiveClass: (clazz: ClassDto) => void;
  setActiveStudent: (student: StudentDto) => void;
  menuRef: React.RefObject<HTMLIonMenuElement>;
}

function ActivityCalendarView({
  menuRef,
  eventList,
  view,
  classList,
  studentList,
  setActiveClass,
  setActiveStudent,
  selectedDate,
  onDateSelect,
  activeClass,
  activeStudent,
}: CalendarViewProps) {

  return (
    <IonContent id="activity-menu-content">
      <CalendarComponent
        classList={classList}
        view={view}
        eventList={eventList}
        onDateSelect={onDateSelect}
        selectedDate={selectedDate}
        activeClass={activeClass as ClassDto}
        activeStudent={activeStudent as StudentDto}
        studentList={studentList}
        setActiveClass={setActiveClass}
        setActiveStudent={setActiveStudent}
        menuRef={menuRef}
      />
    </IonContent>
  );
}

export default ActivityCalendarView;
