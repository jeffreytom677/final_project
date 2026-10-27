import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Save, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const DEFAULT_FORM_VALUES = {
  name: '',
  category: 'Dinner',
  ingredients: '',
  steps: '',
  cookingTime: ''
};

const RecipeForm = ({
  initialValues = DEFAULT_FORM_VALUES,
  onSubmit,
  isSubmitting = false,
  isEditMode = false
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    category: initialValues?.category || 'Dinner',
    ingredients: initialValues?.ingredients || '',
    steps: initialValues?.steps || '',
    cookingTime: initialValues?.cookingTime !== undefined ? initialValues.cookingTime : ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync only in edit mode when initialValues is loaded or changes
  useEffect(() => {
    if (isEditMode && initialValues && initialValues !== DEFAULT_FORM_VALUES) {
      setFormData({
        name: initialValues.name || '',
        category: initialValues.category || 'Dinner',
        ingredients: initialValues.ingredients || '',
        steps: initialValues.steps || '',
        cookingTime: initialValues.cookingTime !== undefined ? initialValues.cookingTime : ''
      });
    }
  }, [initialValues, isEditMode]);

  // Client-side validation logic
  const validate = (values) => {
    const errs = {};

    if (!values.name || values.name.trim().length === 0) {
      errs.name = 'Recipe name is required.';
    } else if (values.name.trim().length < 2) {
      errs.name = 'Recipe name must be at least 2 characters.';
    } else if (values.name.trim().length > 100) {
      errs.name = 'Recipe name cannot exceed 100 characters.';
    }

    if (!values.category || !CATEGORIES.includes(values.category)) {
      errs.category = 'Please select a valid recipe category.';
    }

    if (!values.ingredients || values.ingredients.trim().length === 0) {
      errs.ingredients = 'Ingredients list cannot be empty.';
    }

    if (!values.steps || values.steps.trim().length === 0) {
      errs.steps = 'Preparation steps cannot be empty.';
    }

    const timeNum = Number(values.cookingTime);
    if (
      values.cookingTime === '' ||
      values.cookingTime === null ||
      values.cookingTime === undefined ||
      isNaN(timeNum)
    ) {
      errs.cookingTime = 'Cooking time is required.';
    } else if (timeNum <= 0) {
      errs.cookingTime = 'Cooking time must be a positive number greater than 0.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Re-validate field if already touched
    if (touched[name]) {
      const fieldErrors = validate({ ...formData, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name]
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all touched
    setTouched({
      name: true,
      category: true,
      ingredients: true,
      steps: true,
      cookingTime: true
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      ingredients: formData.ingredients.trim(),
      steps: formData.steps.trim(),
      cookingTime: Number(formData.cookingTime)
    };

    await onSubmit(payload);
  };

  return (
    <div className="recipe-form-card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          {/* Recipe Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span>Recipe Name <span className="required">*</span></span>
              <span className="form-hint">{formData.name.length}/100</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
              placeholder="e.g. Creamy Tuscan Garlic Salmon"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
            />
            {touched.name && errors.name && (
              <div className="inline-error">
                <AlertCircle size={14} />
                <span>{errors.name}</span>
              </div>
            )}
          </div>

          <div className="form-grid-2">
            {/* Category Dropdown */}
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                <span>Category <span className="required">*</span></span>
              </label>
              <select
                id="category"
                name="category"
                className={`form-select ${touched.category && errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {touched.category && errors.category && (
                <div className="inline-error">
                  <AlertCircle size={14} />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            {/* Cooking Time */}
            <div className="form-group">
              <label htmlFor="cookingTime" className="form-label">
                <span>Cooking Time (minutes) <span className="required">*</span></span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="cookingTime"
                  name="cookingTime"
                  type="number"
                  min="1"
                  step="1"
                  className={`form-input ${touched.cookingTime && errors.cookingTime ? 'error' : ''}`}
                  placeholder="e.g. 30"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                />
              </div>
              {touched.cookingTime && errors.cookingTime && (
                <div className="inline-error">
                  <AlertCircle size={14} />
                  <span>{errors.cookingTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label htmlFor="ingredients" className="form-label">
              <span>Ingredients <span className="required">*</span></span>
              <span className="form-hint">One item per line or separated by bullets</span>
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              className={`form-textarea ${touched.ingredients && errors.ingredients ? 'error' : ''}`}
              placeholder="e.g.&#10;- 2 salmon fillets&#10;- 2 tbsp olive oil&#10;- 3 cloves garlic, minced&#10;- 1 cup heavy cream&#10;- 2 cups baby spinach"
              value={formData.ingredients}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={5}
              disabled={isSubmitting}
            />
            {touched.ingredients && errors.ingredients && (
              <div className="inline-error">
                <AlertCircle size={14} />
                <span>{errors.ingredients}</span>
              </div>
            )}
          </div>

          {/* Preparation Steps */}
          <div className="form-group">
            <label htmlFor="steps" className="form-label">
              <span>Preparation Steps <span className="required">*</span></span>
              <span className="form-hint">Numbered instructions for best readability</span>
            </label>
            <textarea
              id="steps"
              name="steps"
              className={`form-textarea ${touched.steps && errors.steps ? 'error' : ''}`}
              placeholder="e.g.&#10;1. Season salmon with salt and pepper on both sides.&#10;2. Sear in skillet with olive oil for 4 minutes per side until golden.&#10;3. Remove salmon, sauté garlic, then stir in heavy cream and spinach until wilted.&#10;4. Return salmon to skillet, spoon sauce over, and simmer for 2 minutes."
              value={formData.steps}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={6}
              disabled={isSubmitting}
            />
            {touched.steps && errors.steps && (
              <div className="inline-error">
                <AlertCircle size={14} />
                <span>{errors.steps}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Save size={16} />
            <span>{isSubmitting ? (isEditMode ? 'Saving Changes...' : 'Creating Recipe...') : (isEditMode ? 'Save Changes' : 'Create Recipe')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
