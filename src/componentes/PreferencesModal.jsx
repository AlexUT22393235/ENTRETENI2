import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from './genreUtils.js';
import useCurrentUser from './useCurrentUser';
import './PreferencesModal.css';


//imports para usar firebase:
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';




function PreferencesModal({ onClose, selectedGenres }) {
  // Estado para gestionar las preferencias
  const [selectedMovieGenres, setSelectedMovieGenres] = useState(selectedGenres?.movies || []);
  const [selectedSeriesGenres, setSelectedSeriesGenres] = useState(selectedGenres?.series || []);
  // const { showPreferencesModal, openModal } = MostrarModalLogica();
  //Hook personalisado para abrir modal:

  // Hook para obtener el usuario actual
  const { currentUser, loading } = useCurrentUser();

  // Para ver si el usuario es nuevo:
  const [isNewUser, setIsNewUser] = useState(false);


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
    setSelectedMovieGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        // Deseleccionar el género si ya está seleccionado
        return prevGenres.filter((selectedGenre) => selectedGenre !== genre);
      } else if (prevGenres.length < 3) {
        // Seleccionar el género si no se han seleccionado 3 géneros aún
        return [...prevGenres, genre];
      } else {
        // Si se ha alcanzado el límite, desmarcar la última opción y marcar la nueva
        return [...prevGenres.slice(1), genre];
      }
    });
  };
  // Función para manejar la selección/deselección de géneros para series
  const handleSeriesGenreToggle = (genre) => {
    setSelectedSeriesGenres((prevGenres) => {
      if (prevGenres.includes(genre)) {
        // Deseleccionar el género si ya está seleccionado
        return prevGenres.filter((selectedGenre) => selectedGenre !== genre);
      } else if (prevGenres.length < 3) {
        // Seleccionar el género si no se han seleccionado 3 géneros aún
        return [...prevGenres, genre];
      } else {
        // Si se ha alcanzado el límite, desmarcar la última opción y marcar la nueva
        return [...prevGenres.slice(1), genre];
      }
    });
  };

  // Efecto para manejar cambios en los géneros seleccionados
  useEffect(() => {
    // Puedes realizar alguna acción si los géneros seleccionados cambian
  }, [selectedMovieGenres, selectedSeriesGenres]);


  //Verificar si el usuario existe en la colección
  useEffect(() => {
    const checkIfLoggedInBefore = async () => {
      try {
        if (currentUser) {
          // Consulta la colección de usuarios en Firebase
          const userSnapshot = await firebase
            .firestore()
            .collection('usuarios')  // Ajusta el nombre de tu colección de usuarios
            .doc(currentUser.uid)
            .get();

          // Actualiza el estado para indicar si el usuario ha iniciado sesión previamente
          setIsNewUser(!userSnapshot.exists);
        }
      } catch (error) {
        console.error('Error al verificar si el usuario ha iniciado sesión:', error);
      }
    };

    checkIfLoggedInBefore();
  }, [currentUser]);

  //Si el usuario no ha iniciado sesión, no se muestra el modal
  if (!currentUser) {
  
    return <div></div>;
  }

  //Si el usuario no es nuevo usuario, no se muestra nada
  // if (!isNewUser){
  //   return <></>;
  // }

  //Si el usuario es nuevo o usa openPreferencesModal se muestra el modal
  if (isNewUser){
    return (
      <div className="preferences-modal-overlay">
        <div className="preferences-modal">
          <div className="preferences-modal-header">
            <h2>Preferencias</h2>
            <p>De 1 a 3 géneros</p>
            <button onClick={onClose}>&times;</button>
          </div>
          <div className="preferences-modal-content">
            {/* Sección para seleccionar géneros de películas */}
            <div>
              <h3>Géneros de Películas</h3>
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

  // return (
  //   <div className="preferences-modal-overlay">
  //     <div className="preferences-modal">
  //       <div className="preferences-modal-header">
  //         <h2>Preferencias</h2>
  //         <button onClick={onClose}>&times;</button>
  //       </div>
  //       <div className="preferences-modal-content">
  //         {/* Sección para seleccionar géneros de películas */}
  //         <div>
  //           <h3>Géneros de Películas</h3>
  //           <div className="genre-selection">
  //             {Object.entries({
  //               Acción: 'accion',
  //               Aventura: 'aventura',
  //               'Ciencia Ficción': 'cienciaFiccion',
  //               Comedia: 'comedia',
  //               Drama: 'drama',
  //               Romance: 'romance',
  //             }).map(([label, genre]) => (
  //               <label key={genre}  className="genre-label">
  //                 <input
  //                   type="checkbox"
  //                   checked={selectedMovieGenres.includes(genre)}
  //                   onChange={() => handleMovieGenreToggle(genre)}
  //                 />
  //                 {label}
  //               </label>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Sección para seleccionar géneros de series */}
  //         <div>
  //           <h3 style={{ zIndex: 1200 }}>Géneros de Series</h3>
  //           <div className="genre-selection">
  //             {Object.entries({
  //               'Acción y Aventura': 'accionAventura',
  //               'Ciencia Ficción': 'cienciaFiccion',
  //               Comedia: 'comedia',
  //               Crimen: 'crimen',
  //               Drama: 'drama',
  //             }).map(([label, genre]) => (
  //               <label key={genre}>
  //                 <input
  //                   type="checkbox"
  //                   checked={selectedSeriesGenres.includes(genre)}
  //                   onChange={() => handleSeriesGenreToggle(genre)}
  //                 />
  //                 {label}
  //               </label>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Botón para aplicar preferencias */}
  //         <button className="apply-button" onClick={applyPreferences}>
  //           Aplicar
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
  
  
  
  
}

export default PreferencesModal;
