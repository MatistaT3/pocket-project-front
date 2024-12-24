import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";

const ICloudLogo = (props) => (
  <Svg viewBox="0 0 80 52" {...props}>
    <Defs>
      <LinearGradient
        id="b"
        x1={-108.903}
        x2={-1137.198}
        y1={2124.834}
        y2={2110.651}
        gradientTransform="matrix(.0774 0 0 .0774 88.374 -128.026)"
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset={0} stopColor="#3e82f4" stopOpacity={1} />
        <Stop offset={1} stopColor="#93dcf7" stopOpacity={1} />
      </LinearGradient>
    </Defs>
    <Path
      d="M45.864.751a21.519 21.519 0 0 0-18.736 11.014 11.804 11.804 0 0 0-5.152-1.192 11.804 11.804 0 0 0-11.621 9.916A16.255 16.255 0 0 0 .378 35.482a16.255 16.255 0 0 0 16.263 16.24 16.255 16.255 0 0 0 2.039-.148h45.188a15.13 15.202 0 0 0 .713.035 15.13 15.202 0 0 0 .679-.035h1.082v-.08a15.13 15.202 0 0 0 13.361-15.087v-.03a15.13 15.202 0 0 0-12.317-14.9A21.519 21.519 0 0 0 45.864.751Z"
      opacity={1}
      fill="url(#b)"
      fillOpacity={1}
      stroke="none"
      strokeWidth={0}
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    />
  </Svg>
);

export default ICloudLogo;
