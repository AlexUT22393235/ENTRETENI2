import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Paginas.css';

function PeliculasYSeries() {
  const [mediaData, setMediaData] = useState([]);
  const navigate = useNavigate();
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b'; // Tu clave de API de TMDb

  //API de TVMAZE
  const TVMAZE_API_URL = 'https://api.tvmaze.com/search/shows?q=girls';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  const totalMedia = 200; // Ajusta la cantidad deseada

  useEffect(() => {
    fetchCombinedMediaData();
  }, []);

  const fetchCombinedMediaData = async () => {
    const tmdbMediaUrls = [
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`,
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es-ES&page=1`,
    ];

    const tvmazeMediaUrl = TVMAZE_API_URL;

    const tmdbData = await fetchMediaData(tmdbMediaUrls);
    const tvmazeData = await fetchMediaData([tvmazeMediaUrl], 'tvmaze');

    const allMediaData = [...tmdbData, ...tvmazeData];

    // Baraja aleatoriamente y muestra la cantidad deseada
    const combinedMediaData = shuffle(allMediaData);
    setMediaData(combinedMediaData.slice(0, totalMedia));
  };

  const fetchMediaData = async (urls, type = 'tmdb') => {
    const allMediaData = [];
  
    for (const url of urls) {
      let page = 1;
      while (allMediaData.length < totalMedia) {
        const mediaResponse = await fetch(`${url}&page=${page}`);
        if (mediaResponse.ok) {
          const mediaData = await mediaResponse.json();
  
          // Asegurémonos de que hay datos y que la propiedad 'results' está definida
          if (mediaData.results && mediaData.results.length > 0) {
            // Asegurémonos de que cada elemento tenga la propiedad 'media_type'
            const mediaWithTypes = mediaData.results.map((item) => ({ ...item, media_type: item.media_type || 'movie' }));
  
            allMediaData.push(...mediaWithTypes);
            page++;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
  
    return type === 'tvmaze' ? allMediaData.map((item) => ({ ...item.show, media_type: 'tv' })) : allMediaData;
  };
  

  // Función para barajar aleatoriamente una lista
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleMediaClick = (id, mediaType) => {
    console.log('Clicked on:', id, mediaType);

    if (mediaType === 'movie') {
      navigate(`/pelicula/${id}`);
    } else if (mediaType === 'tv') {
      navigate(`/serie/${id}`);
    }
  };

  return (
    <div className="movie-cards">
      {mediaData.map((media) => (
        <div key={media.id} className="movie-card" onClick={() => handleMediaClick(media.id, media.media_type)}>
          <img src={`${BASE_IMAGE_URL}${media.poster_path}`} alt={media.title || media.name} />
          <h2>{media.title || media.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default PeliculasYSeries;
