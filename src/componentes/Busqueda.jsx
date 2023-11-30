import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ResultadosBusqueda() {
  const { category, query } = useParams();
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    console.log('Categoría:', category);
    console.log('Consulta:', query);
  
    const fetchData = async () => {
      const url = `https://api.themoviedb.org/3/search/${category === 'Peliculas' ? 'movie' : 'tv'}?api_key=0db681bb093557fdf9d38e59e8f1d42b&language=es-ES&query=${query}&page=1&include_adult=false`;
  
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Datos de resultados:', data);
          setResultados(data.results);
        }
      } catch (error) {
        console.error('Error al cargar datos de resultados:', error);
      }
    };
  
    fetchData();
   
  }, [category, query]);
  

  return (
    <div>
      <h2>Resultados de búsqueda para "{query}" en la categoría {category}</h2>
      <div className="result-cards">
        {/* Lógica para mostrar los resultados */}
        {resultados.map((resultado) => (
          <div key={resultado.id} className="result-card">
            <h3>{resultado.title || resultado.name}</h3>
            {/* Otros detalles del resultado */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultadosBusqueda;
