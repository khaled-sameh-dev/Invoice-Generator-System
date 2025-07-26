import { useFormContext } from "react-hook-form";
import { useClientSelection } from "../context/ClientSelectionContext";
import { clientSchema } from "../../clients/schemas/clientSchema";
import { useState } from "react";
import { type Invoice } from "../schemas/invoice";
import { nanoid } from "@reduxjs/toolkit";

interface Props {
  onClose: () => void;
}

function NewClientInputs({ onClose }: Props) {
  const {
    getValues,
    formState: { errors },
    register,
  } = useFormContext<Invoice>();
  const { saveNewClient } = useClientSelection();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleAddClient = () => {
    const clientData = getValues("client");
    const parseResult = clientSchema.safeParse({
      ...clientData,
      isTemp: true,
      id: nanoid(),
    });
    if (!parseResult.success) {
      setLocalError(parseResult.error.message || "");
      return;
    }

    saveNewClient(clientData);

    setLocalError(null);
    onClose();
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="w-full flex flex-col mb-3">
        <label
          htmlFor="client.name"
          className="font-medium text-slate-800/80 ml-1"
        >
          Client Name
        </label>
        <input
          {...register("client.name")}
          className={`rounded-lg border-[1px] border-black/10 shadow-xs px-4 py-1 w-full outline-none ${
            errors.client?.name && "border-red-500/40"
          }`}
          placeholder="ex. Ahmed"
        />
        {errors.client?.name?.message && (
          <p className="text-red-500 ml-4">
            {String(errors.client.name.message)}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-1 mb-3">
        <label
          htmlFor="client.address"
          className="font-medium text-slate-800/80 ml-1"
        >
          Client Address
        </label>
        <input
          {...register("client.address")}
          className={`rounded-lg border-[1px] border-black/10 shadow-xs px-4 py-1 w-full outline-none ${
            errors.client?.address && "border-red-500/40"
          }`}
          placeholder="ex. Warraq, Giza"
        />
        {errors.client?.address?.message && (
          <p className="text-red-500 ml-4">
            {String(errors.client.address.message)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="w-full flex flex-col gap-1 mb-3">
          <label htmlFor="client.email" className="text-slate-800/80 ml-1">
            Client Email
          </label>
          <input
            {...register("client.email")}
            className={`rounded-lg border-[1px] border-black/10 shadow-xs px-4 py-1 w-full outline-none ${
              errors.client?.address && "border-red-500/40"
            }`}
            placeholder="ex.Ahmed1@example.com"
          />
          {errors.client?.email?.message && (
            <p className="text-red-500 ml-4">
              {String(errors.client.email.message)}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-1 mb-3">
          <label
            htmlFor="client.phone"
            className="font-medium text-slate-800/80 ml-1"
          >
            Client Phone
          </label>
          <input
            {...register("client.phone")}
            className={`rounded-lg border-[1px] border-black/10 shadow-xs px-4 py-1 w-full outline-none ${
              errors.client?.address && "border-red-500/40"
            }`}
            placeholder="ex.01012345678"
          />
          {errors.client?.phone?.message && (
            <p className="text-red-500 ml-4">
              {String(errors.client.phone.message)}
            </p>
          )}
        </div>
      </div>
      {localError && (
        <p className="text-red-500 text-sm my-2">{localError.toString()}</p>
      )}
      <button
        type="button"
        className="w-full bg-cyan-700 text-white rounded py-2"
        onClick={handleAddClient}
      >
        Add
      </button>
    </div>
  );
}

export default NewClientInputs;
