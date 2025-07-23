import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useTRPCErrorHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleError = (error: any) => {
      if (error?.data?.code) {
        // This is a TRPC error
        switch (error.data.code) {
          case "NOT_FOUND":
            toast.error(error.message || "Resource not found");
            break;
          case "UNAUTHORIZED":
            toast.error("You are not authorized to perform this action");
            break;
          case "BAD_REQUEST":
            toast.error(error.message || "Invalid request");
            break;
          case "INTERNAL_SERVER_ERROR":
            toast.error("Something went wrong on our end. Please try again.");
            break;
          default:
            toast.error(error.message || "An unexpected error occurred");
        }
      } else {
        // Handle other types of errors
        toast.error(error.message || "An error occurred");
      }
    };

    // Set up a global error handler for queries
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "observerResultsUpdated") {
        const { query } = event;
        if (query.state.status === "error" && query.state.error) {
          handleError(query.state.error);
        }
      }
    });

    // Set up a global error handler for mutations
    const unsubscribeMutations = queryClient
      .getMutationCache()
      .subscribe((event) => {
        if (event.type === "updated") {
          const { mutation } = event;
          if (mutation.state.status === "error" && mutation.state.error) {
            handleError(mutation.state.error);
          }
        }
      });

    return () => {
      unsubscribe();
      unsubscribeMutations();
    };
  }, [queryClient]);
}
