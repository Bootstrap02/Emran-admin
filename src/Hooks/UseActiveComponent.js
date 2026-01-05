// useActiveComponent.js
import { useState, useEffect } from 'react';

const useActiveComponent = () => {
  const [activeComponent, setActiveComponent] = useState('Wishlist');

  const setActive = (componentName) => {
    setActiveComponent(componentName);
  };

 
  return { activeComponent, setActive };
};

export default useActiveComponent;
