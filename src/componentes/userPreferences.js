// UserPreferences.js

import React, { useState, useEffect } from 'react';
import { getPreferences } from './ruta-a-tu-logica-de-base-de-datos'; // Asegúrate de ajustar la ruta

const UserPreferences = ({ userId }) => {
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    // Función para obtener las preferencias del usuario
    const fetchUserPreferences = async () => {
      try {
        // Utiliza tu lógica de base de datos para obtener las preferencias
        const userPreferences = await getPreferences(userId);
        setPreferences(userPreferences);
      } catch (error) {
        console.error('Error al obtener las preferencias del usuario:', error);
      }
    };

    // Llama a la función para obtener las preferencias al cargar el componente
    fetchUserPreferences();
  }, [userId]);

  // Si las preferencias aún se están cargando, puedes mostrar un indicador de carga
  if (preferences === null) {
    return <p>Cargando preferencias...</p>;
  }

  // Aquí puedes renderizar las preferencias, o también puedes devolverlas para que el componente que lo utiliza las muestre
  return (
    <div>
      <h2>Preferencias del Usuario</h2>
      <pre>{JSON.stringify(preferences, null, 2)}</pre>
    </div>
  );
};

export default UserPreferences;
