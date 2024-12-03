export interface ChartDTO {
  date: string;
  endPrice: string;
  highPrice: string;
  lowPrice: string;
  prevPrice: string;
}

export interface ChartResponse {
  chartDTOS: ChartDTO[];
}

export interface VolumeDTO {
  date: string;
  cumulativeVolume: string;
  changeDirection: "increase" | "decrease";
}

export interface VolumeResponse {
  dtoList: VolumeDTO[];
}

export type PeriodType = "day" | "week" | "month";

export interface StockInfo {
  stockName: string;
  stockPrice: string;
  previousStockPrice: string;
  contrastRatio: string;
  highStockPrice: string;
  lowStockPrice: string;
}