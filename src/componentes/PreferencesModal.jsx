import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from './genreUtils.js';
import useCurrentUser from './useCurrentUser';
import './PreferencesModal.css';

function PreferencesModal({ onClose, selectedGenres }) {
  // Estado para gestionar las preferencias
  const [selectedMovieGenres, setSelectedMovieGenres] = useState(selectedGenres?.movies || []);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState(selectedGenres?.series || []);

  // Hook para obtener el usuario actual
  const { currentUser, loading } = useCurrentUser();

  
  // Función para aplicar las preferencias y cerrar el modal
  const applyPreferences = async () => {
    // Verificar si se han seleccionado hasta 3 géneros para películas y series
    if (selectedMovieGenres.length <= 3 && selectedSeriesGenres.length <= 3) {
      try {
        // Verificar si el usuario está autenticado y no estamos en un estado de carga
        if (!loading && currentUser) {
          const userId = currentUser.uid;

          // Obtener las preferencias actuales del usuario
          const currentPreferences = await getPreferences(userId);

          // Actualizar las preferencias con las selecciones del usuario
          await updatePreferences(userId, {
            ...currentPreferences,
            peliculas: { ...currentPreferences.peliculas, ...selectedMovieGenres },
            series: { ...currentPreferences.series, ...selectedSeriesGenres },
          });

          // Cerrar el modal
          onClose();
        } else {
          console.error('Usuario no autenticado o en estado de carga.');
        }
      } catch (error) {
        console.error('Error al aplicar preferencias:', error);
      }
    } else {
      // Mostrar un mensaje de error o realizar alguna acción adecuada
      console.error('Seleccione hasta 3 géneros para películas y series.');
    }
  };

  // Función para manejar la selección/deselección de géneros para películas
  const handleMovieGenreToggle = (genre) => {
    if (selectedMovieGenres.includes(genre)) {
      // Deseleccionar el género si ya está seleccionado
      setSelectedMovieGenres(selectedMovieGenres.filter((selectedGenre) => selectedGenre !== genre));
    } else if (selectedMovieGenres.length < 3) {
      // Seleccionar el género si no se han seleccionado 3 géneros aún
      setSelectedMovieGenres([...selectedMovieGenres, genre]);
    }
  };

  // Función para manejar la selección/deselección de géneros para series
  const handleSeriesGenreToggle = (genre) => {
    if (selectedSeriesGenres.includes(genre)) {
      // Deseleccionar el género si ya está seleccionado
      setSelectedSeriesGenres(selectedSeriesGenres.filter((selectedGenre) => selectedGenre !== genre));
    } else if (selectedSeriesGenres.length < 3) {
      // Seleccionar el género si no se han seleccionado 3 géneros aún
      setSelectedSeriesGenres([...selectedSeriesGenres, genre]);
    }
  };

  // Efecto para manejar cambios en los géneros seleccionados
  useEffect(() => {
    // Puedes realizar alguna acción si los géneros seleccionados cambian
  }, [selectedMovieGenres, selectedSeriesGenres]);

  if (!currentUser) {
    // Si no está autenticado, puedes mostrar un mensaje o redirigir a la página de inicio de sesión
    return <div>Por favor, inicia sesión para configurar tus preferencias.</div>;
  }
  return (
    <div className="preferences-modal-overlay">
      <div className="preferences-modal">
        <div className="preferences-modal-header">
          <h2>Preferencias</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="preferences-modal-content">
          {/* Sección para seleccionar géneros de películas */}
          <div>
            <h3 style={{ zIndex: 1200 }}>Géneros de Películas</h3>
            <div className="genre-selection">
              {Object.entries({
                Acción: 'accion',
                Aventura: 'aventura',
                'Ciencia Ficción': 'cienciaFiccion',
                Comedia: 'comedia',
                Drama: 'drama',
                Romance: 'romance',
              }).map(([label, genre]) => (
                <label key={genre}  className="genre-label">
                  <input
                    type="checkbox"
                    checked={selectedMovieGenres.includes(genre)}
                    onChange={() => handleMovieGenreToggle(genre)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Sección para seleccionar géneros de series */}
          <div>
            <h3 style={{ zIndex: 1200 }}>Géneros de Series</h3>
            <div className="genre-selection">
              {Object.entries({
                'Acción y Aventura': 'accionAventura',
                'Ciencia Ficción': 'cienciaFiccion',
                Comedia: 'comedia',
                Crimen: 'crimen',
                Drama: 'drama',
              }).map(([label, genre]) => (
                <label key={genre}>
                  <input
                    type="checkbox"
                    checked={selectedSeriesGenres.includes(genre)}
                    onChange={() => handleSeriesGenreToggle(genre)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Botón para aplicar preferencias */}
          <button className="apply-button" onClick={applyPreferences}>
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferencesModal;
