import { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Droppable } from "react-beautiful-dnd";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";

import AddCard from "./AddCard";
import ConfrimDelete from "./ConfrimDelete";
import DisplayCard from "./DisplayCard";
import { deleteList, updateList } from "../_services/list-service";
import { createCard } from "../_services/cards-service";
import type { Card } from "@/app/_services/types";

type List = {
  id: number;
  name: string;
};

type DisplayListProps = {
  list: List;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  editingListId: number | null;
  setEditingListId: (id: number | null) => void;
};

function DisplayList({
  list,
  setLists,
  cards,
  setCards,
  setEditingListId,
  editingListId,
}: DisplayListProps) {
  const isEditListOpen = editingListId === list.id;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState<string>(list.name);
  const [displayAddCard, setDisplayAddCard] = useState<boolean>(false);
  const [displayConfrimDelete, setDisplayConfrimDelete] =
  useState<boolean>(false);

  // const [sortedCards, setSortedCards] = useState([]);

  // useEffect(() => {
  //   const sortedTasks = cards.sort(
  //     (a, b) => Number(a.completed) - Number(b.completed)
  //   );
  //   setSortedCards(sortedTasks);
  //   setCards(sortedTasks);
  // }, []);

  useEffect(() => {
    if (isEditListOpen) {
      inputRef.current?.focus();
    }
  }, [isEditListOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isEditListOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setEditingListId(null);
        setTitle(list.name);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [list.name]);

  function handleDeleteList() {
    const res = deleteList(list.id);

    if (!res) {
      console.error("Failed to delete list");
      return;
    }

    setLists((prev) => prev.filter((l) => l.id !== list.id));

    toast.success("List deleted successfully");
  }

  function handleEditList() {
    if (!title.trim()) {
      setEditingListId(null);
      setTitle(list.name);
      return;
    }

    const res = updateList(list.id, { name: title });

    if (!res) {
      console.error("Failed to update list");
      return;
    }

    setLists((prev) =>
      prev.map((l) => (l.id === list.id ? { ...l, name: title } : l))
    );

    setEditingListId(null);
  }

  const handleDisplayAddCard = useCallback(() => setDisplayAddCard(false), [setDisplayAddCard])

  return (
    <>
      <div className="w-72 shrink-0 bg-slate-800 rounded-xl p-3 flex flex-col max-h-full">
        <div className="flex justify-between items-start gap-2">
          {isEditListOpen ? (
            <div ref={wrapperRef} className="relative">
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditList();
                  if (e.key === "Escape") {
                    setEditingListId(null);
                  }
                }}
                className="w-full px-2 py-1 text-sm rounded bg-slate-700 text-slate-200 outline-none ring-2 ring-blue-500"
              />

              <AiOutlineCheck
                className="absolute right-8 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
                size={20}
                onClick={handleEditList}
              />

              <AiOutlineClose
                className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 cursor-pointer"
                size={20}
                onClick={() => {
                  setEditingListId(null);
                }}
              />
            </div>
          ) : (
            <h2 className="text-sm font-semibold text-slate-200 cursor-pointer">
              {list.name}
            </h2>
          )}

          <div className="flex items-center gap-1">
            <FiEdit
              className="hover:text-slate-300 p-1 text-slate-400 rounded-lg cursor-pointer"
              size={22}
              onClick={() => setEditingListId(list.id)}
            />

            <FiTrash2
              size={18}
              className="text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
              onClick={() => {
                setDisplayConfrimDelete(true);
                // handleDeleteList();
              }}
            />
          </div>
        </div>

        <Droppable droppableId={String(list.id)} type="CARD">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex-1 mt-3 space-y-2 overflow-y-auto"
            >
              {cards.map((card, index) => (
                <DisplayCard
                  key={card.id}
                  card={card}
                  index={index}
                  setCards={setCards}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button
          className="mt-3 text-sm text-slate-300 hover:text-white transition text-left"
          onClick={() => setDisplayAddCard(true)}
        >
          + Add card
        </button>
      </div>

      {displayConfrimDelete && (
        <ConfrimDelete
          onClose={() => {
            setDisplayConfrimDelete(false);
          }}
          label="List"
          DeleteFn={() => handleDeleteList()}
        />
      )}

      {displayAddCard && (
        <AddCard
          listId={list.id}
          onClose={handleDisplayAddCard}
          onAdd={createCard}
          setCards={setCards}
        />
      )}
    </>
  );
}

export default DisplayList;
