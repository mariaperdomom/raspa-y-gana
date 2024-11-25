import React, { useState } from 'react';
import Carta from './Carta';

const RaspaYGana: React.FC = () => {
    const [cartasRaspadas, setCartasRaspadas] = useState<number[]>([]);

    const handleRaspadoComplete = (id: number) => {
        setCartasRaspadas([...cartasRaspadas, id]);
        console.log(`Carta ${id} raspada`);
    };

  // Videos para cada carta
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {videos.map((video, index) => (
                <Carta
                    key={index}
                    id={index}
                    onRaspadoComplete={handleRaspadoComplete}
                    videoSrc={video}
                />
            ))}
            </div>
    );
};

export default RaspaYGana;
