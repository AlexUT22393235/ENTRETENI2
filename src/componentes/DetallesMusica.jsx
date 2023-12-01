import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetallesMusica = () => {
  const API_KEY = 'dfa1cf8d1f24d259e2de9b2b8965cbf8';
  const BASE_URL = 'http://ws.audioscrobbler.com/2.0';

  const { artist } = useParams();
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistAlbums = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`
        );
        if (response.data && response.data.topalbums && response.data.topalbums.album) {
          setArtistAlbums(response.data.topalbums.album);
          setError(null);
        } else {
          setError('No se encontraron álbumes para este artista');
          setArtistAlbums([]);
        }
      } catch (err) {
        setError('Error al obtener la información de los álbumes del artista');
        setArtistAlbums([]);
      }
    };

    fetchArtistAlbums();
  }, [artist]);

  return (
    <div>
      <div className="artist-header">
        <div className="artist-name-box">
          <h1 className="artist-name">{artist}</h1>
        </div>
      </div>
      <div className="artist-cards">
        {error && <p>{error}</p>}
        {artistAlbums.length > 0 && (
          artistAlbums.map((album, index) => (
            <a
              key={index}
              className="artist-card"
              href={`https://www.google.com/search?q=${encodeURIComponent(`${album.name} ${album.artist.name} album`)}`}
              target="_blank" // Abre el enlace en una nueva pestaña
              rel="noopener noreferrer" // Añade rel para la seguridad
            >
              <img src={album.image[2]['#text']} alt={album.name} />
              <h2>{album.name}</h2>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default DetallesMusica;
