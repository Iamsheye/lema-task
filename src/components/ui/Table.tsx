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
  /** Table data */
  data: Array<TData>;
  /** Column definitions */
  columns: Array<ColumnDef<TData, any>>;
  /** Loading state */
  loading?: boolean;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom empty state component */
  emptyComponent?: ReactNode;
  /** Table container className */
  className?: string;
  /** Custom filter functions */
  filterFns?: Record<string, FilterFn<TData>>;
  /** Pagination configuration */
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
  /** Manual pagination mode */
  manualPagination?: boolean;
  /** Sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Manual sorting mode */
  manualSorting?: boolean;
  /** Custom row renderer */
  renderRow?: (row: any, rowIndex: number) => ReactNode;
  /** Custom cell renderer */
  renderCell?: (cell: any, rowIndex: number) => ReactNode;
  /** Table options override */
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
          <Loading className="mx-auto" />
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
            "border-b border-[#E9EAEB] px-6 py-4 text-sm",
            rowIndex === table.getRowModel().rows.length - 1 && "border-none",
          )}
          style={{
            minWidth: cell.column.id === "address" ? "392px" : undefined,
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
          "overflow-auto rounded-lg border border-[#E9EAEB] bg-white",
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
                    className="border-b border-[#E9EAEB] px-6 py-3 text-left text-xs font-medium text-[#535862]"
                    style={{
                      minWidth:
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

          <tbody className="divide-y divide-[#E9EAEB]">
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
