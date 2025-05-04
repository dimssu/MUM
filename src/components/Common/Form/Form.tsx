import React, { useState, useEffect, FormEvent } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { isEmpty } from '../../../Utils/utils';
import styles from './Form.module.scss';

export type FormField = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  patternMessage?: string;
  value?: string | number;
  unit?: string | React.ReactNode;
  options?: { label: string; value: string | number }[];
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  numberOfDecimals?: number;
  allowZero?: boolean;
  textAreaRows?: number;
  disabled?: boolean;
  readOnly?: boolean;
};

export type FormValues = Record<string, string | number>;

type FormProps = {
  fields: FormField[];
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  showActions?: boolean;
  loading?: boolean;
  validationErrors?: Record<string, string>;
  className?: string;
};

const Form: React.FC<FormProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  submitButtonText = 'Submit',
  cancelButtonText = 'Cancel',
  showActions = true,
  onCancel,
  loading = false,
  validationErrors = {},
  className = '',
}) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form values when initialValues change
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Update errors when external validation errors are provided
  useEffect(() => {
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }
  }, [validationErrors]);

  const handleChange = (name: string, value: string | number) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name: string, value: string | number | undefined) => {
    const field = fields.find((f) => f.name === name);
    if (!field) return true;

    // Required validation
    if (field.required && isEmpty(value)) {
      setErrors((prev) => ({ ...prev, [name]: `${field.label} is required` }));
      return false;
    }

    // Pattern validation
    if (field.pattern && typeof value === 'string' && !new RegExp(field.pattern).test(value)) {
      setErrors((prev) => ({ 
        ...prev, 
        [name]: field.patternMessage || `${field.label} is invalid` 
      }));
      return false;
    }

    // Min/max length validation for strings
    if (typeof value === 'string') {
      if (field.minLength && value.length < field.minLength) {
        setErrors((prev) => ({ 
          ...prev, 
          [name]: `${field.label} must be at least ${field.minLength} characters` 
        }));
        return false;
      }
      
      if (field.maxLength && value.length > field.maxLength) {
        setErrors((prev) => ({ 
          ...prev, 
          [name]: `${field.label} must be at most ${field.maxLength} characters` 
        }));
        return false;
      }
    }

    // Min/max validation for numbers
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const numValue = typeof value === 'number' ? value : Number(value);
      
      if (field.min !== undefined && numValue < field.min) {
        setErrors((prev) => ({ 
          ...prev, 
          [name]: `${field.label} must be at least ${field.min}` 
        }));
        return false;
      }
      
      if (field.max !== undefined && numValue > field.max) {
        setErrors((prev) => ({ 
          ...prev, 
          [name]: `${field.label} must be at most ${field.max}` 
        }));
        return false;
      }
    }

    // Clear error if validation passes
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    return true;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    fields.forEach((field) => {
      newTouched[field.name] = true;
      if (!validateField(field.name, values[field.name])) {
        isValid = false;
      }
    });

    setTouched(newTouched);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(values);
    }
  };

  return (
    <form 
      className={`${styles.form} ${className}`} 
      onSubmit={handleSubmit} 
      noValidate
    >
      <div className={styles.formFields}>
        {fields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <Input
              name={field.name}
              type={field.type || 'text'}
              placeholder={field.label}
              value={values[field.name] || ''}
              onChange={(value: string | number) => handleChange(field.name, value)}
              onBlur={() => handleBlur(field.name)}
              isValid={!errors[field.name]}
              errorMessage={touched[field.name] ? errors[field.name] : ''}
              unit={field.unit}
              maxLength={field.maxLength}
              textAreaRows={field.textAreaRows}
              allowNegative={field.allowNegative}
              allowDecimal={field.allowDecimal}
              numberOfDecimals={field.numberOfDecimals}
              allowZero={field.allowZero}
              disabled={field.disabled || loading}
              readOnly={field.readOnly}
              pattern={field.pattern}
            />
          </div>
        ))}
      </div>
      
      {showActions && (
        <div className={styles.formActions}>
          {onCancel && (
            <Button
              text={cancelButtonText}
              onClick={onCancel}
              variant="secondary"
              type="button"
            disabled={loading}
          />
          )}
          <Button
            text={submitButtonText}
            onClick={() => {}}
            variant="primary"
            type="submit"
            loading={loading}
            disabled={loading}
          />
        </div>
      )}
    </form>
  );
};

export default Form;
