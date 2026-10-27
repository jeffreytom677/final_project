import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/api';
import CategoryBadge from '../components/CategoryBadge';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';
import {
  ArrowLeft,
  Clock,
  Edit3,
  Trash2,
  Calendar,
  Utensils,
  ListOrdered,
  AlertCircle
} from 'lucide-react';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const res = await recipeService.getById(id);
        setRecipe(res.data);
      } catch (err) {
        setFetchError(err.message || 'Could not load recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await recipeService.delete(id);
      success(`"${recipe?.name}" deleted successfully.`);
      navigate('/');
    } catch (err) {
      toastError(err.message || 'Failed to delete recipe.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Fetching recipe goodness...</p>
      </div>
    );
  }

  if (fetchError || !recipe) {
    return (
      <div className="empty-state" style={{ borderColor: '#fca5a5' }}>
        <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
          <AlertCircle size={32} />
        </div>
        <h3>Recipe Not Found</h3>
        <p>{fetchError || 'The recipe you requested does not exist or may have been deleted.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  const categoryClass = (recipe.category || 'dinner').toLowerCase();
  const formattedDate = recipe.createdAt
    ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div className="detail-container">
      {/* Back button */}
      <div className="back-btn-wrapper">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <article className="detail-card">
        <div className={`card-top-bar ${categoryClass}`} style={{ height: '8px' }} />

        {/* Header Banner */}
        <header className="detail-header">
          <div className="detail-badges">
            <CategoryBadge category={recipe.category} />
          </div>

          <h1 className="detail-title">{recipe.name}</h1>

          <div className="detail-toolbar">
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="detail-meta-pill">
                <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                <span>{recipe.cookingTime} minutes</span>
              </div>
              {formattedDate && (
                <div className="detail-meta-pill">
                  <Calendar size={16} />
                  <span>Added {formattedDate}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="detail-action-buttons">
              <Link to={`/recipes/${recipe._id}/edit`} className="btn btn-secondary">
                <Edit3 size={16} />
                <span>Edit</span>
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </header>

        {/* Two-column layout for Ingredients and Instructions */}
        <div className="detail-content">
          {/* Ingredients Column */}
          <section className="section-box">
            <h2 className="section-title">
              <Utensils size={20} className="section-title-icon" />
              <span>Ingredients</span>
            </h2>
            <div className="formatted-list">
              {recipe.ingredients}
            </div>
          </section>

          {/* Preparation Steps Column */}
          <section className="section-box" style={{ background: '#ffffff', borderColor: 'var(--color-border)' }}>
            <h2 className="section-title">
              <ListOrdered size={20} className="section-title-icon" />
              <span>Preparation Steps</span>
            </h2>
            <div className="formatted-list">
              {recipe.steps}
            </div>
          </section>
        </div>
      </article>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.name}"? This recipe will be permanently removed.`}
        confirmText="Yes, Delete Recipe"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default RecipeDetailPage;
