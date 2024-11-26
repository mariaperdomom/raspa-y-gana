import React, { useRef, useEffect, useState, useCallback } from 'react';
import './Carta.css';

interface CartaProps {
  id: number;
  onRaspadoComplete: (id: number) => void;
  videoSrc: string;
  reiniciar: boolean;
  tarjetaActiva: number | null;
}

const Carta: React.FC<CartaProps> = ({ id, onRaspadoComplete, videoSrc, reiniciar, tarjetaActiva }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [raspada, setRaspada] = useState(false);
  const [raspadoPorcentaje, setRaspadoPorcentaje] = useState(0);

  const resetCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const ajustarCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (canvas && parent) {
      canvas.width = parent.clientWidth; // Ajustar el ancho dinámico
      canvas.height = parent.clientHeight; // Ajustar el alto dinámico
      resetCanvas(); // Volver a dibujar el canvas
    }
  }, [resetCanvas]);

  useEffect(() => {
    if (reiniciar) {
      setRaspadoPorcentaje(0);
      setRaspada(false);

      // Asegurarse de que el canvas también se reinicie
      setTimeout(() => {
        ajustarCanvas();
      }, 0); // Espera mínima para reiniciar después del ajuste
    }
  }, [reiniciar, ajustarCanvas]);

  useEffect(() => {
    ajustarCanvas();
  }, [ajustarCanvas]);

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
    <div className="carta relative aspect-w-1 aspect-h-1">
      <video className="video-premio w-full h-full object-cover" src={videoSrc} muted loop />
      {!raspada && (
        <canvas
          ref={canvasRef}
          className="raspado w-full h-full absolute top-0 left-0"
          onMouseMove={handleRaspar}
          onTouchMove={handleRaspar}
        />
      )}
    </div>
  );
};

export default Carta;
