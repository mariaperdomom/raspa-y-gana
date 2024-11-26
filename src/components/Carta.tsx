import React, { useState, useRef, useEffect } from 'react';
import './Carta.css';

interface CartaProps {
  id: number;
  onRaspadoComplete: (id: number) => void;
  videoSrc: string;
  reiniciar: boolean;
  tarjetaActiva: number | null; // Nueva prop para controlar la tarjeta activa
}

const Carta: React.FC<CartaProps> = ({ id, onRaspadoComplete, videoSrc, reiniciar, tarjetaActiva }) => {
  const [raspadoPorcentaje, setRaspadoPorcentaje] = useState(0);
  const [raspada, setRaspada] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reiniciar) {
      setRaspadoPorcentaje(0);
      setRaspada(false);
      resetCanvas();
    }
  }, [reiniciar]);

  useEffect(() => {
    resetCanvas();
  }, []);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleRaspar = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current || raspada || (tarjetaActiva !== null && tarjetaActiva !== id)) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const posX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const posY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  
    const x = posX - rect.left;
    const y = posY - rect.top;
    const radius = 30;
  
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const totalPixels = imageData.data.length / 4;
    const transparentPixels = imageData.data.filter((_, i) => (i + 1) % 4 === 0 && imageData.data[i] === 0).length;
    const porcentajeRaspado = (transparentPixels / totalPixels) * 100;
  
    setRaspadoPorcentaje(porcentajeRaspado);
  };
  

  useEffect(() => {
    if (raspadoPorcentaje >= 70 && !raspada) {
      setRaspada(true);
      onRaspadoComplete(id);
    }
  }, [raspadoPorcentaje, raspada, onRaspadoComplete, id]);

  return (
    <div className={`carta ${tarjetaActiva !== null && tarjetaActiva !== id ? 'bloqueada' : ''}`}>
      <video className="video-premio" src={videoSrc} muted loop />
      {!raspada && (
        <canvas
          ref={canvasRef}
          className="raspado"
          width={250}
          height={250}
          onMouseMove={handleRaspar}
          onTouchMove={handleRaspar}
        />
      )}
    </div>
  );
};

export default Carta;
