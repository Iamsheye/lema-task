import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loading } from "./Loading";
import { Pagination } from "./Pagination";
import type { ReactNode } from "react";
import type {
  ColumnDef,
  FilterFn,
  OnChangeFn,
  SortingState,
  TableOptions,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface TableProps<TData> {
  data: Array<TData>;
  columns: Array<ColumnDef<TData, any>>;
  loading?: boolean;
  loadingComponent?: ReactNode;
  emptyMessage?: string;
  emptyComponent?: ReactNode;
  className?: string;
  filterFns?: Record<string, FilterFn<TData>>;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  manualPagination?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  manualSorting?: boolean;
  renderRow?: (row: any, rowIndex: number) => ReactNode;
  renderCell?: (cell: any, rowIndex: number) => ReactNode;
  tableOptions?: Partial<TableOptions<TData>>;
}

export function Table<TData>({
  data,
  columns,
  loading = false,
  loadingComponent,
  emptyMessage = "No data found",
  emptyComponent,
  className,
  filterFns,
  pagination,
  manualPagination = !!pagination,
  sorting,
  onSortingChange,
  manualSorting = false,
  renderRow,
  renderCell,
  tableOptions = {},
}: TableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    filterFns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination,
    manualSorting,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }
        : undefined,
      sorting,
    },
    onSortingChange,
    ...tableOptions,
  });

  const defaultLoadingComponent = (
    <tr>
      <td colSpan={columns.length} className="h-72">
        <div className="grid h-full place-items-center">
          <Loading />
        </div>
      </td>
    </tr>
  );

  const defaultEmptyComponent = (
    <tr>
      <td colSpan={columns.length} className="py-4 text-center">
        {emptyMessage}
      </td>
    </tr>
  );

  const defaultRenderRow = (row: any, rowIndex: number) => (
    <tr key={row.id} className="hover:bg-gray-50">
      {row.getVisibleCells().map((cell: any) => (
        <td
          key={cell.id}
          className={cn(
            "border-border-table border-b px-6 py-4 text-sm",
            rowIndex === table.getRowModel().rows.length - 1 && "border-none",
          )}
          style={{
            width: cell.column.id === "address" ? "392px" : undefined,
          }}
        >
          {renderCell
            ? renderCell(cell, rowIndex)
            : flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );

  return (
    <div>
      <div
        className={cn(
          "border-border-table overflow-auto rounded-lg border bg-white",
          className,
        )}
      >
        <table className="w-max min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-text-secondary border-none px-6 py-3 text-left text-xs font-medium"
                    style={{
                      width:
                        header.column.id === "address" ? "392px" : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none hover:scale-105 transition-transform"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-border-table divide-y">
            {loading
              ? loadingComponent || defaultLoadingComponent
              : table.getRowModel().rows.length === 0
                ? emptyComponent || defaultEmptyComponent
                : table
                    .getRowModel()
                    .rows.map((row, rowIndex) =>
                      renderRow
                        ? renderRow(row, rowIndex)
                        : defaultRenderRow(row, rowIndex),
                    )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-6 overflow-auto">
          <Pagination
            className="w-max min-w-full"
            currentPage={pagination.pageIndex + 1}
            totalPages={pagination.pageCount}
            onPageChange={(page) => pagination.onPageChange(page - 1)}
          />
        </div>
      )}
    </div>
  );
}
