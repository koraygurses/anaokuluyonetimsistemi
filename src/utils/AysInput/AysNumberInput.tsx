import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { InputErrorType } from "./InputErrorType";
import { Form, Col } from "react-bootstrap";
import AysUtils from "../AysUtils";

interface Props {
  label?: string;
  fill?: "outline" | "solid";
  labelPlacement?: "stacked" | "floating" | "fixed";
  placeholder?: string;
  errorText?: string;
  isRequired?: boolean;
  validate?: boolean;
  requireIndicatorShown?: boolean;
  value?: number;
  readonly?: boolean;
}

export interface AysNumberInputElement {
  isValid: () => boolean;
  getValue: () => string | number | null | undefined;
  activate: () => void;
  //Ion Inputa özel metodlar varsa buraya eklenir, useImperativeHandle içine de aktarılır.
}

const AysNumberInput = forwardRef<AysNumberInputElement, Props>(
  (
    {
      label,
      fill,
      labelPlacement,
      placeholder,
      errorText = " ",
      isRequired = true,
      validate = true,
      requireIndicatorShown = isRequired,
      value,
      readonly = false,
    },
    ref
  ) => {
    const [isValid, setIsValid] = useState<InputErrorType>(
      value ? InputErrorType.success : InputErrorType.empty
    );
    const [isTouched, setIsTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current && value) {
        inputRef.current.value = value.toString();
      }
    }, []);

    function validateIfAllNumbers(inputString: string): boolean {
      return /^\d+$/.test(inputString);
    }

    const validateInput = (e: FormEvent) => {
      const value = (e.target as HTMLIonInputElement).value;

      if (value === "") {
        setIsValid(InputErrorType.empty);
        return;
      }
      return validateIfAllNumbers(value as string) !== null
        ? setIsValid(InputErrorType.success)
        : setIsValid(InputErrorType.error);
    };

    const markTouched = (touched: boolean) => {
      setIsTouched(touched);
    };

    const getErrorString = () => {
      if (isValid === InputErrorType.empty && isRequired) {
        return "Bu Alan Boş Bırakılamaz";
      } else {
        return errorText;
      }
    };

    useImperativeHandle(ref, () => ({
      isValid: () => {
        return isValid === InputErrorType.success;
      },
      getValue: () => {
        if (inputRef.current) {
          return inputRef.current.value;
        } else {
          return undefined;
        }
      },
      activate: () => {
        markTouched(true);
      },
    }));

    return (
      <Form.Group as={Col}>
        <Form.Label>
          {requireIndicatorShown
            ? AysUtils.getLabelWithRequiredIndicator(label)
            : label}
        </Form.Label>
        <Form.Control
          ref={inputRef}
          readOnly={readonly}
          isValid={isValid === InputErrorType.success}
          isInvalid={isTouched && isValid !== InputErrorType.success}
          required={isRequired}
          type="number"
          placeholder={placeholder}
          onInput={(event) => (validate ? validateInput(event) : undefined)}
          onBlur={() => markTouched(true)}
        />
        {isTouched && (
          <Form.Control.Feedback type="invalid">
            {getErrorString()}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      // <IonInput
      //   mode="md"
      //   className={
      //     validate
      //       ? `${isValid === InputErrorType.success} ${isValid !== InputErrorType.success && "ion-invalid"
      //       } ${isTouched && "ion-touched"}`
      //       : ""
      //   }
      //   ref={inputRef}
      //   type="number"
      //   fill={fill}
      //   labelPlacement={labelPlacement}
      //   placeholder={placeholder}
      //   onIonInput={(event) => (validate ? validateInput(event) : undefined)}
      //   errorText={validate ? (getErrorString() as string) : undefined}
      //   onIonBlur={() => markTouched(true)}
      //   onIonFocus={() => markTouched(false)}
      // >
      //   <div slot="label">
      //     {label + " "}
      //     {requireIndicatorShown &&
      //       <IonText color="danger">*</IonText>
      //     }
      //   </div>
      // </IonInput>
    );
  }
);

export default AysNumberInput;
