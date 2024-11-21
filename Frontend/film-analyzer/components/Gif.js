"use client";
import React from 'react';

const Gif = ({ gifSource, backgroundColor }) => {
  return (
    <div
      className={`flex justify-center items-center h-screen`}
      style={{
        backgroundColor: backgroundColor || '#ffffff',
      }}
    >
      <img
        src={gifSource}
        alt="Centered GIF"
        className="w-64 h-64 object-contain rounded-lg"
      />
    </div>
  );
};

export default Gif;
