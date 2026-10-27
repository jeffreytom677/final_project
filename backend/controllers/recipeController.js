const { Recipe } = require('../models/Recipe');

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Public
 */
const createRecipe = async (req, res, next) => {
  try {
    const { name, category, ingredients, steps, cookingTime } = req.body;

    const recipe = await Recipe.create({
      name,
      category,
      ingredients,
      steps,
      cookingTime
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all recipes (newest first)
 * @route   GET /api/recipes
 * @access  Public
 */
const getAllRecipes = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.name = { $regex: search.trim(), $options: 'i' };
    }

    // Newest first (descending by createdAt)
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Recipes retrieved successfully',
      data: recipes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        message: `Recipe not found with ID: ${id}`,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Recipe retrieved successfully',
      data: recipe
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update recipe by ID
 * @route   PUT /api/recipes/:id
 * @access  Public
 */
const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, ingredients, steps, cookingTime } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        name,
        category,
        ingredients,
        steps,
        cookingTime
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: `Recipe not found with ID: ${id}`,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete recipe by ID
 * @route   DELETE /api/recipes/:id
 * @access  Public
 */
const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({
        message: `Recipe not found with ID: ${id}`,
        data: null
      });
    }

    return res.status(200).json({
      message: 'Recipe deleted successfully',
      data: deletedRecipe
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};
