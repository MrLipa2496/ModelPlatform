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
}) {
  const containerClass = inline ? styles.inlineContent : styles.modalContent;
  const overlayClass = inline ? styles.inlineWrapper : styles.modalOverlay;

  const isFullWidth = field =>
    field.type === 'textarea' ||
    field.name === 'description' ||
    field.name === 'about';

  return (
    <div className={overlayClass} onClick={onClose}>
      <div className={containerClass} onClick={e => e.stopPropagation()}>
        <h2 className={styles.title}>Edit Profile</h2>
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
          {() => (
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
                </div>
              ))}

              <div className={styles.modalButtons}>
                <button type='submit' className={styles.saveBtn}>
                  Save
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
