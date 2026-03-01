export interface TableSchema {
  name: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    isPrimaryKey: boolean;
  }[];
  foreignKeys: {
    column: string;
    referencedTable: string;
    referencedColumn: string;
  }[];
  estimatedRowCount: number;
}

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  version?: string;
}

export interface DatabaseCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}
