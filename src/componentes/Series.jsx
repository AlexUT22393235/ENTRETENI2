import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './categoria.css';

function Series() {
  const navigate = useNavigate();
  const [mediaData, setMediaData] = useState([]);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  const totalSeries = 20;

  useEffect(() => {
    fetchMediaData('tv', totalSeries);
  }, []);

  const fetchMediaData = async (category, total) => {
    let allMedia = [];
    let page = 1;
    while (allMedia.length < total) {
      let mediaUrl = `https://api.themoviedb.org/3/${category}/popular?api_key=${API_KEY}&language=es-ES&page=${page}`;

      const mediaResponse = await fetch(mediaUrl);

      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        allMedia = allMedia.concat(mediaData.results);
        page++;
      } else {
        break;
      }
    }

    setMediaData(allMedia.slice(0, total));
  };

  const handleSeriesClick = (id) => {
    navigate(`/serie/${id}`); // Utiliza navigate para redirigir al componente de detalles
  };

  return (
    <div className="movie-cards">
      {mediaData.map((media) => (
        <div key={media.id} className="movie-card" onClick={() => handleSeriesClick(media.id)}>
          <img src={`${BASE_IMAGE_URL}${media.poster_path}`} alt={media.name} />
          <h2>{media.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default Series;
