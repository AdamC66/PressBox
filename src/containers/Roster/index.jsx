import React from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { backendFetch } from "utils/api";
import { useQuery } from "react-query";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import PlayerCard from "./PlayerCard";
import classes from "./style.module.css";
function Roster() {
  const { teamCode } = useParams();
  const [forwards, setForwards] = React.useState([]);
  const [defensemen, setDefensemen] = React.useState([]);
  const [goalies, setGoalies] = React.useState([]);
  const [bench, setBench] = React.useState([]);
  const getLineupGrid = (lineSize, playerGroup) => {
    const playerGroupArrays = [];
    for (let i = 0; i < playerGroup.length; i += lineSize) {
      playerGroupArrays.push(playerGroup.slice(i, i + lineSize));
    }
    return playerGroupArrays;
  };
  const { data: rosterData, isLoading, isError } = useQuery(
    ["roster", teamCode],
    () =>
      backendFetch({
        endpoint: `api/v1/teams/${teamCode}/roster/`,
        omitToken: true,
      }),
    {
      onSuccess: (data) => {
        const tempBench = [];
        // Set the first 12 players to forwards and the rest to bench
        const forwardData = data.filter(
          (player) =>
            player.positionAbbv === "LW" ||
            player.positionAbbv === "RW" ||
            player.positionAbbv === "C"
        );
        setForwards(getLineupGrid(3, forwardData.slice(0, 12)));
        tempBench.push(...forwardData.slice(12));

        // Set the first 6 defencemen to defensemen and the rest to bench
        const defensemenData = data.filter(
          (player) => player.positionAbbv === "D"
        );
        setDefensemen(defensemenData.slice(0, 6));
        tempBench.push(...defensemenData.slice(6));

        // Set the first 2 goalies to goalies and the rest to bench
        const goalieData = data.filter((player) => player.positionAbbv === "G");
        setGoalies(goalieData.slice(0, 2));
        tempBench.push(...goalieData.slice(2));

        setBench(tempBench);
      },
    }
  );
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  const onDragEnd = (result) => {
    console.log(result);
    const { source, destination } = result;
    const { droppableId: sourceArea, index: sourceIndex } = source;
    const {
      droppableId: destinationArea,
      index: destinationIndex,
    } = destination;
    const sourceLineIndex = parseInt(sourceArea.split("-")[1]);
    const destinationLineIndex = parseInt(destinationArea.split("-")[1]);
    console.log(sourceArea, destinationArea);
    console.log(sourceIndex, destinationIndex);
    const newLineup = [...forwards];
    const sourcePlayer = newLineup[sourceLineIndex][sourceIndex];
    const destinationPlayer = newLineup[destinationLineIndex][destinationIndex];
    console.log(sourcePlayer);
    console.log(destinationPlayer);
    if (destinationPlayer === undefined) {
      newLineup[destinationLineIndex][destinationIndex] = sourcePlayer;
      newLineup[sourceLineIndex][sourceIndex] =
        newLineup[destinationLineIndex][
          newLineup[destinationLineIndex].length - 1
        ];
    } else {
      newLineup[sourceLineIndex][sourceIndex] = destinationPlayer;
    }
    newLineup[destinationLineIndex][destinationIndex] = sourcePlayer;

    console.log(newLineup);
    setForwards(newLineup);
  };
  console.log(forwards);
  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <div className={classes.activeRoster}>
          {/* Forwards */}
          <div>
            <h3>Forwards</h3>
            {/* Create 4 rows of 3 forward lines */}
            {forwards.map((line, index) => (
              <div key={index} className={classes.line}>
                <Droppable
                  droppableId={`forwards-${index}`}
                  key={`forwards-${index}`}
                >
                  {(provided) => {
                    return (
                      <div
                        className={classes.forwardArea}
                        key={`forwards-${index}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {line.map((player, index) => (
                          <Draggable
                            key={player.id}
                            draggableId={player.fullName}
                            index={index}
                            direction="horizontal"
                          >
                            {(provided) => (
                              <PlayerCard
                                style={{ ...provided.draggableProps.style }}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={classes.forwardCard}
                                key={player.id}
                                player={player}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            ))}
          </div>
          <div className={classes.defenceArea}>
            {/* Defence */}
            {defensemen.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                className={classes.defenceCard}
              />
            ))}
          </div>
          <div className={classes.goalieArea}>
            {/* Goalies */}
            {goalies.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                className={classes.goalieCard}
              />
            ))}
          </div>
        </div>
        <div className={classes.bench}>
          {bench.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

Roster.propTypes = {};

export default Roster;
