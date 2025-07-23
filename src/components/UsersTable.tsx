import { createColumnHelper, flexRender } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Table } from "./ui/Table";
import type { Address, User } from "@/lib/database";
import type { FilterFn, SortingState } from "@tanstack/react-table";

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
    enableSorting: false,
    cell: (info) => (
      <span className="text-sm text-[#535862]">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const addressA = rowA.original.address;
      const addressB = rowB.original.address;

      // Handle null/undefined addresses
      if (!addressA && !addressB) return 0;
      if (!addressA) return 1;
      if (!addressB) return -1;

      // Sort by city, then state, then street
      const cityComparison = addressA.city.localeCompare(addressB.city);
      if (cityComparison !== 0) return cityComparison;

      const stateComparison = addressA.state.localeCompare(addressB.state);
      if (stateComparison !== 0) return stateComparison;

      return addressA.street.localeCompare(addressB.street);
    },
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
  const [sorting, setSorting] = useState<SortingState>([]);

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No users found"
      pagination={pagination}
      sorting={sorting}
      onSortingChange={setSorting}
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
