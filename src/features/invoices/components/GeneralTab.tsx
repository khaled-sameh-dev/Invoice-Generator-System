import {  useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientSelectionProvider } from "../context/ClientSelectionContext";
import SelectClientInput from "./SelectClientInput";
import NewClientInputs from "./NewClientInputs";
import { useFormContext } from "react-hook-form";
import FormInput from "../../../components/shared/FormInput";
import { faPen } from "@fortawesome/free-solid-svg-icons";

function GeneralTab() {
  const [showNewClient, setShowNewClient] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const {
    formState: { errors },
    register,
  } = useFormContext();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleToggle = () => {
    setIsVisible(false);

    setTimeout(() => {
      setShowNewClient((prev) => !prev);
      setIsVisible(true);
    }, 400);
  };

  return (
    <div className="">
      <h3 className="font-bold mb-5">Invoice Information</h3>
      <div className="mb-8 w-full">
        <div className="flex items-center justify-between">
          <label
            htmlFor="bitllTo"
            className="font-medium text-slate-800/80 ml-1"
          >
            Bill To
          </label>
          <button
            type="button"
            onClick={handleToggle}
            className="text-sm cursor-pointer mr-1 text-cyan-600 hover:text-slate-800"
          >
            {!showNewClient ? (
              <p className="flex items-center gap-1 ">
                <FontAwesomeIcon icon={"circle-plus"} className="text-sm" />
                Add New Client
              </p>
            ) : (
              <p className="flex items-center gap-1 ">
                <FontAwesomeIcon icon={"sort"} className="text-sm" />
                Select Client
              </p>
            )}
          </button>
        </div>
        <ClientSelectionProvider>
          <div
            className={`max-h-[500px] border-[1px] border-black/20 rounded-md transition-transform duration-500 ease-in-out transform origin-top ${
              isVisible ? "scale-y-100" : "scale-y-2"
            }`}
          >
            {showNewClient ? (
              <NewClientInputs onClose={handleToggle} />
            ) : (
              <SelectClientInput />
            )}
          </div>
        </ClientSelectionProvider>
        {errors.client && (
          <p className="mt-1 text-sm text-red-600">
            {errors.client.message?.toString()}
          </p>
        )}
      </div>
      <FormInput label="Invoice Number" inputName="number">
        <div
          className={`overflow-hidden rounded-lg border-[1px] border-black/10 ${
            errors.number && "border-red-500/40"
          } flex items-center justify-between shadow-xs pl-4 ${
            !isEditable ? "bg-neutral-100" : ""
          }`}
        >
          <span className="mr-1 text-slate-800/40 ">#</span>
          <input
            {...register("number")}
            readOnly={!isEditable}
            className={`outline-none w-full my-1 ${
              !isEditable ? "text-slate-800/40" : "text-slate-800"
            }`}
          />
          <button
            type="button"
            onClick={() => setIsEditable((prev) => !prev)}
            className={`bg-neutral-100 px-3 py-1 text-center cursor-pointer ${
              !isEditable ? "bg-white" : ""
            }`}
          >
            <FontAwesomeIcon icon={faPen} className="text-sm" />
          </button>
        </div>
      </FormInput>
      <FormInput label="Project Title" inputName="title">
        <input
        type="text"
          {...register("title")}
          className={`rounded-lg border-[1px] border-black/10 ${
            errors.title && "border-red-500/40"
          } shadow-xs px-4 py-1 w-full outline-none`}
        />
      </FormInput>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Isuue Date" inputName="date">
          <input
            type="date"
            readOnly={true}
            {...register("date")}
            className={`rounded-lg border-[1px] border-black/10 ${
              errors.date && "border-red-500/40"
            } shadow-xs px-4 py-1 w-full outline-none bg-neutral-100 text-slate-800/80`}
          />
        </FormInput>
        <FormInput label="Due Date" inputName="dueDate">
          <input
            type="date"
            {...register("dueDate")}
            className={`rounded-lg border-[1px] border-black/10 ${
              errors.ddueDate && "border-red-500/40"
            } shadow-xs px-4 py-1 w-full outline-none`}
          />
        </FormInput>
      </div>

      <FormInput label="Notes" inputName="notes">
        <textarea
          {...register("notes")}
          rows={4}
          placeholder="Write notes about the invoice..."
          className={`rounded-lg border-[1px] border-black/10 ${
            errors.notes && "border-red-500/40"
          } shadow-xs px-4 py-1 w-full outline-none resize-none`}
        />
      </FormInput>
    </div>
  );
}

export default GeneralTab;
