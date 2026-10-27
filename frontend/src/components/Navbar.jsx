import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, PlusCircle, BookOpen } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <ChefHat size={22} />
          </div>
          <span className="navbar-brand-text">
            Culinary<span>Craft</span>
          </span>
        </Link>

        <nav className="navbar-actions">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <BookOpen size={16} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Browse Recipes
          </Link>
          <Link to="/recipes/add" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Add Recipe</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
