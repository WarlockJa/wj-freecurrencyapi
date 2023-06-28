import { useEffect, useState } from "react";

export type TFreeCurrencyApiData = Record<string, Record<string, number>>;

interface IFreeCurrencyAPI_LocalData {
  data: TFreeCurrencyApiData;
  timestamp: number;
  url: string;
}

export default function useFetch(url: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TFreeCurrencyApiData | null>();
  const [error, setError] = useState(null);

  useEffect(() => {
    const localStorage_wj_freecurrencyapi =
      localStorage.getItem("wj_freecurrencyapi");
    const currencyapiLocalData: IFreeCurrencyAPI_LocalData =
      localStorage_wj_freecurrencyapi
        ? JSON.parse(localStorage_wj_freecurrencyapi)
        : undefined;

    // forming initial state if there is data and it is not older than 1 hour
    if (
      !currencyapiLocalData ||
      !currencyapiLocalData.timestamp ||
      !currencyapiLocalData.url ||
      currencyapiLocalData.url !== url ||
      currencyapiLocalData.timestamp + 60 * 1000 < Date.now()
    ) {
      console.log("fetching new currency data");
      fetch(url, {
        method: "GET",
        headers: {
          apikey: import.meta.env.VITE_APP_FREECURRENCYAPI_KEY!,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          setData(result);
          localStorage.setItem(
            "wj_freecurrencyapi",
            JSON.stringify({ timestamp: Date.now(), data: result, url })
          );
        })
        .catch((error) => setError(error))
        .finally(() => setIsLoading(false));
    } else {
      setData(currencyapiLocalData.data);
      setIsLoading(false);
    }
  }, [url]);

  return { data, isLoading, error };
}
