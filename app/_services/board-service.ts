interface Board {
  id: number;
  title: string;
}

export function getAllBoards(): Board[] {
  const boards = JSON.parse(localStorage.getItem("boards")) as Board[] || [];
  return boards;
}

export function getBoardById(boardId: number | string): Board | undefined {
  const boards = JSON.parse(localStorage.getItem("boards")) as Board[] || [];
  return boards.find((board: Board) => board.id === Number(boardId));
}

export function createBoard(title: string): Board {
  const boards = JSON.parse(localStorage.getItem("boards")) as Board[] || [];
  const newBoard = {
    id: Math.floor(Date.now() + Math.random()),
    title,
  };
  boards.push(newBoard);
  localStorage.setItem("boards", JSON.stringify(boards));
  return newBoard;
}

export function updateBoard(
  boardId: number | string,
  updatedData: Partial<Pick<Board, "title">>
): Board | null {
  const boards = JSON.parse(localStorage.getItem("boards")) as Board[] || [];
  const boardIndex = boards.findIndex((board) => board.id === Number(boardId));
  if (boardIndex !== -1) {
    boards[boardIndex] = { ...boards[boardIndex], ...updatedData };
    localStorage.setItem("boards", JSON.stringify(boards));
    return boards[boardIndex];
  }
  return null;
}

export function deleteBoard(boardId: number | string): boolean {
  let boards = JSON.parse(localStorage.getItem("boards")) as Board[] || [];
  boards = boards.filter((board) => board.id !== Number(boardId));
  localStorage.setItem("boards", JSON.stringify(boards));
  return true;
}
