import SidebarToggleButton from "./SidebarToggleButton";
import DataTable from "../DataTable";
import AllUploedExels from "./AllUploedExels";

const Sidebar = ({ isOpen, toggle, filename, fileData, isMobile }) => (
  <aside
    className={`sticky top-0 left-0 max-h-[calc(130vh-5rem)] bg-[var(--body)] border-r
    transition-all duration-700 ease-in-out
    ${isOpen ? (isMobile ? "w-90 p-4" : "w-120 p-4") : "w-10 p-1"}
  `}
  >
    <SidebarToggleButton isOpen={isOpen} onToggle={toggle} />

    {isOpen && (
      <div className=" overflow-y-auto overflow-x-hidden max-h-[calc(120vh-5rem)] space-y-4 pr-2 scrollbar-none">
        <h3 className="text-lg font-semibold">Chart Types</h3>

        <AllUploedExels />
        <DataTable filename={filename} rows={fileData?.rows} />
      </div>
    )}
  </aside>
);

export default Sidebar;
