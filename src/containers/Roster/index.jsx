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

const getForwardPosition = (num) => {
  const positions = ["LW", "C", "RW"];
  return positions[num];
};

function Roster() {
  const { teamCode } = useParams();
  const [forwards, setForwards] = React.useState({
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [defensemen, setDefensemen] = React.useState([]);
  const [goalies, setGoalies] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [bench, setBench] = React.useState([]);
  const getLineupGrid = (lineSize, playerGroup) => {
    const playerGroupArrays = [];
    for (let i = 0; i < playerGroup.length; i += lineSize) {
      playerGroupArrays.push(playerGroup.slice(i, i + lineSize));
    }
    return playerGroupArrays;
  };
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
        setPlayers(data);
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
    const sourceLineIndex = sourceArea.split("-");
    const destinationLineIndex = destinationArea.split("-");
    console.log(sourceLineIndex, sourceIndex);
    console.log(destinationLineIndex, destinationIndex);
    const sourceSection = sourceLineIndex[0];
    const destinationSection = destinationLineIndex[0];
    if (sourceSection === "bench" && destinationSection === "bench") {
      // Reorder bench
      const newBench = [...players];
      newBench.splice(sourceIndex, 1);
      newBench.splice(destinationIndex, 0, players[sourceIndex]);
      console.log(newBench);
      setPlayers(newBench);
    }
    if (sourceSection === "bench" && destinationSection === "forwards") {
      // Move bench to forwards
      const destinationLine = destinationLineIndex[3];
      const destinationPosition = destinationLineIndex[1];
      const newForwards = { ...forwards };
      console.log(getPlayerByCode(sourceIndex));
      newForwards[destinationLine][destinationPosition] = getPlayerByCode(
        sourceIndex
      );
      const newBench = [...players];
      newBench.splice(sourceIndex, 1);
      setForwards(newForwards);
      setBench(newBench);
      console.log(newForwards);
    }
  };
  const getContent = (lineupSection, columnIndex, rowIndex) => {
    if (lineupSection === "forwards") {
      try {
        console.log(forwards[rowIndex][columnIndex]);
        if (forwards[rowIndex][columnIndex]) {
          const player = forwards[rowIndex][columnIndex];
          return (
            <Draggable
              key={parseInt(player.id, 10)}
              draggableId={`draggable-${player.id}`}
              index={parseInt(player.id, 10)}
            >
              {(provided, snapshot) => (
                <PlayerCard
                  className={classes.forwardCard}
                  key={parseInt(player.id, 10)}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  player={player}
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
                <div>{getForwardPosition(i)}</div>
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
        </div>
        <div className={classes.bench}>
          <Droppable droppableId="bench">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {players.map((player, index) => (
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
