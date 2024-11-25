import React, { useState, useRef, useEffect } from 'react';
import './Carta.css';

interface CartaProps {
  id: number;
  onRaspadoComplete: (id: number) => void;
  videoSrc: string;
}

const Carta: React.FC<CartaProps> = ({ id, onRaspadoComplete, videoSrc }) => {
  const [raspadoPorcentaje, setRaspadoPorcentaje] = useState(0);
  const [raspada, setRaspada] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Inicializamos el canvas con un fondo gris o una imagen
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ccc'; // Color gris
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    if (raspadoPorcentaje >= 90 && !raspada) {
      setRaspada(true);
      onRaspadoComplete(id);
    }
  }, [raspadoPorcentaje, raspada, onRaspadoComplete, id]);

  const handleRaspar = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || raspada) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const posX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const posY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const x = posX - rect.left;
    const y = posY - rect.top;
    const radius = 15;

    // Simula el raspado con transparencia
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Calcula el porcentaje raspado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    const transparentPixels = imageData.data.filter((_, i) => (i + 1) % 4 === 0 && imageData.data[i] === 0).length;
    const porcentajeRaspado = (transparentPixels / totalPixels) * 100;

    setRaspadoPorcentaje(porcentajeRaspado);
  };

  return (
    <div className="carta">
      <video className="video-premio" src={videoSrc} autoPlay={raspada} muted loop />
      {!raspada && (
        <canvas
          ref={canvasRef}
          className="raspado"
          width={200}
          height={300}
          onMouseMove={handleRaspar}
          onTouchMove={handleRaspar}
        />
      )}
    </div>
  );
};

export default Carta;
