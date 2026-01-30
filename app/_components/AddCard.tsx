"use client";

import { useEffect, useState } from "react";
import AddLabel from "./AddLabel";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import type { Card } from "@/app/_services/types";

type Label = {
  id: number;
  name: string;
  color: string;
};

type CardForm = {
  title: string;
  description?: string;
  dueDate?: string;
  labels: number[];
};

type CardInput = {
  listId: number;
  title: string;
  labels: number[];
  dueDate?: string;
  description?: string;
};

type AddCardProps = {
  onClose: () => void;
  onAdd?: (card: CardInput) => boolean;
  onEdit?: (id: number, card: Card) => boolean;
  listId?: number;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  cardData?: Partial<Card>;
  isEdit?: boolean;
};

function AddCard({
  onClose,
  onAdd,
  listId,
  setCards,
  cardData,
  onEdit,
  isEdit,
}: AddCardProps) {
  const [form, setForm] = useState<CardForm>({
    title: "",
    description: "",
    dueDate: "",
    labels: [],
  });

  const [error, setError] = useState<string | null>(null);

  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    if (isEdit && cardData) {
      setForm({
        title: cardData.title,
        description: cardData.description ?? "",
        dueDate: cardData.dueDate ?? "",
        labels: cardData.labels ?? [],
      });
    }
  }, [isEdit, cardData]);

  useEffect(() => {
    const raw = localStorage.getItem("labels");
    const storedLabels: Label[] = raw ? (JSON.parse(raw) as Label[]) : [];
    setLabels(storedLabels);
  }, []);

  function toggleLabel(labelId: number) {
    setForm((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter((id) => id !== labelId)
        : [...prev.labels, labelId],
    }));
  }

  function clearForm(): void {
    setForm({
      title: "",
      description: "",
      dueDate: "",
      labels: [],
    });
  }

  function handleSubmit(): void {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    const dateStr = new Date().toLocaleDateString("en-CA");

    if (form.dueDate < dateStr) {
      setError("Date can not privious from today");
      return;
    }

    if (isEdit) {
      const updatedCard: Card = {
        id: cardData.id,
        listId: cardData.listId,
        ...form,
        completed: cardData.completed,
        createdAt: cardData.createdAt,
      };

      const res = onEdit(cardData.id, updatedCard);

      if (!res) {
        toast.error("error in Editing data");
        return;
      }

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardData.id ? { ...card, ...form } : card
        )
      );
    } else {
      const res = onAdd({
        listId,
        ...form,
      });

      if (!res) {
        toast.error("error in Adding data");
        return;
      }

      setCards((prev) => [
        ...prev,
        {
          id: Math.floor(Date.now() + Math.random()),
          listId,
          ...form,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    setForm({
      title: "",
      description: "",
      dueDate: "",
      labels: [],
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full md:max-w-md bg-slate-900 rounded-t-2xl md:rounded-xl p-5 shadow-xl">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-white mb-4">
            {isEdit ? "Edit Card " : "Add Card"}
          </h2>
          <AiOutlineClose
            onClick={onClose}
            size={25}
            className="cursor-pointer"
          />
        </div>

        {error && <span className="text-red-600 text-center">{error}</span>}

        <input
          placeholder="Card title"
          className="w-full mb-2 p-2 rounded bg-slate-800 text-white outline-none"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          value={form.title}
        />

        <textarea
          placeholder="Description"
          rows={3}
          value={form.description}
          className="w-full mb-3 mt-2 p-2 rounded bg-slate-800 text-white outline-none resize-none"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          className="w-full mb-3 p-2 rounded bg-slate-800 text-white outline-none"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <div className="mb-4">
          <p className="text-sm text-slate-300 mb-2">Labels</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {labels.map((label) => (
              <button
                key={label.id}
                onClick={() => toggleLabel(label.id)}
                className={`px-3 py-1 rounded text-sm border transition ${
                  form.labels.includes(label.id)
                    ? "border-white"
                    : "border-transparent opacity-70"
                }`}
                style={{ backgroundColor: label.color }}
              >
                {label.name}
                <FiTrash2 className="hover:block hidden text-red-500" />
              </button>
            ))}
          </div>

          <AddLabel
            onAdd={(newLabel) => setLabels((prev) => [...prev, newLabel])}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={clearForm}
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-600"
          >
            {isEdit ? "Edit Catd " : "Add Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCard;
