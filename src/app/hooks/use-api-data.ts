import useSWR from "swr";
import { fetcherSWR } from "@/lib/api/crave-client";

const SWR_CONFIG = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
};

const useApiData = <T = any>(endpoint: string, shouldFetch = true) => {
  const { data, error, mutate } = useSWR<T>(
    shouldFetch ? endpoint : null, // ✅ Fetch only if `shouldFetch` is true
    fetcherSWR,
    SWR_CONFIG
  );

  return {
    data,
    error: error
      ? typeof error === "string"
        ? error
        : error.message || "An error occurred"
      : undefined,
    isLoading: !data && !error,
    mutate,
  };
};

export default useApiData;
