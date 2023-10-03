export interface TransactionDatas {
  id: number,
  title: string,
  type: number,
  category: number,
  who: number,
  account: number,
  amount: number,
  description: string,
  author: number,
  date: string
  results: TransactionData[],
  responseStatus: string | null
}

export type TransactionData = {
  id: number,
  title: string,
  type: number,
  category: number,
  who: number,
  account: number,
  amount: number,
  description: string,
  author: number,
  date: string
};

export interface APIResponse {
  results: TransactionData[]
  }