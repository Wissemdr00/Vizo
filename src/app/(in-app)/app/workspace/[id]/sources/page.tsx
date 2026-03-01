"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Database,
  FileSpreadsheet,
  FileJson,
  FileText,
  Trash2,
  RefreshCw,
  Plus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import useDataSources from "@/lib/data-sources/useDataSources";
import Link from "next/link";

const typeIcons: Record<string, React.ElementType> = {
  csv: FileText,
  excel: FileSpreadsheet,
  json: FileJson,
  postgresql: Database,
  mysql: Database,
};

const typeColors: Record<string, string> = {
  csv: "bg-green-100 text-green-700",
  excel: "bg-blue-100 text-blue-700",
  json: "bg-amber-100 text-amber-700",
  postgresql: "bg-indigo-100 text-indigo-700",
  mysql: "bg-orange-100 text-orange-700",
};

export default function WorkspaceSourcesPage() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const { dataSources, isLoading, mutate } = useDataSources(workspaceId);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/app/data-sources/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Data source deleted");
      mutate();
    } catch {
      toast.error("Failed to delete data source");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleRefresh = async (dsId: string) => {
    try {
      const res = await fetch(`/api/app/data-sources/${dsId}/refresh`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to refresh");
      toast.success("Schema refreshed");
      mutate();
    } catch {
      toast.error("Failed to refresh schema");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Data Sources</h1>
          <p className="text-muted-foreground text-sm">
            Upload files or connect databases to analyze your data
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Data File</DialogTitle>
              </DialogHeader>
              <FileUploadForm workspaceId={workspaceId} onSuccess={() => { setUploadOpen(false); mutate(); }} />
            </DialogContent>
          </Dialog>

          <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Database className="h-4 w-4 mr-2" />
                Connect Database
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Connect Database</DialogTitle>
              </DialogHeader>
              <DatabaseConnectForm workspaceId={workspaceId} onSuccess={() => { setConnectOpen(false); mutate(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Data Sources List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : dataSources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No data sources yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Upload a CSV, Excel, or JSON file — or connect a database
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {dataSources.map((ds: Record<string, unknown>) => {
            const Icon = typeIcons[ds.type as string] || FileText;
            const colorClass = typeColors[ds.type as string] || "bg-gray-100 text-gray-700";
            const isDatabase = ["postgresql", "mysql"].includes(ds.type as string);
            return (
              <Card key={ds.id as string}>
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{ds.name as string}</CardTitle>
                    <CardDescription className="text-xs">
                      <Badge variant="secondary" className="text-xs mr-2">
                        {(ds.type as string).toUpperCase()}
                      </Badge>
                      {new Date(ds.createdAt as string).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {isDatabase && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRefresh(ds.id as string)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setDeleteId(ds.id as string)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete data source?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the data source and all associated metadata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// --- File Upload Form ---
function FileUploadForm({
  workspaceId,
  onSuccess,
}: {
  workspaceId: string;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sheets, setSheets] = useState<string[] | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");

  const getFileType = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "csv") return "csv";
    if (ext === "xlsx" || ext === "xls") return "excel";
    if (ext === "json") return "json";
    return null;
  };

  const handleUpload = async () => {
    if (!file) return;
    const fileType = getFileType(file.name);
    if (!fileType) {
      toast.error("Unsupported file type. Use CSV, Excel, or JSON.");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Get presigned upload URL
      const urlRes = await fetch("/api/app/data-sources/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          fileName: file.name,
          fileSizeBytes: file.size,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!urlRes.ok) {
        const err = await urlRes.json();
        throw new Error(err.error || "Failed to get upload URL");
      }

      const { uploadUrl, storagePath } = await urlRes.json();

      // Step 2: Upload file directly to Supabase Storage
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");

      // Step 3: Create data source (parse + save)
      const createRes = await fetch("/api/app/data-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          fileName: file.name,
          fileType,
          sheetName: selectedSheet || undefined,
        }),
      });

      const data = await createRes.json();

      if (data.needsSheetSelection) {
        setSheets(data.sheets);
        setUploading(false);
        return;
      }

      if (!createRes.ok) throw new Error(data.error || "Failed to create data source");

      toast.success("Data source created!");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>File (CSV, Excel, or JSON)</Label>
        <Input
          type="file"
          accept=".csv,.xlsx,.xls,.json"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setSheets(null);
            setSelectedSheet("");
          }}
          className="mt-1"
        />
      </div>

      {sheets && (
        <div>
          <Label>Select Sheet</Label>
          <select
            className="w-full mt-1 rounded-md border px-3 py-2 text-sm"
            value={selectedSheet}
            onChange={(e) => setSelectedSheet(e.target.value)}
          >
            <option value="">Choose a sheet...</option>
            {sheets.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploading || (sheets && !selectedSheet)}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : sheets ? (
          "Import Selected Sheet"
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload & Parse
          </>
        )}
      </Button>
    </div>
  );
}

// --- Database Connect Form ---
function DatabaseConnectForm({
  workspaceId,
  onSuccess,
}: {
  workspaceId: string;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"postgresql" | "mysql">("postgresql");
  const [host, setHost] = useState("");
  const [port, setPort] = useState(type === "postgresql" ? 5432 : 3306);
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ssl, setSsl] = useState(true);
  const [name, setName] = useState("");
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string; version?: string } | null>(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/app/data-sources/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, host, port, database, username, password, ssl }),
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) toast.success(`Connected! ${data.version || ""}`);
      else toast.error(data.error || "Connection failed");
    } catch {
      toast.error("Test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await fetch("/api/app/data-sources/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          name: name || `${type} - ${database}`,
          type,
          host,
          port,
          database,
          username,
          password,
          ssl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Connection failed");
      toast.success("Database connected!");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={type} onValueChange={(v) => { setType(v as "postgresql" | "mysql"); setPort(v === "postgresql" ? 5432 : 3306); setTestResult(null); }}>
        <TabsList className="w-full">
          <TabsTrigger value="postgresql" className="flex-1">PostgreSQL</TabsTrigger>
          <TabsTrigger value="mysql" className="flex-1">MySQL</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <Label>Display Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Production DB" className="mt-1" />
        </div>
        <div>
          <Label>Host</Label>
          <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="db.example.com" className="mt-1" />
        </div>
        <div>
          <Label>Port</Label>
          <Input type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} className="mt-1" />
        </div>
        <div>
          <Label>Database</Label>
          <Input value={database} onChange={(e) => setDatabase(e.target.value)} placeholder="mydb" className="mt-1" />
        </div>
        <div>
          <Label>Username</Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="postgres" className="mt-1" />
        </div>
        <div className="col-span-2">
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" />
        </div>
        {type === "postgresql" && (
          <div className="col-span-2 flex items-center gap-2">
            <Switch checked={ssl} onCheckedChange={setSsl} />
            <Label>Use SSL/TLS</Label>
          </div>
        )}
      </div>

      {testResult && (
        <div className={`rounded-md p-3 text-sm ${testResult.success ? "bg-green-50 text-green-700 dark:bg-green-900/20" : "bg-red-50 text-red-700 dark:bg-red-900/20"}`}>
          {testResult.success
            ? `✅ Connected successfully${testResult.version ? ` (${testResult.version})` : ""}`
            : `❌ ${testResult.error}`}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleTest} disabled={testing || !host || !database || !username} className="flex-1">
          {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Test Connection
        </Button>
        <Button onClick={handleConnect} disabled={connecting || !testResult?.success || !host} className="flex-1">
          {connecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
          Connect & Import Schema
        </Button>
      </div>
    </div>
  );
}
