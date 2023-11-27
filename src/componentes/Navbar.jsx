import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logoImage from '../img/logo.png';
import './Navbar.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import PreferencesModal from './PreferencesModal';


function Navbar() {
  const [user, setUser] = useState(null);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Peliculas');
  const [mediaData, setMediaData] = useState([]);
  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  const navigate = useNavigate();
  const [enterPressed, setEnterPressed] = useState(false);
  //Para navbar
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || 'Usuario',
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Actualizar el estado de 'showLogoutButton' cuando 'user' cambia
    setShowLogoutButton(false); // Restablecer al cerrar sesión
  }, [user]);

  const handleUserNameClick = () => {
    setShowLogoutButton(!showLogoutButton);
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut(); // Cerrar sesión en Firebase
      setUser(null); // Limpiar la información del usuario en tu estado local
      // Recargar la página después de cerrar sesión
      window.location.reload();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm && enterPressed) {
        const mediaType = selectedCategory === 'Peliculas' ? 'movie' : 'tv';
        const url = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${API_KEY}&language=es-ES&query=${searchTerm}&page=1&include_adult=false`;

        try {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setMediaData(data.results);
          }
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      }
    };

    fetchData();
  }, [selectedCategory, searchTerm, enterPressed]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setEnterPressed(true);
    }
  };

  const handleMediaClick = (id, result) => {
    const mediaType = result.media_type || (result.title ? 'movie' : 'tv');
    if (mediaType === 'movie') {
      navigate(`/pelicula/${id}`);
    } else if (mediaType === 'tv') {
      navigate(`/serie/${id}`);
    }

    // Limpiar el término de búsqueda
    setSearchTerm('');
    setEnterPressed(false);

    // Limpiar los resultados
    setMediaData([]);
  };

  //Para mostrar modal:
  const openPreferencesModal = () => {
    setShowPreferencesModal(true);
  };



  return (
    <div>
      
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className='logo'>
            <Link to="/">
              <img src={logoImage} alt="logo" />
            </Link>
          </div>
          <div className="custom-dropdown">
            <Link to="/Peliculas">
              <span className="custom-dropdown-label custom-button">Peliculas ⌵</span>
            </Link>
            <div className="custom-dropdown-content">
              <ul>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Acción')}>
                  <Link to="/ActionMovies">
                    <span className="custom-button">Accion</span>
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Aventura')}
                >
                  <Link to="/AdventureMovies">
                    <span className="custom-button">Aventura</span>
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Ciencia Ficción')}
                >
                  <Link to="/SciFiMovies">
                    <span className="custom-button">Ciencia Ficcion</span>
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Comedia')}
                >
                  <Link to="/ComedyMovies">
                    <span className="custom-button">Comedia</span>
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Drama')}
                >
                  <Link to="/DramaMovies">
                    <span className="custom-button">Drama</span>
                  </Link>
                </li>
                <li
                  onMouseEnter={() => setSelectedCategory('Peliculas Romance')}
                >
                  <Link to="/RomanceMovies">
                    <span className="custom-button">Romance</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="custom-dropdown">
            <Link to='/Series'>
              <span className="custom-dropdown-label custom-button">Series ⌵</span>
            </Link>
            <div className="custom-dropdown-content">
              <ul>
                <li
                  className="custom-button"
                  onMouseEnter={() => setSelectedCategory('Series Acción')}
                >
                  <Link to="/ActionSeries">
                    <span className="custom-button">Acción y Aventura</span>
                  </Link>
                </li>

                <li
                  className="custom-button"
                  onMouseEnter={() => setSelectedCategory('Series Ciencia Ficción')}
                >
                  <Link to="/SciFiSeries">
                    <span className="custom-button">Ciencia Ficción</span>
                  </Link>
                </li>
                <li
                  className="custom-button"
                  onMouseEnter={() => setSelectedCategory('Series Comedia')}
                >
                  <Link to="/ComedySeries">
                    <span className="custom-button">Comedia</span>
                  </Link>
                </li>
                <li
                  className="custom-button"
                  onMouseEnter={() => setSelectedCategory('Series Drama')}
                >
                  <Link to="/DramaSeries">
                    <span className="custom-button">Drama</span>
                  </Link>
                </li>
                <li
                  className="custom-button"
                  onMouseEnter={() => setSelectedCategory('Series Romance')}
                >
                  <Link to="/CrimenSeries">
                    <span className="custom-button">Crimen</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="custom-dropdown">
            <Link to='/PeliculasYSeries'>
              <span className="custom-dropdown-label custom-button">Peliculas y Series</span>
            </Link>
          </div>
        </div>
        <div className="search-container">
          <div className="search-input-container">
            <input
              className="search-input rounded"
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}

            />

          </div>
          {user ? (
            <div className="user-info">
              <span className="user-name" onClick={handleUserNameClick}>
                {user.displayName}
              </span>
              <div className="logout-container">
                {showLogoutButton && (
                  <button className="logout-button" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button className="login-button">
                <i className="bi bi-person-circle"></i>
              </button>
            </Link>
          )}
          {user && (
        <button className="preferences-button" onClick={openPreferencesModal}>
          Preferencias
        </button>
      )}

      {/* Renderizar el modal si showPreferencesModal es true */}
      {showPreferencesModal && (
        <PreferencesModal onClose={() => setShowPreferencesModal(false)} />
      )}
           
        </div>
      </div>
    </nav>

    <div className="movie-cards">
      {mediaData.map((result) => (
        <div key={result.id} className="movie-card" onClick={() => handleMediaClick(result.id, result)}>
          <h2>{result.title || result.name}</h2>
          <img src={`${BASE_IMAGE_URL}${result.poster_path}`} alt={result.title || result.name} />
        </div>
      ))}
    </div>
  </div>
  );
}

export default Navbar;
