export type Card = {
  id: number;
  title: string;
  listId: number;
  completed: boolean;
  description?: string;
  labels?: number[];
  dueDate?: string;
  createdAt?: string;
};

export type CreateCardInput = Omit<Card, "id" | "createdAt" | "completed">;