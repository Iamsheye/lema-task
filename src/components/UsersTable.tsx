import { createColumnHelper, flexRender } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Link } from "@tanstack/react-router";
import { Table } from "./ui/Table";
import type { Address, User } from "@/lib/database";
import type { FilterFn } from "@tanstack/react-table";

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
  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No users found"
      pagination={pagination}
      filterFns={{
        fuzzy: fuzzyFilter,
      }}
      renderCell={(cell) => (
        <Link to="/users/$id" params={{ id: cell.row.original.id }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </Link>
      )}
    />
  );
}
