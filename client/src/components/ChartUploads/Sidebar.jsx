import SidebarToggleButton from "./SidebarToggleButton";
import DataTable from "../DataTable";
import AllUploedExels from "./AllUploedExels";
import SavedCharts from "../SavedCharts";
import CollapsibleSection from "../CollapsibleSection";
import { useChartRefresh } from "../../context/ChartRefreshContext";

const Sidebar = ({
  isOpen,
  toggle,
  filename,
  fileData,
  isMobile,
  onChartClick,
}) =>{
  const savedChartsRef = useChartRefresh();
  return (
    <aside
      className={`sticky top-0 left-0 max-h-[calc(130vh-5rem)] bg-[var(--body)] border-r
      transition-all duration-700 ease-in-out
      ${isOpen ? (isMobile ? "w-90 p-4" : "w-120 p-4") : "w-10 p-1"}`}
    >
      <SidebarToggleButton isOpen={isOpen} onToggle={toggle} />

      {isOpen && (
        <div className="overflow-y-auto overflow-x-hidden max-h-[calc(120vh-5rem)] space-y-4 pr-2 scrollbar-none">
          <CollapsibleSection title="Saved Graphs">
            <SavedCharts
              ref={savedChartsRef}
              uploadedFileId={fileData._id}
              rows={fileData.rows}
              onChartClick={onChartClick}
            />
          </CollapsibleSection>

          <CollapsibleSection title="All Uploaded Excels" defaultOpen={true}>
            <AllUploedExels />
          </CollapsibleSection>

          <CollapsibleSection title="Data Table" defaultOpen={true}>
            <DataTable filename={filename} rows={fileData?.rows} />
          </CollapsibleSection>
        </div>
      )}
    </aside>
  );
} 


export default Sidebar;
