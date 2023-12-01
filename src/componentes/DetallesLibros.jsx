import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './DetallesLibros.css'; // Importa tu archivo de estilos CSS

const stripHtmlTags = (html) => {
  const regex = /(<([^>]+)>)/gi;
  return html ? html.replace(regex, '') : '';
};

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

  const getSpanishDescription = () => {
    if (bookDetails.volumeInfo && bookDetails.volumeInfo.description) {
      const { description, language } = bookDetails.volumeInfo;
      if (language && language.toLowerCase().includes('es')) {
        return stripHtmlTags(description);
      }
    }
    return ''; // Si no hay descripción en español, devuelve una cadena vacía
  };

  return (
    <div className="book-details-container">
      <div className="book-details-content">
        <div className="book-info">
          <div className="book-image">
            {bookDetails.volumeInfo && bookDetails.volumeInfo.imageLinks && (
              <img src={bookDetails.volumeInfo.imageLinks.thumbnail} alt={bookDetails.volumeInfo.title} />
            )}
          </div>
          <div>
            <h3 className="book-title">{bookDetails.volumeInfo && bookDetails.volumeInfo.title}</h3>
            {/* Mostrar la descripción en español sin etiquetas HTML si está disponible */}
            <p className="book-description">{getSpanishDescription()}</p>
            {/* Agregar aquí otros detalles del libro que desees mostrar */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesLibros;
