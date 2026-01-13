"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  completeTask,
  deleteCard,
  updateCard,
} from "../_services/cards-service";
import { Draggable } from "react-beautiful-dnd";
import AddCard from "./AddCard";
import ConfrimDelete from "./ConfrimDelete";
import type { Card } from "@/app/_services/types";

type DisplayCardProps = {
  card: Card;
  index: number;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
};

type Label = {
  id: number;
  name: string;
  color: string;
};

function DisplayCard({ card, index, setCards }: DisplayCardProps) {
  const [completed, setCompleted] = useState(card.completed);
  const [displayAddCard, setDisplayAddCard] = useState(false);
  const [displayConfrimDelete, setDisplayConfrimDelete] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);

  useEffect(() => {
    const labels = localStorage.getItem("labels");

    if(!labels) return;

    const storedLabels: Label[] = JSON.parse(labels) as Label[];
    
    const filteredLabels = storedLabels.filter((label) =>
      card.labels.includes(label.id)
    );
    setLabels(filteredLabels);
  }, [card.labels]);

  function handleCheckBox(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.checked;

    setCompleted(newValue);

    const res = completeTask(card.id, { completed: newValue });

    if (!res) {
      toast.error("Something went wrong while completing the task");
      setCompleted(!newValue);
    }
  }

  function handleDeleteCard() {
    deleteCard(card.id);
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  }

  return (
    <>
      <Draggable draggableId={String(card.id)} index={index}>
        {(provided) => (
          <div
            className="flex flex-col bg-slate-700 hover:border-slate-400 transition group rounded-lg text-sm text-slate-100 hover:border-2 p-3 gap-2"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div className=" flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={handleCheckBox}
                  className={`transition accent-green-500 ${
                    completed
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                <p
                  className={`truncate ${
                    completed ? "line-through text-slate-400" : ""
                  }`}
                >
                  {typeof card.title === "string"
                    ? card.title
                    : String(card.title) || ""}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <div
                  className="hover:bg-slate-400 p-1 rounded-lg cursor-pointer"
                  onClick={() => setDisplayAddCard(true)}
                >
                  <FiEdit />
                </div>
                <FiTrash2
                  className="text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
                  onClick={() => setDisplayConfrimDelete(true)}
                />
              </div>
            </div>

            <div className="flex justify-start gap-1">
              {labels.map((label, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-10 rounded-full mt-1 mr-1]`}
                  style={{ backgroundColor: label.color }}
                ></span>
              ))}
            </div>
          </div>
        )}
      </Draggable>

      {displayAddCard && (
        <AddCard
          onClose={() => setDisplayAddCard(false)}
          onEdit={updateCard}
          setCards={setCards}
          isEdit={true}
          cardData={card}
        />
      )}

      {displayConfrimDelete && (
        <ConfrimDelete
          onClose={() => {
            setDisplayConfrimDelete(false);
          }}
          label="Card"
          DeleteFn={() => handleDeleteCard()}
        />
      )}
    </>
  );
}

export default DisplayCard;
