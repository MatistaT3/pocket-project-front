import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const AppleTvLogo = (props) => {
  const scale = 5.5;
  const originalWidth = 170;
  const originalHeight = 80;
  const viewBoxWidth = 1000;
  const viewBoxHeight = 1000;

  const centerX = (viewBoxWidth - originalWidth * scale) / 2;
  const centerY = (viewBoxHeight - originalHeight * scale) / 2;

  return (
    <Svg viewBox="0 0 1000 1000" {...props}>
      <Rect x="0" y="0" width="1000" height="1000" rx="240" fill="black" />
      <Path
        d="M43.882 12.701c2.733-3.419 4.588-8.01 4.1-12.701-4.002.199-8.886 2.64-11.713 6.062-2.538 2.93-4.785 7.713-4.2 12.208 4.493.39 8.98-2.246 11.813-5.569M47.93 19.147c-6.523-.388-12.07 3.703-15.185 3.703-3.117 0-7.888-3.507-13.047-3.412-6.716.098-12.947 3.895-16.355 9.935-7.01 12.08-1.85 30.002 4.966 39.841 3.31 4.868 7.3 10.228 12.556 10.035 4.967-.195 6.914-3.216 12.95-3.216 6.033 0 7.787 3.216 13.044 3.119 5.452-.098 8.86-4.87 12.171-9.743 3.797-5.55 5.352-10.907 5.45-11.202-.098-.097-10.513-4.093-10.61-16.073-.098-10.032 8.177-14.804 8.567-15.1-4.674-6.911-11.975-7.69-14.507-7.887M98.424 5.438v14.148h11.319v9.055H98.424v33.505c0 5.15 2.264 7.583 7.188 7.583 1.245 0 3.339-.17 4.074-.283v9.055c-1.245.34-4.017.51-6.564.51-11.49 0-16.017-4.472-16.017-15.847V28.641h-8.602v-9.055h8.602V5.438h11.32zM148.864 78.671h-11.942l-21.449-59.085h11.885l15.45 47.71h.227l15.45-47.71h11.772l-21.393 59.085z"
        fill="white"
        transform={`translate(${centerX}, ${centerY}) scale(${scale})`}
      />
    </Svg>
  );
};

export default AppleTvLogo;
