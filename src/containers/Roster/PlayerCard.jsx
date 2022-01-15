import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import classes from "./style.module.css";
import Avatar from "react-avatar";

// Refactor to use forwardRef
const PlayerCard = React.forwardRef(({ player, className, ...other }, ref) => {
  return (
    <div className={clsx(classes.playerCard, className)} {...other} ref={ref}>
      <div>
        <Avatar name={player.fullName} size={50} round={true} />
      </div>
      <div className={classes.playerInfo}>
        <div>{player.fullName}</div>
        <div> {player.positionAbbv}</div>
        <div> {player.jerseyNumber}</div>
      </div>
    </div>
  );
});

PlayerCard.propTypes = {
  className: PropTypes.string,
  player: PropTypes.shape({
    id: PropTypes.number,
    fullName: PropTypes.string,
    jerseyNumber: PropTypes.number,
    positionCode: PropTypes.string,
    positionAbbv: PropTypes.string,
    captain: PropTypes.bool,
    alternateCaptain: PropTypes.bool,
    birthDate: PropTypes.string,
    birthCity: PropTypes.string,
    birthStateProvince: PropTypes.string,
    birthCountry: PropTypes.string,
    nationality: PropTypes.string,
    weight: PropTypes.number,
    height: PropTypes.string,
  }).isRequired,
};

export default PlayerCard;
