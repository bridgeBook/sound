import { useState, useEffect } from "react";
import birds from './sound/スズメが鳴く朝.mp3';
import rain from './sound/雨が降る2.mp3';
import leaves from './sound/風に揺れる草木1.mp3';
import street from './sound/街の道路.mp3';
import './index.css'
import tori from './soundIcon/tori.png';
import ame from './soundIcon/ame.png';
import ki from './soundIcon/ki.png';
import mati from './soundIcon/street.png';

type Sound = {
  source: AudioBufferSourceNode;
  gainNode: GainNode;
};

export default function AmbientMixer() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sounds, setSounds] = useState<Record<string, Sound>>({});
  const [birdTogleState, setBirdTogleState] = useState<boolean>(true)
  const [rainTogleState, setRainTogleState] = useState<boolean>(true)
  const [leavesTogleState, setLeavesTogleState] = useState<boolean>(true)
  const [streetTogleState, setStreetTogleState] = useState<boolean>(true)

  const [birdVolume, setBirdVolume] = useState(0.5); // 初期値 0.5 に設定
  const [rainVolume, setRainVolume] = useState(0.5); // 初期値 0.5 に設定
  const [leavesVolume, setLeavesVolume] = useState(0.5); // 初期値 0.5 に設定
  const [streetVolume, setStreetVolume] = useState(0.5); // 初期値 0.5 に設定

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
            <img src={tori} className="h-12 object-scale-down mr-3" />
            <span className="mr-4">Birds</span>
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
            <img src={ame} className="h-12 object-scale-down mr-4" />
            <span className="mr-4">Rain</span>
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
            {/* 木の音 */}
            <img src={ki} className="h-12 object-scale-down mr-1" />
            <span className="mr-4">leaves</span>
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(leavesVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("leaves", parseFloat(e.target.value)), setLeavesVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${leavesTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("leaves", leaves, 0.5), setLeavesTogleState(!leavesTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${leavesTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("leaves"), setLeavesTogleState(!leavesTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>

          <hr className="max-w my-4 h-px bg-[#dddddd] border-0" />

          <div className="flex items-center">
            {/* 街の音 */}
            <img src={mati} className="h-12 object-scale-down mr-2" />
            <span className="mr-4">street</span>
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              style={backgroundStyle(streetVolume)}
              className="w-60 h-2 rounded-lg appearance-none cursor-pointer"
              onChange={(e) => { setVolume("street", parseFloat(e.target.value)), setStreetVolume(Number(e.target.value)) }}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${streetTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("street", street, 0.5), setStreetTogleState(!streetTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-6 ${streetTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("street"), setStreetTogleState(!streetTogleState) }}
            >
              <span className="material-icons py-2">pause</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
