"use client";

import DisplayList from "@/app/_components/DisplayList";
import { createList, getListsByBoardId } from "@/app/_services/list-service";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { DragDropContext } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";
import { getAllCards } from "@/app/_services/cards-service";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useBoards } from "@/app/_context/BoardContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import ConfrimDelete from "@/app/_components/ConfrimDelete";
import type { Card } from "@/app/_services/types";

// type Board = {
//   id: number;
//   title: string;
// };

type List = {
  id: number;
  boardId: number;
  name: string;
};

// type Card = {
//   id: number;
//   title: string;
//   listId?: number;
//   completed: boolean;
//   description: string;
//   labels: number[];
//   dueDate?: string;
//   createdAt?: string;
// };

export default function BoardPage() {
  const { boards, updateBoardTitle, activeBoard, deleteBoard } = useBoards();
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isAddListOpen, setIsAddListOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [boardTitle, setBoardTitle] = useState<string>("");
  const [isEditBoardTitle, setIsEditBoardTitle] = useState<boolean>(false);
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [displayConfrimDelete, setDisplayConfrimDelete] =
    useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const boardTitleRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const boardData = boards.find((b) => b.id === Number(activeBoard));

    setBoardTitle(boardData?.title ?? "");
  }, [boards, activeBoard]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isEditBoardTitle &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setEditingListId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditBoardTitle, boardTitle]);

  useEffect(() => {
    const res = getListsByBoardId(Number(activeBoard));
    setCards(getAllCards());
    setLists(res || []);
  }, [activeBoard]);

  useEffect(() => {
    if (isAddListOpen) {
      inputRef.current?.focus();
    }
  }, [isAddListOpen]);

  useEffect(() => {
    if (isEditBoardTitle) {
      boardTitleRef.current?.focus();
    }
  }, [isEditBoardTitle]);

  function handleAddList() {
    if (!title.trim()) {
      setIsAddListOpen(false);
      setTitle("");
      return;
    }

    const list = createList(Number(activeBoard), title);
    if (!list) {
      toast.error("Failed to create list");
      return;
    }

    setLists((prev) => [...prev, list]);
    setTitle("");
    setIsAddListOpen(false);
    toast.success("List created successfully");
  }

  function handleEditBoardTitle() {
    if (boardTitle === "") return;

    const res = updateBoardTitle(Number(activeBoard), boardTitle);

    if (!res) {
      toast.error("Failed to update board title");
      return;
    }

    setIsEditBoardTitle(false);
    toast.success("Board title updated");
  }

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result;

    if (!destination) return;

    setCards((prev: Card[]) => {
      const updated = [...prev];

      const index = updated.findIndex((c) => String(c.id) === draggableId);

      if (index === -1) return prev;

      const movedCard = { ...updated[index] };
      movedCard.listId = Number(destination.droppableId);

      updated.splice(index, 1);
      updated.splice(destination.index, 0, movedCard);

      localStorage.setItem("cards", JSON.stringify(updated));
      return updated;
    });
  }

  function handleDeleteBoard() {
    const res = deleteBoard(Number(activeBoard));

    if (!res) {
      toast.error("Failed to delete board");
      return;
    }

    setDisplayConfrimDelete(false);
    toast.success("Board deleted successfully");
  }

  if (!activeBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl text-slate-400">
          No Board Created Start By Creating One
        </h2>
      </div>
    );
  }

  return (
    <div className="md:ps-10 md:py-7 mt-5">
      <div className="flex justify-between md:justify-start px-4 py-4">
        {isEditBoardTitle ? (
          <div className="relative">
            <input
              ref={boardTitleRef}
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditBoardTitle();
                if (e.key === "Escape") {
                  setIsEditBoardTitle(false);
                }
              }}
              placeholder="Title of the board"
              className="w-72 h-fit mt-2 mb-5 px-3 py-2 rounded-lg bg-slate-800 text-slate-200 outline-none ring-2 ring-blue-500"
            />
            <AiOutlineCheck
              className="absolute right-8 top-7 -translate-y-1/2 text-green-600 cursor-pointer"
              size={20}
              onClick={handleEditBoardTitle}
            />

            <AiOutlineClose
              className="absolute right-2 top-7 -translate-y-1/2 text-red-600 cursor-pointer"
              size={20}
              onClick={() => {
                setIsEditBoardTitle(false);
              }}
            />
          </div>
        ) : (
          <h1 className="font-bold text-2xl md:text-3xl mb-5 cursor-pointer">
            {/* {typeof board.title === "string" || board.title !== ""
            ? board.title
            : "Untitled Board"} */}
            {boardTitle}
          </h1>
        )}

        <div className="flex items-center gap-1 ms-28 mb-4">
          <FiEdit
            className="hover:text-slate-300 p-1 text-slate-400 rounded-lg cursor-pointer"
            size={30}
            onClick={() => {
              setIsEditBoardTitle(true);
              setEditingListId(null);
            }}
          />

          <FiTrash2
            size={26}
            className="text-slate-400 hover:text-red-500 cursor-pointer shrink-0"
            onClick={() => setDisplayConfrimDelete(true)}
          />
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center md:items-start md:flex-row gap-4 overflow-x-auto">
          {lists.map((list) => (
            <DisplayList
              key={list.id}
              list={list}
              cards={cards.filter((c) => c.listId === list.id)}
              setLists={setLists}
              setCards={setCards}
              editingListId={editingListId}
              setEditingListId={setEditingListId}
            />
          ))}

          {isAddListOpen ? (
            <div className="relative">
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddList();
                  if (e.key === "Escape") {
                    setIsAddListOpen(false);
                  }
                }}
                placeholder="Title of the list"
                className="w-72 h-fit md:mt-2 px-3 py-2 mb-2 rounded-lg bg-slate-800 text-slate-200 outline-none ring-2 ring-blue-500"
              />

              <AiOutlineCheck
                className="absolute right-10  md:right-8 top-[21px] md:top-[27px] -translate-y-1/2 text-green-600 cursor-pointer"
                size={20}
                onClick={() => {
                  handleAddList();
                }}
              />

              <AiOutlineClose
                className="absolute right-4 md:right-2 top-[21px] md:top-[27px] -translate-y-1/2 text-red-600 cursor-pointer"
                size={20}
                onClick={() => {
                  setIsAddListOpen(false);
                  setTitle("");
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsAddListOpen(true)}
              className="w-72 shrink-0 h-fit bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl p-3 transition text-left"
            >
              {" "}
              + Add another list{" "}
            </button>
          )}
        </div>
      </DragDropContext>

      {displayConfrimDelete && (
        <ConfrimDelete
          onClose={() => {
            setDisplayConfrimDelete(false);
          }}
          label="Board"
          DeleteFn={() => handleDeleteBoard()}
        />
      )}
    </div>
  );
}
