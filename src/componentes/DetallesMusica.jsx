import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DetallesMusica = ({ album }) => {
  const API_KEY = 'dfa1cf8d1f24d259e2de9b2b8965cbf8';
  const BASE_URL = 'http://ws.audioscrobbler.com/2.0';

  const [albumDetails, setAlbumDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      if (!album || !album.artist || !album.name) {
        setError('Datos de álbum no válidos');
        setAlbumDetails(null);
        return;
      }

      try {
        const artistName = encodeURIComponent(album.artist.name);
        const albumName = encodeURIComponent(album.name);

        const apiUrl = `${BASE_URL}/?method=album.getinfo&artist=${artistName}&album=${albumName}&api_key=${API_KEY}&format=json`;

        console.log(apiUrl); // Imprime la URL en la consola

        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.album) {
          setAlbumDetails(response.data.album);
          setError(null);
        } else {
          setError('No se encontró información del álbum');
          setAlbumDetails(null);
        }
      } catch (err) {
        console.error('Error al obtener la información del álbum:', err);
        setError(`Error al obtener la información del álbum: ${err.message}`);
        setAlbumDetails(null);
      }
    };

    fetchAlbumDetails();
  }, [album]);

  return (
    <div>
      {error && <p>{error}</p>}
      {albumDetails && (
        <div>
          <h2>{albumDetails.name}</h2>
          <p>Artista: {albumDetails.artist}</p>
          <p>Reproducciones: {albumDetails.playcount}</p>
          <p>Fecha de lanzamiento: {albumDetails.wiki && albumDetails.wiki.published}</p>
          <h3>Canciones:</h3>
          <ul>
            {albumDetails.tracks && albumDetails.tracks.track.map((track, index) => (
              <li key={index}>{track.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetallesMusica;
