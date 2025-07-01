import SidebarToggleButton from "./SidebarToggleButton";
import DataTable from "./DataTable";
import AllUploedExels from "./AllUploedExels";

const Sidebar = ({ isOpen, toggle, filename, fileData }) => (
  <aside
    className={`relative transition-all duration-700 ease-in-out
      ${isOpen ? "w-120 p-4 scrollbar-black" : "w-10 p-1"}
      bg-[var(--body)] border-r`}
  >
    <SidebarToggleButton isOpen={isOpen} onToggle={toggle} />
    {isOpen && (
      <div className="space-y-4 animate-fadeIn">
        <h3 className="text-lg font-semibold">Chart Types</h3>
        <DataTable filename={filename} rows={fileData?.rows} />
        <AllUploedExels />
      </div>
    )}
  </aside>
);

export default Sidebar;
