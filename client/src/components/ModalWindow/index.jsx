import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import ValidatedField from '../ValidatedField';
import styles from './ModalWindow.module.sass';

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '48px',
    borderRadius: '30px',
    borderColor: state.isFocused ? '#333' : '#b3b3b3',
    boxShadow: state.isFocused ? '0 0 0 1px #333' : 'none',
    padding: '0 6px',
    cursor: 'text',
    backgroundColor: '#fff',
    '&:hover': {
      borderColor: '#333',
    },
  }),
  valueContainer: provided => ({
    ...provided,
    padding: '0 12px',
  }),
  input: provided => ({
    ...provided,
    margin: '0px',
    color: '#333',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: '#666',
    padding: '0 12px',
    '&:hover': {
      color: '#333',
    },
  }),
  placeholder: provided => ({
    ...provided,
    color: '#999',
    fontWeight: '400',
  }),
  singleValue: provided => ({
    ...provided,
    color: '#333',
  }),
  menu: provided => ({
    ...provided,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    marginTop: '6px',
    zIndex: 100,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#333'
      : state.isFocused
      ? '#f0f0f0'
      : 'transparent',
    color: state.isSelected ? '#fff' : '#333',
    cursor: 'pointer',
    padding: '12px 16px',
    '&:active': {
      backgroundColor: '#555',
    },
  }),
};

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

  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  useEffect(() => {
    const countryField = fields.find(f =>
      f.name.toLowerCase().includes('country')
    );
    if (countryField && model[countryField.name]) {
      const savedCountryName = model[countryField.name];
      const countryObj = Country.getAllCountries().find(
        c => c.name === savedCountryName
      );
      if (countryObj) {
        setSelectedCountryCode(countryObj.isoCode);
      }
    }
  }, [fields, model]);

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name,
    }));
  }, []);

  const cityOptions = useMemo(() => {
    if (!selectedCountryCode) return [];
    return City.getCitiesOfCountry(selectedCountryCode).map(city => ({
      value: city.name,
      label: city.name,
    }));
  }, [selectedCountryCode]);

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
          {({ setFieldValue, values, setFieldTouched }) => (
            <Form className={styles.profileForm}>
              {fields.map(field => {
                const isCountryField = field.name
                  .toLowerCase()
                  .includes('country');
                const isCityField = field.name.toLowerCase().includes('city');
                const isSmartSelect = isCountryField || isCityField;

                return (
                  <div
                    key={field.name}
                    className={
                      isFullWidth(field)
                        ? styles.fullWidthField
                        : styles.fieldWrapper
                    }
                  >
                    {isSmartSelect ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px',
                        }}
                      >
                        {field.label && (
                          <label
                            style={{
                              fontSize: '0.9rem',
                              fontWeight: '500',
                              color: '#555',
                              marginLeft: '5px',
                            }}
                          >
                            {field.label}
                          </label>
                        )}
                        <Select
                          options={
                            isCountryField ? countryOptions : cityOptions
                          }
                          styles={customSelectStyles}
                          placeholder={`Search ${field.label || 'location'}...`}
                          isDisabled={isCityField && !selectedCountryCode}
                          value={
                            isCountryField
                              ? countryOptions.find(
                                  c => c.label === values[field.name]
                                ) || null
                              : cityOptions.find(
                                  c => c.value === values[field.name]
                                ) || null
                          }
                          onChange={option => {
                            if (isCountryField) {
                              setFieldValue(field.name, option.label);
                              setSelectedCountryCode(option.value);

                              const cityField = fields.find(f =>
                                f.name.toLowerCase().includes('city')
                              );
                              if (cityField) setFieldValue(cityField.name, '');
                            } else {
                              setFieldValue(field.name, option.value);
                            }
                          }}
                          onBlur={() => setFieldTouched(field.name, true)}
                        />
                        <ErrorMessage
                          name={field.name}
                          component='div'
                          style={{
                            color: '#d32f2f',
                            fontSize: '0.75rem',
                            marginTop: '4px',
                            marginLeft: '5px',
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        {field.as === 'select' ? (
                          <ValidatedField {...field}>
                            {field.options &&
                              field.options.map(opt => (
                                <option key={opt} value={opt}>
                                  {opt === ''
                                    ? 'Select...'
                                    : opt.charAt(0).toUpperCase() +
                                      opt.slice(1)}
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
                                onClick={() => setFieldValue(field.name, opt)}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}

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
