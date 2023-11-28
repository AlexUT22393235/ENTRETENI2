import React, { useState, useEffect } from 'react';
import './Musica.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Musica = () => {
  const API_KEY = 'dfa1cf8d1f24d259e2de9b2b8965cbf8';
  const BASE_URL = 'http://ws.audioscrobbler.com/2.0';
  const DEFAULT_ARTIST = 'Dua Lipa';

  const [albums, setAlbums] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const navigate = useNavigate(); // Agregar esta línea para obtener la función navigate

  const fetchAlbums = async (artistName) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`
      );
      setAlbums(response.data.topalbums.album.slice(0, 12));
      setError(null);
    } catch (err) {
      setError('Error al obtener la información de los álbumes');
      setAlbums([]);
    }
  };

  useEffect(() => {
    fetchAlbums(DEFAULT_ARTIST);
  }, []);

  const handleInputChange = (event) => {
    setArtistName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAlbums(artistName);
  };

  const handleAlbumClick = (album) => {
    navigate(`/musica/${album.name}`); 
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Nombre del artista o álbum"
          value={artistName}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="album-cards">
        {albums.map((album) => (
          <div key={album.name} className="album-card" onClick={() => handleAlbumClick(album)}>
            <img src={album.image[2]['#text']} alt={album.name} />
            <h2>{album.name}</h2>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Musica;