const SidebarToggleButton = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="absolute -right-3 top-6 z-20 flex items-center justify-center w-6 h-6 bg-[var(--card)] border border-[var(--border)] rounded-full shadow hover:bg-[var(--border)] transition"
  >
    <span
      className={`transform transition-transform duration-500 ${
        isOpen ? "" : "rotate-180"
      }`}
    >
      ➤
    </span>
  </button>
);

export default SidebarToggleButton;
