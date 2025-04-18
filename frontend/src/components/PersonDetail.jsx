import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PersonDetail = () => {
  // Get person ID from URL parameters
  const { id } = useParams();
  
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  // State for person data
  const [person, setPerson] = useState(null);
  
  // State for manager details (if person has a manager)
  const [manager, setManager] = useState(null);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch person data when component mounts or ID changes
  useEffect(() => {
    const fetchPersonData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch person details
        const response = await fetch(`http://localhost:8000/api/persons/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch person details');
        
        const personData = await response.json();
        setPerson(personData);

        // If person has a manager, fetch manager details
        if (personData.manager_id) {
          const managerResponse = await fetch(`http://localhost:8000/api/persons/${personData.manager_id}/`);
          if (!managerResponse.ok) throw new Error('Failed to fetch manager details');
          
          const managerData = await managerResponse.json();
          setManager(managerData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonData();
  }, [id]);

  // Handle delete action
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/persons/${id}/`, {
          method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Failed to delete person');
        
        navigate('/', { state: { message: 'Person deleted successfully' } });
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.message);
      }
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
      <div className="container mt-4">
        <div className="alert alert-danger">
          <h4>Error Loading Person Details</h4>
          <p>{error}</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-secondary" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
            <Link to="/" className="btn btn-outline-secondary">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Person Details</h3>
            <div className="btn-group">
              <Link 
                to={`/edit/${person.id}`} 
                className="btn btn-light btn-sm"
              >
                <i className="bi bi-pencil-square me-1"></i>
                Edit
              </Link>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="mb-4">
                <h4 className="text-primary">{person.name}</h4>
                <p className="text-muted">{person.position}</p>
              </div>
              
              <div className="mb-4">
                <h5 className="border-bottom pb-2">Details</h5>
                <dl className="row">
                  <dt className="col-sm-3">Employee ID</dt>
                  <dd className="col-sm-9">{person.id}</dd>
                  
                  <dt className="col-sm-3">Position</dt>
                  <dd className="col-sm-9">{person.position}</dd>
                  
                  {manager && (
                    <>
                      <dt className="col-sm-3">Manager</dt>
                      <dd className="col-sm-9">
                        <Link to={`/person/${manager.id}`} className="text-decoration-none">
                          {manager.name} ({manager.position})
                        </Link>
                      </dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="card-title border-bottom pb-2">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <Link 
                      to={`/edit/${person.id}`} 
                      className="btn btn-outline-primary"
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Edit Profile
                    </Link>
                    <button 
                      className="btn btn-outline-danger" 
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Delete Profile
                    </button>
                    <Link to="/" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to List
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonDetail;