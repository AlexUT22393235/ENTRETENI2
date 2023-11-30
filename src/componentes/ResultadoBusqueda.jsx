// ResultadoBusqueda.jsx
import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const ResultadoBusqueda = ({ mediaData, handleMediaClick, BASE_IMAGE_URL }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMounted, setIsMounted] = useState(true);


 useEffect(() => {
        // Puedes realizar acciones específicas basadas en la ruta aquí
        console.log('La ruta cambió a:', location.pathname);

        // Condición para desmontar el componente si la ruta no es la correcta
        if (location.pathname !== '/resultados-busqueda') {
            setIsMounted(false);
        } else {
            setIsMounted(true);
        }
    }, [location.pathname]); // Asegúrate de incluir location.pathname como dependencia para que se ejecute cuando cambie

    // Si el componente no está montado, no renderizar nada
    if (!isMounted) {
        return null;
    }

  return mediaData && mediaData.length > 0 ? (
    <div className="movie-cards">
      {mediaData.map((result) => (
        <div key={result.id} className="movie-card" onClick={() => handleMediaClick(result.id, result)}>
          <h2>{result.title || result.name}</h2>
          <img src={`${BASE_IMAGE_URL}${result.poster_path}`} alt={result.title || result.name} />
        </div>
      ))}
    </div>
  ) : null; // Si no hay resultados o mediaData es undefined, devolver null
};

export default ResultadoBusqueda;
