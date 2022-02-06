import React from "react";
import { useQuery } from "react-query";
import Page from "components/Page";

import { backendFetch } from "utils/api";
import { useParams } from "react-router-dom";
import TeamLogo from "components/TeamLogo";
import { COLORS } from "constants/colors";
import Roster from "containers/Roster";
import classes from "./style.module.css";
function TeamPage() {
  const { teamCode } = useParams();
  const { data: teamData, isLoading, isError } = useQuery(
    ["teams", teamCode],
    () =>
      backendFetch({ endpoint: `api/v1/teams/${teamCode}/`, omitToken: true })
  );
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  document.documentElement.style.setProperty(
    "--primary-color",
    COLORS[teamCode].primary
  );
  document.documentElement.style.setProperty(
    "--secondary-color",
    COLORS[teamCode].secondary
  );
  return (
    <Page className={classes.root}>
      <div className={classes.teamCard}>
        <TeamLogo code={teamCode} style={{ width: "200px", height: "auto" }} />
        <div className={classes.teamInfo}>
          <h3>{teamData.name}</h3>
          <div>
            {" "}
            W: {teamData.record.wins} | L: {teamData.record.losses} | OTL:{" "}
            {teamData.record.ot}{" "}
          </div>
          <div>
            {" "}
            GP: {teamData.record.gamesPlayed} | GF:{" "}
            {teamData.record.goalsScored} | GA: {teamData.record.goalsAgainst} |
            streak: {teamData.record.streakLength} {teamData.record.streakType}{" "}
          </div>
          <div>
            <h6>PTS: {teamData.record.points}</h6>
          </div>
        </div>
      </div>
      <Roster />
    </Page>
  );
}

TeamPage.propTypes = {};

export default TeamPage;
