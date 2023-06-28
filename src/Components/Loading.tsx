import Spinner from "./Spinner";
import "./loading.scss";

const Loading = () => {
  return (
    <main className="loading">
      <div className="loading__spinnerWrapper">
        <Spinner />
      </div>
    </main>
  );
};

export default Loading;
