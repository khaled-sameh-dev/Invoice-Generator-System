import { useState } from "react";
import InvoicesTable from "./InvoicesTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faTimes,
  faChevronDown,
  faChevronUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useInvoicesFilter } from "../context/InvoicesFilter";
import { useAppSelector } from "../../../app/hooks";
import { selectInvoicesCounts } from "../invoiesSlice";
import type { StatusFilter } from "../hooks/useStatusFilter";
import type { InvoiceStatus } from "../types/InvoiceStatus";

const StatusTabs: StatusFilter[] = [
  { type: "all", label: "All Invoices" },
  { type: "paid", label: "Paid" },
  { type: "unpaid", label: "Unpaid" },
  { type: "draft", label: "Draft" },
];

const statusOptions = [
  { value: "paid", label: "Paid" },
  { value: "sent", label: "Sent" },
  { value: "archived", label: "Archived" },
  { value: "cancelled", label: "Cancelled" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
];

function InvoicesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const { statusFilter, setStatusFilter, advancedFilters, resetFilters } =
    useInvoicesFilter();
  const { all, paid, unpaid, draft } = useAppSelector(selectInvoicesCounts);

  const handleStatusChange = (statusValue: string, isChecked: boolean) => {
    const statusFilter = advancedFilters.getFilterByType("status");
    const currentStatuses = Array.isArray(statusFilter?.value)
      ? statusFilter.value
      : [];
    let newStatuses: InvoiceStatus[];

    if (isChecked) {
      newStatuses = [...currentStatuses, statusValue as InvoiceStatus];
    } else {
      newStatuses = currentStatuses.filter(
        (s) => s !== statusValue
      ) as InvoiceStatus[];
    }

    if (newStatuses.length > 0) {
      advancedFilters.addFilter({
        type: "status",
        value: newStatuses,
        label: "Status",
      });
    } else {
      advancedFilters.removeFiltersByType("status");
    }
  };

  const addDateFilter = (type: "start" | "end", value: string) => {
    const dateFilter = advancedFilters.getFilterByType("issueDate") || {
      type: "issueDate",
      value: {},
    };

    const newValue = {
      ...dateFilter.value,
      [type]: value,
    };

    advancedFilters.addFilter({
      ...dateFilter,
      value: newValue,
    });
  };

  const addAmountFilter = (type: "min" | "max", value: string) => {
    const amountFilter = advancedFilters.getFilterByType("amount") || {
      type: "amount",
      value: {},
    };

    const newValue = {
      ...amountFilter.value,
      [type]: Number(value),
    };

    advancedFilters.addFilter({
      ...amountFilter,
      value: newValue,
    });
  };

  const addClientFilter = (name: string) => {
    if (name.trim()) {
      advancedFilters.addFilter({
        type: "client",
        value: { name },
        label: "Client",
      });
    } else {
      advancedFilters.removeFiltersByType("client");
    }
  };

  const removeFilter = (id: string) => {
    advancedFilters.removeFilter(id);
  };

  return (
    <section className="mb-6">
      <div className="mb-3">
        <h1 className="text-2xl text-slate-900 font-bold">Invoices</h1>
        <p className="text-slate-800/80">
          Here you can manage all your invoices, view details, and track their
          status.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-md p-4">
        <div className="">
          {/* Header with status tabs and search/filter */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center lg:gap-6 pb-4">
            <div className="flex items-center overflow-x-auto pb-2 lg:pb-0">
              {StatusTabs.map((tab) => (
                <button
                  key={tab.type}
                  className={`text-sm flex items-center gap-1 lg:text-md font-medium px-4 py-1 border-b-[1px] cursor-pointer transition-[border] duration-300 ${
                    tab.type == statusFilter.type
                      ? "border-black"
                      : "border-black/10"
                  } text-start`}
                  onClick={() => setStatusFilter(tab)}
                >
                  <p>{tab.label}</p>{" "}
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                    {tab.type === "all"
                      ? all?.count || 0
                      : tab.type === "paid"
                      ? paid?.count || 0
                      : tab.type === "unpaid"
                      ? unpaid?.count || 0
                      : draft?.count || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="w-full lg:w-max flex items-center justify-between gap-4">
              <div className="relative flex-grow">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by invoice number, client name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    // if (e.target.value.trim()) {
                    //   advancedFilters.addFilter({
                    //     type: "search",
                    //     value: e.target.value.trim(),
                    //     label: "Search"
                    //   });
                    // } else {
                    //   advancedFilters.removeFiltersByType("search");
                    // }
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenFilters(!openFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-black/25 hover:bg-neutral-100 cursor-pointer rounded-md transition-colors"
                >
                  <FontAwesomeIcon icon={faFilter} />
                  Filter
                  <FontAwesomeIcon
                    icon={openFilters ? faChevronUp : faChevronDown}
                    className="ml-1 text-sm"
                  />
                </button>

                {/* Filter Dropdown */}
                {openFilters && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 p-4 border border-gray-200">
                    <h3 className="font-semibold text-lg mb-3 text-gray-800">
                      Advanced Filters
                    </h3>

                    {/* Date Range Filter */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-700">
                        Date Range
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            From
                          </label>
                          <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) =>
                              addDateFilter("start", e.target.value)
                            }
                            value={
                              (
                                advancedFilters.getFilterByType("issueDate")
                                  ?.value as any
                              )?.start || ""
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            To
                          </label>
                          <input
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) =>
                              addDateFilter("end", e.target.value)
                            }
                            value={
                              (
                                advancedFilters.getFilterByType("issueDate")
                                  ?.value as any
                              )?.end || ""
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Amount Range Filter */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-700">
                        Amount Range
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Min
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) =>
                              addAmountFilter("min", e.target.value)
                            }
                            value={
                              (
                                advancedFilters.getFilterByType("amount")
                                  ?.value as any
                              )?.min || ""
                            }
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Max
                          </label>
                          <input
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            onChange={(e) =>
                              addAmountFilter("max", e.target.value)
                            }
                            value={
                              (
                                advancedFilters.getFilterByType("amount")
                                  ?.value as any
                              )?.max || ""
                            }
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Client Filter */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-700">Client</h4>
                      <input
                        type="text"
                        placeholder="Search by client name..."
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        onChange={(e) => addClientFilter(e.target.value)}
                        value={
                          (
                            advancedFilters.getFilterByType("client")
                              ?.value as any
                          )?.name || ""
                        }
                      />
                    </div>

                    {/* Status Filter */}
                    <div>
                      <h4 className="font-medium mb-2 text-gray-700">Status</h4>
                      <div className="space-y-2">
                        {statusOptions.map((status) => {
                          const statusValue =
                            advancedFilters.getFilterByType("status")?.value;
                          const isChecked =
                            Array.isArray(statusValue) &&
                            statusValue.includes(status.value as InvoiceStatus);

                          return (
                            <label
                              key={status.value}
                              className="flex items-center space-x-2 group"
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      status.value,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded group-hover:border-blue-400 transition-colors"
                                />
                              </div>
                              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
                                {status.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => {
                          resetFilters();
                          setOpenFilters(false);
                        }}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {advancedFilters.filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 py-3 bg-gray-50 rounded-lg px-4 border border-gray-200">
              <span className="text-sm text-gray-500 mr-1">
                Applied filters:
              </span>

              {advancedFilters.filters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-300 text-sm shadow-xs hover:shadow-sm transition-shadow"
                >
                  <span className="font-medium text-gray-700">
                    {filter.type === "issueDate"
                      ? (() => {
                          const { start, end } = filter.value as {
                            start?: string;
                            end?: string;
                          };
                          return `Date: ${
                            start ? new Date(start).toLocaleDateString() : "Any"
                          } - ${
                            end ? new Date(end).toLocaleDateString() : "Any"
                          }`;
                        })()
                      : filter.type === "amount"
                      ? (() => {
                          const { min, max } = filter.value as {
                            min?: number;
                            max?: number;
                          };
                          return `Amount: ${min ? `$${min}` : "Any"} - ${
                            max ? `$${max}` : "Any"
                          }`;
                        })()
                      : filter.type === "client"
                      ? `Client: ${(filter.value as { name?: string }).name}`
                      : filter.type === "status"
                      ? `Status: ${(filter.value as string[]).join(", ")}`
                      : ""}
                  </span>
                  <button
                    onClick={() => filter.id && removeFilter(filter.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Remove filter"
                  >
                    <FontAwesomeIcon icon={faTimes} size="xs" />
                  </button>
                </div>
              ))}

              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 ml-2 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Invoices Table */}
          <InvoicesTable />
        </div>
      </div>
    </section>
  );
}

export default InvoicesSection;
