import React, { useEffect, useState, useRef } from 'react';
import { getPreferences } from './genreUtils';
import useCurrentUser from './useCurrentUser';
import './CardsPersonalizadas.css'
import { useNavigate } from 'react-router-dom';



const API_KEY = '0db681bb093557fdf9d38e59e8f1d42b';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';


const movieUrls = {
    accion: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=28`,
    aventura: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=12`,
    cienciaFiccion: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=878`,
    comedia: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=35`,
    drama: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=18`,
    romance: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=10749`,

};

const seriesUrls = {
    accionAventura: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=10759`,
    cienciaFiccion: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=10765`,
    comedia: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=35`,
    crimen: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=80`,
    drama: `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&with_genres=18`,

};

const CardsPersonalizadas = () => {
    const [movieData, setMovieData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const { currentUser, loading } = useCurrentUser();
    const movieCardContainerRef = useRef(null);
    const seriesCardContainerRef = useRef(null);
    

    //Para smooth scroll

    //Para mostrar más y mostrar menos
    const [visibleItems, setVisibleItems] = useState(5);

    //Para navegación
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser) {
                    const preferences = await getPreferences(currentUser.uid);
                    console.log('Preferences:', preferences);

                    const movieGenreUrls = Object.keys(preferences.peliculas)
                        .filter((index) => preferences.peliculas[index])
                        .map((index) => {
                            const genreName = Object.keys(movieUrls)[index];
                            return movieUrls[genreName.toLowerCase()];
                        });

                    console.log('Genres:', Object.keys(preferences.peliculas));

                    const seriesGenreUrls = Object.keys(preferences.series)
                        .filter((index) => preferences.series[index])
                        .map((index) => {
                            const genreName = Object.keys(seriesUrls)[index];
                            return seriesUrls[genreName.toLowerCase()];
                        });

                    console.log('Genres (Series):', Object.keys(preferences.series));

                    console.log('Filtered Movie URLs:', movieGenreUrls);
                    console.log('Filtered Series URLs:', seriesGenreUrls);

                    const moviePromises = movieGenreUrls.map(fetchDataAndSetState(setMovieData));
                    const seriesPromises = seriesGenreUrls.map(fetchDataAndSetState(setSeriesData));

                    // Esperar a que todas las promesas se resuelvan
                    await Promise.all([...moviePromises, ...seriesPromises]);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, [currentUser]);

    const fetchDataAndSetState = (setState) => async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setState((prevData) => [...prevData, ...data.results]);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    

    if (loading) {
        return <div>Cargando...</div>;
    }

    // const handleMovieClick = (id) => {
    //     navigate(`/pelicula/${id}`);
    //   };
      
    // const handleSeriesClick = (id) => {
    //     navigate(`/serie/${id}`); // Utiliza navigate para redirigir al componente de detalles
    // };

    
    const handleCardClick = (id, mediaType) => {
        // Utiliza navigate para redirigir al componente de detalles
        navigate(`/${mediaType}/${id}`);
    };

    
    const handleShowMore = (category) => {
        const containerRef = category === 'series' ? seriesCardContainerRef : movieCardContainerRef;
    
        setVisibleItems((prev) => prev + 5);
    
        // Ajusta la cantidad de píxeles que se desplaza hacia abajo
        const pixelsToScroll = 100; // Ajusta este valor según tus necesidades
    
        if (containerRef.current) {
            const lastVisibleCard = containerRef.current.querySelector('.card:last-child');
            if (lastVisibleCard) {
                const topPosition = lastVisibleCard.offsetTop + lastVisibleCard.clientHeight - pixelsToScroll;
                window.scrollTo({ top: topPosition, behavior: 'smooth' });
            }
        }
    };



    const handleShowLess = () => {
        setVisibleItems(5);

        // Desplazarse al contenedor principal suavemente
        movieCardContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShowMoreSeries = () => {
        setVisibleItems((prev) => prev + 5);
      
        // Ajusta la cantidad de píxeles que se desplaza hacia abajo
        const pixelsToScroll = 300; // Ajusta este valor según tus necesidades
      
        const containerRef = seriesCardContainerRef.current;
        const buttonHeight = 40; // Altura estimada del botón "Mostrar más"
      
        if (containerRef) {
          const topPosition = containerRef.offsetTop + containerRef.clientHeight + pixelsToScroll - buttonHeight;
          window.scrollTo({
            top: topPosition,
            behavior: 'smooth',
          });
        }
      };

      const handleShowLessSeries = () => {
        setVisibleItems(5);
    
        // Obtener el contenedor principal de tarjetas de series
        const seriesContainer = seriesCardContainerRef.current;
    
        if (seriesContainer) {
            // Calcular la posición de desplazamiento
            const containerTop = seriesContainer.getBoundingClientRect().top + window.scrollY;
    
            // Desplazar suavemente al contenedor principal
            window.scrollTo({ top: containerTop, behavior: 'smooth' });
        }
    };

    if (!currentUser) {
        // Si no está autenticado, puedes mostrar un mensaje o redirigir a la página de inicio de sesión
        return <div className='recomendacion'><h1>Por favor, inicia sesión para ver contenido personalizado.</h1></div>;
      }
    return (
        <div>
            <div>
                <h1>Para ti</h1>
                <h2>Películas</h2>
                {movieData.length > 0 ? (
                    <div>
                        <div className="card-container"  ref={movieCardContainerRef}>
                            {movieData.slice(0, visibleItems).map((movie, index) => (
                                <Card key={`movie_${movie.id}`} title={movie.title} imageUrl={`${imageBaseUrl}${movie.poster_path}`} onClick={() => handleCardClick(movie.id, 'pelicula')} cardRef={index === visibleItems - 1 ? movieCardContainerRef : null}/>
                            ))}
                        </div>
                        <div>
                        <button onClick={handleShowMore} className="mostrarMasPeliculas">Mostrar más</button>
                            {visibleItems > 5 && <button onClick={handleShowLess} className='mostrarMenosPeliculas'>Mostrar menos</button>}
                        </div>
                    </div>
                ) : (
                    <p>No hay datos de películas disponibles.</p>
                )}
    
                <h2>Series</h2>
                {seriesData.length > 0 ? (
                    <div>
                        <div className="card-container"  ref={seriesCardContainerRef}>
                            {seriesData.slice(0, visibleItems).map((series) => (
                                <Card key={`series_${series.id}`} title={series.name} imageUrl={`${imageBaseUrl}${series.poster_path}`} onClick={() => handleCardClick(series.id, 'serie')}/>
                            ))}
                        </div>
                        <div>
                        <button onClick={handleShowMoreSeries} className='mostrarMasSeries'>Mostrar más</button>
                            {visibleItems > 5 && <button onClick={handleShowLessSeries} className='mostrarMenosSeries'>Mostrar menos</button>}
                        </div>
                    </div>
                ) : (
                    <p>No hay datos de series disponibles.</p>
                )}
            </div>
        </div>
    );
};


const Card = ({ title, imageUrl, onClick }) => (
    <div className="card" onClick={onClick}>
        <img src={imageUrl} alt={title} />
        <h3>{title}</h3>
    </div>
);

export default CardsPersonalizadas;
