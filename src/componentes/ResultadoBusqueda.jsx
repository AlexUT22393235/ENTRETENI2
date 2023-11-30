// SearchResults.jsx
import React from 'react';

const ResultadoBusqueda = ({ mediaData, handleMediaClick, BASE_IMAGE_URL }) => {
  return (
    <div className="movie-cards">
      {mediaData.map((result) => (
        <div key={result.id} className="movie-card" onClick={() => handleMediaClick(result.id, result)}>
          <h2>{result.title || result.name}</h2>
          <img src={`${BASE_IMAGE_URL}${result.poster_path}`} alt={result.title || result.name} />
        </div>
      ))}
    </div>
  );
};

export default ResultadoBusqueda;
