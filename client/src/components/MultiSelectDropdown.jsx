import { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder = "Select columns",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    const newSelected = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  return (
    <div className="relative w-48" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center border border-[var(--border)] bg-[var(--card)] rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(", ") : placeholder}
        </span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-10  w-full bg-[var(--card)] border  border-[var(--border)] rounded shadow max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 px-3 py-1 hover:bg-[var(--border)] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
                className="accent-blue-500"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
