const mongoose = require('mongoose');
const { RECIPE_CATEGORIES } = require('../models/Recipe');

/**
 * Validates MongoDB ObjectId in route params
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: `Invalid recipe ID format: '${id}'`,
      data: null
    });
  }
  next();
};

/**
 * Route-level validation for creating or updating a recipe
 */
const validateRecipePayload = (req, res, next) => {
  const { name, category, ingredients, steps, cookingTime } = req.body;
  const errors = [];

  // Check name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Recipe name is required and cannot be empty.');
  }

  // Check category
  if (!category || typeof category !== 'string' || !RECIPE_CATEGORIES.includes(category)) {
    errors.push(`Category is required and must be one of: ${RECIPE_CATEGORIES.join(', ')}.`);
  }

  // Check ingredients
  if (!ingredients || typeof ingredients !== 'string' || ingredients.trim().length === 0) {
    errors.push('Ingredients are required and cannot be empty.');
  }

  // Check preparation steps
  if (!steps || typeof steps !== 'string' || steps.trim().length === 0) {
    errors.push('Preparation steps are required and cannot be empty.');
  }

  // Check cooking time
  const parsedTime = Number(cookingTime);
  if (cookingTime === undefined || cookingTime === null || isNaN(parsedTime) || parsedTime <= 0) {
    errors.push('Cooking time is required and must be a positive number greater than 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      message: errors.join(' '),
      data: { errors }
    });
  }

  // Sanitize/normalize payload
  req.body.name = name.trim();
  req.body.category = category.trim();
  req.body.ingredients = ingredients.trim();
  req.body.steps = steps.trim();
  req.body.cookingTime = parsedTime;

  next();
};

module.exports = {
  validateObjectId,
  validateRecipePayload
};
