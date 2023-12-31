import React, { useState, useEffect } from 'react';
import './Libros.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, handleAlbumClick }) => {
  return (
    <div className="book-card" onClick={() => handleAlbumClick(book)}>
      {book.volumeInfo.imageLinks && (
        <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} />
      )}
      <h3>{book.volumeInfo.title}</h3>
    </div>
  );
};

const GoogleBooksSearch = () => {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genresList] = useState([
    'Ficción', 'Historia', 'Arte', 'Negocios y Economía', 'Cocina', 'Fantasía', 'Salud y Bienestar',
    // Agrega más géneros según sea necesario
  ]);
  const navigate = useNavigate();

  const API_KEY = 'AIzaSyDeo85nri-y3IxeYywpRrupwZhENFP2olc';
  const MAX_RESULTS = 32; // Cantidad máxima de libros a obtener

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: selectedGenre ? `subject:${selectedGenre}` : 'ficcion', // Búsqueda predeterminada si no se selecciona un género
            key: API_KEY,
            maxResults: MAX_RESULTS,
            langRestrict: 'es',
          },
        });

        setBooks(response.data.items || []);
      } catch (error) {
        console.error('Error al buscar libros:', error);
      }
    };

    fetchBooks();
  }, [selectedGenre, searchTerm]);

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAlbumClick = (book) => {
    navigate(`/libro/${book.id}`); // Suponiendo que 'book.id' sea la identificación única del libro
  };

  return (
    <div>
      <h3>Seleccione un género:</h3>
      <select className="genre-select" onChange={handleGenreChange} value={selectedGenre}>
        <option value="">Todos los géneros</option>
        {genresList.map((genre, index) => (
          <option key={index} value={genre}>{genre}</option>
        ))}
      </select>

      <div>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por título o autor"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} book={book} handleAlbumClick={handleAlbumClick} />
        ))}
      </div>
    </div>
  );
};

export default GoogleBooksSearch;