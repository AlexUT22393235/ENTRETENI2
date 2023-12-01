import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './generos.css';

function ComedySeries() {
  const navigate = useNavigate();
  const [comedySeries, setComedySeries] = useState([]);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=35`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setComedySeries(data.results);
        }
      } catch (error) {
        console.error('Error al cargar datos de series de comedia:', error);
      }
    };

    fetchData();
  }, []);

  const handleSeriesClick = (id) => {
    navigate(`/serie/${id}`);
  };

  return (
    <div className="movie-cards">
      <div className="section-title">
        Series de Comedia
      </div>
      <div className="movie-cards">
        {comedySeries.map((serie) => (
          <div key={serie.id} className="movie-card" onClick={() => handleSeriesClick(serie.id)}>
            <img src={`${BASE_IMAGE_URL}${serie.poster_path}`} alt={serie.name} />
            <h2>{serie.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComedySeries;
