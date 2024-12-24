import * as React from "react";
import Svg, { Path } from "react-native-svg";
const DisneyPlusLogo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    className="icon line-color"
    data-name="Line Color"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      d="M19 3v4m2-2h-4"
      fill="none"
      stroke="#2ca9bc"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Path
      d="m6.69 9 2 12"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Path
      d="M3 6s12.29-2 13.91 6.77c1.09 5.93-6.58 6.7-9.48 5.89S3 16.06 3 14.06C3 11 8.54 9.45 12 12"
      data-name="primary"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
);
export default DisneyPlusLogo;
