import React, { useState } from 'react';
import Carta from './Carta';

const RaspaYGana: React.FC = () => {
  const [cartasRaspadas, setCartasRaspadas] = useState<number[]>([]);
  const [videoEnPantallaCompleta, setVideoEnPantallaCompleta] = useState<string | null>(null);
  const [reiniciarJuego, setReiniciarJuego] = useState(false);
  const [tarjetaActiva, setTarjetaActiva] = useState<number | null>(null); // Nueva prop para controlar la tarjeta activa
  const [interaccionUsuario, setInteraccionUsuario] = useState(false);

  const manejarInteraccion = () => {
    setInteraccionUsuario(true);
  };

  const handleRaspadoComplete = (id: number) => {
    if (cartasRaspadas.length === 0 && tarjetaActiva === null) {
      setVideoEnPantallaCompleta(videos[id]);
      setTarjetaActiva(id); // Establece la tarjeta activa
    }
    setCartasRaspadas([...cartasRaspadas, id]);
  };

  const handleReinicio = () => {
    setReiniciarJuego(true);
    setTimeout(() => {
      setReiniciarJuego(false);
      setCartasRaspadas([]);
      setVideoEnPantallaCompleta(null);
      setTarjetaActiva(null); // Libera la tarjeta activa
    }, 100);
  };

  const videos = [
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
    'video.mp4',
  ];

  return (
    <div
      className="relative"
      onClick={manejarInteraccion}
      onTouchStart={manejarInteraccion}
    >
      {/* Si hay un video en pantalla completa, lo mostramos en una vista separada */}
      {videoEnPantallaCompleta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <video
            src={videoEnPantallaCompleta}
            autoPlay
            muted={!interaccionUsuario}
            controls
            onEnded={handleReinicio}
            style={{ width: '75%', height: '75%' }}
          />
        </div>
      )}

      {/* Mostrar las cartas solo si no hay un video en pantalla */}
      {!videoEnPantallaCompleta && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
          {videos.map((video, index) => (
            <Carta
              key={index}
              id={index}
              onRaspadoComplete={handleRaspadoComplete}
              videoSrc={video}
              reiniciar={reiniciarJuego}
              tarjetaActiva={tarjetaActiva} // Pasar tarjeta activa
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RaspaYGana;
