import React, { useState } from 'react';
import Carta from './Carta';

const RaspaYGana: React.FC = () => {
  const [cartasRaspadas, setCartasRaspadas] = useState<number[]>([]);
  const [videoEnPantallaCompleta, setVideoEnPantallaCompleta] = useState<string | null>(null);
  const [reiniciarJuego, setReiniciarJuego] = useState(false);
  const [tarjetaActiva, setTarjetaActiva] = useState<number | null>(null);
  const [interaccionUsuario, setInteraccionUsuario] = useState(false); // Detecta si hubo interacción
  const [juegosJugados, setJuegosJugados] = useState<number>(
    parseInt(localStorage.getItem('juegosJugados') || '0')
  );

  const manejarInteraccion = () => {
    setInteraccionUsuario(true); // Se registra que el usuario interactuó
  };

  const handleRaspadoComplete = (id: number) => {
    if (cartasRaspadas.length === 0 && tarjetaActiva === null) {
      setVideoEnPantallaCompleta(videos[id]);
      setTarjetaActiva(id);
    }
    setCartasRaspadas([...cartasRaspadas, id]);
  };

  const handleReinicio = () => {
    setReiniciarJuego(true);
    setTimeout(() => {
      setReiniciarJuego(false);
      setCartasRaspadas([]);
      setVideoEnPantallaCompleta(null);
      setTarjetaActiva(null);
      setJuegosJugados(juegosJugados + 1);
      localStorage.setItem('juegosJugados', (juegosJugados + 1).toString());
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
      {videoEnPantallaCompleta && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <video
            src={videoEnPantallaCompleta}
            autoPlay
            muted={!interaccionUsuario} // Se desactiva mute solo tras interacción
            controls
            onEnded={handleReinicio}
            style={{ width: '75%', height: '75%' }}
          />
          {!interaccionUsuario && (
            <p className="absolute bottom-4 text-white text-sm">
              Toca la pantalla para activar el sonido
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {videos.map((video, index) => (
          <Carta
            key={index}
            id={index}
            onRaspadoComplete={handleRaspadoComplete}
            videoSrc={video}
            reiniciar={reiniciarJuego}
            tarjetaActiva={tarjetaActiva}
          />
        ))}
      </div>
      <p className="text-center mt-4">Interacciones: {juegosJugados}</p>
    </div>
  );
};

export default RaspaYGana;
