import React from 'react';

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
