import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClientSelection } from "../context/ClientSelectionContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAllClients } from "../../clients/clientSlice";
import { fetchClients } from "../../clients/clientsThunks";
import type { Client } from "../../clients/schemas/clientSchema";
import { useFormContext } from "react-hook-form";

function SelectClientInput() {
  const { setSelectedClient, clearSelection, setIsNewClient } =
    useClientSelection();
  const {
    formState: { errors },
    watch,
  } = useFormContext();
  const [showClientsList, setShowClientsList] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data: clients, status } = useAppSelector(selectAllClients);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const client = watch("client");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchClients());
    }
  }, [status, dispatch]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, clients]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowClientsList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = useCallback(
    (client: Client) => {
      setSelectedClient(client);
      setSearchText("");
      setShowClientsList(false);
      setIsNewClient(false);
    },
    [setSelectedClient, setIsNewClient, errors]
  );

  return (
    <div className="relative w-full  py-2 px-4" ref={dropdownRef}>
      <div className="w-full min-h-8 flex items-center gap-4 justify-between">
        {client?.id ? (
          <div className={`flex items-center h-full gap-3 w-full`}>
            {/* <img
              src={client.logoUrl.length > 1 ? client.logoUrl : userPng}
              alt={client.name}
              className="rounded-md w-7 h-7 object-cover"
            /> */}
            <div className="flex-1">
              <p className="font-semibold">{client.name}</p>
              {client.email && (
                <p className="text-sm text-gray-500">{client.email}</p>
              )}
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-400 hover:text-red-500"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setShowClientsList(true);
            }}
            placeholder="Search Client..."
            className="w-full outline-none h-full"
          />
        )}
        <button
          type="button"
          onClick={() => setShowClientsList((prev) => !prev)}
          className="text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>

      {showClientsList && (
        <div className="absolute left-0 z-10 mt-4 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleSelect(client)}
                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {/* <img
                  src={client.logoUrl || userPng}
                  alt={client.name}
                  className="rounded-md w-7 h-7 object-cover"
                /> */}
                <div className="flex-1">
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-sm text-gray-500">{client.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">
              no Clients Founded
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SelectClientInput;
