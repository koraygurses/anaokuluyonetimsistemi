// import { forwardRef, useRef, useState } from "react";
// import { IonItem, IonSelect } from "@ionic/react";

// //TODO bunu itemla yap

// interface Props {
//     options?: any[]
//     label?: string;
//     labelPlacement?: "stacked" | "floating" | "fixed";
//     placeholder?: string;
// }

// export interface AysSelectItemElement {
//     isValid: () => boolean;
//     getValue: () => string | number | null | undefined;
// }

// const AysSelectItem = forwardRef<AysSelectItemElement, Props>((
//     { options, label, labelPlacement, placeholder }
// ) => {

//     const [isValid, setIsValid] = useState(false);
//     const [isTouched, setIsTouched] = useState(false);
//     const inputRef = useRef<HTMLIonSelectElement>(null);

//     const validate = (e: Event) => {

//     };

//     return (
//         <div id="rectangle">

//         </div>
//     );
// }
// );

// export default AysSelectItem;