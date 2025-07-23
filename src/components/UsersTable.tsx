import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Link } from "@tanstack/react-router";
import { Loading } from "./ui/Loading";
import { Pagination } from "./ui/Pagination";
import type { Address, User } from "@/lib/database";
import type { FilterFn } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

type UserWithAddress = User & {
  address?: Address;
};

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
  return itemRank.passed;
};

const columnHelper = createColumnHelper<UserWithAddress>();

const columns = [
  columnHelper.accessor("name", {
    header: "Full Name",
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: (info) => (
      <span className="text-sm font-medium text-[#535862]">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email Address",
    cell: (info) => (
      <span className="text-sm text-[#535862]">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => {
      const address = info.getValue();
      if (!address)
        return <span className="text-sm text-[#535862]">No address</span>;

      return (
        <span className="block truncate text-sm text-[#535862]">
          {address.street}, {address.state}, {address.city}, {address.zipcode}
        </span>
      );
    },
  }),
];

interface UsersTableProps {
  loading: boolean;
  data: Array<UserWithAddress>;
  pagination?: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (page: number) => void;
  };
}

export function UsersTable({ loading, data, pagination }: UsersTableProps) {
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount ?? -1,
    state: {
      pagination: pagination
        ? {
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }
        : undefined,
    },
  });

  return (
    <div className="overflow-hidden overflow-x-auto">
      <div className="rounded-lg border border-[#E9EAEB] bg-white">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-[#E9EAEB] px-6 py-3 text-left text-xs font-medium text-[#535862]"
                    style={{
                      minWidth:
                        header.column.id === "address" ? "392px" : "auto",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
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
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-[#E9EAEB]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="h-72">
                  <div className="grid h-full place-items-center">
                    <Loading className="mx-auto" />
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-4 text-center">
                  No users found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, rowIndex) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "border-b border-[#E9EAEB] px-6 py-4 text-sm",
                        rowIndex === table.getRowModel().rows.length - 1 &&
                          "border-none",
                      )}
                      style={{
                        minWidth:
                          cell.column.id === "address" ? "392px" : "auto",
                      }}
                    >
                      <Link to="/users/$id" params={{ id: row.original.id }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.pageIndex + 1}
            totalPages={pagination.pageCount}
            onPageChange={(page) => pagination.onPageChange(page - 1)}
          />
        </div>
      )}
    </div>
  );
}
