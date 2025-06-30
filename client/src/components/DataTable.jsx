const DataTable = ({ filename, rows }) => {
  if (!rows?.length) return <p className="text-gray-500">No data available.</p>;

  return (
    <div className="w-full max-h-[400px] bg-[var(--card)] p-4 pt-0 rounded shadow overflow-auto mb-5 scrollbar-black">
      <h4 className="text-lg font-medium p-2 border-b sticky top-0 bg-[var(--card)] z-10">
        Data Table of {filename}
      </h4>
      <table className="w-full border border-[var(--border)] text-sm">
        <thead className="sticky top-10 bg-[var(--card)] z-10">
          <tr>
            {Object.keys(rows[0]).map((col) => (
              <th
                key={col}
                className="px-4 py-2 border-b border-[var(--border)] text-left font-semibold"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={
                idx % 2 === 0 ? "bg-[var(--card)]" : "bg-[var(--border)]"
              }
            >
              {Object.values(row).map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="px-4 py-2 border-b border-gray-200"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
