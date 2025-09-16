export interface CashEntry {
  id: string;
  type: 'jobb' | 'lotter' | 'pant' | 'böter' | 'utgift';
  amount: number;
  date: string;
  description: string;
}
