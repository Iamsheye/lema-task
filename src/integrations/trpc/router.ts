import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DatabaseService } from "../../lib/database";
import { createTRPCRouter, publicProcedure } from "./init";

import type { TRPCRouterRecord } from "@trpc/server";

const usersRouter = {
  listWithAddresses: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
      }),
    )
    .query(({ input }) => {
      const offset = (input.page - 1) * input.limit;
      const result = DatabaseService.getUsersWithAddresses(input.limit, offset);

      return {
        users: result.users,
        pagination: {
          page: input.page,
          limit: input.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / input.limit),
        },
      };
    }),
} satisfies TRPCRouterRecord;

const postsRouter = {
  listByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ input }) => {
      const user = DatabaseService.getUserById(input.userId);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const posts = DatabaseService.getPostsByUserId(input.userId);
      return {
        user,
        posts,
      };
    }),
  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .mutation(({ input }) => {
      const user = DatabaseService.getUserById(input.userId);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const post = DatabaseService.createPost({
        userId: input.userId,
        title: input.title,
        body: input.body,
      });

      return {
        post,
      };
    }),
  delete: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // Check if post exists first
      if (!DatabaseService.postExists(input.postId)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const success = DatabaseService.deletePost(input.postId);
      if (!success) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }

      return {
        success: true,
        message: "Post deleted successfully",
      };
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  users: usersRouter,
  posts: postsRouter,
});
export type TRPCRouter = typeof trpcRouter;
