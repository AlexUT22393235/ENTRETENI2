import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DetallePelicula.css'; // Asegúrate de que este importe el archivo correcto

function DetalleSeries() {
  const { id } = useParams();

  const [serie, setSerie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';

  useEffect(() => {
    const fetchSerie = async () => {
      const apiUrl = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos,watch/providers`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data) {
          setSerie(data);
        }
      } catch (error) {
        console.error('Error fetching data from TMDb:', error);
      }
    };

    fetchSerie();
  }, [API_KEY, id]);

  const handleClickTrailer = () => {
    if (serie && serie.videos?.results?.length > 0) {
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (!serie) {
    return <div>Cargando...</div>;
  }

  // Obtener la información del reparto
  const reparto = serie.credits?.cast;

  // Obtener la información de los servicios de streaming sin repeticiones
  const streamingProviders = Array.from(
    new Set(
      serie['watch/providers']?.results?.ES?.flatrate?.map((provider) => provider.provider_id) || []
    )
  );

  return (
    <>
      <div className="detalle-pelicula">
        <div className="pelicula-imagen">
          <img src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} alt={serie.name} />
        </div>
        <div className="pelicula-detalles">
          <h1>{serie.name}</h1>
          <p>{serie.overview}</p>
          <h3>Valoración:</h3> {serie.vote_average.toFixed(2)}%
          <h3>Fecha de lanzamiento:</h3> {serie.first_air_date}
          <div className="trailer-btn">
            <button onClick={handleClickTrailer}>Ver Tráiler</button>
            <div className="streaming-services">
              <div className="disponible-en">
                <h5>Disponible en:</h5>
              </div>
              <div className="logos-streaming">
                {streamingProviders.map((providerId) => {
                  const provider = serie['watch/providers']?.results?.ES?.flatrate?.find(
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
              src={`https://www.youtube.com/embed/${serie.videos.results[0]?.key || ''}`}
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

export default DetalleSeries;
