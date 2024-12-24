import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const SmartFitLogo = (props) => (
  <Svg viewBox="1000 0 546 546" {...props}>
    <Defs>
      <ClipPath id="clip-path">
        <Path d="M1000 0h546v546H1000z" fill="#fbba00" />
      </ClipPath>
      <ClipPath id="clip-path-2">
        <Path d="M1000 0h546v546H1000z" fill="#fbba00" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip-path)">
      <G clipPath="url(#clip-path-2)">
        <Path
          d="M1010.65 401.58v-296.4c0-100.59 105.71-122.19 181.17-93.5V68c-51.86-21.13-110.13-16.26-110.13 49.33H1166v56.27h-84.31v226.88ZM1345.34 73.37h52.5l10.78 44h65.3v56.23h-57.51v131q0 39.36 34 39.4h36v56.24h-70.28q-70.78 0-70.78-75.81Z"
          fill="#fbba00"
        />
        <Path
          d="M1220.16 117.35h71.04V400.2h-71.04zM1220.16 14.98h71.04v58.39h-71.04z"
          fill="#fbba00"
        />
        <Path
          d="M1546 400.28c-62.42 98.42-172.33 163.78-297.49 163.78s-235-65.36-297.45-163.79c73.35 67.56 179.46 110 297.45 110s224.13-42.47 297.49-110"
          fill="#fbba00"
        />
      </G>
    </G>
  </Svg>
);

export default SmartFitLogo;
