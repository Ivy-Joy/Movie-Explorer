import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulating the API call
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        const response = await fetch("/mock/movies.json");
        const data = await response.json();
        
         const movieList = Array.isArray(data) ? data : data.data || [];
        // Simulating delay
        setTimeout(() => {
          setMovies(movieList);
          setFiltered(movieList);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Filter movies by genres might add others like title, years later
  useEffect(() => {
    if (!search || !search.trim()) {
      setFiltered(movies);
      return;
    }
    const q = search.trim().toLowerCase();
    const results = movies.filter((m) => {
      const genres = Array.isArray(m.genres) ? m.genres.join(" ").toLowerCase() : (m.genre || "").toString().toLowerCase();
      return genres.includes(q);
    });
    setFiltered(results);
  }, [search, movies]);

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="gallery-container">
      <header className="gallery-header">
        <h1>Movie Explorer</h1>
        <div className="gallery-actions">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <p className="loading">Loading movies...</p>
      ) : (
        <div className="movie-grid">
          {filtered.length > 0 ? (
            filtered.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleCardClick(movie.id)}
              >
                <img
                  src={movie.posterURL}
                  alt={movie.title}
                  className="movie-poster"
                />
                <h3>{movie.title}</h3>
                <p>{movie.genres}</p>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      )}
    </div>
  );
}
