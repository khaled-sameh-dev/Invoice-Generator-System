import { useEffect, useRef, useState } from "react";
import { Tabs } from "../../../types/navigationTabs";
import { useFormContext } from "react-hook-form";
import generateInvoiceNumber from "../../../utils/generateInvoceNumber";
import TabNavigation from "../../../components/TabNavigation";
import GeneralTab from "./GeneralTab";
import ServicesTab from "./ServicesTab";
import PaymentTab from "./PaymentTab";
import type { Invoice } from "../schemas/invoice";

function CreateInvoiceForm() {
  const { setValue, reset } =
    useFormContext<Omit<Invoice, "id">>();

  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.GENERAL);
  const alreadyGenerated = useRef(false);
  

  useEffect(() => {
    if (alreadyGenerated.current) return;

    alreadyGenerated.current = true;

    generateInvoiceNumber().then((num) => {
      setValue("number", num);
    });
  }, [setValue]);

  

  return (
    
      <div className="rounded-xl border-[1px] border-black/10 shadow-2xs overflow-hidden h-dvh">
        <div className="px-4 py-2 text-lg flex items-center justify-between bg-white text-slate-800 font-bold border-b-[1px] border-b-black/10">
          <h2 className="">Invoice Details</h2>
          <button
            type="button"
            onClick={() => reset}
            className="text-red-700/60 hover:text-red-700 cursor-pointer"
          >
            reset
          </button>
        </div>
        <div className="px-6 py-4 bg-white h-full">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab == Tabs.GENERAL && <GeneralTab />}
          {activeTab == Tabs.SERVICES && <ServicesTab />}
          {activeTab == Tabs.PAYMENT && <PaymentTab />}
        </div>
      </div>

  );
}

export default CreateInvoiceForm;
