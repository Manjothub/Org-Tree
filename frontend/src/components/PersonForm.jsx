import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PersonForm = ({ onSuccess }) => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // Get ID from URL params if editing
  const { id } = useParams();
  
  // Determine if we're in edit mode
  const isEdit = !!id;
  
  // Form state management
  const [formData, setFormData] = useState({ 
    name: '', 
    position: '', 
    manager_id: '' 
  });
  
  // State for available managers dropdown
  const [managers, setManagers] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data when component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch managers list
        const managersResponse = await fetch('http://localhost:8000/api/persons/');
        if (!managersResponse.ok) throw new Error('Failed to fetch managers');
        const managersData = await managersResponse.json();
        setManagers(managersData);

        // If in edit mode, fetch existing person data
        if (isEdit) {
          const personResponse = await fetch(`http://localhost:8000/api/persons/${id}/`);
          if (!personResponse.ok) throw new Error('Failed to fetch person data');
          const personData = await personResponse.json();
          setFormData(personData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const url = isEdit
        ? `http://localhost:8000/api/persons/${id}/`
        : 'http://localhost:8000/api/persons/';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isEdit ? 'Failed to update person' : 'Failed to create person');
      }

      onSuccess(); // Notify parent component of success
      navigate('/'); // Redirect to home page
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        <h4>Error</h4>
        <p>{error}</p>
        <button 
          className="btn btn-secondary" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Main form render
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            {isEdit ? 'Edit Person' : 'Add New Person'}
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>

            {/* Position Field */}
            <div className="mb-3">
              <label htmlFor="position" className="form-label">
                Position <span className="text-danger">*</span>
              </label>
              <input
                id="position"
                type="text"
                className="form-control"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Enter position"
              />
            </div>

            {/* Manager Select Field */}
            <div className="mb-4">
              <label htmlFor="manager_id" className="form-label">
                Manager
              </label>
              <select
                id="manager_id"
                className="form-select"
                name="manager_id"
                value={formData.manager_id || ''}
                onChange={handleChange}
              >
                <option value="">No manager</option>
                {managers
                  .filter(manager => manager.id !== id) // Exclude self from manager options
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.position})
                    </option>
                  ))}
              </select>
              <div className="form-text">
                Select a manager if applicable
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <i className={`bi ${isEdit ? 'bi-pencil' : 'bi-plus'} me-2`}></i>
                )}
                {isEdit ? 'Update' : 'Create'} Person
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonForm;