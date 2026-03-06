interface DataSourceSchema {
  id: string;
  name: string;
  type: string;
  columns?: { name: string; type: string }[];
  tables?: { name: string; columns: { name: string; type: string }[]; estimatedRowCount: number }[];
}

export function buildSchemaContext(schemas: DataSourceSchema[]): string {
  if (!schemas || schemas.length === 0) return "";

  return schemas.map((ds) => {
    const header = `### ${ds.name} (${ds.type})\n**dataSourceId**: \`${ds.id}\``;

    if (ds.columns) {
      const cols = ds.columns.map((c) => `  - ${c.name} (${c.type})`).join("\n");
      return `${header}\n${cols}`;
    }

    if (ds.tables) {
      const tables = (ds.tables as { name: string; columns: { name: string; type: string }[]; estimatedRowCount: number }[])
        .map((t) => {
          const cols = t.columns.slice(0, 20).map((c) => `    - ${c.name} (${c.type})`).join("\n");
          return `  **${t.name}** (~${t.estimatedRowCount} rows)\n${cols}`;
        })
        .join("\n\n");
      return `${header}\n${tables}`;
    }

    return `${header} — schema not yet loaded`;
  }).join("\n\n");
}
