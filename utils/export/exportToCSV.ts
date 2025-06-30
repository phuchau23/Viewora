// utils/export/exportToCSV.ts
export function exportToCSV<T>(
    filename: string,
    headers: string[],
    data: T[],
    mapper: (item: T) => (string | number)[]
  ) {
    if (data.length === 0) return;
  
    const csvContent =
      [headers, ...data.map(mapper)]
        .map((row) =>
          row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
  
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  