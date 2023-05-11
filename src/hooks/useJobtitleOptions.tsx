import { useQuery } from "react-query";
import { get } from "@/lib";

export function useJobTitleOptions() {
  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["jobTitle-options"],
    queryFn: async () =>
      await get({
        url: `api/user`,
        key: "users",
      }),
  });

  return { data, isFetching, isLoading };
}
