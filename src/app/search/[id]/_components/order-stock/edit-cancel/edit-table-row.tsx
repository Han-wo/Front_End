import CheckButton from "@/components/common/check-button";
import { LimitPriceOrderHistory } from "@/types/transaction";
import cn from "@/utils/cn";
import { getKoreanPrice } from "@/utils/price";

interface EditTableBodyProps {
  data: LimitPriceOrderHistory;
  isChecked: boolean;
  toggleSelection: (orderId: string) => void;
}

export default function EditTableRow({
  data,
  isChecked,
  toggleSelection,
}: EditTableBodyProps) {
  return (
    <tr
      className="border-b border-solid text-center text-14-500"
      key={data.OrderId}
    >
      <td className="py-12 pl-10">
        <CheckButton
          isChecked={isChecked}
          onChange={() => toggleSelection(data.OrderId.toString())}
        />
      </td>
      <td className=" py-10 pl-20 text-left">
        <div className="pb-6 text-12-400">
          <span
            className={cn(
              "pr-3",
              data.type === "매수" && "text-red-500",
              data.type === "매도" && "text-blue-500",
            )}
          >
            {data.type} 정정
          </span>
          <span className="text-gray-500">{data.OrderId}</span>
        </div>
        {data.stockName}
      </td>
      <td>{data.remainCount}</td>
      <td>{data.stockCount}</td>
      <td>{getKoreanPrice(data.buyPrice)}원</td>
    </tr>
  );
}
