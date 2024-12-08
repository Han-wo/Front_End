"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { buyAtLimitPrice, buyAtMarketPrice } from "@/api/transaction";
import { useTabsContext } from "@/components/common/tabs";
import { useStockInfoContext } from "@/context/stock-info-context";
import { useAuth } from "@/hooks/use-auth";
import { calculateTotalOrderAmount } from "@/utils/price";
import {
  BuyFormData,
  BuyFormSchema,
} from "@/validation/schema/transaction-form";

import TransactionTable from "../transaction-table";
import BuyFormButtons from "./buy-form-buttons";
import BuyableQuantity from "./buyable-quantity";
import CurrentPrice from "./current-price";
import OrderField from "./order-field";
import PriceTypeDropdown from "./price-type-dropdown";
import TotalAmount from "./total-amount";

interface TradeProps {
  type: "buy" | "sell";
}

export default function Trade({ type }: TradeProps) {
  const [priceType, setPriceType] = useState("지정가");
  const [isConfirmationPage, setIsConfirmationPage] = useState(false);
  const { setActiveTab } = useTabsContext();
  const { stockName, stockInfo } = useStockInfoContext();
  const { token } = useAuth();

  const {
    control,
    watch,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuyFormData>({
    resolver: zodResolver(BuyFormSchema),
    defaultValues: {
      count: undefined,
      bidding: undefined,
    },
  });

  const watchedCount = watch("count");
  const watchedBidding = watch("bidding");

  const handleReset = () => {
    reset({
      count: undefined,
      bidding: undefined,
    });
  };

  const handlePriceTypeChange = (newPriceType: string) => {
    setPriceType(newPriceType);
    if (newPriceType === "현재가") {
      setValue("bidding", Number(stockInfo.stockPrice));
    } else {
      setValue("bidding", 0);
    }
  };

  const handleConfirmPurchase = () => {
    setIsConfirmationPage(true);
  };

  const { mutate: buyAtMarketPriceMutate } = useMutation({
    mutationFn: buyAtMarketPrice,
    onSuccess: () => {
      setActiveTab("history");
    },
  });

  const { mutate: buyAtLimitPriceMutate } = useMutation({
    mutationFn: buyAtLimitPrice,
    onSuccess: () => {
      setActiveTab("history");
    },
  });

  const handlePurchase = () => {
    if (priceType === "현재가") {
      buyAtMarketPriceMutate({
        token,
        data: { stockName, quantity: watchedCount },
      });
    } else {
      buyAtLimitPriceMutate({
        token,
        data: { stockName, limitPrice: watchedBidding, quantity: watchedCount },
      });
    }
  };

  if (isConfirmationPage) {
    return (
      <TransactionTable
        color="red"
        submittedData={{
          stockName,
          count: watchedCount,
          bidding: watchedBidding,
          totalAmount: calculateTotalOrderAmount(watchedCount, watchedBidding),
        }}
        onClickGoBack={() => setIsConfirmationPage(false)}
        onClickConfirm={handlePurchase}
      />
    );
  }

  return (
    <div className="flex">
      <CurrentPrice />
      <div className="flex w-270 flex-col gap-16 pl-11">
        <PriceTypeDropdown
          priceType={priceType}
          setPriceType={handlePriceTypeChange}
        />
        <OrderField
          title="수량"
          type="count"
          placeholder="수량 입력"
          inputSuffix="주"
          state={watchedCount}
          setState={setValue}
          control={control}
          errors={errors.count}
        />

        <BuyableQuantity bidding={watchedBidding} type={type} />

        <OrderField
          title="호가"
          type="bidding"
          placeholder="호가 입력"
          inputSuffix="원"
          state={watchedBidding}
          setState={setValue}
          control={control}
          errors={errors.bidding}
        />
        <TotalAmount count={watchedCount} bidding={watchedBidding} />
        <BuyFormButtons
          handleReset={handleReset}
          handleSubmit={() => handleSubmit(handleConfirmPurchase)()}
        />
      </div>
    </div>
  );
}