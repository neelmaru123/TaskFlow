"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useBoards } from "../_context/BoardContext";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

type Board = {
  id: number | string;
  title: string | { title: string };
  userId: number;
};

function DashboardSidebar() {
  const [isAddBoardOpen, setIsAddBoardOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { boards, createBoard, activeBoard, setActiveBoard } = useBoards();

  useEffect(() => {
    if (isAddBoardOpen) {
      inputRef.current?.focus();
    }
  }, [isAddBoardOpen]);

  function handleAddBoard() {
    if (!title.trim()) {
      setIsAddBoardOpen(false);
      return;
    }

    const newBoard = createBoard(title);
    setIsAddBoardOpen(false);
    setTitle("");
    setActiveBoard(Number(newBoard.id));
  }

  return (
    <div className="hidden md:flex md:flex-col w-64 min-h-screen bg-slate-950 border-r border-slate-800 ">
      {/* Boards */}
      <ul className="flex-1 px-3 py-4 space-y-2">
        {boards.map((board: Board) => (
          <li key={board.id}>
            <Link
              onClick={() =>
                setActiveBoard(Number(board.id))
              }
              href={`/dashboard/board/${board.id}`}
              className={`group gap-3 px-3 py-2 rounded-lg text-slate-300 flex items-center bg-slate-700 hover:bg-slate-800 hover:text-white transition ${
                activeBoard === board.id ? "bg-slate-800 text-white" : ""
              }`}
            >
              <span className="text-sm font-medium">
                {typeof board.title === "string"
                  ? board.title
                  : board.title.title}
              </span>
            </Link>
          </li>
        ))}

        {isAddBoardOpen ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              onBlur={handleAddBoard}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") handleAddBoard();
                if (e.key === "Escape") {
                  setIsAddBoardOpen(false);
                  setTitle("");
                }
              }}
              placeholder="Title of the board"
              className="w-full px-3 py-2 text-sm font-medium rounded-lg text-slate-200 bg-slate-800 outline-none ring-2 ring-blue-500"
            />

            <AiOutlineCheck
              className="absolute right-8 top-1/2 -translate-y-1/2 text-green-600 cursor-pointer"
              size={20}
              onClick={handleAddBoard}
            />

            <AiOutlineClose
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 cursor-pointer"
              size={20}
              onClick={() => {
                setIsAddBoardOpen(false);
                setTitle("");
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setIsAddBoardOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-800 text-slate-200 hover:border-slate-700 transition"
          >
            + Create Board
          </button>
        )}
      </ul>
    </div>
  );
}

export default DashboardSidebar;
