import { Palette, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, themes } from "@/contexts/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, setTheme, isDark, toggleDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          onClick={toggleDark}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle dark mode"
        >
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </motion.div>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Change theme"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 p-3 rounded-xl glass-card border shadow-xl z-50 min-w-[200px]"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2 px-1">Choose Theme</p>
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name); setOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    theme === t.name
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.colors.primary}, ${t.colors.accent})` }}
                  />
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
