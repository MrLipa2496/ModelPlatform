import React from 'react';
import { Formik, Form } from 'formik';
import ValidatedField from '../ValidatedField';
import styles from './ModalWindow.module.sass';

export default function ModalWindow ({
  model,
  fields,
  validationSchema,
  onClose,
  onSubmit,
  inline = false,
  title = 'Edit Profile',
  submitLabel = 'Save',
}) {
  const containerClass = inline ? styles.inlineContent : styles.modalContent;
  const overlayClass = inline ? styles.inlineWrapper : styles.modalOverlay;

  const isFullWidth = field =>
    field.type === 'textarea' ||
    field.name === 'description' ||
    field.name === 'about' ||
    field.name === 'reason';

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>

        <Formik
          enableReinitialize
          initialValues={fields.reduce((acc, f) => {
            acc[f.name] = model[f.name] || '';
            return acc;
          }, {})}
          validationSchema={validationSchema}
          onSubmit={async values => {
            const sanitizedValues = { ...values };

            Object.keys(sanitizedValues).forEach(key => {
              if (sanitizedValues[key] === '') {
                sanitizedValues[key] = null;
              }
            });

            await onSubmit(sanitizedValues);
            onClose();
          }}
        >
          {({ setFieldValue, values }) => (
            <Form className={styles.profileForm}>
              {fields.map(field => (
                <div
                  key={field.name}
                  className={
                    isFullWidth(field)
                      ? styles.fullWidthField
                      : styles.fieldWrapper
                  }
                >
                  {field.as === 'select' ? (
                    <ValidatedField {...field}>
                      {field.options &&
                        field.options.map(opt => (
                          <option key={opt} value={opt}>
                            {opt === ''
                              ? 'Select...'
                              : opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                    </ValidatedField>
                  ) : (
                    <ValidatedField {...field} />
                  )}

                  {field.quickOptions && field.quickOptions.length > 0 && (
                    <div className={styles.quickOptionsContainer}>
                      {field.quickOptions.map(opt => (
                        <button
                          key={opt}
                          type='button'
                          className={styles.quickOptionBtn}
                          onClick={() => {
                            setFieldValue(field.name, opt);
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className={styles.modalButtons}>
                <button type='submit' className={styles.saveBtn}>
                  {submitLabel}
                </button>
                <button
                  type='button'
                  className={styles.cancelBtn}
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
