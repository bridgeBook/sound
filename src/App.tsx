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
  const [birdTogleState, setBirdTogleState] = useState<boolean>(true)
  const [rainTogleState, setRainTogleState] = useState<boolean>(true)

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

  const [value, setValue] = useState(50); // 初期値 50 に設定

  // スライダーの値に基づいて背景を動的に設定
  const backgroundStyle = {
    background: `linear-gradient(to right, green ${value}%, rgba(0, 255, 0, 0.2) ${value}%)`,
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="bg-[#F6F5F1] m-12 p-20 rounded-4xl shadow-2xl inset-shadow-sm">



          <div className="w-full max-w-lg mx-auto mt-10">
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))} // スライダーの値を更新
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={backgroundStyle} // スライダーの背景を動的に変更
            />
          </div>


          <h1 className="text-xl font-bold mb-4">Ambient Sound Mixer</h1>
          <div className="flex">
            {/* 鳥の音 */}
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              className="accent-[#a9bb9a] h-1 border-none"
              onChange={(e) => setVolume("birds", parseFloat(e.target.value))}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-2 ${birdTogleState ? "block" : "hidden"}`}
              onClick={
                () => { loadAndPlaySound("birds", birds, 0.5), setBirdTogleState(!birdTogleState) }
              }>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-2 ${birdTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("birds"), setBirdTogleState(!birdTogleState) }}
            >
              <span className="material-icons py-2">stop</span>
            </button>
          </div>

          <div className="flex mt-4">
            {/* 雨の音 */}
            <input
              type="range"
              min="0" max="1" step="0.01"
              defaultValue="0.5"
              onChange={(e) => setVolume("rain", parseFloat(e.target.value))}
            />
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-2 ${rainTogleState ? "block" : "hidden"}`}
              onClick={() => { loadAndPlaySound("rain", rain, 0.5), setRainTogleState(!rainTogleState) }}>
              <span className="material-icons py-2">play_arrow</span>
            </button>
            <button
              className={`px-4 bg-[#a9bb9a] text-white rounded-full ml-2 ${rainTogleState ? "hidden" : "block"}`}
              onClick={() => { stopSound("rain"), setRainTogleState(!rainTogleState) }}
            >
              <span className="material-icons py-2">stop</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
