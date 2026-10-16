import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ChevronRight, Minimize2, Maximize2, X, Hexagon, Volume2, VolumeX, Sparkles } from "lucide-react";
import { executeGhostCommand } from "../services/api";

/* ── Types ───────────────────────────────────────────────── */
interface TerminalLine {
  id: number;
  type: "input" | "output" | "error" | "system" | "success" | "warning";
  content: string;
  timestamp: string;
}

// Global audio tone synth context
let audioCtx: AudioContext | null = null;
let activeOscillator: OscillatorNode | null = null;
let activeGain: GainNode | null = null;

function playTone(hz: number): void {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    stopTone();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(hz, audioCtx.currentTime);

    // Smooth ramp in
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();

    activeOscillator = osc;
    activeGain = gain;
  } catch (err) {
    console.error('Audio synthesis error:', err);
  }
}

function stopTone(): void {
  try {
    if (activeGain && audioCtx) {
      activeGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.1);
      setTimeout(() => {
        try {
          activeOscillator?.stop();
          activeOscillator?.disconnect();
          activeGain?.disconnect();
        } catch (_) {}
        activeOscillator = null;
        activeGain = null;
      }, 120);
    }
  } catch (_) {
    activeOscillator = null;
    activeGain = null;
  }
}

/* ── Local Fallback Command Registry ─────────────────────── */
const LOCAL_COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    "╔══════════════════════════════════════════════════╗",
    "║         GHOST CORE — COMMAND REGISTRY            ║",
    "╚══════════════════════════════════════════════════╝",
    "",
    "LIVE ARCHIVE & ATELIER PIPELINE:",
    "  pieces count            Query live 1,200+ catalogue count",
    "  pieces search [term]    Search catalog by glass type or title",
    "  pieces recent           List newest forged acquisitions",
    "  forge [title]           Forge new bespoke piece directly into DB",
    "",
    "KOL — REAL FREQUENCY SOUND ENGINE:",
    "  kol play [hz]           Synthesize real crystal audio tone (e.g. 432, 528)",
    "  kol stop                Halt all audio oscillators",
    "  kol status              Sound engine oscillator status",
    "",
    "RUACH — AI & OPTICAL COGNITION:",
    "  ruach query [prompt]    Query optical AI model on glass physics",
    "",
    "SYSTEM CONTROLS:",
    "  status                  Full atelier & server core status",
    "  whoami                  Operator identity & credentials",
    "  version                 System version & build",
    "  clear                   Clear terminal window",
    "",
    "AYIN — SPECTRAL MATRIX:",
    "  initialize eye          Unlock all optical spectrums",
    "  scan infrared           Activate IR annealing inspection",
    "  scan thermal            Read core kiln thermodynamics",
    "  scan all                Engage multi-band polariscope",
    "",
    "EMET — MASTER CONTROL:",
    "  emet init               Initialize all atelier systems",
    "  emet status             Full platform status",
  ],

  status: () => [
    "╔══════════════════════════════════════════════════╗",
    "║            GHOST CORE SYSTEM STATUS              ║",
    "╚══════════════════════════════════════════════════╝",
    "",
    "ATELIER SYSTEMS:",
    "  ● GHOST_CORE          v2.4      ONLINE",
    "  ● KILN_BANK_1_TO_4              580°C ANNEALING",
    "  ● POLARISCOPE_ARRAY             ZERO-STRAIN VERIFIED",
    "  ● BACKEND_REST_API              PORT 3000 SYNCED",
    "  ● ARCHIVE_REGISTRY              1,200+ PIECES LIVE",
    "",
    "ADMIN: DAMONE_WARD",
    "CLEARANCE: SOVEREIGN ARCHIVAL MASTER",
    "ALL SYSTEMS NOMINAL",
  ],

  whoami: () => [
    "USER:        DAMONE_WARD",
    "ROLE:        ADMINISTRATOR & MASTER CURATOR",
    "ACCESS:      FULL — ARCHIVE, KILNS, POLARISCOPES",
    "CLEARANCE:   SOVEREIGN",
    "PLATFORM:    DECENNIA ATELIER v2.4",
  ],

  version: () => [
    "GHOST CORE          v2.4.0",
    "DECENNIA ATELIER    v1.0.0 (2016–2026 RETROSPECTIVE)",
    "EXPRESS BACKEND     SYNCED ON PORT 3000",
  ],

  "initialize eye": () => [
    "INITIALIZING AYIN OPTICAL POLARISCOPE...",
    "LOADING SPECTRUM MODULES...",
    "  [████████████████████] 100%",
    "OPTIC_SYNC: 100%",
    "ALL SPECTRUMS UNLOCKED: INFRARED, THERMAL, UV, X-RAY, NIGHT, POLARIZED",
  ],

  "emet init": () => [
    "╔══════════════════════════════════════════════════╗",
    "║         INITIALIZING EMET PLATFORM               ║",
    "║              אֱמֶת — TRUTH                       ║",
    "╚══════════════════════════════════════════════════╝",
    "LOADING ALL ATELIER SUBSYSTEMS...",
    "  [████████████████████] 100%",
    "EMET אֱמֶת — FULLY ONLINE & SYNCHRONIZED",
  ],

  clear: () => ["__CLEAR__"],
};

