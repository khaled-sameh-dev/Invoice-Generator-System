import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import StatsCard  from "../components/StatsCard";
import { useAppSelector } from "../app/hooks";
import { selectInvoicesCounts } from "../features/invoices/invoiesSlice";
import InvoicesFilterProvider from "../features/invoices/context/InvoicesFilter";
import InvoicesSection from "../features/invoices/components/InvoicesSection";
import { useNavigate } from "react-router-dom";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const invoiceCounts = useAppSelector(selectInvoicesCounts);

  return (
    <div className="text-slate-900 p-6 w-full h-full bg-neutral-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-slate-800/80">
            Explore your full invoices history and every transaction in one
            place
          </p>
        </div>
        <button
          className="flex items-center cursor-pointer gap-2 bg-cyan-700 hover:bg-cyan-800 text-white px-4 py-2 rounded-md shadow-lg transition duration-300 ease-in-out"
          onClick={() => navigate("invoices/new")}
        >
          <FontAwesomeIcon icon="plus" />
          <p>Create Invoice</p>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        <div className="flex flex-col justify-between p-4 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white text-sm font-medium">Total Revenue</h3>
            <div className="bg-cyan-600/50 p-2 rounded-full">
              <FontAwesomeIcon icon="chart-line" className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold mt-1">
              ${invoiceCounts.all.total.toLocaleString()}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-xs mt-1">
                {invoiceCounts.all.count} total invoices
              </p>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon 
                  icon={invoiceCounts.all.trend === "up" ? faArrowUp : faArrowDown} 
                  className={invoiceCounts.all.trend === "up" ? "text-green-300" : "text-red-300"} 
                  size="xs"
                />
                <span className={`text-xs font-medium ${invoiceCounts.all.trend === "up" ? "text-green-300" : "text-red-300"}`}>
                  {Math.abs(invoiceCounts.all.percentageChange).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
        <StatsCard type="paid" />
        <StatsCard type="unpaid" />
        <StatsCard type="cancelled" />
      </div>

      <InvoicesFilterProvider>
        <InvoicesSection />
      </InvoicesFilterProvider>
    </div>
  );
};

export default Dashboard;
