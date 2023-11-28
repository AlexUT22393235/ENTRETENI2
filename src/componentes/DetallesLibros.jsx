
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetallesLibros.css'; // Importa tu archivo de estilos CSS
import Footer from './Footer';

const DetallesLibros = () => {
  const [bookDetails, setBookDetails] = useState({});
  const { bookId } = useParams(); // Obtener el parámetro 'bookId' de la URL

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        setBookDetails(response.data || {});
      } catch (error) {
        console.error('Error al obtener los detalles del libro:', error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  return (
    <div className="book-details-container">
      <h2 className="book-details-title">Detalles del Libro</h2>
      <div className="book-details-content">
        <div className="book-info">
          <div className="book-image">
            {bookDetails.volumeInfo && bookDetails.volumeInfo.imageLinks && (
              <img src={bookDetails.volumeInfo.imageLinks.thumbnail} alt={bookDetails.volumeInfo.title} />
            )}
          </div>
          <div>
            <h3 className="book-title">{bookDetails.volumeInfo && bookDetails.volumeInfo.title}</h3>
            {bookDetails.volumeInfo && bookDetails.volumeInfo.description && (
              <p className="book-description">{bookDetails.volumeInfo.description}</p>
            )}
            {/* Agregar aquí otros detalles del libro que desees mostrar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesLibros;