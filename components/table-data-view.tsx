"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { fetchTableRecords, deleteRecord, createRecord, updateRecord } from "@/lib/surreal-actions"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { RecordForm } from "./record-form"
import { toast } from "sonner"

interface TableDataViewProps {
  tableName: string
}

export function TableDataView({ tableName }: TableDataViewProps) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const pageSize = 10

  const loadRecords = async () => {
    setLoading(true)
    try {
      const data = await fetchTableRecords(tableName, page, pageSize)
      setRecords(data.records)
      setTotalPages(Math.ceil(data.total / pageSize) || 1)
    } catch (error) {
      console.error("Failed to fetch records:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [tableName, page])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteRecord(tableName, id)
        toast.success("Record deleted successfully")
        loadRecords()
      } catch (error) {
        console.error("Failed to delete record:", error)
        toast.error("Failed to delete record")
      }
    }
  }

  const handleEdit = (record: any) => {
    setSelectedRecord(record)
    setIsEditDialogOpen(true)
  }

  const handleCreate = async (data: any) => {
    try {
      await createRecord(tableName, data)
      toast.success("Record created successfully")
      setIsCreateDialogOpen(false)
      loadRecords()
    } catch (error) {
      console.error("Failed to create record:", error)
      toast.error("Failed to create record")
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      console.log("Updating record with data:", data, selectedRecord.id, tableName) //DEBUG

      await updateRecord(tableName, selectedRecord.id, data)
      toast.success("Record updated successfully")
      setIsEditDialogOpen(false)
      loadRecords()
    } catch (error) {
      console.error("Failed to update record:", error)
      toast.error("Failed to update record")
    }
  }

  const filteredRecords = records.filter((record) => {
    const searchLower = searchQuery.toLowerCase()
    return Object.values(record).some(
      (value) => value !== null && value !== undefined && value.toString().toLowerCase().includes(searchLower),
    )
  })

  const columns = records.length > 0 ? Object.keys(records[0]).filter((key) => key !== "id") : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chercher un enregistrement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full md:w-[300px]"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Record</DialogTitle>
            </DialogHeader>
            <RecordForm columns={columns} initialData={{}} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="py-6 text-center text-muted-foreground">Loading records...</div>
      ) : records.length === 0 ? (
        <div className="py-6 text-center text-muted-foreground">No records found in this table</div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {typeof record[column] === "object"
                          ? JSON.stringify(record[column])
                          : String(record[column] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(record.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink onClick={() => setPage(p)} isActive={page === p}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editer le registre</DialogTitle>
          </DialogHeader>
          {selectedRecord && <RecordForm columns={columns} initialData={selectedRecord} onSubmit={handleUpdate} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

