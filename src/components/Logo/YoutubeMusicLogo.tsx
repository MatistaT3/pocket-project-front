import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const YoutubeMusicLogo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 176 176"
    {...props}
  >
    <Circle cx={88} cy={88} r={88} fill="red" />
    <Path
      fill="#FFF"
      d="M88 46c23.1 0 42 18.8 42 42s-18.8 42-42 42-42-18.8-42-42 18.9-42 42-42m0-4c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46z"
    />
    <Path fill="#FFF" d="m72 111 39-24-39-22z" />
  </Svg>
);
export default YoutubeMusicLogo;
