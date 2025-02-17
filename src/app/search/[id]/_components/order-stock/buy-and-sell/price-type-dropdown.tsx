import Dropdown from "@/components/common/dropdown";

import { PriceType, TradeType } from "../../../types";

interface PriceTypeDropdownProps {
  orderType: TradeType;
  priceType: PriceType;
  setPriceType: (newPriceType: PriceType) => void;
}
export default function PriceTypeDropdown({
  orderType,
  priceType,
  setPriceType,
}: PriceTypeDropdownProps) {
  return (
    <div className="flex gap-8">
      {orderType === TradeType.Edit ? (
        <span className="mb-4 grow rounded-2 border border-solid border-gray-100 p-13 text-left">
          지정가
        </span>
      ) : (
        <Dropdown
          selectedValue={priceType}
          onSelect={(value) => setPriceType(value as PriceType)}
          className="flex-1"
        >
          <Dropdown.Toggle>{priceType}</Dropdown.Toggle>
          <Dropdown.Wrapper>
            <Dropdown.Item value="지정가">지정가</Dropdown.Item>
            <Dropdown.Item value="현재가">현재가</Dropdown.Item>
          </Dropdown.Wrapper>
        </Dropdown>
      )}
      <span className="mb-4 w-100 rounded-2 border border-solid border-gray-100 p-13">
        시장가
      </span>
    </div>
  );
}
