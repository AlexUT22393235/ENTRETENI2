import { getFirestore, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

// Función para obtener las preferencias actuales del usuario
export const getPreferences = async (userId) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'usuarios', userId);
    const userDocSnap = await getDoc(userDocRef);
  
    if (userDocSnap.exists()) {
      return userDocSnap.data().preferences || {};
    } else {
      // Si el usuario no tiene un documento, devolver un objeto vacío
      return {};
    }
  };

 // Función para actualizar las preferencias del usuario
export const updatePreferences = async (userId, preferences) => {
    const db = getFirestore();
    const userDocRef = doc(db, 'usuarios', userId);
  
    await setDoc(userDocRef, { preferences }, { merge: true });
    console.log('Preferencias actualizadas en Firestore.');
  };

export const onSelectGenres = (movies, series) => {
    // Lógica simulada para onSelectGenres
    console.log('Preferencias seleccionadas - Movies:', movies);
    console.log('Preferencias seleccionadas - Series:', series);
    // Aquí puedes agregar la lógica real para manejar las preferencias en tu aplicación
    // Por ahora, simplemente lo imprimimos en la consola
  };