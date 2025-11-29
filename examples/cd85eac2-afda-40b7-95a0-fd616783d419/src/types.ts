export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export type Category = {
  id: string;
  name: string;
  icon: string;
}