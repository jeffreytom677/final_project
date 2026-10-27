import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { recipeService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await recipeService.getById(id);
        setInitialData(res.data);
      } catch (err) {
        setFetchError(err.message || 'Could not load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await recipeService.update(id, formData);
      success(`"${formData.name}" was successfully updated!`);
      navigate(`/recipes/${id}`);
    } catch (err) {
      error(err.message || 'Failed to update recipe. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Loading recipe details...</p>
      </div>
    );
  }

  if (fetchError || !initialData) {
    return (
      <div className="empty-state" style={{ borderColor: '#fca5a5' }}>
        <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
          <AlertCircle size={32} />
        </div>
        <h3>Failed to Load Recipe</h3>
        <p>{fetchError || 'Recipe could not be found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>Back to Recipes</span>
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Edit Recipe</h1>
        <p>Modify ingredients, step directions, or cooking time for &quot;{initialData.name}&quot;.</p>
      </div>

      <RecipeForm
        initialValues={initialData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={true}
      />
    </div>
  );
};

export default EditRecipePage;
