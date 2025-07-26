import type { Client } from "../features/clients/schemas/clientSchema";

export type ClientSelectionContextType = {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  isNewClient: boolean;
  setIsNewClient: (value: boolean) => void;
  clearSelection: () => void;
  saveNewClient: (clientData: Omit<Client, "id">) => void;
};