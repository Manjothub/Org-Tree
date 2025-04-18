import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import PersonList from './components/PersonList';
import PersonForm from './components/PersonForm';
import PersonDetail from './components/PersonDetail';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [notification, setNotification] = useState(null);

  // Toggle refresh and show notification
  const toggleRefresh = () => {
    setRefresh(!refresh);
    showNotification('Operation completed successfully!');
  };

  // Simple notification system
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Check for location state messages
  const LocationHandler = () => {
    const location = useLocation();
    
    useEffect(() => {
      if (location.state?.message) {
        showNotification(location.state.message);
      }
    }, [location]);

    return null;
  };

  return (
    <Router>
      <div className="container py-3">
        {/* Notification area */}
        {notification && (
          <div className="alert alert-success alert-dismissible fade show">
            {notification}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setNotification(null)}
            />
          </div>
        )}

        <LocationHandler />

        {/* Header */}
        <header className="mb-4 border-bottom pb-3">
          <h1 className="h3">Organization Tree</h1>
          <Link to="/add" className="btn btn-primary btn-sm">
            Add Person
          </Link>
        </header>

        {/* Main content */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <PersonList 
                  onRefresh={toggleRefresh} 
                  refresh={refresh} 
                />
              }
            />
            <Route
              path="/add"
              element={<PersonForm onSuccess={toggleRefresh} />}
            />
            <Route
              path="/edit/:id"
              element={<PersonForm onSuccess={toggleRefresh} />}
            />
            <Route path="/person/:id" element={<PersonDetail />} />
          </Routes>
        </main>

        {/* Simple footer */}
        <footer className="mt-4 pt-3 border-top text-muted small">
          Organization Tree App
        </footer>
      </div>
    </Router>
  );
};

export default App;