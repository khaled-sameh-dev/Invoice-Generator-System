import { useReducer } from "react";
import type {
  AdvancedFilter,
  AdvancedFilters,
  FilterType,
} from "../types/AdvancedFilters";

type AdvancedFiltersAction =
  | { type: "ADD_FILTER"; filter: AdvancedFilter }
  | {
      type: "UPDATE_FILTER";
      id: string;
      updates: Partial<Omit<AdvancedFilter, "id" | "type">>;
    }
  | { type: "REMOVE_FILTER"; id: string }
  | { type: "REMOVE_FILTERS_BY_TYPE"; filterType: FilterType }
  | { type: "RESET_FILTERS" };

function filtersReducer(
  state: AdvancedFilters,
  action: AdvancedFiltersAction
): AdvancedFilters {
  switch (action.type) {
    case "ADD_FILTER":
      // Check if filter of same type already exists
      const existingIndex = state.filters.findIndex(
        (f) => f.type === action.filter.type
      );

      if (existingIndex >= 0) {
        const newFilters = [...state.filters];
        newFilters[existingIndex] = action.filter;
        return { filters: newFilters };
      }
      return { filters: [...state.filters, action.filter] };

    case "UPDATE_FILTER":
      return {
        filters: state.filters.map((filter) =>
          filter.id === action.id
            ? { ...filter, ...(action.updates as any) }
            : filter
        ) as AdvancedFilter[],
      };

    case "REMOVE_FILTER":
      return {
        filters: state.filters.filter((filter) => filter.id !== action.id),
      };

    case "REMOVE_FILTERS_BY_TYPE":
      return {
        filters: state.filters.filter(
          (filter) => filter.type !== action.filterType
        ),
      };

    case "RESET_FILTERS":
      return { filters: [] };

    default:
      return state;
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function useAdvancedFilters(initialFilters: AdvancedFilter[] = []) {
  const [state, dispatch] = useReducer(filtersReducer, {
    filters: initialFilters.map((f) => ({
      ...f,
      id: f.id || generateId(),
    })),
  });

  const addFilter = <T extends AdvancedFilter>(
    filter: Omit<T, "id"> & { type: T["type"] }
  ) => {
    dispatch({
      type: "ADD_FILTER",
      filter: {
        ...filter,
        id: generateId(),
      } as AdvancedFilter,
    });
  };

  const updateFilter = <T extends AdvancedFilter>(
    id: string,
    updates: Partial<Omit<T, "id" | "type">>
  ) => {
    dispatch({
      type: "UPDATE_FILTER",
      id,
      updates,
    });
  };

  const removeFilter = (id: string) => {
    dispatch({ type: "REMOVE_FILTER", id });
  };

  const removeFiltersByType = (filterType: FilterType) => {
    dispatch({ type: "REMOVE_FILTERS_BY_TYPE", filterType });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const getFilterByType = <T extends AdvancedFilter>(
    type: T["type"]
  ): T | undefined => {
    return state.filters.find((f) => f.type === type) as T | undefined;
  };

  return {
    filters: state.filters,
    addFilter,
    updateFilter,
    removeFilter,
    removeFiltersByType,
    resetFilters,
    getFilterByType,
  };
}
