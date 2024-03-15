import { FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
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
  requireIndicatorShown?: boolean;
  value?: string;
  readonly?: boolean;
}

export interface AysPhoneInputElement {
  isValid: () => boolean;
  getValue: () => string | number | null | undefined;
  activate: () => void;
  //Ion Inputa özel metodlar varsa buraya eklenir, useImperativeHandle içine de aktarılır.
}

const AysPhoneInput = forwardRef<AysPhoneInputElement, Props>(
  (
    { label, placeholder, errorText = " ", isRequired = true, requireIndicatorShown = isRequired, value, readonly = false },
    ref
  ) => {
    const [isValid, setIsValid] = useState<InputErrorType>(value ? InputErrorType.success : InputErrorType.empty);
    const [isTouched, setIsTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current && value) {
        inputRef.current.value = value;
      }
    }, [])

    const formatInput = (e: FormEvent) => {
      const value = (e.target as HTMLIonInputElement).value as string;

      if (value === "") {
        setIsValid(InputErrorType.empty);
        return;
      }

      let inputValue = value.replace(/\s/g, "");

      let numericValue = value;

      if (inputValue.length > 0 && inputValue.length <= 7) {
        numericValue = value.replace(/(\d{3})(?=\d)/g, "$1 ");
      }

      const phonePattern = /^(?:\d{10}|\+90\d{10})$/;

      const numericPhoneNumber = value.replace(/\D/g, '');

      const isValidFormat = phonePattern.test(numericPhoneNumber);

      if (isValidFormat) {
        setIsValid(InputErrorType.success);
      } else {
        setIsValid(InputErrorType.error);
      }

      (e.target as HTMLIonInputElement).value = numericValue;
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

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const inputElement = e.target as HTMLIonInputElement;
      const value = inputElement.value as string;

      if (e.key === "Backspace" && value.endsWith(" ")) {
        inputElement.value = value.slice(0, -1);
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
      }
    }))

    return (

      <Form.Group as={Col}>
        <Form.Label>{requireIndicatorShown ? AysUtils.getLabelWithRequiredIndicator(label) : label}</Form.Label>
        <Form.Control
          ref={inputRef}
          readOnly={readonly}
          isValid={isValid === InputErrorType.success}
          isInvalid={isTouched && isValid !== InputErrorType.success}
          required={isRequired}
          type="tel"
          placeholder={placeholder}
          onInput={(event) => formatInput(event)}
          onBlur={() => markTouched(true)}
          onKeyDown={(event) => handleBackspace(event)}
          maxLength={12}
        />
        {isTouched && <Form.Control.Feedback type='invalid'>{getErrorString()}</Form.Control.Feedback>}
      </Form.Group>

    );
  }
);

export default AysPhoneInput;
