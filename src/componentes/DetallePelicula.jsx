import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DetallePelicula.css';

function DetallePeliculas() {
  const { id } = useParams();

  const [pelicula, setPelicula] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';

  useEffect(() => {
    const fetchPelicula = async () => {
      const apiUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos,watch/providers`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data) {
          setPelicula(data);
        }
      } catch (error) {
        console.error('Error fetching data from TMDb:', error);
      }
    };

    fetchPelicula();
  }, [API_KEY, id]);

  const handleClickTrailer = () => {
    if (pelicula && pelicula.videos?.results?.length > 0) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!pelicula) {
    return <div>Cargando...</div>;
  }

  // Obtener la información del reparto
  const reparto = pelicula.credits?.cast;

  // Obtener la información de los servicios de streaming sin repeticiones
  const streamingProviders = Array.from(
    new Set(
      pelicula['watch/providers']?.results?.ES?.flatrate?.map((provider) => provider.provider_id) || []
    )
  );

  return (
    <>
      <div className="detalle-pelicula">
        <div className="pelicula-imagen">
          <img src={`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`} alt={pelicula.title} />
        </div>
        <div className="pelicula-detalles">
          <h1>{pelicula.title}</h1>
          <p>{pelicula.overview}</p>
          <h3>Valoración:</h3> {pelicula.vote_average.toFixed(2)}%
          <h3>Fecha de lanzamiento:</h3> {pelicula.release_date}
          <h3>Duración:</h3> {pelicula.runtime} minutos
          <div className="trailer-btn">
            <button onClick={handleClickTrailer}>Ver Tráiler</button>
            <div className="streaming-services">
              <div className="disponible-en">
                <h5>Disponible en:</h5>
              </div>
              <div className="logos-streaming">
                {streamingProviders.map((providerId) => {
                  const provider = pelicula['watch/providers']?.results?.ES?.flatrate?.find(
                    (p) => p.provider_id === providerId
                  );
                  return (
                    <a
                      key={providerId}
                      href={provider?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${provider?.logo_path || ''}`}
                        alt={provider?.provider_name || ''}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${pelicula.videos.results[0]?.key || ''}`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <div className="reparto">
        <h2>Reparto:</h2>
        <div className="reparto-imagenes">
          {reparto && reparto.slice(0, 10).map((actor) => (
            <div key={actor.id} className="reparto-actor">
              {actor.profile_path && (
                <img src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`} alt={actor.name} />
              )}
              <h4 className='nombre'>{actor.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default DetallePeliculas;
