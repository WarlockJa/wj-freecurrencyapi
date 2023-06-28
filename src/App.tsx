import "./App.scss";
import Error from "./Components/Error";
import FreeCurrencyAPI from "./Components/FreeCurrencyAPI";
import Loading from "./Components/Loading";
import useFetch from "./hooks/useFetch";

function App() {
  const { isLoading, data, error } = useFetch(
    import.meta.env.VITE_APP_FREECURRENCYAPI_URL
  );

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <main>
      <FreeCurrencyAPI data={data!} />
    </main>
  );
}

export default App;
