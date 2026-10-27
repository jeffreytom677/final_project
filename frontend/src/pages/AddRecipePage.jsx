import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { recipeService } from '../services/api';
import { useToast } from '../context/ToastContext';

const AddRecipePage = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await recipeService.create(formData);
      success(`"${formData.name}" added to your recipe book!`);
      // Navigate to recipe details or home
      const newId = res.data?._id;
      if (newId) {
        navigate(`/recipes/${newId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      error(err.message || 'Failed to create recipe. Please check the inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Create New Recipe</h1>
        <p>Document your secret ingredients, timing, and step-by-step cooking instructions.</p>
      </div>

      <RecipeForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isEditMode={false}
      />
    </div>
  );
};

export default AddRecipePage;
