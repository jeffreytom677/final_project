import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="empty-state" style={{ margin: '4rem auto', maxWidth: '540px' }}>
      <div className="empty-state-icon">
        <Compass size={36} />
      </div>
      <h2>Page Not Found (404)</h2>
      <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} />
        <span>Return to Recipe Collection</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
