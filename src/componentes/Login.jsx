import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logoImage from '../img/logo.png';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth, firestore } from '../bd/firebase';

const googleButtonImageUrl = 'https://1000marcas.net/wp-content/uploads/2020/02/logo-Google.png';

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);

      // Obtenemos el objeto de usuario
      const userData = result.additionalUserInfo.profile;
      console.log(userData.email);

      // Llamamos a la función para almacenar datos en Firestore
      saveUserDataToFirestore(userData);

      // Navegamos a la página principal
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  // Función para almacenar datos del usuario en Firestore
  const saveUserDataToFirestore = (userData) => {
    console.log('Guardar datos en Firestore:', userData);

    // Crea una referencia al documento del usuario en Firestore
    const userDocRef = firestore.collection('usuarios').doc(userData.email);

    // Utiliza el método set para almacenar los datos en el documento
    userDocRef.set(userData)
      .then(() => {
        console.log('Datos de usuario almacenados en Firestore:', userData);
      })
      .catch((error) => {
        console.error('Error al almacenar datos en Firestore:', error);
      });
  };

  // Función para extraer iniciales del nombre
  const extractInitial = (name) => {
    const initials = name.split(' ').map((word) => word[0]);
    return initials.join('').toUpperCase();
  };

  return (
    <div className="login-container">
      <div className='login-card'>
        <div className="logo">
          <img src={logoImage} alt="Logo del proyecto" />
        </div>
        <h1>Inicia sesión con:</h1>

        <img
          src={googleButtonImageUrl}
          alt="Iniciar sesión con Google"
          onClick={handleGoogleSignIn}
          style={{ cursor: 'pointer', width: '150px', height: '80px' }}
        />

        {user && user.name && (
          <div className="user-initial-circle">
            {extractInitial(user.name)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
