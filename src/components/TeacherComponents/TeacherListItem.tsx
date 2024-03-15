import { TeacherDto } from "../../../api/models";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonRippleEffect } from "@ionic/react";

interface Props {
  teacher: TeacherDto;
  itemClicked: (teacher: TeacherDto) => void;
}

const getClassNames = (teacher: TeacherDto) => {
  let classNames: string[] = [];

  if (teacher.classid) {
    teacher.classid.forEach((clazz) => {
      classNames.push((clazz as any).name);
    });
  }

  let result: string = classNames.join(", ");

  return result;
};

function TeacherListItem({ teacher, itemClicked }: Props) {
  return (
    <div
      className="ion-activatable teacher-item"
      onClick={() => itemClicked(teacher)}
    >
      <FontAwesomeIcon
        className="teacher-img-padding"
        size="2x"
        icon={faUser}
      />
      <div className="teacher-info">
        <h3>{teacher.name}</h3>
        <p>{getClassNames(teacher)}</p>
      </div>
      <IonRippleEffect></IonRippleEffect>
    </div>
  );
}

export default TeacherListItem;
