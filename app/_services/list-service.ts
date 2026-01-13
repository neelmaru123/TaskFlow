export type List = {
  id: number;
  boardId: number;
  name: string;
};

export function getListsByBoardId(boardId: number | string): List[] {
  const lists: List[] = JSON.parse(localStorage.getItem("lists") || "[]") as List[];
  return lists.filter((list) => list.boardId === Number(boardId));
}

export function createList(boardId: number | string, name: string): List {
  const lists: List[] = JSON.parse(localStorage.getItem("lists") || "[]") as List[];

  const newList: List = {
    id: Math.floor(Date.now() + Math.random()),
    boardId: Number(boardId),
    name,
  };

  lists.push(newList);
  localStorage.setItem("lists", JSON.stringify(lists));

  return newList;
}

export function updateList(
  listId: number | string,
  updatedData: Partial<Pick<List, "name">>
): List | null {
  const lists: List[] = JSON.parse(localStorage.getItem("lists") || "[]") as List[];

  const listIndex = lists.findIndex((list) => list.id === Number(listId));
  if (listIndex !== -1) {
    lists[listIndex] = { ...lists[listIndex], ...updatedData };
    localStorage.setItem("lists", JSON.stringify(lists));
    return lists[listIndex];
  }

  return null;
}

export function deleteList(listId: number | string): boolean {
  let lists: List[] = JSON.parse(localStorage.getItem("lists") || "[]") as List[];
  lists = lists.filter((list) => list.id !== Number(listId));
  localStorage.setItem("lists", JSON.stringify(lists));
  return true;
}
