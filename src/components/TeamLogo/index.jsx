import React from "react";
import PropTypes from "prop-types";
import ANA from "./teamlogos/anaheim.png";
import ARI from "./teamlogos/arizona.png";
import BOS from "./teamlogos/boston.png";
import BUF from "./teamlogos/buffalo.png";
import CGY from "./teamlogos/calgary.png";
import CAR from "./teamlogos/carolina.png";
import CHI from "./teamlogos/chicago.png";
import COL from "./teamlogos/colorado.png";
import CBJ from "./teamlogos/columbus.png";
import DAL from "./teamlogos/dallas.png";
import DET from "./teamlogos/detroit.png";
import EDM from "./teamlogos/edmonton.png";
import FLA from "./teamlogos/florida.png";
import LAK from "./teamlogos/losangeles.png";
import MIN from "./teamlogos/minnesota.png";
import MTL from "./teamlogos/montreal.png";
import NSH from "./teamlogos/nashville.png";
import NJD from "./teamlogos/newjersey.png";
import NYI from "./teamlogos/newyorki.png";
import NYR from "./teamlogos/newyorkr.png";
import OTT from "./teamlogos/ottawa.png";
import PHI from "./teamlogos/philadelphia.png";
import PIT from "./teamlogos/pittsburgh.png";
import SJS from "./teamlogos/sanjose.png";
import SEA from "./teamlogos/seattle.png";
import STL from "./teamlogos/stlouis.png";
import TBL from "./teamlogos/tampabay.png";
import TOR from "./teamlogos/toronto.png";
import VAN from "./teamlogos/vancouver.png";
import VGK from "./teamlogos/vegas.png";
import WSH from "./teamlogos/washington.png";
import WPG from "./teamlogos/winnipeg.png";

const getLogo = (teamCode) => {
  switch (teamCode) {
    case "ANA":
      return ANA;
    case "ARI":
      return ARI;
    case "BOS":
      return BOS;
    case "BUF":
      return BUF;
    case "CGY":
      return CGY;
    case "CAR":
      return CAR;
    case "CHI":
      return CHI;
    case "COL":
      return COL;
    case "CBJ":
      return CBJ;
    case "DAL":
      return DAL;
    case "DET":
      return DET;
    case "EDM":
      return EDM;
    case "FLA":
      return FLA;
    case "LAK":
      return LAK;
    case "MIN":
      return MIN;
    case "MTL":
      return MTL;
    case "NSH":
      return NSH;
    case "NJD":
      return NJD;
    case "NYI":
      return NYI;
    case "NYR":
      return NYR;
    case "OTT":
      return OTT;
    case "PHI":
      return PHI;
    case "PIT":
      return PIT;
    case "SJS":
      return SJS;
    case "SEA":
      return SEA;
    case "STL":
      return STL;
    case "TBL":
      return TBL;
    case "TOR":
      return TOR;
    case "VAN":
      return VAN;
    case "VGK":
      return VGK;
    case "WSH":
      return WSH;
    case "WPG":
      return WPG;
    default:
      return null;
  }
};

function TeamLogo({ code, ...props }) {
  return <img src={getLogo(code)} alt={`${code}-logo`} {...props}></img>;
}

TeamLogo.propTypes = {};

export default TeamLogo;
