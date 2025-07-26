import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  invoiceSchema,
  type Invoice,
} from "../features/invoices/schemas/invoice";
import { getDueDateISO, getTodayISO } from "../utils/manageDate";
import InvoiceTempelate from "../features/invoices/components/InvoiceTempelate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faShare } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateInvoice } from "../features/invoices/invoicesThunk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectInvoiceById } from "../features/invoices/invoiesSlice";
import CreateInvoiceForm from "../features/invoices/components/CreateInvoiceForm";

function EditInvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if (!id) {
      setError("Invoice ID not specified");
      setLoading(false);
      return;
    }

    setInvoiceId(id);
    setLoading(false);
  }, [location]);

  const invoice = useAppSelector((state) =>
    invoiceId ? selectInvoiceById(state, invoiceId) : undefined
  );

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

  useEffect(() => {
    if (invoice) {
      methods.reset(invoice);
    }
  }, [invoice, methods]);

  const onSubmit = (data: Invoice) => {
    if (!invoiceId) {
      setError("Invoice ID not specified");
      return;
    }

    if (!data.client.id) {
      setError("Client ID is missing!");
      return;
    }

    dispatch(updateInvoice({ ...data, id: invoiceId }));

    if (status === "draft") {
      navigate(`/invoices/edit?id=${invoiceId}`);
    } else {
      navigate(`/`);
    }

  };

  if (loading) {
    return <div className="p-8 text-center">Loading invoice data...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">Invoice not found</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="">
        <div className="px-4 text-slate-800 h-full my-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold ">Edit Invoice</h1>
              <p className=" text-slate-800/80">
                Edit invoice details quickly and accurately
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="outline-none border border-black/20 rounded px-3 py-1 cursor-pointer hover:scale-105 transition-all duration-300 "
              >
                <FontAwesomeIcon icon={faSave} className="mr-1" />
                Save Changes
              </button>
              <button
                type="button"
                className="outline-none bg-cyan-600 rounded px-3 py-1 cursor-pointer hover:bg-cyan-800 text-white transition-all duration-300 "
              >
                <FontAwesomeIcon icon={faShare} className="mr-1" />
                Send by Email
              </button>
            </div>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl shadow-xs grid grid-cols-1 lg:grid-cols-(--equal-cols) xl:grid-cols-(--main-cols) gap-4">
            <CreateInvoiceForm />
            <InvoiceTempelate />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default EditInvoicePage;
