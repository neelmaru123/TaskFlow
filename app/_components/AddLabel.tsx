"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createLabel } from "../_services/labels-service";

type Label = {
  id: number;
  name: string;
  color: string;
};

type AddLabelProps = {
  onAdd?: (label: Label) => void;
};

function AddLabel({ onAdd }: AddLabelProps) {
  const [name, setName] = useState<string>("");
  const [color, setColor] = useState<string>("#22c55e");
  const [error, setError] = useState<string | null>(null);

  function handleAddLabel(): void {
    if (!name.trim()) {
      setError("Label name is required");
      return;
    }

    const res = createLabel(name, color);

    onAdd?.(res); // optional callback
    setName("");
    toast.success("Label added");
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="flex flex-col justify-start w-full">
        <input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
          placeholder="New label"
          className="flex-1 p-2 rounded bg-slate-800 text-white text-sm outline-none"
        />
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer"
      />

      <button
        onClick={handleAddLabel}
        className="px-3 py-2 bg-slate-700 text-sm rounded hover:bg-slate-600"
      >
        Add
      </button>
    </div>
  );
}

export default AddLabel;
