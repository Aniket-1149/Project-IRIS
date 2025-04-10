import React from 'react';

const Copyright = ({ brand = 'IRIS' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-950 text-white text-center py-4 text-sm">
      &copy; {currentYear} {brand}. All rights reserved.
    </footer>
  );
};

export default Copyright;

