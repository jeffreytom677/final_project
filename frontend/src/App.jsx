import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes/add" element={<AddRecipePage />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <p>
              🍳 <strong>CulinaryCraft</strong> — Production MERN Stack Recipe Book • Built with Node.js, Express, MongoDB Atlas, &amp; React
            </p>
          </footer>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
