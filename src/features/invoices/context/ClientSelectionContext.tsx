import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useFormContext } from "react-hook-form";
import type { Client } from "../../clients/schemas/clientSchema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addTempClient,
  removeTempClient,
  selectTempClient,
} from "../../clients/clientSlice";
import type { ClientSelectionContextType } from "../../../types/clientSelection";

const ClientSelectionContext = createContext<ClientSelectionContextType | null>(
  null
);

const NoClient: Client = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  logoUrl: "",
  isTemp: false,
};

export function ClientSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNewClient, setIsNewClient] = useState(false);
  const { setValue } = useFormContext();
  const dispatch = useAppDispatch();
  const tempClient = useAppSelector(selectTempClient);
  const [selectedClient, setSelectedClient] = useState<Client | null>(NoClient);

  useEffect(() => {
    console.log("Temp client updated:", tempClient);
    if (tempClient?.id) {
      setValue("client", tempClient, {
        shouldValidate: true,
      });
      setIsNewClient(false);
    }
  }, [tempClient, setValue]);

  useEffect(() => {
    console.log("Selected client updated:", selectedClient);
    if (selectedClient?.id) {
      setValue("client", selectedClient, {
        shouldValidate: true,
      });
    }
  }, [selectedClient, setValue]);

  const clearSelection = useCallback(() => {
    setSelectedClient(NoClient);
    setIsNewClient(false);
    setValue(
      "client",
      {
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        logoUrl: "",
        isTemp: false,
      },
      { shouldValidate: true }
    );
  }, [setValue]);

  const saveNewClient = useCallback(
    (clientData: Omit<Client, "id" | "isTemp">) => {
      dispatch(removeTempClient());
      dispatch(addTempClient(clientData));
    },
    [dispatch]
  );

  return (
    <ClientSelectionContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        isNewClient,
        setIsNewClient,
        clearSelection,
        saveNewClient,
      }}
    >
      {children}
    </ClientSelectionContext.Provider>
  );
}

export function useClientSelection() {
  const context = useContext(ClientSelectionContext);
  if (!context) {
    throw new Error(
      "useClientSelection must be used within a ClientSelectionProvider"
    );
  }
  return context;
}
