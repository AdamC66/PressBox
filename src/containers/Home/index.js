import React from "react";
import Page from "components/Page";
import { useQuery } from "react-query";
import { backendFetch } from "utils/api";

function Home() {
  const { isLoading, isError, refetch } = useQuery("heartbeat", () =>
    backendFetch({ endpoint: "heartbeat/", omitToken: true })
  );
  const Heartbeat = () => {
    if (isLoading) return "Loading...";
    if (isError) return "Error";
    return "Thump";
  };
  return (
    <Page>
      <div>Test Home Page</div>
      <div>
        <Heartbeat />
      </div>
      <button onClick={() => refetch({ stale: true })} type="submit">
        Test Heartbeat
      </button>
    </Page>
  );
}

export default Home;
