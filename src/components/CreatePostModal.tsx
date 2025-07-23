import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { FormField, Input, Textarea } from "./ui/FormField";

const postSchema = z.object({
  title: z.string().min(1, "Post title is required").trim(),
  body: z.string().min(1, "Post content is required").trim(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; body: string }) => void;
  isSubmitting?: boolean;
}

export function CreatePostModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: PostModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
  });

  const onFormSubmit = (data: PostFormData) => {
    onSubmit(data);
    reset();
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={handleCancel} title="New Post">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6">
          <FormField
            label="Post title"
            htmlFor="post-title"
            error={errors.title?.message}
          >
            <Input
              id="post-title"
              {...register("title")}
              placeholder="Give your post a title"
              error={!!errors.title}
            />
          </FormField>

          <FormField
            label="Post content"
            htmlFor="post-content"
            error={errors.body?.message}
          >
            <Textarea
              id="post-content"
              {...register("body")}
              placeholder="Write something mind-blowing"
              rows={4}
              error={!!errors.body}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex h-10 items-center justify-center gap-[6px] rounded border border-[#E2E8F0] bg-white px-4 text-sm leading-[1.21] font-normal text-[#334155] hover:bg-gray-50 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex h-10 items-center justify-center gap-2 rounded border border-[#334155] bg-[#334155] px-4 text-sm leading-[1.5] font-semibold text-white hover:bg-[#475569] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
