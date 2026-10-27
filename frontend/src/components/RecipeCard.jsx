import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Edit3, Trash2, ArrowRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

const RecipeCard = ({ recipe, onDeleteClick }) => {
  const categoryClass = (recipe.category || 'dinner').toLowerCase();

  return (
    <article className="recipe-card">
      <div className={`card-top-bar ${categoryClass}`} />
      <div className="card-body">
        <div className="card-meta">
          <CategoryBadge category={recipe.category} />
          <div className="card-time" title={`Estimated cooking time: ${recipe.cookingTime} minutes`}>
            <Clock size={15} />
            <span>{recipe.cookingTime} mins</span>
          </div>
        </div>

        <h3 className="card-title">
          <Link to={`/recipes/${recipe._id}`}>{recipe.name}</Link>
        </h3>

        <p className="card-preview">
          {recipe.ingredients || recipe.steps}
        </p>

        <div className="card-footer">
          <Link to={`/recipes/${recipe._id}`} className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>

          <div className="card-actions">
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className="action-btn"
              title="Edit Recipe"
              aria-label={`Edit ${recipe.name}`}
            >
              <Edit3 size={16} />
            </Link>
            <button
              type="button"
              className="action-btn delete"
              title="Delete Recipe"
              aria-label={`Delete ${recipe.name}`}
              onClick={() => onDeleteClick(recipe)}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
