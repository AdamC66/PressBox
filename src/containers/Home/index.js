import React from "react";
import Page from "components/Page";
import { useQuery } from "react-query";
import Table from "components/Table";
import { backendFetch } from "utils/api";

function Home() {
  const { data: teamData, isLoading, isError, refetch } = useQuery(
    "teams",
    () => backendFetch({ endpoint: "api/v1/teams/", omitToken: true })
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        accessor: "name",
      },
      {
        Header: "Wins",
        accessor: "record.wins",
      },
      {
        Header: "Losses",
        accessor: "record.losses",
      },
      {
        Header: "OT",
        accessor: "record.ot",
      },
      {
        Header: "Points",
        accessor: "record.points",
      },
      {
        Header: "Games Played",
        accessor: "record.gamesPlayed",
      },
      {
        Header: "Goals For",
        accessor: "record.goalsScored",
      },
      {
        Header: "Goals Against",
        accessor: "record.goalsAgainst",
      },
    ],
    []
  );
  return (
    <Page>
      <Table data={teamData || []} columns={columns} />
    </Page>
  );
}

export default Home;
