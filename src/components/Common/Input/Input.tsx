import clsx from 'clsx';
import React from 'react';

import styles from './Input.module.scss';
import { isEmpty } from '../../../Utils/utils';

type InputProps = {
    readonly placeholder?: string;
    readonly type?: string;
    readonly pattern?: string;
    readonly isValid?: boolean;
    readonly errorMessage?: string;
    readonly convertedText?: string;
    readonly value: string | number;
    readonly style?: React.CSSProperties;
    readonly inputStyle?: React.CSSProperties;
    readonly labelStyle?: React.CSSProperties;
    readonly unitContainer?: React.CSSProperties;
    readonly unitStyle?: React.CSSProperties;
    readonly onChange: Function;
    readonly name?: string;
    readonly onEnter?: Function;
    readonly onBlur?: () => void;
    readonly disabled?: boolean;
    readonly readOnly?: boolean;
    readonly maxLength?: number;
    readonly unit?: string | React.ReactNode;
    readonly textAreaRows?: number;
    readonly allowNegative?: boolean;
    readonly allowDecimal?: boolean;
    readonly numberOfDecimals?: number;
    readonly allowZero?: boolean;
    readonly onClick?: () => void;
    readonly isActive?: boolean;
};

function Input({
    type = 'text',
    placeholder = '',
    pattern = '',
    isValid = true,
    errorMessage = '',
    convertedText = '',
    value = '',
    onChange,
    name,
    onEnter,
    style,
    inputStyle,
    labelStyle,
    unitContainer,
    unitStyle,
    disabled = false,
    readOnly = false,
    maxLength,
    unit,
    textAreaRows = 4,
    allowNegative = false,
    allowDecimal = false,
    numberOfDecimals = 4,
    allowZero = true,
    onClick,
    isActive = false,
    onBlur,
}: InputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newValue = e.target.value;
        if (pattern && !e.target.validity.valid) return;
        if (maxLength && newValue?.length > maxLength) return;
        if (type === 'number' && allowDecimal) {
            const decimalIndex = newValue.split('.')[1];
            if (decimalIndex && decimalIndex.length > numberOfDecimals) {
                newValue = newValue.slice(0, newValue.indexOf('.') + numberOfDecimals + 1);
            }
        }
        onChange(newValue);
    };

    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    name={name}
                    className={clsx(styles.FormInput, {
                        [styles.Invalid]: !isValid,
                        [styles.HasData]: !isEmpty(value),
                        [styles.WithUnit]: !!unit,
                        [styles.ReadOnly]: readOnly,
                    })}
                    value={value}
                    onChange={handleChange}
                    onKeyUp={(e) => {
                        if (onEnter && e.key === 'Enter') onEnter();
                    }}
                    disabled={disabled}
                    readOnly={readOnly}
                    style={inputStyle}
                    onWheel={(e: any) => e.target?.blur?.()}
                    rows={textAreaRows}
                    onBlur={onBlur}
                />
            );
        }
        return (
            <input
                name={name}
                className={clsx(styles.FormInput, {
                    [styles.Invalid]: !isValid,
                    [styles.HasData]: !isEmpty(value),
                    [styles.WithUnit]: !!unit,
                    [styles.ReadOnly]: readOnly,
                    [styles.Active]: isActive,
                })}
                type={type}
                pattern={pattern}
                value={value}
                onChange={handleChange}
                onKeyUp={(e) => {
                    if (onEnter && e.key === 'Enter') onEnter();
                }}
                onKeyDown={(e) => {
                    if (type === 'number') {
                        ['e', 'E', '+'].includes(e.key) && e.preventDefault();
                        if (!allowNegative && e.key === '-') e.preventDefault();
                        if (!allowDecimal && e.key === '.') e.preventDefault();
                        if (!allowZero && e.key === '0' && value === '') e.preventDefault();
                    }
                }}
                disabled={disabled}
                readOnly={readOnly}
                style={inputStyle}
                onWheel={(e: any) => e.target?.blur?.()}
                onBlur={onBlur}
            />
        );
    };

    return (
        <div
            className={clsx(styles.InputContainer, {
                [styles.ContainerWithErrorMsg]: !!errorMessage,
            })}
            style={style}
            onClick={onClick}
        >
            {renderInput()}
            <label
                className={clsx(styles.FormLabel, {
                    [styles.FormLabelInputHasValue]: !isEmpty(value),
                })}
                style={labelStyle}
            >
                {placeholder}
            </label>
            {unit && (
                <div
                    className={clsx({
                        [styles.UnitWrap]: true,
                        [styles.UnitWithData]: !isEmpty(value),
                        [styles.Invalid]: !isValid,
                        [styles.Active]: isActive,
                    })}
                    style={unitContainer}
                >
                    <div style={unitStyle} className={styles.Unit}>
                        {unit}
                    </div>
                </div>
            )}
            {!!(!isValid && errorMessage) && <div className={styles.Error}>{errorMessage}</div>}
            {!!(isValid && convertedText) && <div className={styles.ConvertedText}>{convertedText}</div>}
        </div>
    );
}

export default Input;
