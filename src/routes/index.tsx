import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTRPC } from "@/integrations/trpc/react";
import { UsersTable } from "@/components/UsersTable";

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.users.listWithAddresses.queryOptions({ page: 1, limit: 4 }),
    );
  },
});

function App() {
  const trpc = useTRPC();

  const [page, setPage] = useState(1);
  const limit = 4;

  const usersQuery = useQuery(
    trpc.users.listWithAddresses.queryOptions({ page, limit }),
  );

  const users = usersQuery.data?.users || [];
  const paginationData = usersQuery.data?.pagination;

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1); // Convert from 0-based to 1-based
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[3.75rem] leading-[1.2] font-medium tracking-[-0.02em]">
        Users
      </h1>
      {usersQuery.isError ? (
        <div className="text-red-500">Error loading users</div>
      ) : (
        <UsersTable
          loading={usersQuery.isLoading}
          data={users}
          pagination={
            paginationData
              ? {
                  pageIndex: paginationData.page - 1, // Convert to 0-based
                  pageSize: paginationData.limit,
                  pageCount: paginationData.totalPages,
                  onPageChange: handlePageChange,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
