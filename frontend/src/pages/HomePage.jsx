import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, PlusCircle, UtensilsCrossed, RefreshCw, AlertCircle } from 'lucide-react';
import { recipeService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

const HomePage = () => {
  const { success, error: toastError } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Deletion modal state
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await recipeService.getAll();
      setRecipes(res.data || []);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setFetchError(err.message || 'Failed to load recipes. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Client-side filtering for ultra-fast instant UI responsiveness
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      recipe.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      recipe.name?.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      recipe.ingredients?.toLowerCase().includes(searchQuery.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleDeleteConfirm = async () => {
    if (!recipeToDelete) return;
    try {
      setIsDeleting(true);
      await recipeService.delete(recipeToDelete._id);

      // Immediate state update without page reload
      setRecipes((prev) => prev.filter((r) => r._id !== recipeToDelete._id));
      success(`"${recipeToDelete.name}" was successfully removed.`);
      setRecipeToDelete(null);
    } catch (err) {
      toastError(err.message || 'Failed to delete recipe.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <section className="home-hero">
        <div className="home-header">
          <h1>Master Your Kitchen</h1>
          <p>Explore your personal collection of culinary masterpieces, or craft a new recipe today.</p>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="filter-bar">
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search recipes by title or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search recipes"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading Skeletons */}
      {loading && (
        <div className="recipe-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line" style={{ height: '24px', width: '35%' }} />
              <div className="skeleton-line" style={{ height: '32px', width: '80%' }} />
              <div className="skeleton-line" style={{ height: '60px', width: '100%' }} />
              <div className="skeleton-line" style={{ height: '36px', width: '45%', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && fetchError && (
        <div className="empty-state" style={{ borderColor: '#fca5a5' }}>
          <div className="empty-state-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
            <AlertCircle size={32} />
          </div>
          <h3>Failed to Load Recipes</h3>
          <p>{fetchError}</p>
          <button type="button" className="btn btn-secondary" onClick={fetchRecipes}>
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !fetchError && filteredRecipes.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <UtensilsCrossed size={32} />
          </div>
          <h3>
            {searchQuery || selectedCategory !== 'All'
              ? 'No matching recipes found'
              : 'Your Recipe Book is Empty'}
          </h3>
          <p>
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search terms or clearing the category filter.'
              : 'Start your culinary collection by adding your first delicious recipe now!'}
          </p>
          {searchQuery || selectedCategory !== 'All' ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </button>
          ) : (
            <Link to="/recipes/add" className="btn btn-primary">
              <PlusCircle size={18} />
              <span>Add Your First Recipe</span>
            </Link>
          )}
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && !fetchError && filteredRecipes.length > 0 && (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              onDeleteClick={(r) => setRecipeToDelete(r)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(recipeToDelete)}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRecipeToDelete(null)}
      />
    </div>
  );
};

export default HomePage;
