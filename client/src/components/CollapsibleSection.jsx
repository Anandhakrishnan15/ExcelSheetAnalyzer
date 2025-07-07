import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-[var(--card)] rounded">
      <button
        className="w-full flex justify-between items-center px-3 py-2 bg-[var(--card)] hover:bg-[var(--card-hover)]"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-left">{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && <div className="p-2">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
