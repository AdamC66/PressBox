import React from "react";
import PropTypes from "prop-types";
import * as _ from "lodash";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { backendFetch } from "utils/api";
import { useQuery } from "react-query";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import PlayerCard from "./PlayerCard";
import classes from "./style.module.css";

const getLineupPositions = (lineupSection, num) => {
  const forwards = ["LW", "C", "RW"];
  const defence = ["LD", "RD"];
  const goalie = ["G", "BG"];
  switch (lineupSection) {
    case "forwards":
      return forwards[num];
    case "defencemen":
      return defence[num];
    case "goalies":
      return goalie[num];
    default:
      return "";
  }
};
const tempForwardLines = {
  1: [15, 20, 18],
  2: [12, 7, 13],
  3: [1, 22, 16],
  4: [24, 2, 4],
};
const tempDefencemenLines = {
  1: [11, 5],
  2: [3, 8],
  3: [23, 17],
};
const tempGoalieLines = {
  1: [9, 10],
};
const flattenLines = (lineup) => {
  const lines = [];
  _.values(lineup).forEach((line) => {
    lines.push(...line);
  });
  return lines;
};
function Roster() {
  const { teamCode } = useParams();
  const [forwards, setForwards] = React.useState(tempForwardLines);
  const [defencemen, setDefencemen] = React.useState(tempDefencemenLines);
  const [goalies, setGoalies] = React.useState(tempGoalieLines);
  const [players, setPlayers] = React.useState([]);
  const [bench, setBench] = React.useState([]);

  const getPlayerByCode = (code) => {
    return _.find(players, { id: code });
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
        const flattendForwardLines = flattenLines(forwards);
        const flattendDefencemenLines = flattenLines(defencemen);
        const flattendGoalieLines = flattenLines(goalies);
        const combinedFlattendLines = [
          ...flattendForwardLines,
          ...flattendDefencemenLines,
          ...flattendGoalieLines,
        ];
        setPlayers(data);
        setBench(
          data.filter((player) => !combinedFlattendLines.includes(player.id))
        );
      },
    }
  );
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error!</p>;
  const getAndSet = (lineupSection) => {
    switch (lineupSection) {
      case "forwards":
        return [forwards, setForwards];
      case "defencemen":
        return [defencemen, setDefencemen];
      case "goalies":
        return [goalies, setGoalies];
      default:
        return [[], () => {}];
    }
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    const { droppableId: sourceArea, index: sourceIndex } = source;
    const {
      droppableId: destinationArea,
      index: destinationIndex,
    } = destination;
    const sourceLineIndex = sourceArea.split("-");
    const destinationLineIndex = destinationArea.split("-");
    const sourceSection = sourceLineIndex[0];
    const destinationSection = destinationLineIndex[0];

    const sourcePlayer = getPlayerByCode(sourceIndex);
    const destinationPlayer = getPlayerByCode(destinationIndex);

    if (sourceSection === "bench" && destinationSection === "bench") {
      // Reorder bench
      const newBench = [...bench];
      newBench.splice(_.indexOf(bench, sourcePlayer), 1);
      newBench.splice(destinationIndex, 0, sourcePlayer);
      console.log(newBench);
      setBench(newBench);
    } else if (sourceSection === "bench") {
      // Move bench to Active
      const destinationLine = destinationLineIndex[3];
      const destinationPosition = destinationLineIndex[1];
      const [destination, setDestination] = getAndSet(destinationSection);
      console.log(destination);
      const newDestination = { ...destination };
      newDestination[destinationLine][destinationPosition] = getPlayerByCode(
        sourceIndex
      ).id;
      const newBench = [...bench];
      newBench.splice(_.indexOf(bench, sourcePlayer), 1);
      setDestination(newDestination);
      if (destinationPlayer) {
        // Add player back to bench
        newBench.splice(destinationIndex, 0, destinationPlayer);
        setBench(newBench);
      }
      setBench(newBench);
    } else {
      const [destination, setDestination] = getAndSet(destinationSection);
      const [source, setSource] = getAndSet(sourceSection);
      const destinationLine = destinationLineIndex[3];
      const destinationPosition = destinationLineIndex[1];
      const sourceLine = sourceLineIndex[3];
      const sourcePosition = sourceLineIndex[1];
      const newDestination = { ...destination };
      newDestination[destinationLine][destinationPosition] = sourcePlayer.id;
      const newSource = { ...source };
      newSource[sourceLine][sourcePosition] = destinationPlayer.id;
      setDestination(newDestination);
      setSource(newSource);
    }
  };
  const getContent = (lineupSection, columnIndex, rowIndex) => {
    const [lineup] = getAndSet(lineupSection);
    try {
      if (lineup[rowIndex][columnIndex]) {
        const playerId = lineup[rowIndex][columnIndex];
        return (
          <Draggable
            key={playerId}
            draggableId={`draggable-${playerId}`}
            index={playerId}
          >
            {(provided, snapshot) => (
              <PlayerCard
                className={classes.forwardCard}
                key={playerId}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                player={getPlayerByCode(playerId)}
                ref={provided.innerRef}
              />
            )}
          </Draggable>
        );
      }
      return null;
    } catch (e) {
      if (e instanceof TypeError) {
        return null;
      }
      throw e;
    }
  };
  const makeDropZones = (lineupSection, columns, rowIndex) => {
    let dropZones = [];
    for (let i = 0; i < columns; i++) {
      dropZones.push(
        <Droppable
          droppableId={`${lineupSection}-${i}-row-${rowIndex}`}
          key={i}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={clsx(
                classes.dropZone,
                snapshot.isDraggingOver && classes.dropZoneHighlight
              )}
            >
              {getContent(lineupSection, i, rowIndex) &&
              !snapshot.isDraggingOver ? (
                getContent(lineupSection, i, rowIndex)
              ) : (
                <div>
                  {!snapshot.isDraggingOver &&
                    getLineupPositions(lineupSection, i)}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
    return dropZones;
  };

  return (
    <div className={classes.root}>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <div className={classes.activeRoster}>
          {/* Forwards */}
          <div>
            <button
              onClick={() => {
                console.log({
                  forwards,
                  defencemen,
                  goalies,
                });
              }}
            >
              Log Lines
            </button>
            <h3>Forwards</h3>
            {/* Create 4 rows of 3 forward lines */}
            <div className={classes.forwardArea}>
              {makeDropZones("forwards", 3, 1)}
            </div>
            <div className={classes.forwardArea}>
              {makeDropZones("forwards", 3, 2)}
            </div>
            <div className={classes.forwardArea}>
              {makeDropZones("forwards", 3, 3)}
            </div>
            <div className={classes.forwardArea}>
              {makeDropZones("forwards", 3, 4)}
            </div>
          </div>
          <div>
            <h3>Defence</h3>
            {/* Create 4 rows of 3 forward lines */}
            <div className={classes.forwardArea}>
              {makeDropZones("defencemen", 2, 1)}
            </div>
            <div className={classes.forwardArea}>
              {makeDropZones("defencemen", 2, 2)}
            </div>
            <div className={classes.forwardArea}>
              {makeDropZones("defencemen", 2, 3)}
            </div>
          </div>
          <div>
            <h3>Goalies</h3>
            {/* Create 4 rows of 3 forward lines */}
            <div className={classes.forwardArea}>
              {makeDropZones("goalies", 2, 1)}
            </div>
          </div>
        </div>
        <div className={classes.bench}>
          <h3>Scratches</h3>
          <Droppable droppableId="bench">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {bench.map((player, index) => (
                  <Draggable
                    key={parseInt(player.id, 10)}
                    draggableId={`draggable-${player.id}`}
                    index={parseInt(player.id, 10)}
                  >
                    {(provided, snapshot) => (
                      <PlayerCard
                        key={parseInt(player.id, 10)}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        player={player}
                        ref={provided.innerRef}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}

Roster.propTypes = {};

export default Roster;
