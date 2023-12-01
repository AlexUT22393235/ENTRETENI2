import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './generos.css';

function ActionAdventureSeries() {
  const navigate = useNavigate();
  const [actionSeries, setActionSeries] = useState([]);
  const [adventureSeries, setAdventureSeries] = useState([]);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    const fetchActionSeries = async () => {
      const actionUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=10759`;

      try {
        const response = await fetch(actionUrl);
        if (response.ok) {
          const data = await response.json();
          setActionSeries(data.results);
        }
      } catch (error) {
        console.error('Error al cargar datos de series de acción:', error);
      }
    };

    const fetchAdventureSeries = async () => {
      const adventureUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=12`;

      try {
        const response = await fetch(adventureUrl);
        if (response.ok) {
          const data = await response.json();
          setAdventureSeries(data.results);
        }
      } catch (error) {
        console.error('Error al cargar datos de series de aventura:', error);
      }
    };

    fetchActionSeries();
    fetchAdventureSeries();
  }, []);

  const handleSeriesClick = (id) => {
    navigate(`/serie/${id}`);
  };

  const actionAdventureSeries = [...actionSeries, ...adventureSeries];

  return (
    <div className="movie-cards">
      <div className="section-title">
        Series de Acción y Aventura
      </div>
      <div className="movie-cards">
        {actionAdventureSeries.map((serie) => (
          <div key={serie.id} className="movie-card" onClick={() => handleSeriesClick(serie.id)}>
            <img src={`${BASE_IMAGE_URL}${serie.poster_path}`} alt={serie.name} />
            <h2>{serie.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActionAdventureSeries;
