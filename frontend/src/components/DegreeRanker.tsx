import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface Props {
  degrees: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function DegreeRanker({ degrees, selected, onChange }: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = degrees.filter(
    (d) =>
      d.toLowerCase().includes(search.toLowerCase()) && !selected.includes(d)
  );

  const add = (d: string) => {
    onChange([...selected, d]);
    setSearch("");
    setOpen(false);
  };

  const remove = (d: string) => onChange(selected.filter((x) => x !== d));

  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...selected];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onChange(arr);
  };

  const moveDown = (i: number) => {
    if (i === selected.length - 1) return;
    const arr = [...selected];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    onChange(arr);
  };

  return (
    <div>
      <div ref={ref} className="relative mb-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-200 transition">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            placeholder="Buscar carreira..."
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>

        {open && filtered.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto">
            {filtered.map((d) => (
              <button
                key={d}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(d)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length > 0 ? (
        <div className="space-y-2">
          {selected.map((d, i) => (
            <div
              key={d}
              className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100"
            >
              <span className="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-gray-800">{d}</span>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-25 transition-colors"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === selected.length - 1}
                  className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-25 transition-colors"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => remove(d)}
                  className="p-1 ml-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-6">
          Engade polo menos unha carreira para continuar
        </p>
      )}
    </div>
  );
}