export const GhostTerminal: React.FC<{ initialOpen?: boolean; className?: string }> = ({
  initialOpen = false,
  className = "",
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: "system", content: "DECENNIA GHOST_CORE INIT SEQUENCE... OK", timestamp: new Date().toLocaleTimeString() },
    { id: 1, type: "system", content: "TIED TO REAL EXPRESS BACKEND ON PORT 3000. 1,200+ PIECES SYNCED.", timestamp: new Date().toLocaleTimeString() },
    { id: 2, type: "system", content: "TYPE 'help' FOR COMMANDS (TRY: 'pieces count', 'pieces search prism', 'kol play 432').", timestamp: new Date().toLocaleTimeString() },
  ]);

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lineIdRef = useRef(3);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines(prev => [...prev, {
      id: lineIdRef.current++,
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const timestamp = new Date().toLocaleTimeString();

    setLines(prev => [...prev, { id: lineIdRef.current++, type: "input", content: cmd, timestamp }]);
    setHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistIdx(-1);
    setInput("");

    const lower = cmd.toLowerCase().trim();
    const parts = lower.split(' ');
    const base = parts[0];
    const args = parts.slice(1);

    // Audio synthesizer command
    if (base === 'kol') {
      if (args[0] === 'play') {
        const hz = parseFloat(args[1]);
        if (!isNaN(hz) && hz >= 20 && hz <= 20000) {
          playTone(hz);
          setActiveFrequency(hz);
          addLine('success', `♪ TONE ENGINE ENGAGED: Synthesizing ${hz} Hz harmonic sine wave.`);
          addLine('system', `WAVEFORM: PURE SINE | DECIBELS: -22dB | TYPE 'kol stop' TO CEASE.`);
          return;
        } else {
          addLine('error', 'INVALID FREQUENCY. Specify a frequency in Hz between 20 and 20000 (e.g. kol play 432).');
          return;
        }
      } else if (args[0] === 'stop') {
        stopTone();
        setActiveFrequency(null);
        addLine('system', 'TONE ENGINE HALTED: All oscillators disconnected.');
        return;
      } else if (args[0] === 'status') {
        addLine('system', activeFrequency ? `ACTIVE OSCILLATOR: ${activeFrequency} Hz (RUNNING)` : 'OSCILLATOR: IDLE');
        return;
      }
    }

    // Try backend command executor first
    try {
      const backendRes = await executeGhostCommand(cmd);
      if (backendRes.type !== 'passthrough' && backendRes.lines) {
        backendRes.lines.forEach(l => addLine(backendRes.type as any, l));
        return;
      }
    } catch (_) {
      // Passthrough to local
    }

    // Local commands check
    if (LOCAL_COMMANDS[lower]) {
      const result = LOCAL_COMMANDS[lower](args);
      if (result[0] === "__CLEAR__") {
        setLines([{ id: lineIdRef.current++, type: "system", content: "TERMINAL CLEARED.", timestamp: new Date().toLocaleTimeString() }]);
      } else {
        result.forEach(content => addLine('success', content));
      }
      return;
    }

    // Unknown command
    addLine('error', `COMMAND_NOT_FOUND: "${cmd}". Type "help" for full command pipeline.`);
  }, [input, activeFrequency]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx]);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2">
        {activeFrequency && (
          <button
            onClick={() => {
              stopTone();
              setActiveFrequency(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] uppercase tracking-wider backdrop-blur-xl animate-pulse"
          >
            <Volume2 size={12} />
            <span>{activeFrequency} Hz</span>
            <VolumeX size={12} className="ml-1 hover:text-white" />
          </button>
        )}
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-mono text-[10px] uppercase tracking-widest border border-white/10 bg-black/85 backdrop-blur-xl text-white shadow-2xl hover:border-white/30 transition-all cursor-pointer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <Hexagon size={14} className="text-white animate-pulse" />
          <span>Ghost Core & Kiln Terminal</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`fixed z-[60] flex flex-col rounded-2xl overflow-hidden bg-[#07070b]/95 backdrop-blur-2xl border border-white/10 shadow-2xl ${
        isMaximized ? "inset-4" : "bottom-6 right-6 w-[92vw] sm:w-[580px] h-[520px]"
      } ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <Hexagon size={14} className="text-white/60 animate-spin" style={{ animationDuration: '20s' }} />
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">
            GHOST_CORE // BACKEND_CONNECTED
          </span>
          {activeFrequency && (
            <span className="flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Volume2 size={10} /> {activeFrequency} Hz
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFrequency && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopTone();
                setActiveFrequency(null);
              }}
              title="Mute tone"
              className="text-amber-400 hover:text-white p-1"
            >
              <VolumeX size={14} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMaximized(!isMaximized);
            }}
            className="text-white/40 hover:text-white p-1 transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="text-white/40 hover:text-red-400 p-1 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Output Console */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-1 font-mono text-[11px] leading-relaxed select-text">
        {lines.map((line) => (
          <div key={line.id} className="flex items-start gap-2">
            {line.type === 'input' ? (
              <span className="flex items-center gap-1.5 text-white font-bold">
                <ChevronRight size={11} className="text-white/40 shrink-0 mt-0.5" />
                <span>{line.content}</span>
              </span>
            ) : (
              <span
                className={
                  line.type === 'error' ? 'text-red-400' :
                  line.type === 'success' ? 'text-white' :
                  line.type === 'warning' ? 'text-amber-300' :
                  line.type === 'system' ? 'text-white/40' : 'text-white/70'
                }
              >
                {line.content}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Line */}
      <form onSubmit={handleSubmit} className="p-3.5 border-t border-white/10 bg-white/[0.02] flex items-center gap-2">
        <ChevronRight size={14} className="text-white/40 shrink-0" />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none font-mono text-xs text-white placeholder-white/30"
          placeholder="Command... (e.g. pieces count, kol play 528, whoami, help)"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
        >
          Send
        </button>
      </form>
    </motion.div>
  );
};
