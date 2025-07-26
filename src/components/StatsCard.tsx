import React from "react";
import { useAppSelector } from "../app/hooks";
import { selectInvoicesCounts } from "../features/invoices/invoiesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

type StatsCardProps = {
  type: "paid" | "unpaid" | "draft" | "cancelled";
};

const StatsCard: React.FC<StatsCardProps> = ({ type }) => {
  const invoiceCounts = useAppSelector(selectInvoicesCounts);

  const getCardStyle = () => {
    switch (type) {
      case "paid":
        return {
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          iconBg: "bg-green-100",
          icon: "check-circle",
        };
      case "unpaid":
        return {
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          iconBg: "bg-red-100",
          icon: "exclamation-circle",
        };
      case "draft":
        return {
          bgColor: "bg-gray-50",
          textColor: "text-gray-600",
          iconBg: "bg-gray-100",
          icon: "file-alt",
        };
      case "cancelled":
        return {
          bgColor: "bg-purple-50",
          textColor: "text-purple-600",
          iconBg: "bg-purple-100",
          icon: "ban",
        };
      default:
        return {
          bgColor: "bg-blue-50",
          textColor: "text-blue-600",
          iconBg: "bg-blue-100",
          icon: "info-circle",
        };
    }
  };

  const getTitle = () => {
    switch (type) {
      case "paid":
        return "Paid Invoices";
      case "unpaid":
        return "Unpaid Invoices";
      case "draft":
        return "Draft Invoices";
      case "cancelled":
        return "Cancelled Invoices";
      default:
        return "Invoices";
    }
  };

  const styles = getCardStyle();
  const title = getTitle();

  return (
    <div className={`flex flex-col justify-between p-4 rounded-lg shadow-sm`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <div className={`${styles.iconBg} pt-2 pb-1 px-2 rounded-full`}>
          <FontAwesomeIcon icon={styles.icon as any} className={styles.textColor} />
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold mt-1 `}>
          ${invoiceCounts[type].total.toLocaleString()}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon 
              icon={invoiceCounts[type].trend === "up" ? faArrowUp : faArrowDown} 
              className={invoiceCounts[type].trend === "up" ? "text-green-500" : "text-red-500"} 
              size="xs"
            />
            <span className={`text-xs font-medium ${invoiceCounts[type].trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {Math.abs(invoiceCounts[type].percentageChange).toFixed(1)}%
            </span>
          </div>
          <p className="text-slate-600 bg-neutral-200 py-1 px-3 rounded-2xl font-semibold text-xs mt-1">
            {invoiceCounts[type].count}  invoice{invoiceCounts[type].count !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;