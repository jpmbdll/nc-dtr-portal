import { useQuery } from "react-query";
import { get } from "@/lib";

export function useUserStatusOptions() {
  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["user-status-options"],
    queryFn: async () =>
      await get({
        url: `api/user`,
        key: "users",
      }),
  });

  return { data, isFetching, isLoading };
}
