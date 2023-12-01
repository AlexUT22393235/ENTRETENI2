import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import PreferencesModal from './PreferencesModal';
import CardsPersonalizadas from './CardsPersonalizadas';
// import CardsPersonalizadas from './CardsPersonalizadas';

function Home() {
  const navigate = useNavigate();
  const handleMovieClick = (id) => {
    navigate(`/pelicula/${id}`);
  };

  const [carouselItems, setCarouselItems] = useState([]);
  const [trendingIndex, setTrendingIndex] = useState(0);
  const [trendingItems, setTrendingItems] = useState([]);
  const [trendingTimeWindow, setTrendingTimeWindow] = useState('week');
  const [popularIndex, setPopularIndex] = useState(0);
  const [popularMovies, setPopularMovies] = useState([]);
  const [freeToWatchIndex, setFreeToWatchIndex] = useState(0);
  const [freeToWatchItems, setFreeToWatchItems] = useState([]); // Agrega este estado
  const [freeToWatchType, setFreeToWatchType] = useState('movies');
  const [activeIndex, setActiveIndex] = useState(0);
  const [filterType, setFilterType] = useState('streaming');
  const [userAuthenticated, setUserAuthenticated] = useState(false); // Agrega esta línea
 


  //CONTROLA SI SE MUESTRA EL MODAL O NO
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);


  const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
  const totalMovies = 50;
  const carouselSize = 3000;
  const itemsToShow = 5;

  const fillCircle = (percentage) => {
    const degree = (0 * (percentage / 100)).toFixed(1);
    return `rotate(${degree}deg)`;
  };

  //VERIFICA SI EL USUARIO ESTÁ LOGEADO
  useEffect(() => {
    const authenticationCheck = setTimeout(() => {
      setUserAuthenticated(true);
      setShowPreferencesModal(true); // Mostrar el modal después de iniciar sesión
    }, 2000);
  
    return () => clearTimeout(authenticationCheck);
  }, []);
  
  


  useEffect(() => {
    const fetchMovies = async () => {
      const uniqueMovies = new Set();
      const allMovies = [];

      while (uniqueMovies.size < totalMovies) {
        const page = Math.floor(Math.random() * (totalMovies / 20)) + 1;
        const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&page=${page}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.results) {
            data.results.forEach((movie) => {
              if (!uniqueMovies.has(movie.id)) {
                uniqueMovies.add(movie.id);
                allMovies.push({
                  id: movie.id,
                  title: movie.title,
                  imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                  userRating: (movie.vote_average * 10).toFixed(),
                });
              }
            });
          }
        } catch (error) {
          console.error('Error fetching data from TMDb:', error);
        }
      }

      const randomMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, carouselSize);
      setCarouselItems(randomMovies);
    };

    fetchMovies(); // Llamar a fetchMovies al inicio
  }, [API_KEY]);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      const apiUrlMovies = `https://api.themoviedb.org/3/trending/movie/${trendingTimeWindow}?api_key=${API_KEY}&language=es-ES`;
      const apiUrlTV = `https://api.themoviedb.org/3/trending/tv/${trendingTimeWindow}?api_key=${API_KEY}&language=es-ES`;

      try {
        const responseMovies = await fetch(apiUrlMovies);
        const dataMovies = await responseMovies.json();

        const responseTV = await fetch(apiUrlTV);
        const dataTV = await responseTV.json();

        if (dataMovies.results && dataTV.results) {
          const trendingMoviesData = dataMovies.results.map((movie) => ({
            id: movie.id,
            title: movie.title,
            imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            userRating: (movie.vote_average * 10).toFixed(),
            type: 'movie',
          }));

          const trendingTVData = dataTV.results.map((tv) => ({
            id: tv.id,
            title: tv.name,
            imageUrl: `https://image.tmdb.org/t/p/w500${tv.poster_path}`,
            userRating: (tv.vote_average * 10).toFixed(),
          }));

          // Combina y mezcla las películas y las series
          const combinedData = interleaveArrays(trendingMoviesData, trendingTVData);
          setTrendingItems(combinedData);
        }
      } catch (error) {
        console.error('Error fetching trending items from TMDb:', error);
      }
    };

    fetchTrendingItems(); // Llamar a fetchTrendingItems al inicio
  }, [API_KEY, trendingTimeWindow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % carouselSize);
    }, 100000);

    return () => clearInterval(interval);
  }, [activeIndex, carouselSize]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      let apiUrl = '';

      switch (filterType) {
        case 'streaming':
          apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
          break;
        case 'television':
          apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es-ES&page=1`;
          break;
        case 'alquiler':
          apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`; // Obtener películas recientes
          break;
        case 'cines':
          apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1`; // Obtener películas próximas a estrenarse
          break;
        default:
          break;
      }

      try {
        if (apiUrl) {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (data.results) {
            const popularMoviesData = data.results.map((movie) => ({
              id: movie.id,
              title: movie.title || movie.name,
              imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              userRating: (movie.vote_average * 10).toFixed(),
            }));

            setPopularMovies(popularMoviesData);
          }
        }
      } catch (error) {
        console.error('Error fetching popular movies from TMDb:', error);
      }
    };

    fetchPopularMovies();
  }, [API_KEY, filterType]);


  useEffect(() => {
    const fetchFreeToWatchItems = async () => {
      let apiUrl = '';
  
      switch (freeToWatchType) {
        case 'movies':
          apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`;
          break;
        case 'series':
          apiUrl = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}&language=es-ES&page=1`;
          break;
        default:
          break;
      }
  
      try {
        if (apiUrl) {
          const response = await fetch(apiUrl);
          const data = await response.json();
  
          if (data.results) {
            const freeToWatchData = data.results.map((item) => ({
              id: item.id,
              title: item.title || item.name,
              imageUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              userRating: (item.vote_average * 10).toFixed(),
            }));
  
            setFreeToWatchItems(freeToWatchData);
          }
        }
      } catch (error) {
        console.error('Error fetching free to watch items from TMDb:', error);
      }
    };
  
    fetchFreeToWatchItems();
  }, [API_KEY, freeToWatchType]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % carouselSize);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeIndex, carouselSize]);


    const visibleFreeToWatchItems = freeToWatchItems.slice(freeToWatchIndex, freeToWatchIndex + itemsToShow);

  const visibleTrendingItems = trendingItems.slice(trendingIndex, trendingIndex + itemsToShow);

  const visiblePopularMovies = popularMovies.slice(popularIndex, popularIndex + itemsToShow);

  return (
    <div>
      <div className="carousel-container">
        <div className="custom-carousel">
          <div className="carousel-track" style={{ transform: `translateX(-${activeIndex * (100 / 6)}%)` }}>
            {carouselItems.map((item, index) => (
              <div key={item.id} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
                <img src={item.imageUrl} alt={item.title} />
                <div className="user-rating-circle" style={{ transform: fillCircle(item.userRating) }}>
                  {item.userRating}%
                </div>
                <div className="carousel-caption">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN EXTRA PARA METER CARDS */}
      <div>
            <CardsPersonalizadas/>
      <div className="trending-section">
      <div className="trending-header">
        <h2>Tendencias</h2>
        <div className="trending-buttons-container">
          <button
            className={`trending-time-button ${trendingTimeWindow === 'day' ? 'active' : ''}`}
            onClick={() => setTrendingTimeWindow('day')}
          >
            Hoy
          </button>
          <button
            className={`trending-time-button ${trendingTimeWindow === 'week' ? 'active' : ''}`}
            onClick={() => setTrendingTimeWindow('week')}
          >
            Esta semana
          </button>
        </div>
      </div>
        <div className="trending-carousel">
          <div className="trending-movies">
            <div className="trending-buttons">
              <button
                className="previous-button"
                onClick={() => {
                  const prevIndex = (trendingIndex - 1 + trendingItems.length) % trendingItems.length;
                  if (trendingIndex !== 0) {
                    setTrendingIndex(prevIndex);
                  } else {
                    setTrendingIndex(trendingItems.length - itemsToShow);
                  }
                }}
              >
                {"<"}
              </button>
              {visibleTrendingItems.map((item) => (
                <div key={item.id} className="trending-movie" onClick={() => handleMovieClick(item.id)}>
                  <img src={item.imageUrl} alt={item.title} className="trending-movie-image" />
                  <div className="user-rating-circle" style={{ transform: fillCircle(item.userRating) }}>
                    {item.userRating}%
                  </div>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
            <button
              className="next-button"
              onClick={() => {
                const nextIndex = (trendingIndex + 1) % trendingItems.length;
                if (nextIndex + itemsToShow <= trendingItems.length) {
                  setTrendingIndex(nextIndex);
                }
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>


      </div>
      
      {/* CIERRE DE SECCIÓN EXTRA */}
      <div className="popular-section">
      <div className="popular-header">
        <h2>Los más populares</h2>
        <div className="filter-buttons-container">
          <button
            className={`filter-button ${filterType === 'streaming' ? 'active' : ''}`}
            onClick={() => setFilterType('streaming')}
          >
            En streaming
          </button>
          <button
            className={`filter-button ${filterType === 'television' ? 'active' : ''}`}
            onClick={() => setFilterType('television')}
          >
            En televisión
          </button>
          <button
            className={`filter-button ${filterType === 'alquiler' ? 'active' : ''}`}
            onClick={() => setFilterType('alquiler')}
          >
            En alquiler
          </button>
          <button
            className={`filter-button ${filterType === 'cines' ? 'active' : ''}`}
            onClick={() => setFilterType('cines')}
          >
            En cines
          </button>
        </div>
      </div>
        <div className="popular-carousel">
          <div className="popular-movies">
            <div className="popular-buttons">
              <button
                className="previous-button"
                onClick={() => {
                  const prevIndex = (popularIndex - 1 + popularMovies.length) % popularMovies.length;
                  if (popularIndex !== 0) {
                    setPopularIndex(prevIndex);
                  } else {
                    setPopularIndex(popularMovies.length - itemsToShow);
                  }
                }}
              >
                {"<"}
              </button>
              {visiblePopularMovies.map((item) => (
                <div key={item.id} className="popular-movie" onClick={() => handleMovieClick(item.id)}>
                  <img src={item.imageUrl} alt={item.title} className="popular-movie-image" />
                  <div className="user-rating-circle" style={{ transform: fillCircle(item.userRating) }}>
                    {item.userRating}%
                  </div>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
            <button
              className="next-button"
              onClick={() => {
                const nextIndex = (popularIndex + 1) % popularMovies.length;
                if (nextIndex + itemsToShow <= popularMovies.length) {
                  setPopularIndex(nextIndex);
                }
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      <div className="free-to-watch-section">
      <div className="free-to-watch-header">
      <h2>Para ver gratis</h2>
      <div className="free-to-watch-buttons-container">
        <button
          className={`free-to-watch-button ${freeToWatchType === 'movies' ? 'active' : ''}`}
          onClick={() => setFreeToWatchType('movies')}
        >
          Películas
        </button>
        <button
          className={`free-to-watch-button ${freeToWatchType === 'series' ? 'active' : ''}`}
          onClick={() => setFreeToWatchType('series')}
        >
          Series
        </button>
      </div>
      </div>
        <div className="free-to-watch-carousel">
          <div className="free-to-watch-movies">
            <div className="free-to-watch-buttons">
              <button
                className="previous-button"
                onClick={() => {
                  const prevIndex = (freeToWatchIndex - 1 + freeToWatchItems.length) % freeToWatchItems.length;
                  if (freeToWatchIndex !== 0) {
                    setFreeToWatchIndex(prevIndex);
                  } else {
                    setFreeToWatchIndex(freeToWatchItems.length - itemsToShow);
                  }
                }}
              >
                {"<"}
              </button>
              {visibleFreeToWatchItems.map((item) => (
                <div key={item.id} className="free-to-watch-movie" onClick={() => handleMovieClick(item.id)}>
                  <img src={item.imageUrl} alt={item.title} className="free-to-watch-movie-image" />
                  <div className="user-rating-circle" style={{ transform: fillCircle(item.userRating) }}>
                    {item.userRating}%
                  </div>
                  <h3>{item.title}</h3>
                </div>
              ))}
            </div>
            <button
              className="next-button"
              onClick={() => {
                const nextIndex = (freeToWatchIndex + 1) % freeToWatchItems.length;
                if (nextIndex + itemsToShow <= freeToWatchItems.length) {
                  setFreeToWatchIndex(nextIndex);
                }
              }}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      {userAuthenticated && showPreferencesModal && <PreferencesModal onClose={() => setShowPreferencesModal(false)} />}
    </div>
  );
}

// Función para intercalar elementos de dos arrays
function interleaveArrays(arr1, arr2) {
  const result = [];
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) {
      result.push(arr1[i]);
    }
    if (i < arr2.length) {
      result.push(arr2[i]);
    }
  }

  return result;
}

export default Home;