import React from 'react';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import classNames from 'classnames';
import styles from './ValidatedField.module.sass';

function ValidatedField ({
  name,
  type = 'text',
  label,
  as = 'input',
  children,
  ...props
}) {
  const { errors, touched, submitCount } = useFormikContext();
  const showError = (touched[name] || submitCount > 0) && errors[name];

  const className = classNames(styles.input, {
    [styles.valid]:
      !showError && (touched[name] || submitCount > 0) && type !== 'checkbox',
    [styles.invalid]: !!showError,
  });

  return (
    <div className={styles.fieldContainer}>
      {as !== 'checkbox' && label && (
        <label htmlFor={name} className={styles.fieldLabel}>
          {label}
        </label>
      )}

      <Field name={name} as={as} type={type} {...props}>
        {({ field }) => {
          if (as === 'select') {
            return (
              <>
                <select {...field} id={name} className={className}>
                  {children}
                </select>
                <ErrorMessage
                  name={name}
                  component='div'
                  className={styles.error}
                />
              </>
            );
          }

          if (type === 'checkbox') {
            return (
              <div className={styles.checkboxWrapper}>
                <Field name={name}>
                  {({ field }) => (
                    <>
                      <input
                        {...field}
                        id={name}
                        type='checkbox'
                        className={className}
                        checked={field.value}
                      />

                      <ErrorMessage
                        name={name}
                        component='div'
                        className={styles.error}
                      />
                    </>
                  )}
                </Field>
              </div>
            );
          }

          return (
            <>
              <input
                {...field}
                id={name}
                type={type}
                className={className}
                placeholder={props.placeholder}
              />
              <ErrorMessage
                name={name}
                component='div'
                className={styles.error}
              />
            </>
          );
        }}
      </Field>
    </div>
  );
}

export default ValidatedField;
