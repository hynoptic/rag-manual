"use client";

import { ParseJob } from "@/lib/api/types";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
});
const columnHelper = createColumnHelper<typeof features, ParseJob>();
const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "Job ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("documentId", {
    header: "Document ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("userId", {
    header: "User ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor(
    (row) => {
      if (!row.startedAt || !row.completedAt) return null;
      return (
        (new Date(row.completedAt).getTime() -
          new Date(row.startedAt).getTime()) /
        1000
      );
    },
    {
      id: "duration",
      header: "Duration",
      cell: (info) => {
        const value = info.getValue();
        return value === null ? "—" : `${value.toFixed(1)}s`;
      },
    },
  ),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const value = info.getValue();
      switch (value) {
        case "queued":
          return <Badge className="w-full bg-muted-foreground">Queued</Badge>;
        case "processing":
          return (
            <Badge className="w-full bg-muted-foreground">Processing</Badge>
          );
        case "completed":
          return <Badge className="w-full bg-[#16a34a]">Completed</Badge>;
        case "failed":
          return <Badge className="w-full bg-destructive">Failed</Badge>;
        default:
          return null;
      }
    },
  }),

  columnHelper.accessor("error", {
    header: "Error",
    cell: (info) => {
      const err = info.getValue();
      if (err) {
        return (
          <Badge className="bg-destructive">{err.slice(0, 3)}</Badge>
        );
      }
      return null;
    },
  }),
]);

export default function Jobs({ jobs: data }: { jobs: ParseJob[] }) {
  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
    },
    (state) => state, // default selector
  );
  return (
    <Table className="">
      <TableHeader className="sticky top-0 z-10 bg-background">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted();
              const Icon =
                sorted === "asc"
                  ? ArrowUp
                  : sorted === "desc"
                    ? ArrowDown
                    : ArrowUpDown;

              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-ml-3 h-8 data-[state=open]:bg-accent"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                      <Icon className="ml-2" />
                    </Button>
                  ) : (
                    <span className="text-sm font-medium">
                      <table.FlexRender header={header} />
                    </span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
