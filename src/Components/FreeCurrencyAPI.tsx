import { TFreeCurrencyApiData } from "../hooks/useFetch";
import "./freecurrencyapi.scss";

const FreeCurrencyAPI = ({ data }: { data: TFreeCurrencyApiData }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default FreeCurrencyAPI;
