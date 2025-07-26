import {
  Controller,
  useFormContext,
  useWatch,
  type FieldErrors,
} from "react-hook-form";
import type { serviceType } from "./ServicesTab";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectProducts } from "../../products/productsSlice";
import { fetchProducts } from "../../products/productsThunks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faChevronDown,
  faCog,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import type { Product } from "../../products/productSchema";
import type { Invoice } from "../schemas/invoice";

interface ServiceBoxProps {
  onRemove: () => void;
  idx: number;
}

function ServiceBox({ onRemove, idx }: ServiceBoxProps) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const { data: products, status } = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();
  const [showProducts, setShowProducts] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showCurrencies, setShowCurrencies] = useState<boolean>(false);

  const type: serviceType = useWatch({
    name: `services.${idx}.type`,
  });
  const description = useWatch({
    name: `services.${idx}.description`,
  });
  const productId = useWatch({
    name: `services.${idx}.productId`,
  });
  const quantity = useWatch({
    name: `services.${idx}.quantity`,
  });
  const price = useWatch({
    name: `services.${idx}.price`,
  });
  const currency = useWatch({
    name: `services.${idx}.currency`,
  });

  useEffect(() => {
    if (type === "item" && status === "idle") {
      dispatch(fetchProducts());
    }
  }, [type, status, dispatch]);

  const changeCurrency = useCallback(() => {
    const prevCurrency = currency;
    const newCurrency = prevCurrency === "USD" ? "EGP" : "USD";

    const prevPrice = price;
    const newPrice = prevCurrency === "USD" ? prevPrice * 50 : prevPrice / 50;

    setValue(`services.${idx}.currency`, newCurrency, {
      shouldValidate: true,
    });
    setValue(`services.${idx}.price`, newPrice, { shouldValidate: true });
  }, [idx, setValue, currency, price]);

  const amount = useMemo(() => {
    return (price || 0.1) * (quantity || 1);
  }, [price, quantity]);

  useEffect(() => {
    setValue(`services.${idx}.amount`, amount);
  }, [amount, idx, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowProducts(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const handleSelectProduct = (product: Product) => {
    setValue(`services.${idx}.description`, product.name, {
      shouldValidate: true,
    });
    setValue(`services.${idx}.productId`, product.id, { shouldValidate: true });
    setValue(`services.${idx}.price`, product.price);
    setShowProducts(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    setValue(`services.${idx}.description`, "", { shouldValidate: true });
    setValue(`services.${idx}.productId`, "", { shouldValidate: true });
    setValue(`services.${idx}.price`, 0);
    setSearchTerm("");
    setShowProducts(true);
  };

  const handleInputFocus = () => {
    if (products.length > 0) {
      setShowProducts(true);
    }
    if (productId) {
      setSearchTerm("");
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setValue(`services.${idx}.price`, value, { shouldValidate: true });
  };
  const handlequantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setValue(`services.${idx}.quantity`, value, { shouldValidate: true });
  };

  const itemErrors = (errors as FieldErrors<Invoice>)?.services?.[idx] || {};

  return (
    <div className=" bg-white  shadow-lg rounded-lg w-full py-4 px-3">
      {itemErrors.productId && (
        <p className="text-red-500 text-sm mb-2">
          {itemErrors.productId.message}
        </p>
      )}
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-semibold">
          {type === "item" ? (
            <FontAwesomeIcon icon={faBox} />
          ) : (
            <FontAwesomeIcon icon={faCog} />
          )}
        </h4>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-900 cursor-pointer"
        >
          <FontAwesomeIcon icon="trash" />
        </button>
      </div>

      {type === "item" ? (
        <div>
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 mb-2 w-full rounded border border-gray-300 py-1 px-2">
              <FontAwesomeIcon icon={faBox} className="text-gray-500" />
              <input
                type="text"
                value={searchTerm || description || ""}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowProducts(true);
                }}
                onFocus={handleInputFocus}
                placeholder={description ? description : "Search Product..."}
                className="w-full outline-0 border-none"
              />
              {description ? (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-sm" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowProducts((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faChevronDown} className="text-sm" />
                </button>
              )}
            </div>

            {showProducts && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                {status === "loading" ? (
                  <p className="p-2">Loading products...</p>
                ) : status === "failed" ? (
                  <p className="text-red-500 p-2">Failed to load products</p>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <FontAwesomeIcon icon={faBox} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-xs text-gray-500">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-gray-500">No products found</p>
                )}
              </div>
            )}
          </div>
          {itemErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.description.message}
            </p>
          )}
        </div>
      ) : (
        <div>
          <input
            {...register(`services.${idx}.description`)}
            placeholder="Enter Service Description..."
            className="rounded border border-gray-300 py-1 px-2 w-full outline-none"
          />
          {itemErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.description.message}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <div className="flex flex-col">
          <label htmlFor={`services.${idx}.price`}>Price</label>
          <input
            type="number"
            step={currency === "USD" ? "0.01" : "0.1"}
            {...register(`services.${idx}.price`, { valueAsNumber: true })}
            onChange={handlePriceChange}
            readOnly={type === "item"}
            className={`rounded border ${
              itemErrors.price ? "border-red-500" : "border-gray-300"
            } py-1 px-2 w-full outline-none`}
          />
          {itemErrors.price && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.price.message}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor={`services.${idx}.quantity`}>QTY</label>
          <input
            type="number"
            {...register(`services.${idx}.quantity`, { valueAsNumber: true })}
            onChange={handlequantityChange}
            className={`rounded border ${
              itemErrors.price ? "border-red-500" : "border-gray-300"
            } py-1 px-2 w-full outline-none`}
          />
          {itemErrors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.quantity.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-5">
        <div>
          <p className="flex items-center gap-3">
            Amount:
            <span className="font-semibold">{amount.toFixed(2)}</span>
            <span className="text-sm">{currency === "USD" ? "$" : "EGP"}</span>
          </p>
          {itemErrors.amount && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.amount.message}
            </p>
          )}
        </div>
        <div className="max-w-[50px]">
          <Controller
            name={`services.${idx}.currency`}
            control={control}
            render={({ field, fieldState }) => (
              <div className="relative ">
                <input
                  type="text"
                  value={field.value}
                  readOnly
                  onFocus={() => setShowCurrencies((prev) => !prev)}
                  className={`rounded border ${
                    fieldState.error ? "border-red-500" : "border-gray-300"
                  } py-1 px-2 w-full outline-none`}
                />
                {showCurrencies ? (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                    {["EGP", "USD"].map((curr) => (
                      <li
                        key={curr}
                        onClick={() => {
                          setShowCurrencies(false);
                          changeCurrency();
                        }}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1"
                      >
                        {curr}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </div>
            )}
          />
          {itemErrors.currency && (
            <p className="text-red-500 text-sm mt-1">
              {itemErrors.currency.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceBox;
