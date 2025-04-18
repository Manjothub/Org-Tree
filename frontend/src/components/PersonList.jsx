import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PersonList = ({ refresh, onRefresh }) => {
  // State to store the list of persons
  const [persons, setPersons] = useState([]);
  // State to handle loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to handle error messages
  const [error, setError] = useState(null);

  // Fetch persons data from API when component mounts or refresh prop changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    fetch('http://localhost:8000/api/persons/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch persons');
        }
        return res.json();
      })
      .then((data) => {
        setPersons(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [refresh]);

  // Function to handle person deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/persons/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete person');
      }
      
      onRefresh(); // Trigger parent component to refresh the list
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
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
        <h4>Error Loading Data</h4>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  // Main component render
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Personnel Directory</h2>
        <Link to="/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Person
        </Link>
      </div>
      
      {/* Display message when no persons are available */}
      {persons.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-people-fill text-muted" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">No Persons Found</h4>
            <p className="text-muted">Add a new person to get started</p>
            <Link to="/add" className="btn btn-primary mt-2">
              Add First Person
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <ul className="list-group list-group-flush">
              {persons.map((p) => (
                <li key={p.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Link 
                        to={`/person/${p.id}`} 
                        className="text-decoration-none text-dark"
                      >
                        <h5 className="mb-1">{p.name}</h5>
                        <small className="text-muted">{p.position}</small>
                      </Link>
                    </div>
                    <div className="btn-group">
                      <Link 
                        to={`/edit/${p.id}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </Link>
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this person?')) {
                            handleDelete(p.id);
                          }
                        }}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonList;