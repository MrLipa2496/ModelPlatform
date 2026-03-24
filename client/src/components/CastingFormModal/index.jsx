import React, { useState, useEffect, useRef } from 'react';
import styles from './CastingFormModal.module.sass';
import CONSTANTS from '../../utils/constants';

const getInitialState = () => ({
  CST_Title: '',
  CST_Description: '',
  CST_Requirements: '',
  CST_Payment: 0,
  CST_StartDate: '',
  CST_EndDate: '',
  CST_Type: 'other',
  CST_Gender: 'any',
  CST_AgeMin: '',
  CST_AgeMax: '',
  CST_HeightMin: '',
  CST_HeightMax: '',
  CST_LocationType: 'on_site',
  CST_Country: '',
  CST_City: '',
});

const formatDateForInput = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

export default function CastingFormModal ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  formError,
}) {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState(
    isEditMode ? initialData : getInitialState()
  );
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.CST_CoverImage
      ? `${CONSTANTS.BASE_URL}${initialData.CST_CoverImage}`
      : null
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          ...initialData,
          CST_StartDate: formatDateForInput(initialData.CST_StartDate),
          CST_EndDate: formatDateForInput(initialData.CST_EndDate),
        });
        setImagePreview(
          initialData.CST_CoverImage
            ? `${CONSTANTS.BASE_URL}${initialData.CST_CoverImage}`
            : null
        );
      } else {
        setFormData(getInitialState());
        setImagePreview(null);
      }
      setCoverImageFile(null);
    }
  }, [initialData, isEditMode, isOpen]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      dataToSubmit.append(key, formData[key] || '');
    }
    if (coverImageFile) {
      dataToSubmit.append('coverImage', coverImageFile);
    }
    onSubmit(dataToSubmit, initialData?.CST_ID);
    onClose();
  };

  const modalTitle = isEditMode ? 'Edit Casting' : 'Create New Casting';
  const submitButtonText = isEditMode ? 'Save Changes' : 'Create Casting';

  if (!isOpen) {
    return null;
  }

  const handleModalClick = e => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={handleModalClick}>
        <h2 className={styles.modalTitle}>{modalTitle}</h2>

        <div className={styles.modalContent}>
          <form
            id='casting-form'
            className={styles.form}
            onSubmit={handleSubmit}
          >
            {formError && <div className={styles.formError}>{formError}</div>}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Main Details</legend>
              <div className={styles.formGroup}>
                <label htmlFor='CST_Title'>Casting Title*</label>
                <input
                  type='text'
                  id='CST_Title'
                  name='CST_Title'
                  value={formData.CST_Title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Cover Image (Billboard)</label>
                <div
                  className={styles.fileInputTrigger}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className={styles.imagePreview}
                    />
                  ) : (
                    <span>Click to upload an image</span>
                  )}
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='image/jpeg, image/png, image/webp'
                  style={{ display: 'none' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='CST_Description'>Description</label>
                <textarea
                  id='CST_Description'
                  name='CST_Description'
                  value={formData.CST_Description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Details & Payment</legend>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_Payment'>Payment ($)</label>
                  <input
                    type='number'
                    id='CST_Payment'
                    name='CST_Payment'
                    value={formData.CST_Payment}
                    onChange={handleChange}
                    min='0'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_Type'>Casting Type</label>
                  <select
                    id='CST_Type'
                    name='CST_Type'
                    value={formData.CST_Type}
                    onChange={handleChange}
                  >
                    <option value='commercial'>Commercial</option>
                    <option value='editorial'>Editorial</option>
                    <option value='runway'>Runway</option>
                    <option value='promo'>Promo</option>
                    <option value='tfp'>TFP</option>
                    <option value='other'>Other</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_StartDate'>Start Date</label>
                  <input
                    type='date'
                    id='CST_StartDate'
                    name='CST_StartDate'
                    value={formData.CST_StartDate}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_EndDate'>End Date</label>
                  <input
                    type='date'
                    id='CST_EndDate'
                    name='CST_EndDate'
                    value={formData.CST_EndDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Requirements</legend>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_Gender'>Gender</label>
                  <select
                    id='CST_Gender'
                    name='CST_Gender'
                    value={formData.CST_Gender}
                    onChange={handleChange}
                  >
                    <option value='any'>Any</option>
                    <option value='female'>Female</option>
                    <option value='male'>Male</option>
                    <option value='non_binary'>Non-binary</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_AgeMin'>Age (Min)</label>
                  <input
                    type='number'
                    id='CST_AgeMin'
                    name='CST_AgeMin'
                    value={formData.CST_AgeMin}
                    onChange={handleChange}
                    placeholder='e.g., 18'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_AgeMax'>Age (Max)</label>
                  <input
                    type='number'
                    id='CST_AgeMax'
                    name='CST_AgeMax'
                    value={formData.CST_AgeMax}
                    onChange={handleChange}
                    placeholder='e.g., 30'
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_HeightMin'>Height (cm, Min)</label>
                  <input
                    type='number'
                    id='CST_HeightMin'
                    name='CST_HeightMin'
                    value={formData.CST_HeightMin}
                    onChange={handleChange}
                    placeholder='e.g., 175'
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_HeightMax'>Height (cm, Max)</label>
                  <input
                    type='number'
                    id='CST_HeightMax'
                    name='CST_HeightMax'
                    value={formData.CST_HeightMax}
                    onChange={handleChange}
                    placeholder='e.g., 185'
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='CST_Requirements'>
                  Additional Requirements
                </label>
                <textarea
                  id='CST_Requirements'
                  name='CST_Requirements'
                  value={formData.CST_Requirements}
                  onChange={handleChange}
                  rows={3}
                  placeholder='e.g., "Must have driver license", "Fluent in Spanish"'
                />
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Location</legend>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor='CST_LocationType'>Location Type</label>
                  <select
                    id='CST_LocationType'
                    name='CST_LocationType'
                    value={formData.CST_LocationType}
                    onChange={handleChange}
                  >
                    <option value='on_site'>On-site</option>
                    <option value='remote'>Remote</option>
                  </select>
                </div>
              </div>
              {formData.CST_LocationType === 'on_site' && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor='CST_Country'>Country</label>
                    <input
                      type='text'
                      id='CST_Country'
                      name='CST_Country'
                      value={formData.CST_Country}
                      onChange={handleChange}
                      placeholder='e.g., Ukraine'
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor='CST_City'>City</label>
                    <input
                      type='text'
                      id='CST_City'
                      name='CST_City'
                      value={formData.CST_City}
                      onChange={handleChange}
                      placeholder='e.g., Kyiv'
                    />
                  </div>
                </div>
              )}
            </fieldset>
          </form>
        </div>

        <div className={styles.modalActions}>
          <button
            type='button'
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type='submit'
            form='casting-form'
            className={styles.submitButton}
          >
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
