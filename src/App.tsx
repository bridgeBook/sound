import { useState, useEffect } from "react";
import birds from './sound/birds.mp3';
import rain from './sound/rain.mp3';

type Sound = {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
};

export default function AmbientMixer() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sounds, setSounds] = useState<Record<string, Sound>>({});

  useEffect(() => {
    const ctx = new AudioContext();
    setAudioContext(ctx);
    return () => {
      ctx.close();
    };
  }, []);


  const loadAndPlaySound = async (name: string, url: string, volume: number = 1.0) => {
    if (!audioContext) return;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);

    setSounds((prev) => ({
      ...prev,
      [name]: { source, gainNode },
    }));
  };

  const setVolume = (name: string, volume: number) => {
    if (sounds[name]) {
      sounds[name].gainNode.gain.value = volume;
    }
  };

  const stopSound = (name: string) => {
    if (sounds[name]) {
      sounds[name].source.stop();
      setSounds((prev) => {
        const updatedSounds = { ...prev };
        delete updatedSounds[name];
        return updatedSounds;
      });
    }
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Ambient Sound Mixer</h1>
        {/* 鳥の音 */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mb-2 mt-2"
          onClick={() => loadAndPlaySound("birds", birds, 0.5)}
        >
          <svg className="w-[36px] h-[36px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 18V6l8 6-8 6Z" />
          </svg>
        </button>
        <input
          type="range"
          min="0" max="1" step="0.01"
          defaultValue="0.5"
          onChange={(e) => setVolume("birds", parseFloat(e.target.value))}
        />
        <button
          className="px-4 py-2 bg-red-500 text-white rounded ml-2"
          onClick={() => stopSound("birds")}
        >
          Stop
        </button>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600"></span>
          {/* 雨の音 */}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
            onClick={() => loadAndPlaySound("rain", rain, 0.5)}
          >Play
          </button>
          <input
            type="range"
            min="0" max="1" step="0.01"
            defaultValue="0.5"
            onChange={(e) => setVolume("rain", parseFloat(e.target.value))}
          />
          <button
            className="px-4 py-2 bg-red-500 text-white rounded ml-2"
            onClick={() => stopSound("rain")}
          >
            Stop
          </button>
        </div>
      </div>
    </>
  );
}
