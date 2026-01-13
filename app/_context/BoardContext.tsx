"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* ---------- TYPES ---------- */

type Board = {
  id: number;
  title: string;
  userId: number;
};

type User = {
  id: number;
  email: string;
  password: string;
  name?: string;
};

type UseBoardsContext = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  updateBoardTitle: (boardId: number, title: string) => Board | undefined;
  createBoard: (title: string) => Board | undefined;
  activeBoard: number | null;
  setActiveBoard: React.Dispatch<React.SetStateAction<number | null>>;
  deleteBoard: (boardId: number) => boolean;
};

const BoardContext = createContext<UseBoardsContext | undefined>(undefined);

function safeJSONParse<T>(value: string | null): T | null {
  try {
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = safeJSONParse<User>(
      localStorage.getItem("currentuser")
    );

    if (!storedUser) return;

    setUser(storedUser);

    const allBoards =
      safeJSONParse<Board[]>(localStorage.getItem("boards")) ?? [];

    const userBoards = allBoards.filter(
      (board) => board.userId === storedUser.id
    );

    setBoards(userBoards);
    setActiveBoard(userBoards[0]?.id ?? null);
  }, []);


  function updateBoardTitle(
    boardId: number,
    title: string
  ): Board | undefined {
    let updatedBoard: Board | undefined;

    setBoards((prev) => {
      const next = prev.map((b) => {
        if (b.id === boardId) {
          updatedBoard = { ...b, title };
          return updatedBoard;
        }
        return b;
      });

      localStorage.setItem("boards", JSON.stringify(next));
      return next;
    });

    return updatedBoard;
  }

  function createBoard(title: string): Board | undefined {
    if (!user) return;

    const allBoards =
      safeJSONParse<Board[]>(localStorage.getItem("boards")) ?? [];

    const newBoard: Board = {
      id: Date.now(),
      title: title.trim(),
      userId: user.id,
    };

    const updated = [...allBoards, newBoard];
    localStorage.setItem("boards", JSON.stringify(updated));

    setBoards((prev) => [...prev, newBoard]);
    setActiveBoard(newBoard.id);

    return newBoard;
  }

  function deleteBoard(boardId: number): boolean {
    const allBoards =
      safeJSONParse<Board[]>(localStorage.getItem("boards")) ?? [];

    const updated = allBoards.filter((b) => b.id !== boardId);

    localStorage.setItem("boards", JSON.stringify(updated));
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
    setActiveBoard(updated[0]?.id ?? null);

    return true;
  }

  return (
    <BoardContext.Provider
      value={{
        boards,
        setBoards,
        updateBoardTitle,
        createBoard,
        activeBoard,
        setActiveBoard,
        deleteBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

/* ---------- HOOK ---------- */

export function useBoards(): UseBoardsContext {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoards must be used within BoardProvider");
  }
  return context;
}
