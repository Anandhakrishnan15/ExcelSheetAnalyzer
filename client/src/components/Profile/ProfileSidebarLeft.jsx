import MyComponent from "../ChartUploads/AllUploedExels";
import { QuickActions, Tips } from "../QuickActions";

export default function ProfileSidebarLeft({ showLeft, setShowLeft, leftRef }) {
  return (
    <aside
      ref={leftRef}
      className={`fixed lg:top-0 md:top-18 left-0 w-64 shadow-lg z-50 overflow-auto 
        transform transition-transform duration-300 block border-r border-[var(--border)]
        ${
          showLeft
            ? "translate-x-0 bg-[var(--card)] border-[var(--border)] h-full"
            : "-translate-x-full"
        }
        lg:relative lg:translate-x-0 lg:w-1/4 scrollbar-none`}
    >
      {/* Mobile Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-100 lg:hidden">
        <h2 className="text-lg font-semibold">MyComponent</h2>
        <button
          className="text-sm px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => setShowLeft(false)}
        >
          Close
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-full space-y-4">
        <MyComponent />
        {/* <QuickActions /> */}
        <Tips />
      </div>
    </aside>
  );
}
