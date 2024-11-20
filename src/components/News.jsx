import React, { useState, useEffect } from "react";
import noticiaDestacada from "../assets/noticiaDestacada.jpg";

const News = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array de imágenes de ejemplo
  const images = [
    noticiaDestacada
  ];

  // Cambiar automáticamente la imagen cada 3 segundos  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="p-6 bg-gradient-to-r from-green-950 to-black">
      <h2 className="text-white text-3xl font-bebas mb-4">Últimas Noticias</h2>
      <div className="relative w-full h-64 overflow-hidden">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Noticia ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default News;
