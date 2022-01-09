import React from "react";
import { useQuery } from "react-query";
import { backendFetch } from "utils/api";
import { useParams } from "react-router-dom";
import TeamLogo from "components/TeamLogo";
function TeamPage() {
  const { teamCode } = useParams();
  const { data: teamData, isLoading, isError } = useQuery(
    ["teams", teamCode],
    () =>
      backendFetch({ endpoint: `api/v1/teams/${teamCode}/`, omitToken: true })
  );
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;

  return (
    <div>
      <TeamLogo code={teamCode} style={{ width: "200px", height: "auto" }} />
      <h3>{teamData.name}</h3>
      <div>
        <div>
          {" "}
          W: {teamData.record.wins} | L: {teamData.record.losses} | OTL:{" "}
          {teamData.record.ot}{" "}
        </div>
        <div>
          {" "}
          GP: {teamData.record.gamesPlayed} | GF: {teamData.record.goalsScored}{" "}
          | GA: {teamData.record.goalsAgainst} | streak:{" "}
          {teamData.record.streakLength} {teamData.record.streakType}{" "}
        </div>
        <div>
          <h6>PTS: {teamData.record.points}</h6>
        </div>
      </div>
    </div>
  );
}

TeamPage.propTypes = {};

export default TeamPage;
