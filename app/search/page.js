"use client";

import { useState, useEffect, useRef } from "react";
import { SkinViewer, IdleAnimation } from "skinview3d";

// Icons as simple SVG components
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-white">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

export default function SearchPage() {
  const [username, setUsername] = useState("");
  const [edition, setEdition] = useState("java");
  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (playerData?.decodedTexture?.textures?.SKIN?.url && canvasRef.current) {
      let viewer;
      try {
        viewer = new SkinViewer({
          canvas: canvasRef.current,
          width: 250,
          height: 350,
          skin: playerData.decodedTexture.textures.SKIN.url,
        });
        viewer.animation = new IdleAnimation();
        // Tweak camera to match screenshot isometric angle
        viewer.camera.position.set(-15, 10, 40);
        viewer.camera.lookAt(0, 0, 0);
      } catch (err) {
        console.error("Failed to render 3D skin:", err);
      }

      return () => {
        if (viewer) {
          viewer.dispose();
        }
      };
    }
  }, [playerData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      const res = await fetch(`https://mc-api.io/profile/${encodeURIComponent(username.trim())}/${edition}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Player not found. Please check the spelling and edition.");
        }
        throw new Error("An error occurred while fetching the player profile.");
      }
      const data = await res.json();
      setPlayerData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-[#0b1121] p-6 font-sans min-h-screen">
      <div className="w-full max-w-4xl mt-10">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Player Profile Lookup</h1>
          <p className="text-slate-400 text-sm">
            Get complete player profile including UUID, XUID (Bedrock), and skin data
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="notch"
            className="flex-1 rounded-md border border-slate-700 bg-[#111827] px-4 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
            required
          />
          <select
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            className="rounded-md border border-slate-700 bg-[#111827] px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm sm:w-48 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem"
            }}
          >
            <option value="java">Java Edition</option>
            <option value="bedrock">Bedrock Edition</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-[#2dbcfc] hover:bg-[#1eaaf0] px-6 py-2.5 font-medium text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <SearchIcon />
            )}
            Search
          </button>
        </form>

        {error && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {playerData && (
          <div className="animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Name</label>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-md border border-slate-700 bg-[#111827] px-4 py-2.5 text-white flex items-center">
                    {playerData.name}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(playerData.name)}
                    className="flex items-center justify-center rounded-md border border-slate-700 bg-[#111827] p-3 hover:bg-slate-800 transition-colors"
                    title="Copy Name"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">UUID</label>
                <div className="flex gap-2">
                  <div className="flex-1 rounded-md border border-slate-700 bg-[#111827] px-4 py-2.5 text-white flex items-center font-mono text-sm overflow-hidden text-ellipsis">
                    {playerData.uuid}
                  </div>
                  <button 
                    onClick={() => copyToClipboard(playerData.uuid)}
                    className="flex items-center justify-center rounded-md border border-slate-700 bg-[#111827] p-3 hover:bg-slate-800 transition-colors"
                    title="Copy UUID"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              {playerData.decodedTexture?.textures?.SKIN?.url ? (
                <div className="relative">
                  <canvas ref={canvasRef} className="block" />
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-slate-500">
                  No skin available
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
