import { useQuery } from "@tanstack/react-query";

import { fetchMyStocks } from "@/api/side-Info";
import { useStockInfoContext } from "@/context/stock-info-context";
import { useAuth } from "@/hooks/use-auth";
import MyStockMap from "@/utils/my-stock-count";
import { calculateBuyableQuantity, getKoreanPrice } from "@/utils/price";

import { TradeType } from "../../../types";

interface BuyableQuantityProps {
  type: TradeType;
  bidding: number;
}

export default function BuyableQuantity({
  type,
  bidding,
}: BuyableQuantityProps) {
  const { isAuthenticated, token, deposit } = useAuth();
  const { stockName } = useStockInfoContext();
  const { data: stockHoldings } = useQuery({
    queryKey: ["myStocks"],
    queryFn: () => fetchMyStocks(token!),
    enabled: !!isAuthenticated && !!token,
  });

  const stockMap = new MyStockMap(stockHoldings);
  return (
    <div className="relative flex justify-between gap-6">
      <span className="w-110">
        {type === TradeType.Buy ? "매수" : "매도"} 가능 주식
      </span>
      <div className="flex-1 cursor-not-allowed border-b border-solid border-gray-600 pb-2 text-right">
        <span className="pr-5 text-gray-200">
          {type === TradeType.Buy
            ? getKoreanPrice(calculateBuyableQuantity(deposit, bidding))
            : stockMap.findStockCount(stockName)}
        </span>
        주
      </div>
    </div>
  );
}
