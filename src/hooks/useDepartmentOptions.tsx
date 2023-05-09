import { useQuery } from "react-query";
import { get } from "@/lib";

export function useDepartmentOptions() {
  const {
    data = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["department-options"],
    queryFn: async () =>
      await get({
        url: `/api/user`,
        key: "users",
      }),
  });

  return { data, isFetching, isLoading };
}
