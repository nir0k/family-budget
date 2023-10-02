// export interface DailyPrices {
// total: number,
// offset: number,
// results: DailyPrice[],
// responseStatus: string | null
// }
// export interface DailyPrice {
// date: string,
// open: number,
// high: number,
// low: number,
// title: number,
// volume: number
// }
// export interface APIResponse {
//     results: DailyPrice[]
// }

  
export interface Transaction {
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
}

export interface APIResponse {
    results: Transaction[]
}  
    