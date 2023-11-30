import React, { useEffect, useState, useRef } from 'react';
import { getPreferences, listenToPreferences } from './genreUtils';
import useCurrentUser from './useCurrentUser';
import { useNavigate } from 'react-router-dom';
import './CardsPersonalizadas.css';

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
    const navigate = useNavigate();
    const [visibleItems, setVisibleItems] = useState(5);

    const fetchDataAndSetState = (setState) => async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setState((prevData) => [...prevData, ...data.results]);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    //Recuerda, un objeto tiene objeto = {clave: "valor"}, máquina

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentUser) {
                    const preferences = await getPreferences(currentUser.uid);
                    console.log('Preferences:', preferences);
    
                    const filteredMovieUrls = Object.values(preferences.peliculas)
                        .filter((genre) => genre)
                        .map((genre) => movieUrls[genre]);
    
                    const filteredSeriesUrls = Object.values(preferences.series)
                        .filter((genre) => genre)
                        .map((genre) => seriesUrls[genre]);
    
                    console.log('Filtered Movie URLs:', filteredMovieUrls);
                    console.log('Filtered Series URLs:', filteredSeriesUrls);
    
                    const moviePromises = filteredMovieUrls.map(fetchDataAndSetState(setMovieData));
                    const seriesPromises = filteredSeriesUrls.map(fetchDataAndSetState(setSeriesData));
    
                    await Promise.all([...moviePromises, ...seriesPromises]);

                    // Escuchar cambios en tiempo real en las preferencias
                    const unsubscribe = listenToPreferences(currentUser.uid, (updatedPreferences) => {
                        console.log('Preferences updated:', updatedPreferences);

                        // Actualizar las preferencias y volver a cargar los datos
                        const updatedMovieUrls = Object.values(updatedPreferences.peliculas)
                            .filter((genre) => genre)
                            .map((genre) => movieUrls[genre]);

                        const updatedSeriesUrls = Object.values(updatedPreferences.series)
                            .filter((genre) => genre)
                            .map((genre) => seriesUrls[genre]);

                        console.log('Updated Movie URLs:', updatedMovieUrls);
                        console.log('Updated Series URLs:', updatedSeriesUrls);

                        setMovieData([]);
                        setSeriesData([]);

                        const updatedMoviePromises = updatedMovieUrls.map(fetchDataAndSetState(setMovieData));
                        const updatedSeriesPromises = updatedSeriesUrls.map(fetchDataAndSetState(setSeriesData));

                        Promise.all([...updatedMoviePromises, ...updatedSeriesPromises]);
                    });

                    // Limpiar el listener cuando el componente se desmonta
                    return () => unsubscribe();



                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };
    
        fetchData();
    }, [currentUser]);
    
    
    
    
    
    
    
      
      
      



    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!currentUser) {
        return <div className='recomendacion'><h1>Por favor, inicia sesión para ver contenido personalizado.</h1></div>;
    }

    const handleCardClick = (id, mediaType) => {
        // Utiliza navigate para redirigir al componente de detalles
        navigate(`/${mediaType}/${id}`);
    };

    const handleShowMore = (category) => {
        const containerRef = category === 'series' ? seriesCardContainerRef : movieCardContainerRef;

        setVisibleItems((prev) => prev + 5);

        const pixelsToScroll = 100;

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
        movieCardContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShowMoreSeries = () => {
        setVisibleItems((prev) => prev + 5);
        const pixelsToScroll = 300;
        const containerRef = seriesCardContainerRef.current;
        const buttonHeight = 40;

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
        const seriesContainer = seriesCardContainerRef.current;

        if (seriesContainer) {
            const containerTop = seriesContainer.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: containerTop, behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div>
                <h1>Para ti</h1>
                <h2>Películas</h2>
                {movieData.length > 0 ? (
                    <div>
                        <div className="card-container" ref={movieCardContainerRef}>
                            {movieData.slice(0, visibleItems).map((movie, index) => (
                                <Card key={`movie_${movie.id}`} title={movie.title} imageUrl={`${imageBaseUrl}${movie.poster_path}`} onClick={() => handleCardClick(movie.id, 'pelicula')} cardRef={index === visibleItems - 1 ? movieCardContainerRef : null} />
                            ))}
                        </div>
                        <div>
                            <button onClick={() => handleShowMore('movies')} className="mostrarMasPeliculas">Mostrar más</button>
                            {visibleItems > 5 && <button onClick={handleShowLess} className='mostrarMenosPeliculas'>Mostrar menos</button>}
                        </div>
                    </div>
                ) : (
                    <p>No hay datos de películas disponibles.</p>
                )}

                <h2>Series</h2>
                {seriesData.length > 0 ? (
                    <div>
                        <div className="card-container" ref={seriesCardContainerRef}>
                            {seriesData.slice(0, visibleItems).map((series) => (
                                <Card key={`series_${series.id}`} title={series.name} imageUrl={`${imageBaseUrl}${series.poster_path}`} onClick={() => handleCardClick(series.id, 'serie')} />
                            ))}
                        </div>
                        <div>
                            <button onClick={() => handleShowMoreSeries('series')} className='mostrarMasSeries'>Mostrar más</button>
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
