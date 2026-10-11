import React from 'react';

const Table = ({
  columns = [],
  data = [],
  renderRow,
  keyExtractor,
  emptyMessage = 'No records found',
  className = '',
}) => {
  return (
    <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
      <table className={`custom-table ${className}`.trim()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width || 'auto',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) =>
              renderRow ? (
                renderRow(item, idx)
              ) : (
                <tr key={keyExtractor ? keyExtractor(item) : item._id || idx}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
