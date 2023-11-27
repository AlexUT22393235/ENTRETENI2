import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './Footer.css';
import logoImage from '../img/logo.png';

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="social-icons">
        <div className="line-left"></div>
        <a href="https://www.facebook.com/profile.php?id=61552927820251" target="_blank" rel="noopener noreferrer">
          <FaFacebook color="#1877f2" size={28} />
        </a>
        <a href="https://www.instagram.com/entreteni2_page" target="_blank" rel="noopener noreferrer">
          <FaInstagram color="#e1306c" size={28} />
        </a>
        <a href="https://x.com/Entreteni2_Page?t=LRamNFK9CqTjb49gnpttVw&s=08" target="_blank" rel="noopener noreferrer">
          <FaTwitter color="#1da1f2" size={28} />
        </a>
        <div className="line-right"></div>
      </div>
      <Link to = '/'>
      <div className="logo">
        <img src={logoImage} alt="Logo del proyecto"/>
      </div>
      </Link>
    </div>
  );
}

export default Footer;
