// ResultadoBusqueda.jsx
import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import notFound from '../img/notFound.jpg'


const ResultadoBusqueda = ({ mediaData, BASE_IMAGE_URL }) => {
  console.log("mediaData:", mediaData);
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

    const handleMediaClickDetalle = (id) => {
      // Navegar a la ruta de detalles con el ID del elemento
      navigate(`/detalle/${id}`);
    };

    
    return (
      <div className="search-results-container">
        {mediaData !== undefined ? (
          mediaData.length > 0 ? (
            <div className="movie-cards">
              {mediaData.map((result) => (
                <div key={result.id} className="movie-card" onClick={() => handleMediaClickDetalle(result.id)}>
                  <h2>{result.title || result.name}</h2>
                  <img src={`${BASE_IMAGE_URL}${result.poster_path}`} alt={result.title || result.name} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results-message">
              <div className='noEncontrado'>
              <p>Lo sentimos, no encontramos el contenido para tu búsqueda.</p>
              <p>Intenta nuevamente con otras palabras.</p>
              </div>
              
              <div className='imagenNoEncontrado'>
              <img src={notFound} alt="noEncontrado" />
              </div>
            </div>
            
          )
        ) : (
          <div className="el-indeseado">
          
          </div>
        )}
      </div>
    );
    
    
        }

export default ResultadoBusqueda;
