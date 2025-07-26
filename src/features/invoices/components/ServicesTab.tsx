import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import ServiceBox from "./ServiceBox";

export type serviceType = "service" | "item";

function ServicesTab() {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const { append, fields, remove } = useFieldArray({
    control,
    name: "services",
  });

  useEffect(() => {
    console.log("Fields:", fields);
  }, []);

  const addService = (type: serviceType) => {
    const invoiceItem = {
      description: "",
      quantity: 1,
      price: 0.1,
      currency: "USD",
      amount: 0.1,
      type,
    };
    append(invoiceItem);
  };
  return (
    <div>
      <h3 className="font-bold mb-5">Serviecs and Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 max-h-[438px] overflow-auto">
        {fields.map((field, index) => (
          <ServiceBox
            key={field.id}
            onRemove={() => remove(index)}
            idx={index}
          />
        ))}
      </div>
      <div className="flex gap-4 mb-4 justify-center items-center">
        <button
          type="button"
          onClick={() => addService("service")}
          className="bg-cyan-700 text-white text-sm cursor-pointer px-2 py-1 rounded flex items-center gap-1"
        >
          <FontAwesomeIcon icon="plus" />
          Add Service
        </button>
        <button
          type="button"
          onClick={() => addService("item")}
          className="bg-cyan-700 text-white text-sm cursor-pointer px-2 py-1 rounded flex items-center gap-1"
        >
          <FontAwesomeIcon icon="plus" />
          Add Item
        </button>
      </div>
      {errors.services &&
        typeof (errors.services as any).message === "string" && (
          <p className="text-red-500">{(errors.services as any).message}</p>
        )}
    </div>
  );
}

export default ServicesTab;
