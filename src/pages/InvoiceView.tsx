import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectInvoiceById } from "../features/invoices/invoiesSlice";
import { updateInvoice } from "../features/invoices/invoicesThunk";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faEnvelope,
  faCheck,
  faTimes,
  faArchive,
  faExclamationTriangle,
  faClock,
  faFileExport,
  faPaperPlane,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import type { InvoiceStatus } from "../features/invoices/types/InvoiceStatus";

const InvoiceView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [invoiceId, setInvoiceId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");

    if (!(id && id.length > 1)) {
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

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    if (!invoiceId || !invoice) {
      setError("Cannot update invoice status");
      return;
    }

    dispatch(
      updateInvoice({
        ...invoice,
        id: invoiceId,
        status: newStatus,
      })
    );
    setShowStatusDropdown(false);
  };

  const handleEdit = () => {
    navigate(`/invoices/edit?id=${invoiceId}`);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading invoice details...</div>;
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
          className="px-4 py-2 bg-cyan-600 text-white rounded-md"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="container mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm">
          <span className="text-gray-500">Invoice List</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">Invoice details</span>
        </div>

        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {invoice.number}
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-neutral-300 text-neutral-800 rounded-full">
                {invoice.status.charAt(0).toUpperCase() +
                  invoice.status.slice(1)}
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {invoice.currency} {invoice.total.toFixed(2).toLocaleString()} •{" "}
              {invoice.status === "paid" ? "Paid " : "Unpaid"}
            </p>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-2">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Export
            </button>
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Send Invoice
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faPen} className="mr-2" />
              Edit Invoice
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center cursor-pointer px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={faEllipsisH} />
                <span className="ml-1">More</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Status Change Dropdown */}
              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white  z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {/* Only show Mark as Sent button for draft invoices */}
                    {invoice.status === "draft" && (
                      <button
                        onClick={() => handleStatusChange("sent")}
                        className="flex items-center cursor-pointer  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="mr-2 text-indigo-600"
                        />
                        Mark as Sent
                      </button>
                    )}

                    {/* Only show Mark as Paid button for sent or pending invoices */}
                    {(invoice.status === "sent" ||
                      invoice.status === "pending") && (
                      <button
                        onClick={() => handleStatusChange("paid")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="mr-2 text-green-600"
                        />
                        Mark as Paid
                      </button>
                    )}

                    {/* Add Mark as Overdue button for sent or pending invoices past due date */}
                    {(invoice.status === "sent" ||
                      invoice.status === "pending") &&
                      new Date() > new Date(invoice.dueDate) && (
                        <button
                          onClick={() => handleStatusChange("overdue")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <FontAwesomeIcon
                            icon={faExclamationTriangle}
                            className="mr-2 text-yellow-600"
                          />
                          Mark as Overdue
                        </button>
                      )}

                    {/* Add Mark as Pending button for sent invoices */}
                    {invoice.status === "sent" && (
                      <button
                        onClick={() => handleStatusChange("pending")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon
                          icon={faClock}
                          className="mr-2 text-blue-600"
                        />
                        Mark as Pending
                      </button>
                    )}

                    {/* Add Cancel button for draft or sent invoices */}
                    {(invoice.status === "draft" ||
                      invoice.status === "sent") && (
                      <button
                        onClick={() => handleStatusChange("cancelled")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="mr-2 text-red-600"
                        />
                        Cancel Invoice
                      </button>
                    )}

                    {/* Add Archive button for paid or cancelled invoices past due date */}
                    {(invoice.status === "paid" ||
                      invoice.status === "cancelled" ||
                      invoice.status === "overdue") &&
                      new Date() > new Date(invoice.dueDate) && (
                        <button
                          onClick={() => handleStatusChange("archived")}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          <FontAwesomeIcon
                            icon={faArchive}
                            className="mr-2 text-gray-600"
                          />
                          Archive Invoice
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Invoice Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{invoice.title}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Client Information */}
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 mb-1">Client Name</p>
                      <p className="font-medium">{invoice.client.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Email Address</p>
                      <p className="font-medium">{invoice.client.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Billing Address</p>
                      <p className="font-medium text-sm">
                        {invoice.client.address}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Phone</p>
                      <p className="font-medium">{invoice.client.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Invoice Details */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Invoice Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 mb-1">Invoice Number</p>
                      <p className="font-medium">{invoice.number}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 mb-1">Issue Date</p>
                      <p className="font-medium">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 mb-1">Due Date</p>
                      <p className="font-medium">{invoice.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 mb-1">Status</p>
                      <p
                        className={`font-medium ${
                          invoice.status === "paid"
                            ? "text-green-600"
                            : invoice.status === "overdue"
                            ? "text-red-600"
                            : invoice.status === "pending"
                            ? "text-yellow-600"
                            : invoice.status === "sent"
                            ? "text-blue-600"
                            : invoice.status === "cancelled"
                            ? "text-gray-600"
                            : invoice.status === "archived"
                            ? "text-purple-600"
                            : "text-gray-900"
                        }`}
                      >
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Items Table */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Invoice Items</h3>
                <div className="grid grid-cols-5 gap-4 py-2 text-sm font-medium text-gray-600 border-b border-gray-200">
                  <div className="col-span-2">PRODUCT</div>
                  <div className="text-center">QTY</div>
                  <div className="text-right">PRICE</div>
                  <div className="text-right">AMOUNT</div>
                </div>

                {invoice.services.map((service, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 py-4 border-b border-gray-200"
                  >
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="font-medium">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-center self-center">
                      {service.quantity}
                    </div>
                    <div className="text-right self-center">
                      {service.price.toLocaleString()} {service.currency}
                    </div>
                    <div className="text-right self-center font-medium">
                      {service.amount.toLocaleString()} {service.currency}
                    </div>
                  </div>
                ))}

                {/* Summary */}
                <div className="mt-6 grid grid-cols-2">
                  <div></div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>
                        {invoice.subtotal.toLocaleString()} {invoice.currency}
                      </span>
                    </div>

                    {invoice.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Discount (
                          {invoice.discountType === "percentage"
                            ? `${invoice.discount}%`
                            : "Fixed"}
                          )
                        </span>
                        <span className="text-red-600">
                          -
                          {(invoice.discountType === "percentage"
                            ? (invoice.subtotal * invoice.discount) / 100
                            : invoice.discount
                          ).toLocaleString()}{" "}
                          {invoice.currency}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tax ({invoice.taxRate}%)
                      </span>
                      <span>
                        {invoice.taxTotal.toLocaleString()} {invoice.currency}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-900 font-semibold">Total</span>
                      <span className="font-bold">
                        {invoice.total.toLocaleString()} {invoice.currency}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Amount due</span>
                      <span className="font-bold">
                        {invoice.total.toLocaleString()} {invoice.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-2">Terms & Condition</h3>
                <p className="text-gray-600 text-sm">
                  Please ensure payment is made by the due date to avoid any
                  late fees. Payment is due on or before the due date.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Notes and Log */}
          <div className="lg:col-span-1">
            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Notes</h2>
                <button className="text-blue-600 text-sm font-medium">
                  Edit Notes
                </button>
              </div>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>

            {/* Log Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Log</h2>

              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">
                      Invoice was sent to {invoice.client.email}
                    </p>
                    <p className="text-sm text-gray-500">{invoice.createdAt}</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Invoice was finalized</p>
                    <p className="text-sm text-gray-500">
                      22 Jan 2023, 01:28 PM
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">
                      Invoice Payment page was created
                    </p>
                    <p className="text-sm text-gray-500">
                      20 Jan 2023, 10:28 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
