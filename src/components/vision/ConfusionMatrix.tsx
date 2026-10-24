type Props = { matrix: number[][]; classes: string[] }

// Rows are true classes, columns are predictions; cell shade is the row share.
export default function ConfusionMatrix({ matrix, classes }: Props) {
  const compact = classes.length > 2

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1 text-xs">
        <thead>
          <tr>
            <th className="text-left font-normal text-muted-foreground pr-2">True \ Predicted</th>
            {classes.map((name, i) => (
              <th key={name} title={name} className="font-medium text-gray-600 px-1 max-w-20 truncate">
                {compact ? i + 1 : name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => {
            const total = row.reduce((a, b) => a + b, 0) || 1
            return (
              <tr key={classes[i]}>
                <th className="text-left font-medium text-gray-600 pr-2 whitespace-nowrap">
                  {compact ? `${i + 1}. ${classes[i]}` : classes[i]}
                </th>
                {row.map((count, j) => {
                  const share = count / total
                  return (
                    <td
                      key={j}
                      title={`${classes[i]} predicted as ${classes[j]}: ${count}`}
                      className={`h-9 min-w-9 rounded text-center tabular-nums ${i === j ? "font-semibold" : ""} ${share > 0.5 ? "text-white" : "text-gray-800"}`}
                      style={{ backgroundColor: `color-mix(in oklab, var(--primary) ${Math.round(share * 100)}%, white)` }}
                    >
                      {count}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
