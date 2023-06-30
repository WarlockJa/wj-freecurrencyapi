import "./App.scss";
import Error from "./Components/Error";
import FreeCurrencyAPI from "./Components/FreeCurrencyAPI";
import Loading from "./Components/Loading";
import useFetch from "./hooks/useFetch";
import setTheme from "./util/setTheme";

function App() {
  const params = new URLSearchParams(window.location.search);
  const theme = params.get("theme");
  if (theme) setTheme(theme);

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
