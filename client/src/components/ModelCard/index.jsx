import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../../store/slices/modelSlice';
import { createInvitation } from '../../store/slices/invitationSlice';
import { fetchMyCastings } from '../../store/slices/castingSlice';
import ModalWindow from '../ModalWindow';
import InfoModal from '../InfoModal';
import ReportUserModal from '../ReportUserModal';
import { FiEdit, FiArrowLeft, FiCheck, FiFlag } from 'react-icons/fi';
import defaultAvatarLocal from '../../../img/default-avatar.jpg';
import styles from './ModelCard.module.sass';
import CONSTANTS from '../../utils/constants';
import { profileValidationSchema } from '../../utils/validationSchema';

export default function ModelCard ({
  model,
  isEditable = false,
  onPhotoChange,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(state => state.auth);
  const { myCastings } = useSelector(
    state => state.casting || { myCastings: [] }
  );

  const currentUserRole = (user?.role || user?.USR_Role || '').toLowerCase();
  const isAdmin = currentUserRole === 'admin';
  const isAgency = currentUserRole === 'agency';

  const [photoPreview, setPhotoPreview] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [selectedCasting, setSelectedCasting] = useState('');
  const [inviteStatus, setInviteStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const [infoModal, setInfoModal] = useState({
    isOpen: false,
    title: '',
    message: '',
  });

  const fileInputRef = useRef(null);

  const activeCastings = useMemo(() => {
    return myCastings?.filter(c => c.CST_Status === 'active') || [];
  }, [myCastings]);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditing]);

  useEffect(() => {
    if (!isFlipped) {
      setShowInviteMenu(false);
      setSelectedCasting('');
      setInviteStatus({ loading: false, success: false, error: null });
    }
  }, [isFlipped]);

  useEffect(() => {
    if (isAgency && showInviteMenu) {
      dispatch(fetchMyCastings({ page: 1, limit: 100 }));
    }
  }, [isAgency, showInviteMenu, dispatch]);

  const progressStats = useMemo(() => {
    const textFields = CONSTANTS.PROFILE_FIELDS;

    const filledTextCount = textFields.filter(field => {
      const value = model[field.name];
      return (
        value !== null && value !== undefined && value.toString().trim() !== ''
      );
    }).length;

    const hasPhoto =
      model.MOD_Photo &&
      model.MOD_Photo.trim() !== '' &&
      model.MOD_Photo !== defaultAvatarLocal;

    const totalItems = textFields.length + 1;
    const filledItems = filledTextCount + (hasPhoto ? 1 : 0);
    const percent = Math.round((filledItems / totalItems) * 100);

    return { percent, filled: filledItems, total: totalItems };
  }, [model]);

  const handleChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    if (onPhotoChange) onPhotoChange(file);
    e.target.value = null;
  };

  const handleCardClick = () => {
    if (!isEditing && !isReportModalOpen) setIsFlipped(!isFlipped);
  };

  const handlePhotoClick = e => {
    if (isEditable) {
      e.stopPropagation();
      fileInputRef.current.click();
    }
  };

  const handleCloseEditMode = () => {
    setIsEditing(false);
    setIsFlipped(false);
  };

  const formatFieldValue = (field, value) => {
    if (value === null || value === undefined || value === '') return '-';

    if (field === 'MOD_BirthDate') {
      return value.toString().split('T')[0];
    }

    if (field === 'MOD_Experience') {
      const exp = Number(value);
      return `${exp} year${exp === 1 ? '' : 's'}`;
    }

    if (field === 'MOD_Gender') {
      return (
        value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
      );
    }

    return value;
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Verified';
      case 'blocked':
        return 'Declined';
      case 'pending':
        return 'Pending';
      default:
        return 'Pending';
    }
  };

  const handleSendInvite = async e => {
    e.stopPropagation();
    if (!selectedCasting) return;

    setInviteStatus({ loading: true, success: false, error: null });

    try {
      await dispatch(
        createInvitation({
          CST_ID: selectedCasting,
          MOD_ID: model.MOD_ID,
        })
      ).unwrap();

      setInviteStatus({ loading: false, success: true, error: null });

      setTimeout(() => setShowInviteMenu(false), 2000);
    } catch (error) {
      const msg =
        typeof error === 'string'
          ? error
          : error?.message || 'Something went wrong';

      setInviteStatus({ loading: false, success: false, error: msg });

      setInfoModal({
        isOpen: true,
        title: 'Invitation Notice',
        message: msg,
      });
    }
  };

  const currentStatus = model.MOD_Status || 'pending';

  return (
    <>
      <ReportUserModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedUserId={model.USR_ID}
        reportedUserName={`${model.MOD_FirstName} ${model.MOD_LastName}`}
      />

      {isEditing && (
        <div className={styles.overlay} onClick={handleCloseEditMode} />
      )}

      <div
        className={`${styles.cardContainer} ${
          isEditing ? styles.modalActive : ''
        }`}
        onClick={handleCardClick}
        title={!isEditing ? 'Flip card' : ''}
      >
        <div
          className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}
        >
          {/* --- FRONT --- */}
          <div className={`${styles.cardFront} ${styles.profileCard}`}>
            <div className={styles.photoWrapper} onClick={handlePhotoClick}>
              {isEditable && (
                <input
                  type='file'
                  accept='image/*'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleChange}
                />
              )}
              <img
                src={
                  photoPreview ||
                  (model.MOD_Photo
                    ? `${CONSTANTS.BASE_URL}${model.MOD_Photo}`
                    : defaultAvatarLocal)
                }
                alt='Profile'
                className={styles.profilePhoto}
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatarLocal;
                }}
              />
            </div>

            <div className={styles.infoColumn}>
              <div className={styles.nameWrapper}>
                <span
                  className={`${styles.fullName} ${
                    currentStatus === 'active' ? styles.verifiedName : ''
                  }`}
                >
                  {model.MOD_FirstName?.toUpperCase()}{' '}
                  {model.MOD_LastName?.toUpperCase()}
                </span>

                <span
                  className={`${styles.statusBadge} ${styles[currentStatus]}`}
                >
                  {getStatusText(currentStatus)}
                </span>
              </div>

              <div className={styles.infoWrapper}>
                {[
                  'MOD_Gender',
                  'MOD_BirthDate',
                  'MOD_Height',
                  'MOD_Weight',
                  'MOD_EyeColor',
                  'MOD_HairColor',
                  'MOD_Experience',
                ].map(field => (
                  <div key={field} className={styles.infoRow}>
                    <span className={styles.infoLabel}>
                      {field.replace('MOD_', '')}:
                    </span>
                    <span>{formatFieldValue(field, model[field])}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.bioSection}>
              <h3>About</h3>
              <p>{model.MOD_Bio || '-'}</p>
            </div>
          </div>

          {/* --- BACK --- */}
          <div className={styles.cardBack}>
            {isEditable && isEditing ? (
              <div
                className={styles.formScrollContainer}
                onClick={e => e.stopPropagation()}
              >
                <ModalWindow
                  model={model}
                  fields={CONSTANTS.PROFILE_FIELDS}
                  validationSchema={profileValidationSchema}
                  inline
                  onClose={() => handleCloseEditMode()}
                  onSubmit={values => {
                    dispatch(saveProfile(values));
                    handleCloseEditMode();
                  }}
                />
              </div>
            ) : isEditable && !isEditing ? (
              <div className={styles.statsContainer}>
                <div
                  className={styles.progressCircle}
                  style={{
                    background: `conic-gradient(#000 ${progressStats.percent}%, #eee 0)`,
                  }}
                >
                  <div className={styles.innerCircle}>
                    <span className={styles.percentText}>
                      {progressStats.percent}%
                    </span>
                  </div>
                </div>

                <div className={styles.statsText}>
                  <h3>Profile Completion</h3>
                  <p>
                    {progressStats.filled} / {progressStats.total} fields filled
                  </p>
                </div>

                <button
                  className={styles.actionBtnStats}
                  onClick={e => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                >
                  {progressStats.percent === 100
                    ? 'Update Info'
                    : 'Complete Profile'}
                </button>
              </div>
            ) : isAdmin ? (
              <>
                <h2>Admin Actions</h2>
                <p>Return to the dashboard to moderate this profile.</p>
                <div className={styles.backButtons}>
                  <button
                    className={styles.portfolioBtn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      if (currentStatus === 'pending') {
                        navigate('/admin/verify');
                      } else {
                        navigate('/admin/users');
                      }
                    }}
                  >
                    <FiArrowLeft /> Back to Moderation
                  </button>
                </div>
              </>
            ) : isAgency ? (
              <>
                <h2>Agency Actions</h2>

                {!showInviteMenu ? (
                  <>
                    <p>Select an action for this model:</p>
                    <div className={styles.backButtons}>
                      <button
                        className={styles.contactBtn}
                        onClick={e => e.stopPropagation()}
                      >
                        Message
                      </button>
                      <button
                        className={styles.portfolioBtn}
                        onClick={e => {
                          e.stopPropagation();
                          setShowInviteMenu(true);
                        }}
                      >
                        Invite to Casting
                      </button>

                      <button
                        className={styles.reportBtn}
                        onClick={e => {
                          e.stopPropagation();
                          setIsReportModalOpen(true);
                        }}
                      >
                        <FiFlag /> Report
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className={styles.inviteMenu}
                    onClick={e => e.stopPropagation()}
                  >
                    <p>Select an active casting to invite this model:</p>

                    {activeCastings.length > 0 ? (
                      <>
                        <select
                          className={styles.castingSelect}
                          value={selectedCasting}
                          onChange={e => setSelectedCasting(e.target.value)}
                        >
                          <option value='' disabled>
                            -- Select a casting --
                          </option>
                          {activeCastings.map(c => (
                            <option key={c.CST_ID} value={c.CST_ID}>
                              {c.CST_Title}
                            </option>
                          ))}
                        </select>
                        <InfoModal
                          isOpen={infoModal.isOpen}
                          onClose={() => setInfoModal(false)}
                          title={infoModal.title}
                        >
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 500,
                              color: '#374151',
                            }}
                          >
                            {infoModal.message}
                          </p>
                        </InfoModal>

                        {inviteStatus.error && (
                          <p className={styles.errorText}>
                            {inviteStatus.error}
                          </p>
                        )}

                        <div className={styles.inviteActions}>
                          <button
                            className={
                              inviteStatus.success
                                ? styles.successBtn
                                : styles.submitInviteBtn
                            }
                            onClick={handleSendInvite}
                            disabled={
                              !selectedCasting ||
                              inviteStatus.loading ||
                              inviteStatus.success
                            }
                          >
                            {inviteStatus.loading ? (
                              'Sending...'
                            ) : inviteStatus.success ? (
                              <>
                                <FiCheck /> Sent!
                              </>
                            ) : (
                              'Send Invitation'
                            )}
                          </button>

                          <button
                            className={styles.cancelBtn}
                            onClick={() => {
                              setShowInviteMenu(false);
                              setInviteStatus({
                                loading: false,
                                success: false,
                                error: null,
                              });
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.noCastingsMsg}>
                        <p>
                          You don't have any active castings to invite models
                          to.
                        </p>
                        <button
                          className={styles.cancelBtn}
                          onClick={() => setShowInviteMenu(false)}
                        >
                          Go Back
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : null}

            {isEditable && (
              <button
                className={styles.editBtn}
                onClick={e => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setIsFlipped(true);
                }}
              >
                <FiEdit />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
