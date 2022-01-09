import React from "react";
import Page from "components/Page";
import TeamLogo from "components/TeamLogo";
import { useQuery } from "react-query";
import { backendFetch } from "utils/api";
import { Link } from "react-router-dom";
import Table from "components/Table";
import classes from "./style.module.css";
function Home() {
  const { data: teamData, isLoading, isError, refetch } = useQuery(
    "teams",
    () => backendFetch({ endpoint: "api/v1/teams/", omitToken: true })
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "",
        id: "name",
        width: 200,
        accessor: (row) => ({ name: row.name, code: row.code }),
        Cell: ({ value }) => (
          <div className={classes.logoCell}>
            <TeamLogo
              code={value.code}
              style={{ width: "24px", height: "auto", marginRight: "16px" }}
            />
            <Link to={`/teams/${value.code}/`}>{value.name}</Link>
          </div>
        ),
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
