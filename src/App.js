import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import Login from './componentes/Login';
import Home from './componentes/Home';
import Peliculas from './componentes/Peliculas';
import Series from './componentes/Series';
import PeliculasYSeries from './componentes/PeliculasYSeries';


import ActionMovies from './generos/ActionMovies';
import AdventureMovies from './generos/AdventureMovies';
import SciFiMovies from './generos/SciFiMovies';
import ComedyMovies from './generos/ComedyMovies';
import DramaMovies from './generos/DramaMovies';
import RomanceMovies from './generos/RomanceMovies';
import Footer from './componentes/Footer';

import DetallePeliculas from './componentes/DetallePelicula';
import DetalleSeries from './componentes/DetalleSerie';

import ActionAdventureSeries from './generos/ActionSeries';
import ScienceFictionSeries from './generos/SciFiSeries';
import ComedySeries from './generos/ComedySeries';
import DramaSeries from './generos/DramaSeries';
import CrimeSeries from './generos/CrimenSeries';
// import ResultadosBusqueda from './componentes/Busqueda';
import DetallesLibros from './componentes/DetallesLibros';
import GoogleBooksSearch from './componentes/Libros';
import Musica from './componentes/Musica';
import DetallesMusica from './componentes/DetallesMusica';
import ResultadoBusqueda from './componentes/ResultadoBusqueda';
import DetalleElemento from './componentes/DetalleElemento';

function App() {
  const [user, setUser] = React.useState(null);
  const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
  const [searchResults, setSearchResults] = useState([]);


  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home/>} />

          <Route path="/Peliculas" element={<Peliculas />} />
          <Route path="/Series" element={<Series />} />
          <Route path="/PeliculasYSeries" element={<PeliculasYSeries />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          
          <Route path="/resultados-busqueda" element={<ResultadoBusqueda />} />


          <Route path="/ActionMovies" element={<ActionMovies />} />
          <Route path="/ActionSeries" element={<ActionAdventureSeries/>} />
          <Route path="/AdventureMovies" element={<AdventureMovies />} />
          <Route path="/SciFiMovies" element={<SciFiMovies />} />
          <Route path="/SciFiSeries" element={<ScienceFictionSeries />} />
          <Route path="/ComedyMovies" element={<ComedyMovies />} />
          <Route path="/ComedySeries" element={<ComedySeries />} />
          <Route path="/DramaMovies" element={<DramaMovies />} />
          <Route path="/DramaSeries" element={<DramaSeries/>} />
          <Route path="/RomanceMovies" element={<RomanceMovies />} />
          <Route path="/CrimenSeries" element={<CrimeSeries />} />

          <Route path="/libro/:bookId" element={<DetallesLibros />} />
          <Route path="/Musica" element={<Musica />} />
          <Route path="/Libros" element={<GoogleBooksSearch />} />
          <Route path="/musica/:album" element={<DetallesMusica />} />

          <Route path="/pelicula/:id" element={<DetallePeliculas />} />
          <Route path="/serie/:id" element={<DetalleSeries/>} />
          <Route path="/detalle/:id" element={<DetalleElemento/>}/>
        </Routes>
      </div>
      <Footer/>
    </Router>
    
  );
}

export default App;
