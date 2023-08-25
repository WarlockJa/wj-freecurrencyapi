import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TFreeCurrencyApiData } from "../hooks/useFetch";
import "./freecurrencyapi.scss";
import { useEffect, useMemo, useState } from "react";
import useGetYesterdayDate from "../hooks/useGetYesterdayDate";
import useGetCurrencyOptions from "../hooks/useGetCurrencyOptions";
import transformApiHistoricalDataToGraphFormat from "../util/transformApiHistoricalDataToGraphFormat";

const FreeCurrencyAPI = ({ data }: { data: TFreeCurrencyApiData }) => {
  // getting yesterday date in format YYYY-MM-DD
  const { yesterday } = useGetYesterdayDate(new Date().getDate());
  // currency states
  const [firstCurrency, setFirstCurrency] = useState("USD");
  const [secondCurrency, setSecondCurrency] = useState("TRY");
  // data used by inputs
  const [firstCurrencyInput, setFirstCurrencyInput] = useState<string>("");
  const [secondCurrencyInput, setSecondCurrencyInput] = useState<string>("");
  // generating translated select options
  const currencyOptions = useGetCurrencyOptions();

  // setting initial exchange values on form load
  useEffect(() => {
    data[yesterday] && handleExchange("1", "first");
  }, [yesterday]);

  // show exchange rate based on the data from api and value from input fields
  const handleExchange = (value: string, source: string) => {
    const currencyValue = Number(value);
    if (isNaN(currencyValue) || value === "") {
      if (source === "first") {
        setFirstCurrencyInput(value);
        setSecondCurrencyInput("");
      } else {
        setSecondCurrencyInput(value);
        setFirstCurrencyInput("");
      }
    } else {
      if (source === "first") {
        setFirstCurrencyInput(value);
        setSecondCurrencyInput(
          (
            (data[yesterday][secondCurrency] / data[yesterday][firstCurrency]) *
            currencyValue
          ).toFixed(4)
        );
      } else {
        setSecondCurrencyInput(value);
        setFirstCurrencyInput(
          (
            (data[yesterday][firstCurrency] / data[yesterday][secondCurrency]) *
            currencyValue
          ).toFixed(4)
        );
      }
    }
  };

  // handling currency change including switching already present currencies
  const handleSelect = (value: string, source: string) => {
    if (source === "first") {
      // changing first currency
      if (value === secondCurrency) {
        // chosen new currency is the same as second -> switching currency fields
        setSecondCurrency(firstCurrency);
        setSecondCurrencyInput(firstCurrencyInput);
        setFirstCurrencyInput(secondCurrencyInput);
      } else {
        // chosen new currency -> calculating exchange for the new currency
        setFirstCurrencyInput(
          (data[yesterday][value] / data[yesterday][secondCurrency]).toFixed(4)
        );
      }
      setFirstCurrency(value);
    } else {
      // changing second currency
      if (value === firstCurrency) {
        // chosen new currency is the same as second -> switching currency fields
        setFirstCurrency(secondCurrency);
        setFirstCurrencyInput(secondCurrencyInput);
        setSecondCurrencyInput(firstCurrencyInput);
      } else {
        // chosen new currency -> calculating exchange for the new currency
        setSecondCurrencyInput(
          (data[yesterday][value] / data[yesterday][firstCurrency]).toFixed(4)
        );
      }
      setSecondCurrency(value);
    }
  };

  // preparing data for the graph
  const graphData = useMemo(
    () => transformApiHistoricalDataToGraphFormat(data, firstCurrency),
    [data, firstCurrency]
  );

  // formatting excessive floating point on graph Y axis
  const yAxisTickFormatter = (value: number) => {
    return value.toFixed(3);
  };

  return (
    <div className="freeCurrencyApi__formWrapper">
      <div className="formWrapper__inputsWrapper">
        <h3 className="formWrapper__inputsWrapper--h3">
          {firstCurrency} {"=>"} {secondCurrency}
        </h3>
        <div className="inputsWrapper__currency inputsWrapper__firstCurrency">
          <input
            className="inputsWrapper__currency--input"
            value={firstCurrencyInput}
            onChange={(e) => handleExchange(e.target.value, "first")}
          />
          <select
            className="inputsWrapper__currency--select"
            value={firstCurrency}
            onChange={(e) => handleSelect(e.target.value, "first")}
          >
            {currencyOptions}
          </select>
        </div>
        <div className="inputsWrapper__currency inputsWrapper__secondCurrency">
          <input
            className="inputsWrapper__currency--input"
            value={secondCurrencyInput}
            onChange={(e) => handleExchange(e.target.value, "second")}
          />
          <select
            className="inputsWrapper__currency--select"
            value={secondCurrency}
            onChange={(e) => handleSelect(e.target.value, "second")}
          >
            {currencyOptions}
          </select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart
          data={graphData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            domain={["dataMin", "dataMax"]}
            tickFormatter={yAxisTickFormatter}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--clr-button-bg)",
              fontSize: "0.8rem",
              textAlign: "center",
              borderRadius: "4px",
            }}
            itemStyle={{ margin: 0 }}
          />
          <Area
            type="monotone"
            dataKey={secondCurrency}
            stroke="#8884d8"
            fill="#8884d8"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FreeCurrencyAPI;
