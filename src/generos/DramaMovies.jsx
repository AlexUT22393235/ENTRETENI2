import React, { useState, useEffect } from 'react';
import './generos.css'
import { useNavigate } from 'react-router-dom';

function DramaMovies() {
  const navigate = useNavigate();
  const [dramaMovies, setDramaMovies] = useState([]);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=18`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setDramaMovies(data.results);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleMovieClick = (id) => {
    navigate(`/pelicula/${id}`); // Utiliza navigate para redirigir al componente de detalles
  };

  return (
    <div className="movie-cards-container">
      <div className="section-title">
        Películas de Drama
        </div>
        <div className="movie-cards">
          {dramaMovies.map((movie) => (
          <div key={movie.id} className="movie-card" onClick={() => handleMovieClick(movie.id)}>
          <img src={`${BASE_IMAGE_URL}${movie.poster_path}`} alt={movie.title} />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      </div>
      );
}

      export default DramaMovies;
