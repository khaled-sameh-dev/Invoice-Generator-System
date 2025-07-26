import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CreateInvoiceForm from "../features/invoices/components/CreateInvoiceForm";
import {
  invoiceSchema,
  type Invoice,
} from "../features/invoices/schemas/invoice";
import { getDueDateISO, getTodayISO } from "../utils/manageDate";
import InvoiceTempelate from "../features/invoices/components/InvoiceTempelate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faShare } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../app/hooks";
import { createNewInvoice } from "../features/invoices/invoicesThunk";

function NewInvoice() {
  const methods = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      title: "",
      number: "",
      date: getTodayISO(),
      dueDate: getDueDateISO(),
      status: "draft",
      client: {
        id: "",
        name: "",
        phone: "",
        email: "",
      },
      services: [],
      currency: "USD",
      taxRate: 0,
      discountType: "fixed",
      discount: 0,
      notes: "",
      subtotal: 0,
      taxTotal: 0,
      total: 0,
    },
  });
  const dispatch = useAppDispatch();

  const onSubmit = (data: Omit<Invoice, "id">) => {
    console.log(data);
    if (!data.client.id) {
      console.error("Client ID is missing!");
      return;
    }
    dispatch(createNewInvoice(data));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="">
        <div className="px-4 text-slate-800 h-full my-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold ">Create Invoice</h1>
              <p className=" text-slate-800/80">
                Generate and manage customer invoices quickly and accuratly
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="outline-none border border-black/20 rounded px-3 py-1 cursor-pointer hover:scale-105 transition-all duration-300 "
              >
                <FontAwesomeIcon icon={faSave} className="mr-1" />
                Safe As Draft
              </button>
              <button
                type="button"
                className="outline-none bg-cyan-600 rounded px-3 py-1 cursor-pointer hover:bg-cyan-800 text-white transition-all duration-300 "
              >
                <FontAwesomeIcon icon={faShare} className="mr-1" />
                Send Email
              </button>
            </div>
          </div>
          <div className="p-3 bg-neutral-100  rounded-xl shadow-xs grid grid-cols-1 lg:grid-cols-(--equal-cols) xl:grid-cols-(--main-cols) gap-4">
            <CreateInvoiceForm />
            <InvoiceTempelate />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default NewInvoice;
