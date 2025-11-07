import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const MOVIES_URL = "/mock/movies.json";

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    fetch(MOVIES_URL)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch movies");
        return r.json();
      })
      .then((data) => {
        setTimeout(() => {
          if (!mounted) return;
          const found = data.find((m) => String(m.id) === String(id));
          if (found) {
            setMovie(found);
          } else {
            setMovie(null);
            setError("Movie not found.");
          }
          setLoading(false);
        }, 600);
      })
      .catch((err) => {
        console.error("Movie fetch error:", err);
        if (!mounted) return;
        setError("Unable to load movie data.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [MOVIES_URL, id]);

  if (loading)
    return (
      <div className="movie-detail-container">
        <p>Loading movie details…</p>
      </div>
    );

  if (error)
    return (
      <div className="movie-detail-container">
        <p className="error-text">{error}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>
      </div>
    );

  return (
    <div className="movie-detail-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="movie-detail-content">
        <div className="movie-poster-wrapper">
          <img src={movie.posterURL} alt={movie.title} className="movie-poster-large" />
        </div>

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span>{movie.year}</span>
            {movie.genres && (
              <>
                {" • "}
                <span>
                  {Array.isArray(movie.genres)
                    ? movie.genres.join(", ")
                    : String(movie.genres)}
                </span>
              </>
            )}
          </div>

          <div className="movie-detail-row">
            <strong>Director:</strong> {movie.director || "Unknown"}
          </div>

          <div className="movie-detail-row">
            <strong>Rating:</strong> {movie.rating ?? "N/A"}
          </div>

          <div className="movie-synopsis">
            <h3>Synopsis</h3>
            <p>
              {movie.synopsis ||
                "No synopsis available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
