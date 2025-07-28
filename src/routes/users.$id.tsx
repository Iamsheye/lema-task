import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { NavigationButton } from "@/components/ui/NavigationButton";
import { useTRPC } from "@/integrations/trpc/react";
import { Loading } from "@/components/ui/Loading";
import { PostGrid } from "@/components/PostGrid";

export const Route = createFileRoute("/users/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const trpc = useTRPC();
  const postsQuery = useQuery({
    ...trpc.posts.listByUser.queryOptions({ userId: id }),
    enabled: !!id,
  });

  if (postsQuery.isLoading) {
    return (
      <div className="grid h-full place-items-center">
        <Loading />
      </div>
    );
  }

  const data = postsQuery.data;

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-4">
        <Link to="/">
          <NavigationButton
            icon={ArrowLeft}
            iconPosition="left"
            className="px-0"
          >
            Back to Users
          </NavigationButton>
        </Link>
        <h1 className="text-title text-primary leading-none font-medium tracking-tight">
          {data?.user.name}
        </h1>
        <p className="text-text-secondary text-sm">
          <span>{data?.user.email}</span> •{" "}
          <span className="font-medium">{data?.posts.length}</span> Posts
        </p>
      </div>

      <PostGrid posts={data?.posts || []} userId={id} />
    </div>
  );
}
