export default function DataPreview({ jsonData, showTable }) {
  return (
    <div className="border rounded p-2 overflow-auto max-h-[60vh] scrollbar-black">
      {showTable ? (
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-[var(--card)]">
            <tr>
              {jsonData.fields.map((field) => (
                <th
                  key={field}
                  className="px-2 py-2 border-b border-[var(--border)] font-medium text-left"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jsonData.rows.map((row, idx) => (
              <tr key={idx}>
                {jsonData.fields.map((field) => (
                  <td
                    key={field}
                    className="px-2 py-1 whitespace-nowrap border-b border-[var(--border)]"
                  >
                    {row[field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(jsonData.rows, null, 2)}
        </pre>
      )}
    </div>
  );
}
