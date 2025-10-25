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

  return (
    <div className={overlayClass}>
      <div className={containerClass}>
        <h2 className={styles.title}>Edit Profile</h2>
        <Formik
          enableReinitialize
          initialValues={fields.reduce((acc, f) => {
            acc[f.name] = model[f.name] || '';
            return acc;
          }, {})}
          validationSchema={validationSchema}
          onSubmit={async values => {
            await onSubmit(values);
            onClose();
          }}
        >
          {() => (
            <Form className={styles.profileForm}>
              {fields.map(field => (
                <ValidatedField key={field.name} {...field} />
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
