// ResultadoBusqueda.jsx
import React from 'react';

const ResultadoBusqueda = ({ mediaData, handleMediaClick, BASE_IMAGE_URL }) => {
  // Renderizar el componente solo si hay resultados
  
  return mediaData.length > 0 ? (
    <div className="movie-cards">
      {mediaData.map((result) => (
        <div key={result.id} className="movie-card" onClick={() => handleMediaClick(result.id, result)}>
          <h2>{result.title || result.name}</h2>
          <img src={`${BASE_IMAGE_URL}${result.poster_path}`} alt={result.title || result.name} />
        </div>
      ))}
    </div>
  ) : null; // Si no hay resultados, devolver null
};

export default ResultadoBusqueda;
