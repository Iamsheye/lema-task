import { useState } from "react";
import { Modal } from "./ui/Modal";

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
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    onSubmit({ title: title.trim(), body: body.trim() });

    // Reset form after submission
    setTitle("");
    setBody("");
  };

  const handleCancel = () => {
    setTitle("");
    setBody("");
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} title="New Post">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Post Title Field */}
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="post-title"
              className="text-lg font-medium text-[#535862]"
            >
              Post title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
              className="flex items-center rounded border border-[#E2E8F0] bg-white px-4 py-[10px] text-sm leading-[1.5] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none"
              required
            />
          </div>

          {/* Post Content Field */}
          <div className="flex flex-col gap-[10px]">
            <label
              htmlFor="post-content"
              className="text-lg font-medium text-[#535862]"
            >
              Post content
            </label>
            <textarea
              id="post-content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write something mind-blowing"
              rows={4}
              className="flex resize-none rounded border border-[#E2E8F0] bg-white px-4 py-[10px] text-sm leading-[1.5] placeholder:text-[#94A3B8] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
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
            disabled={isSubmitting || !title.trim() || !body.trim()}
            className="flex h-10 items-center justify-center gap-2 rounded border border-[#334155] bg-[#334155] px-4 text-sm leading-[1.5] font-semibold text-white hover:bg-[#475569] focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
