import { useState, useEffect } from "react";
import birds from './sound/birds.mp3';
import rain from './sound/rain.mp3';
import './index.css'

type Sound = {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
};

export default function AmbientMixer() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sounds, setSounds] = useState<Record<string, Sound>>({});
  const [birdTogleState, setBirdTogleState] = useState<boolean>(true)
  const [rainTogleState, setRainTogleState] = useState<boolean>(true)
  const [birdVolume, setBirdVolume] = useState(0.5); // 初期値 0.5 に設定
  const [rainVolume, setRainVolume] = useState(0.5); // 初期値 0.5 に設定


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

  // スライダーの値に基づいて背景を動的に設定
  const backgroundStyle = (value: any) => ({
    background: `linear-gradient(to right, rgba(169, 187, 154, 0.9) ${value * 100}%, rgba(125 , 125 , 125 , 0.2) ${value * 100}%)`,
  });

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="bg-[#F6F5F1] m-12 p-20 rounded-4xl shadow-2xl inset-shadow-sm">

          <h1 className="text-xl font-bold mb-4 text-center">Ambient Sound Mixer</h1>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />
          <div className="flex items-center">
            {/* 鳥の音 */}
            <img src="src\soundIcon\tori.png" className="h-12 object-scale-down" />
            <span className="mr-4">Birds sound</span>
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(birdVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("birds", parseFloat(e.target.value)), setBirdVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${birdTogleState ? "block" : "hidden"}`}
              onClick={
                () => { loadAndPlaySound("birds", birds, 0.5), setBirdTogleState(!birdTogleState) }
              }>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${birdTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("birds"), setBirdTogleState(!birdTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />

          <div className="flex items-center">
            {/* 雨の音 */}
            <img src="src\soundIcon\ame.png" className="h-12 object-scale-down mr-1" />
            <span className="mr-4">Rain sound</span>
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(rainVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("rain", parseFloat(e.target.value)), setRainVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("rain", rain, 0.5), setRainTogleState(!rainTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("rain"), setRainTogleState(!rainTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />

          <div className="flex items-center">
            {/* 雨の音 */}
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(rainVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("rain", parseFloat(e.target.value)), setRainVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("rain", rain, 0.5), setRainTogleState(!rainTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("rain"), setRainTogleState(!rainTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />

          <div className="flex items-center">
            {/* 雨の音 */}
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(rainVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("rain", parseFloat(e.target.value)), setRainVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("rain", rain, 0.5), setRainTogleState(!rainTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("rain"), setRainTogleState(!rainTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />

          <div className="flex items-center">
            {/* 雨の音 */}
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(rainVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("rain", parseFloat(e.target.value)), setRainVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("rain", rain, 0.5), setRainTogleState(!rainTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${rainTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("rain"), setRainTogleState(!rainTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
