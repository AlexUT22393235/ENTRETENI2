import React, { useState, useEffect } from 'react';
import './Musica.css';
import axios from 'axios';
import DetallesMusica from './DetallesMusica';
import { useNavigate } from 'react-router-dom';

const LastFmApiComponent = () => {
  const API_KEY = 'dfa1cf8d1f24d259e2de9b2b8965cbf8';
  const BASE_URL = 'http://ws.audioscrobbler.com/2.0';

  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [albumImages, setAlbumImages] = useState({});

  const navigate = useNavigate();

  const fetchTopArtists = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/?method=chart.gettopartists&api_key=${API_KEY}&format=json`
      );
      setArtists(response.data.artists.artist.slice(0, 10));
      setError(null);
    } catch (err) {
      setError('Error al obtener la información de los artistas');
      setArtists([]);
    }
  };

  useEffect(() => {
    fetchTopArtists();
  }, []);

  useEffect(() => {
    const fetchAlbumImages = async () => {
      const images = {};
      await Promise.all(
        artists.map(async (artist) => {
          try {
            const response = await axios.get(
              `${BASE_URL}/?method=artist.gettopalbums&artist=${artist.name}&api_key=${API_KEY}&format=json`
            );
            const topAlbum = response.data.topalbums.album[0];
            if (topAlbum && topAlbum.image && topAlbum.image[2] && topAlbum.image[2]['#text']) {
              images[artist.name] = topAlbum.image[2]['#text'];
            }
          } catch (error) {
            images[artist.name] = ''; // En caso de error, asigna una cadena vacía
          }
        })
      );
      setAlbumImages(images);
    };
    if (artists.length > 0) {
      fetchAlbumImages();
    }
  }, [artists]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${BASE_URL}/?method=artist.search&artist=${encodeURIComponent(searchQuery)}&api_key=${API_KEY}&format=json`
      );
      if (response.data && response.data.results && response.data.results.artistmatches && response.data.results.artistmatches.artist) {
        setArtists(response.data.results.artistmatches.artist.slice(0, 10));
        setError(null);
      } else {
        setError('No se encontraron artistas');
        setArtists([]);
      }
    } catch (err) {
      setError('Error al buscar artistas');
      setArtists([]);
    }
  };

  const handleArtistClick = (artist) => {
    navigate(`/musica/${artist.name}`);
  };

  return (
    <div className="music-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Buscar artistas"
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button type="submit">Buscar</button>
      </form>

      <div className="artist-cards">
        {artists.map((artist) => (
          <div key={artist.name} className="artist-card" onClick={() => handleArtistClick(artist)}>
            {albumImages[artist.name] ? (
              <img src={albumImages[artist.name]} alt={`Album ${artist.name}`} />
            ) : (
              <img src={artist.image && artist.image[2] && artist.image[2]['#text']} alt={artist.name} />
            )}
            <h2>{artist.name}</h2>
          </div>
        ))}
      </div>

      {selectedArtist && <DetallesMusica artist={selectedArtist} />}
    </div>
  );
};

export default LastFmApiComponent;
