import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";

const NetflixLogo = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="51.5 16 262.9 480">
    <Defs>
      <LinearGradient
        id="a"
        x1={108.142}
        x2={176.518}
        y1={240.643}
        y2={189.038}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#c20000" stopOpacity={0} />
        <Stop offset={1} stopColor="#9d0000" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={400.786}
        x2={338.861}
        y1={312.035}
        y2={337.837}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#c20000" stopOpacity={0} />
        <Stop offset={1} stopColor="#9d0000" />
      </LinearGradient>
    </Defs>
    <Path
      fill="#c20000"
      d="M216.398 16h-91.87v480c30.128-7.135 61.601-10.708 91.87-12.052z"
    />
    <Path
      fill="url(#a)"
      d="M216.398 16h-91.87v367.267c30.128-7.135 61.601-10.707 91.87-12.051z"
    />
    <Path
      fill="#c20000"
      d="M387.472 496V16h-91.87v468.904c53.636 3.416 91.87 11.096 91.87 11.096z"
    />
    <Path
      fill="url(#b)"
      d="M387.472 496V177.445h-91.87v307.459c53.636 3.416 91.87 11.096 91.87 11.096z"
    />
    <Path
      fill="#fa0000"
      d="M387.472 496 216.398 16h-91.87l167.03 468.655c55.75 3.276 95.914 11.345 95.914 11.345z"
    />
  </Svg>
);

export default NetflixLogo;
