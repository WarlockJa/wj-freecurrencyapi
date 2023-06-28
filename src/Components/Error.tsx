import "./error.scss";

const Error = ({ error }: { error: Error }) => {
  return (
    <main>
      <pre>{JSON.stringify(error, null, 2)}</pre>;
    </main>
  );
};

export default Error;
