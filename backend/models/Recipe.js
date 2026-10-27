const mongoose = require('mongoose');

const RECIPE_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      minlength: [2, 'Recipe name must be at least 2 characters long'],
      maxlength: [100, 'Recipe name cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: RECIPE_CATEGORIES,
        message: '{VALUE} is not a valid category. Must be one of: ' + RECIPE_CATEGORIES.join(', ')
      }
    },
    ingredients: {
      type: String,
      required: [true, 'Ingredients are required'],
      trim: true
    },
    steps: {
      type: String,
      required: [true, 'Preparation steps are required'],
      trim: true
    },
    cookingTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute']
    }
  },
  {
    timestamps: true
  }
);

// Add index on name and category for faster search and filtering
recipeSchema.index({ name: 'text', category: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = {
  Recipe,
  RECIPE_CATEGORIES
};
