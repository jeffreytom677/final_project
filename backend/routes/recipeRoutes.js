const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const {
  validateObjectId,
  validateRecipePayload
} = require('../middleware/validator');

// /api/recipes
router.route('/')
  .post(validateRecipePayload, createRecipe)
  .get(getAllRecipes);

// /api/recipes/:id
router.route('/:id')
  .get(validateObjectId, getRecipeById)
  .put(validateObjectId, validateRecipePayload, updateRecipe)
  .delete(validateObjectId, deleteRecipe);

module.exports = router;
