import type { Card, CreateCardInput} from "@/app/_services/types";


// export type CardInput = {
//   listId: number;
//   title: string;
//   description?: string;
//   dueDate?: string;
//   labels: number[];
// };


export function getCardsByListId(listId: number | string): Card[] {
  const cards = JSON.parse(localStorage.getItem("cards")) as Card[] || [];
  return cards.filter((card : Card) => card.listId === Number(listId));
}

export function createCard(cardInput: CreateCardInput): boolean {
  const cards: Card[] = getAllCards();
  const newCard: Card = {
    id: Math.floor(Date.now() + Math.random()),
    createdAt: String(Date.now()),
    completed: false,
    ...cardInput,
    listId: Number(cardInput.listId),
  };

  cards.push(newCard);
  localStorage.setItem("cards", JSON.stringify(cards));

  return true;
}

export function updateCard(
  cardId: number | string,
  updatedData: Partial<Card>
): boolean {
  const cards: Card[] = getAllCards();
  const cardIndex = cards.findIndex((card) => card.id === Number(cardId));

  if (cardIndex !== -1) {
    cards[cardIndex] = { ...cards[cardIndex], ...updatedData };
    localStorage.setItem("cards", JSON.stringify(cards));
    return cards[cardIndex] ? true : false;
  }

  return false;
}

export function deleteCard(cardId: number | string): void {
  let cards: Card[] = getAllCards();
  cards = cards.filter((card) => card.id !== Number(cardId));
  localStorage.setItem("cards", JSON.stringify(cards));
}

export function completeTask(
  cardId: number | string,
  updatedData: Partial<Pick<Card, "completed">>
): boolean {
  try {
    return updateCard(cardId, updatedData);
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function getAllCards(): Card[] {
  const cards: Card[] = JSON.parse(localStorage.getItem("cards") || "[]") as Card[];
  return cards;
}
