import { useState } from "react";

import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { Client } from "../../clients/schemas/clientSchema";
import type { Currency, InvoiceItem } from "../schemas/service";
import logo from "../../../assets/40163 - Edited.jpg";

function InvoiceTemplate() {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoiceSubject = useWatch({ name: "title" });
  const customer: Client = useWatch({ name: "client" });
  const issueDate = useWatch({ name: "date" });
  const dueDate = useWatch({ name: "dueDate" });
  const currency = useWatch({ name: "currency" });
  const subtotal = useWatch({ name: "subtotal" });
  const taxRate = useWatch({ name: "taxRate" });
  const taxTotal = useWatch({ name: "taxTotal" });
  const discount = useWatch({ name: "discount" });
  const total = useWatch({ name: "total" });

  const { watch } = useFormContext();
  const invoiceNumber = watch("number");
  const services: InvoiceItem[] = watch("services");

  const currencyIconRender = (currency: Currency) => {
    if (currency == "EGP") return "EGP";
    return "$";
  };

  useEffect(() => {
    const adjustScale = () => {
      if (containerRef.current && paperRef.current) {
        const containerWidth =
          containerRef.current.getBoundingClientRect().width;
        const paperWidth = 800;

        const autoScale = Math.min((containerWidth - 32) / paperWidth, 1);

        setScale(autoScale);
      }
    };

    adjustScale();

    window.addEventListener("resize", adjustScale);
    return () => window.removeEventListener("resize", adjustScale);
  }, [containerRef]);

  return (
    <div className="rounded-xl flex flex-col h-dvh bg-neutral-100 border border-black/20 shadow-sm overflow-hidden">
      <div className="bg-white px-4 py-2 text-slate-800 flex items-center justify-between">
        <h2 className=" font-bold text-lg">Preview</h2>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden p-4 bg-neutral-100"
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            ref={paperRef}
            className="bg-white rounded-lg shadow-xl mx-auto px-6"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease-in-out",
              width: "800px",
              maxWidth: "100%",
              height: "fit-content",
            }}
          >
            <div ref={invoiceRef}>
              <div className="">
                <div className="flex justify-between items-center border-b border-b-black/10 py-4">
                  <div className="text-left">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {invoiceSubject}
                    </h1>
                    <p className="text-gray-600/60">
                      Invoiec Number: #{invoiceNumber}
                    </p>
                  </div>
                  <div className="w-10 h-10  flex items-center justify-center">
                    <img
                      src={logo}
                      alt="Company Logo"
                      className=" w-full object-contain"
                    />
                  </div>
                </div>

                <div className="py-4 border-b border-b-black/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-600/60 mb-1">
                        Billed By:
                      </h3>
                      <p className="text-slate-800 font-medium">
                        Team Develope
                      </p>
                      <p className="text-slate-600/60 text-sm ml-1">
                        789 Enterprise Avenue, Floor 2
                      </p>
                    </div>

                    <div className="text-left">
                      <h3 className="font-semibold text-slate-600/60 mb-1">
                        Billed To:
                      </h3>
                      {customer.id.length > 0 ? (
                        <div>
                          <p className="text-slate-800 font-medium">
                            {customer.name}
                          </p>
                          <p className="text-slate-600/60 text-sm ml-1">
                            {customer.address || "No Address Found"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-slate-600/60 text-sm ml-1">
                          No Client Found
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6">
                    <div className="text-left flex items-center gap-2">
                      <h3 className="font-semibold text-slate-600/60">
                        Date Issued:
                      </h3>
                      <p className="text-slate-800 font-medium">{issueDate}</p>
                    </div>
                    <div className="text-left flex items-center gap-2">
                      <h3 className="font-semibold text-slate-600/60">
                        Due Date:
                      </h3>
                      <p className="text-slate-800 font-medium">{dueDate}</p>
                    </div>
                  </div>
                </div>

                <div className="py-10 border-b border-b-black/10">
                  <div className="overflow-x-auto ">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-black/20 text-slate-600">
                          <th className="pb-2 text-left font-semibold text-sm">
                            Items/Service
                          </th>
                          <th className="pb-2 text-right font-semibold text-sm">
                            Qty
                          </th>
                          <th className="pb-2 text-right font-semibold text-sm">
                            Price
                          </th>
                          <th className="pb-2 text-right font-semibold text-sm">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.length > 0 ? (
                          services.map((item, index) => {
                            return (
                              <tr
                                key={index}
                                className="border-b border-gray-100 text-gray-800"
                              >
                                <td className="py-3 text-sm">
                                  {item.description}
                                </td>
                                <td className="text-right text-sm">
                                  {item.quantity}
                                </td>
                                <td className="text-right text-sm">
                                  {currencyIconRender(item.currency)}
                                  {item.price.toFixed(2)}
                                </td>
                                <td className="text-right text-sm">
                                  {currencyIconRender(item.currency)}
                                  {item.amount.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <td colSpan={4} className="py-4 text-center">
                            <p className="mt-2 font-semibold text-slate-600/60">
                              No Services Added
                            </p>
                          </td>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div className="w-full md:w-1/2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          {currencyIconRender(currency)}
                          {subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax ({taxRate}%):</span>
                        <span className="font-medium">
                          {currencyIconRender(currency)}
                          {taxTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium">
                          {currencyIconRender(currency)}
                          {discount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1 mt-4 border-t border-gray-200">
                        <span className="font-bold text-gray-800">Total:</span>
                        <span className="font-bold">
                          {currencyIconRender(currency)}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="py-6 border-b border-b-black/10">
                  <h4 className="font-bold text-gray-700 text-sm mb-2">
                    Notes:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>Payment is due by January 31, 2025.</li>
                    <li>
                      Include the invoice number in the payment reference.
                    </li>
                  </ul>
                </div>

                <div className="py-6 border-b border-b-black/10 text-center text-gray-500 text-sm">
                  <p className="font-medium">Flowly Finance Company, IND</p>
                  <p>(+62) 823-4567-8901</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceTemplate;
