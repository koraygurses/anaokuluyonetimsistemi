import { FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { InputErrorType } from './InputErrorType';
import { Form, Col } from 'react-bootstrap';
import AysUtils from '../AysUtils';

interface Props {
    label?: string;
    fill?: 'outline' | 'solid';
    labelPlacement?: 'stacked' | 'floating' | 'fixed';
    placeholder?: string;
    errorText?: string
    isRequired?: boolean
    validate?: boolean
    requireIndicatorShown?: boolean
    value?: string
    readonly?: boolean
}

export interface AysLetterInputElement {
    isValid: () => boolean;
    getValue: () => string | number | null | undefined;
    activate: () => void;
    //Ion Inputa özel metodlar varsa buraya eklenir, useImperativeHandle içine de aktarılır.
}

const AysLetterInput = forwardRef<AysLetterInputElement, Props>(
    ({ label, placeholder, errorText = " ", isRequired = true, validate = true, requireIndicatorShown = isRequired, value, readonly = false }, ref) => {

        const [isValid, setIsValid] = useState<InputErrorType>(value ? InputErrorType.success : InputErrorType.empty);
        const [isTouched, setIsTouched] = useState(value ? true : false);
        const inputRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (inputRef.current && value) {
                inputRef.current.value = value;
            }
        }, [])

        const validateIfAllLetters = (name: string) => {
            const onlyLettersRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]*$/;

            return onlyLettersRegex.test(name);
        }

        const validateInput = (e: FormEvent) => {
            const value = (e.target as HTMLIonInputElement).value;

            if (value === '') {
                setIsValid(InputErrorType.empty);
                return;
            }

            validateIfAllLetters(value as string) ? setIsValid(InputErrorType.success) : setIsValid(InputErrorType.error);
        }

        const markTouched = (touched: boolean) => {
            setIsTouched(touched);
        };

        const getErrorString = () => {
            if (isValid === InputErrorType.empty) {
                if (isRequired) {
                    return "Bu Alan Boş Bırakılamaz";
                }
            } else {
                return errorText;
            }
        }

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
                    type="text"
                    placeholder={placeholder}
                    onInput={(event) => (validate ? validateInput(event) : undefined)}
                    onBlur={() => markTouched(true)}
                />
                {isTouched && <Form.Control.Feedback type='invalid'>{getErrorString()}</Form.Control.Feedback>}
            </Form.Group>
        );
    }
);

export default AysLetterInput;