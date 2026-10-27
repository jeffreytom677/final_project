import React from 'react';

const CATEGORY_STYLES = {
  Breakfast: { className: 'badge-breakfast', icon: '☀️' },
  Lunch: { className: 'badge-lunch', icon: '🥗' },
  Dinner: { className: 'badge-dinner', icon: '🍲' },
  Snack: { className: 'badge-snack', icon: '🥨' },
  Dessert: { className: 'badge-dessert', icon: '🍰' }
};

const CategoryBadge = ({ category }) => {
  const meta = CATEGORY_STYLES[category] || { className: 'badge-dinner', icon: '🍽️' };

  return (
    <span className={`badge ${meta.className}`}>
      <span>{meta.icon}</span>
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
