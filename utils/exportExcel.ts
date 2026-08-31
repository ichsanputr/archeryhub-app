/**
 * Utility to export tabular data to Excel-compatible CSV (with UTF-8 BOM)
 */
export function exportToExcel(
  filename: string,
  headers: { key: string; label: string }[],
  data: Record<string, any>[]
) {
  if (!data || !data.length) {
    return
  }

  // UTF-8 BOM so Excel opens accented & special chars properly
  let csvContent = '\ufeff'

  // Header row
  const headerRow = headers.map(h => `"${(h.label || '').replace(/"/g, '""')}"`).join(',')
  csvContent += headerRow + '\r\n'

  // Data rows
  data.forEach(item => {
    const row = headers.map(h => {
      let val = item[h.key]
      if (val === null || val === undefined) {
        val = ''
      } else if (typeof val === 'object') {
        val = JSON.stringify(val)
      } else {
        val = String(val)
      }
      return `"${val.replace(/"/g, '""')}"`
    }).join(',')
    csvContent += row + '\r\n'
  })

  // Download trigger
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  const timestamp = new Date().toISOString().slice(0, 10)
  link.setAttribute('download', `${filename}_${timestamp}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
