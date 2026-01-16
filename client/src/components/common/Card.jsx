import React from 'react';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
