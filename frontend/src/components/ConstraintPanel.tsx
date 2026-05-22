import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, X } from "lucide-react";
import { Constraint } from "../api/client";
import SearchInput from "./SearchInput";

interface Props {
  modalities: string[];
  subjects: string[];
  constraints: Constraint[];
  onChange: (constraints: Constraint[]) => void;
}

const CONSTRAINT_LABELS: Record<Constraint["type"], string> = {
  force_modality: "Forzar modalidade",
  exclude_modality: "Excluír modalidade",
  require_subject: "Requirir materia",
  exclude_subject: "Excluír materia",
};

export default function ConstraintPanel({
  modalities,
  subjects,
  constraints,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<Constraint["type"]>("force_modality");
  const [value, setValue] = useState("");

  const isModalityType = type === "force_modality" || type === "exclude_modality";

  const add = () => {
    console.log("[ConstraintPanel] add called, value:", value, "type:", type);
    if (!value) return;
    console.log("[ConstraintPanel] adding constraint:", { type, value });
    onChange([...constraints, { type, value }]);
    setValue("");
  };

  const remove = (i: number) =>
    onChange(constraints.filter((_, idx) => idx !== i));

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
      >
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        Restriccións opcionais
        {constraints.length > 0 && (
          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-semibold">
            {constraints.length}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value as Constraint["type"]);
                setValue("");
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 bg-white"
            >
              {(Object.keys(CONSTRAINT_LABELS) as Constraint["type"][]).map(
                (k) => (
                  <option key={k} value={k}>
                    {CONSTRAINT_LABELS[k]}
                  </option>
                )
              )}
            </select>

            {isModalityType ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400 bg-white"
              >
                <option value="">Seleccionar...</option>
                {modalities.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <SearchInput
                options={subjects}
                value={value}
                onChange={setValue}
                placeholder="Nome interno da materia..."
                className="flex-1"
              />
            )}

            <button
              onClick={add}
              disabled={!value}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {constraints.length > 0 && (
            <div className="space-y-1.5">
              {constraints.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm border border-gray-100"
                >
                  <span className="text-gray-400 text-xs">
                    {CONSTRAINT_LABELS[c.type]}
                  </span>
                  <span className="flex-1 text-gray-800 font-medium">
                    {c.value}
                  </span>
                  <button
                    onClick={() => remove(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
