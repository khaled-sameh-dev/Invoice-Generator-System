import type Client from "../../clients/types/Client";
import userPng from "../../../assets/user.png"

interface Props {
  client: Client;
}

function ClientRender({ client }: Props) {
  const handleClick = () => {
    
  };

  return (
    <div
      className="grid grid-cols-[32px_1fr] items-center py-2 px-4 cursor-pointer hover:bg-white"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <img
        src={client.logoUrl ?? userPng}
        alt={client.name}
        className="rounded-full w-8 h-8 object-cover"
      />
      <div className="ml-3">
        <p className="font-semibold">{client.name}</p>
        <p className="text-sm text-gray-500">{client.email}</p>
      </div>
    </div>
  );
}

export default ClientRender;
