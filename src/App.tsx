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
  const [rainTogle, setRainTogle] = useState<boolean>(true)

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
      <div className="p-40">
        <h1 className="text-xl font-bold mb-4">Ambient Sound Mixer</h1>

        <div className="flex">
          {/* 鳥の音 */}
          <input
            type="range"
            min="0" max="1" step="0.01"
            defaultValue="0.5"
            onChange={(e) => setVolume("birds", parseFloat(e.target.value))}
          />
          <button
            className="px-4 bg-slate-500 text-white rounded-full ml-2"
            onClick={() => loadAndPlaySound("birds", birds, 0.5)}>
            <span className="material-icons py-2">play_arrow</span>
          </button>
          <button
            className="px-4 bg-slate-500 text-white rounded-full ml-2"
            onClick={() => stopSound("birds")}
          >
            <span className="material-icons py-2">stop</span>
          </button>
        </div>

        <div className="flex mt-4">
          {/* 鳥の音 */}
          <input
            type="range"
            min="0" max="1" step="0.01"
            defaultValue="0.5"
            onChange={(e) => setVolume("rain", parseFloat(e.target.value))}
          />
          <button
            className="px-4 bg-slate-500 text-white rounded-full ml-2"
            onClick={() => loadAndPlaySound("rain", rain, 0.5)}>
            <span className="material-icons py-2">play_arrow</span>
          </button>
          <button
            className="px-4 bg-slate-500 text-white rounded-full ml-2"
            onClick={() => stopSound("rain")}
          >
            <span className="material-icons py-2">stop</span>
          </button>
        </div>
      </div>
    </>
  );
}
