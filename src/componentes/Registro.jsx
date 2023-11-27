import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Registro.css'; // Asegúrate de tener el archivo CSS correspondiente
import logoImage from '../img/logo.png';
import axios from 'axios';


function Registro() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        axios.post('http://localhost:5000/register', { name, email, password })
          .then(response => {
            console.log(response.data); // Puedes manejar la respuesta según tus necesidades
          })
          .catch(error => {
            console.error(error);
          });
      };

    return (
        <div className="register-container">
            <div className='register-card'>
                <div className="logo">
                    <img src={logoImage} alt="Logo del proyecto" />
                </div>
                <h1>Registrarse</h1>
                <form>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Link to="/">
                        <button onClick={handleRegister}>Registrarse</button>
                    </Link>
                </form>
                <p>
                    ¿Ya tienes una cuenta? <Link to="/login"><h2>Iniciar sesión</h2></Link>
                </p>
            </div>
        </div>
    );
}

export default Registro;
