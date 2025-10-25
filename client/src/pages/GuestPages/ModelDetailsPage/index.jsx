import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchModelById } from '../../../store/slices/modelSlice';
import ModelCard from '../../../components/ModelCard';
import styles from './ModelDetailsPage.module.sass';

export default function ModelDetailsPage () {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selectedModel, loading } = useSelector(state => state.model);

  useEffect(() => {
    dispatch(fetchModelById(id));
  }, [dispatch, id]);

  if (loading || !selectedModel) {
    return <p className={styles.loading}>Loading...</p>;
  }

  const model = selectedModel;

  return (
    <>
      <div className={styles.profilePage}>
        <ModelCard model={model} isEditable={false} />
      </div>
    </>
  );
}
