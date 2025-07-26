import { Tabs } from "../types/navigationTabs";

interface TabNavigationProps {
  activeTab: Tabs;
  setActiveTab: (tab: Tabs) => void;
}

const tabTitles = {
  [Tabs.GENERAL]: "General",
  [Tabs.SERVICES]: "Items/Services",
  [Tabs.PAYMENT]: "Payment",
};

function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="w-full p-1 rounded-xl shadow-2xs bg-neutral-100 overflow-hidden flex items-center justify-between mb-4 mt-2">
      {Object.entries(Tabs).map(([key, value]) => {
        return (
          <button
            key={key}
            type="button"
            className={`flex-1/3 text-center py-2 ${
              activeTab == value ? "bg-white shadow-xs" : ""
            } rounded-lg cursor-pointer text-sm px-2 sm:text-md`}
            onClick={() => setActiveTab(value)}
          >
            {tabTitles[value as keyof typeof tabTitles]}
          </button>
        );
      })}
    </div>
  );
}

export default TabNavigation;
