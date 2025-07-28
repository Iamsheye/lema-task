import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./ui/Modal";
import { FormField, Input, Textarea } from "./ui/FormField";
import { Loading } from "./ui/Loading";

const postSchema = z.object({
  title: z
    .string()
    .min(1, "Post title is required")
    .max(64, "Post title must be less than 64 characters")
    .trim(),
  body: z
    .string()
    .min(1, "Post content is required")
    .max(512, "Post content must be less than 512 characters")
    .trim(),
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
    <Modal
      open={open}
      showCloseButton={false}
      onOpenChange={handleCancel}
      title="New Post"
    >
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
            className="border-border-light text-text-slate-600 flex h-10 items-center justify-center gap-1.5 rounded border bg-white px-4 text-sm leading-tight font-normal hover:bg-gray-50 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="bg-text-slate-600 hover:bg-button-hover flex h-10 cursor-pointer items-center justify-center gap-2 rounded px-4 text-sm leading-normal font-semibold text-white focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publish
            {isSubmitting && (
              <Loading
                size="sm"
                className={{
                  circle: "bg-white",
                }}
              />
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
