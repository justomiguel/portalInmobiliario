"use client";
import { useEffect, useState, useRef } from "react";

const REGION_METROPOLITANA_ID = 13; // ID oficial para la Región Metropolitana en la mayoría de APIs chilenas

export default function Home() {
  const [comunas, setComunas] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [comunasSource, setComunasSource] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch comunas de la Región Metropolitana desde el API Route local
  useEffect(() => {
    fetch("/api/comunas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setComunas(data.data);
          setComunasSource(data.source || "");
        } else {
          setComunas([]);
          setComunasSource("");
        }
      })
      .catch(() => {
        setComunas([]);
        setComunasSource("");
      });
  }, []);

  // Filtrar sugerencias según lo que escribe el usuario
  useEffect(() => {
    if (inputValue.length > 0) {
      const filtered = comunas.filter((comuna) =>
        comuna.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, comunas]);

  // Maneja selección de sugerencia
  const handleSuggestionClick = (comuna: string) => {
    setInputValue(comuna);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Animación de gradiente con CSS
  useEffect(() => {
    document.body.classList.add("animated-gradient-bg");
    return () => document.body.classList.remove("animated-gradient-bg");
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Hero central */}
      <div className="flex flex-col items-center justify-center h-[70vh] w-full z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center mb-6 tracking-tight animate-fade-in" style={{textShadow: '0 4px 24px #000, 0 2px 8px #317873'}}>
          Vive donde sueñas
        </h1>
        <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl mb-6 animate-fade-in-up" style={{textShadow: '0 2px 8px #000, 0 1px 4px #317873'}}>
          Encuentra casas y departamentos únicos en todo Chile. Simple, rápido y elegante.
        </p>
        {/* Buscador tipo dock, ahora debajo del texto */}
        <div className="w-full max-w-2xl z-20 animate-fade-in-up relative">
          {comunasSource && comunasSource !== 'skualo' && (
            <div className="mb-2 text-xs text-yellow-200 text-center">
              Mostrando comunas desde fuente de respaldo ({comunasSource === 'github' ? 'GitHub' : 'local'}).
            </div>
          )}
          <form className="flex flex-col md:flex-row gap-2 md:gap-4 bg-white/10 backdrop-blur-xl rounded-full shadow-2xl border border-white/20 px-4 py-3 md:py-4 items-center">
            <div className="relative w-full md:w-auto flex-1">
              <input
                ref={inputRef}
                type="text"
                placeholder="¿Dónde quieres buscar? (comuna)"
                autoComplete="off"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                className="flex-1 w-full px-4 py-2 md:py-3 rounded-full bg-transparent text-white placeholder:text-white/60 border-none focus:ring-2 focus:ring-white/40 outline-none text-lg"
              />
              {showSuggestions && (
                <ul className="absolute left-0 right-0 mt-2 bg-white/90 text-[var(--calypso)] rounded-xl shadow-lg z-30 max-h-56 overflow-y-auto">
                  {suggestions.map((comuna) => (
                    <li
                      key={comuna}
                      className="px-4 py-2 cursor-pointer hover:bg-[var(--calypso)] hover:text-white transition-colors rounded-xl"
                      onMouseDown={() => handleSuggestionClick(comuna)}
                    >
                      {comuna}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <select className="px-4 py-2 md:py-3 rounded-full bg-transparent text-white border-none focus:ring-2 focus:ring-white/40 outline-none">
              <option value="">Tipo</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
            </select>
            <select className="px-4 py-2 md:py-3 rounded-full bg-transparent text-white border-none focus:ring-2 focus:ring-white/40 outline-none">
              <option value="">Operación</option>
              <option value="venta">Venta</option>
              <option value="arriendo">Arriendo</option>
            </select>
            <button
              type="submit"
              className="bg-white text-[var(--calypso)] font-bold px-8 py-2 md:py-3 rounded-full shadow-lg hover:bg-white/90 transition-colors text-lg"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
      {/* Flecha animada para explorar más */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <style jsx global>{`
        body.animated-gradient-bg {
          background: linear-gradient(270deg, #317873, #4fd1c5, #317873, #ffffff);
          background-size: 400% 400%;
          animation: gradientMove 12s ease-in-out infinite;
        }
        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(.4,0,.2,1) both;
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
      `}</style>
    </div>
  );
}
