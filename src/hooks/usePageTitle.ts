import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | Dembe Beads`;
    
    return () => {
      document.title = 'Dembe Beads Boutique - Handcrafted Beaded Accessories';
    };
  }, [title]);
};
