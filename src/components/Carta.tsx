import React, { useState } from 'react';
import './Carta.css';

interface CartaProps {
    id: number;
    onRaspadoComplete: (id: number) => void;
    videoSrc: string;
}

const Carta: React.FC<CartaProps> = ({ id, onRaspadoComplete, videoSrc }) => {
    const [raspada, setRaspada] = useState(false);

    const handleRaspado = () => {
        if (!raspada) {
        setRaspada(true);
        onRaspadoComplete(id);
        }
    };

    return (
        <div
            className={`carta ${raspada ? 'raspada' : ''}`}
            onMouseEnter={handleRaspado}
            onTouchStart={handleRaspado}
        >
            {!raspada && <div className="raspado">Raspa aquí</div>}
            {raspada && (
                <video className="video-premio" src={videoSrc} autoPlay loop muted />
            )}
        </div>
    );
};

export default Carta;
