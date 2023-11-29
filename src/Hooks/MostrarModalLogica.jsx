// En useModalLogic.jsx

import { useState } from 'react';

export function MostrarModalLogica() {
    const [showPreferencesModal, setShowPreferencesModal] = useState(false);

    const openModal = () => {
      setShowPreferencesModal(true);
    };
  
    // const closeModal = () => {
    //   setShowPreferencesModal(false);
    // };
  
    return {
      showPreferencesModal,
      openModal,
    //   closeModal
    };
}
