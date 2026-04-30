import { useEffect, useMemo, useState } from "react";
import { getPageDataClient } from "@/lib/cms-page-data";

export function useCmsPageData<T>(slug: string, fallback: T): T {
  const stableFallback = useMemo(() => fallback, []);
  const [data, setData] = useState<T>(stableFallback);

  useEffect(() => {
    let active = true;
    getPageDataClient<T>(slug, stableFallback)
      .then((next) => {
        if (active) setData(next);
      })
      .catch(() => {
        if (active) setData(stableFallback);
      });
    return () => {
      active = false;
    };
  }, [slug, stableFallback]);

  return data;
}
