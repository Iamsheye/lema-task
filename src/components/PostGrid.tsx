import { PlusCircle, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { CreatePostModal } from "./CreatePostModal";
import type { Post } from "@/lib/database";
import { useTRPC } from "@/integrations/trpc/react";

interface PostGridProps {
  posts: Array<Post>;
  userId: string;
}

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}

function NewPostCard({
  onNewPost,
  isCreating,
}: {
  onNewPost: () => void;
  isCreating?: boolean;
}) {
  return (
    <button
      title="Create New Post"
      onClick={() => onNewPost()}
      disabled={isCreating}
      className="border-border-default flex h-[293px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-white p-6 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <PlusCircle size={20} className="text-text-muted" />
      <span className="text-text-muted text-sm font-semibold">
        {isCreating ? "Creating..." : "New Post"}
      </span>
    </button>
  );
}

function PostCard({ post, onDelete, isDeleting }: PostCardProps) {
  return (
    <div className="border-border-default relative flex h-[293px] w-full flex-col gap-4 rounded-lg border bg-white py-6 shadow-[0px_2px_4px_-2px_rgba(10,13,18,0.06),0px_4px_8px_-2px_rgba(10,13,18,0.1)]">
      <button
        onClick={() => onDelete(post.id)}
        disabled={isDeleting}
        className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-transparent hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Delete post"
        title="Delete post"
      >
        <Trash2 className="text-text-danger size-3" />
      </button>

      <h3 className="text-text-secondary px-6 text-lg leading-tight font-medium">
        {post.title}
      </h3>

      <div className="flex-1 overflow-auto px-6">
        <p className="text-text-secondary text-sm leading-relaxed">
          {post.body}
        </p>
      </div>
    </div>
  );
}

export function PostGrid({ posts, userId }: PostGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/trpc/posts.delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json: { postId } }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.posts.listByUser.queryKey({ userId }),
      });
      toast.success("Post deleted successfully");
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: { title: string; body: string }) => {
      const response = await fetch(`/api/trpc/posts.create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: {
            userId,
            title: data.title,
            body: data.body,
          },
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.posts.listByUser.queryKey({ userId }),
      });
      setIsModalOpen(false);
    },
  });

  const handleNewPost = () => {
    setIsModalOpen(true);
  };

  const handleCreatePost = (data: { title: string; body: string }) => {
    createPostMutation.mutate(data);
  };

  const handleDeletePost = (postId: string) => {
    deletePostMutation.mutate(postId);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NewPostCard
          onNewPost={handleNewPost}
          isCreating={createPostMutation.isPending}
        />

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            isDeleting={deletePostMutation.isPending}
          />
        ))}
      </div>

      <CreatePostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreatePost}
        isSubmitting={createPostMutation.isPending}
      />
    </>
  );
}
