import { format, startOfYesterday } from "date-fns";
import { useEffect, useState } from "react";

const useGetYesterdayDate = (dayToday: number) => {
  const [yesterday, setYesterday] = useState<string>("");

  useEffect(() => {
    setYesterday(format(startOfYesterday(), "yyyy-MM-dd"));
  }, [dayToday]);

  return { yesterday };
};

export default useGetYesterdayDate;
