import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { InvoiceItem } from "../schemas/service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDollarSign, faPercent } from "@fortawesome/free-solid-svg-icons";

function PaymentTab() {
  const { control, setValue, register } = useFormContext();
  const [showCurrencies, setShowCurrencies] = useState<boolean>(false);
  const services = useWatch({ control, name: "services" });
  const currency = useWatch({ control, name: "currency" });
  const taxRate = useWatch({ control, name: "taxRate" });
  const discountType = useWatch({ control, name: "discountType" });
  const discount = useWatch({ control, name: "discount" });

  // Move the function to the top to avoid reference error
  const convertCurrency = (amount: number, from: string, to: string) => {
    const rates: Record<string, number> = {
      USD: 1,
      EGP: 50,
    };
    if (from === to) return amount;
    return (amount / rates[from]) * rates[to];
  };

  const subtotal = useMemo(() => {
    return (
      services?.reduce((sum: number, item: InvoiceItem) => {
        const amount =
          item.currency === currency
            ? item.amount
            : convertCurrency(item.amount, item.currency, currency);
        return sum + (amount || 0);
      }, 0) || 0
    );
  }, [services, currency]);

  const taxTotal = useMemo(() => {
    return (subtotal * (taxRate || 0)) / 100;
  }, [subtotal, taxRate]);

  const discountAmount = useMemo(() => {
    if (discountType === "percentage") {
      return (subtotal * (discount || 0)) / 100;
    }
    return discount || 0;
  }, [discountType, discount, subtotal]);

  const total = useMemo(() => {
    return subtotal + taxTotal - discountAmount;
  }, [subtotal, taxTotal, discountAmount]);

  useEffect(() => {
    setValue("subtotal", subtotal);
    setValue("taxTotal", taxTotal);
    setValue("total", total);
  }, [subtotal, taxTotal, total, setValue]);

  return (
    <div className="p-4">
      <h3 className="font-bold text-lg mb-4">Total Summary</h3>

      {/* Currency Selection */}
      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm text-gray-600">All prices are calculated in:</p>
        <div className="relative w-20">
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <>
                <div
                  onClick={() => setShowCurrencies(!showCurrencies)}
                  className="flex items-center justify-between border rounded px-3 py-1 cursor-pointer hover:bg-gray-50"
                >
                  <span>{field.value}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {showCurrencies && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                    {["USD", "EGP"].map((curr) => (
                      <div
                        key={curr}
                        onClick={() => {
                          field.onChange(curr);
                          setShowCurrencies(false);
                        }}
                        className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                          field.value === curr ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        {curr}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          />
        </div>
      </div>

      {/* Summary Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium">
            {currency} {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Tax Rate:</span>
            <input
              type="number"
              {...register("taxRate", { valueAsNumber: true })}
              className="w-16 border rounded px-2 py-1 text-right"
              min="0"
              max="100"
              step="0.1"
            />
            <span>%</span>
          </div>
          <span className="font-medium">
            {currency} {taxTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Discount:</span>
            <div className="flex border rounded overflow-hidden">
              <input
                type="number"
                {...register("discount", { valueAsNumber: true })}
                className="w-16 px-2 py-1 text-right outline-none"
                min="0"
              />
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setValue("discountType", "fixed")}
                  className={`px-2 py-1 ${
                    discountType === "fixed"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faDollarSign} className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setValue("discountType", "percentage")}
                  className={`px-2 py-1 ${
                    discountType === "percentage"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <FontAwesomeIcon icon={faPercent} className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          <span className="font-medium text-red-500">
            -{currency} {discountAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">
            {currency} {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PaymentTab;
