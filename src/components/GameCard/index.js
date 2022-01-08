import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@blueprintjs/core";
function GameCard({ game }) {
  return (
    <Link to={`/games/${game.code}/`}>
      <Card>{game.name}</Card>
    </Link>
  );
}

export default GameCard;
