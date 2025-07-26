import { useInvoicesFilter } from "../context/InvoicesFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faPen,
  faEye,
  faBan,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function InvoicesTable() {
  const { filteredInvoices } = useInvoicesFilter();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5; // عدد الصفوف في كل صفحة

  // const handleCancelInvoice = (invoiceId: string) => {

  //     dispatch(updateInvoice({ {},id: invoiceId,  }));
  //   setActiveMenu(null);
  // };

  const handleViewInvoice = (invoiceId: string) => {
    navigate(`/invoices/view?id=${invoiceId}`);
    setActiveMenu(null);
  };

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const currentInvoices = filteredInvoices.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-100 text-slate-600 text-left">
            <th className="p-4 font-medium">Invoice #</th>
            <th className="p-4 font-medium">Client</th>
            <th className="p-4 font-medium">Date</th>
            <th className="p-4 font-medium text-right">Amount</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {currentInvoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 font-medium text-blue-600">
                {invoice.number}
              </td>
              <td className="p-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {invoice.client.name}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {invoice.client.email}
                  </span>
                </div>
              </td>
              <td className="p-3 text-gray-500">
                {new Date(invoice.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="p-4 text-right font-medium">
                {invoice.currency}{" "}
                {invoice.total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : invoice.status === "draft"
                      ? "bg-gray-100 text-gray-800"
                      : invoice.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : invoice.status === "cancelled"
                      ? "bg-gray-200 text-gray-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </td>
              <td className="p-3 text-center relative">
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() =>
                    setActiveMenu(
                      activeMenu === invoice.id ? null : (invoice.id as string)
                    )
                  }
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </button>

                {activeMenu === invoice.id && (
                  <div className="absolute right-10 top-2 bg-white shadow-md rounded-md py-2 z-10 min-w-32">
                    <button
                      onClick={() => {
                        navigate(`/invoices/edit?id=${invoice.id}`);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faPen} className="text-blue-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleViewInvoice(invoice.id as string)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-green-600"
                      />
                      <span>View</span>
                    </button>
                    <button
                      // onClick={() => handleCancelInvoice(invoice.id as string)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faBan} className="text-red-600" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">No invoices found</div>
      )}

      {filteredInvoices.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} invoices
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoicesTable;
