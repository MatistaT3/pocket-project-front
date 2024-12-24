import { transform } from "@babel/core";
import * as React from "react";
import Svg, { Path, G } from "react-native-svg";

const AmazonMusicLogo = (props) => (
  <Svg
    viewBox="0 0 361 361"
    style={{
      enableBackground: "new 0 0 361 361",
    }}
    {...props}
  >
    <Path
      d="M360 112.61c0-4.3 0-8.6-.02-12.9-.02-3.62-.06-7.24-.16-10.86-.21-7.89-.68-15.84-2.08-23.64-1.42-7.92-3.75-15.29-7.41-22.49a75.633 75.633 0 0 0-33.06-33.05c-7.19-3.66-14.56-5.98-22.47-7.41C287 .86 279.04.39 271.15.18c-3.62-.1-7.24-.14-10.86-.16-4.3-.02-8.6-.02-12.9-.02H112.61c-4.3 0-8.6 0-12.9.02-3.62.02-7.24.06-10.86.16C80.96.4 73 .86 65.2 2.27c-7.92 1.42-15.28 3.75-22.47 7.41A75.633 75.633 0 0 0 9.67 42.73c-3.66 7.2-5.99 14.57-7.41 22.49C.86 73.02.39 80.98.18 88.86.08 92.48.04 96.1.02 99.72 0 104.01 0 108.31 0 112.61v134.77c0 4.3 0 8.6.02 12.9.02 3.62.06 7.24.16 10.86.21 7.89.68 15.84 2.08 23.64 1.42 7.92 3.75 15.29 7.41 22.49a75.633 75.633 0 0 0 33.06 33.05c7.19 3.66 14.56 5.98 22.47 7.41 7.8 1.4 15.76 1.87 23.65 2.08 3.62.1 7.24.14 10.86.16 4.3.03 8.6.02 12.9.02h134.77c4.3 0 8.6 0 12.9-.02 3.62-.02 7.24-.06 10.86-.16 7.89-.21 15.85-.68 23.65-2.08 7.92-1.42 15.28-3.75 22.47-7.41a75.633 75.633 0 0 0 33.06-33.05c3.66-7.2 5.99-14.57 7.41-22.49 1.4-7.8 1.87-15.76 2.08-23.64.1-3.62.14-7.24.16-10.86.03-4.3.02-8.6.02-12.9V112.61z"
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#25d1da"
    />
    <G transform="scale(12) translate(-1,-4)">
      <Path
        d="M20.068 19.235c.158-.12.24-.29.24-.518a.482.482 0 0 0-.146-.367c-.098-.096-.272-.19-.531-.285l-.797-.301c-.695-.26-1.04-.698-1.04-1.321 0-.408.158-.74.475-.99.316-.253.73-.376 1.241-.376.408 0 .803.073 1.191.218.076.026.13.057.158.098.032.042.048.101.048.183v.256c0 .114-.041.171-.124.171a.806.806 0 0 1-.214-.048c-.331-.1-.67-.15-1.011-.15-.6 0-.901.205-.901.613 0 .164.05.294.15.385.102.096.298.2.592.313l.73.285c.37.146.635.317.796.515.162.2.244.455.244.769 0 .445-.164.803-.496 1.065s-.77.395-1.32.395-.996-.089-1.416-.265a.37.37 0 0 1-.155-.105c-.028-.038-.04-.098-.04-.18v-.265c0-.114.038-.17.113-.17.044 0 .123.018.233.056.414.133.84.199 1.283.199.303 0 .534-.06.696-.18zm-4.15-3.83c0-.127.063-.19.187-.19h.552c.126 0 .187.063.187.19v4.405c0 .126-.064.19-.187.19h-.404a.244.244 0 0 1-.146-.04c-.034-.024-.057-.072-.069-.14l-.066-.33c-.582.434-1.18.651-1.789.651-.442 0-.783-.126-1.02-.376-.237-.253-.358-.607-.358-1.066v-3.296c0-.126.064-.19.187-.19h.553c.126 0 .187.064.187.19v2.99c0 .337.066.587.196.748.132.161.342.24.629.24.45 0 .904-.152 1.36-.452V15.4h.002l-.001.003zm-5.029 4.594c-.126 0-.187-.063-.187-.19v-3.055c0-.316-.06-.547-.177-.698-.117-.151-.306-.224-.563-.224-.455 0-.917.142-1.378.424.006.044.009.091.009.142v3.413c0 .126-.064.19-.187.19h-.552c-.126 0-.187-.064-.187-.19v-3.055c0-.317-.06-.548-.178-.699-.12-.15-.306-.224-.563-.224-.474 0-.933.14-1.369.414v3.564c0 .126-.063.19-.187.19h-.552c-.126 0-.187-.064-.187-.19v-4.406c0-.125.064-.19.187-.19h.41a.24.24 0 0 1 .146.04c.035.025.057.072.07.141l.056.3c.6-.413 1.185-.622 1.755-.622s.974.224 1.182.67c.618-.445 1.236-.67 1.855-.67.429 0 .762.123.992.367.23.247.347.594.347 1.046v3.324c0 .126-.063.19-.187.19h-.559l.004-.002zm14.414 3.546c.436-.187.8.288.373.607-2.576 1.91-6.305 2.927-9.52 2.927-4.503 0-8.56-1.675-11.63-4.465-.192-.174-.095-.4.098-.4.05 0 .108.017.167.051 3.31 1.94 7.405 3.106 11.633 3.106 2.854 0 5.99-.594 8.878-1.827l.001.001zm-.098-7.265c-.23.269-.347.692-.347 1.28v.123c0 .573.117.993.351 1.258.233.269.604.401 1.11.401.262 0 .542-.044.843-.132a.69.69 0 0 1 .14-.028c.082 0 .12.063.12.19v.255a.334.334 0 0 1-.038.18.333.333 0 0 1-.149.105 2.675 2.675 0 0 1-1.068.199c-.737 0-1.302-.212-1.69-.635-.393-.424-.585-1.04-.585-1.846 0-.805.203-1.415.604-1.855.404-.436.974-.654 1.71-.654.337 0 .67.06.992.18a.31.31 0 0 1 .146.095c.028.039.04.1.04.19v.255c0 .126-.04.19-.122.19a.62.62 0 0 1-.149-.028 2.736 2.736 0 0 0-.778-.114c-.518-.01-.897.123-1.127.392l-.003-.001zm1.185 9.746c-.212.18-.414.082-.32-.151.31-.78 1.009-2.529.676-2.955-.328-.424-2.177-.203-3.005-.101-.253.032-.29-.19-.064-.351.762-.537 1.773-.717 2.613-.717.787 0 1.42.158 1.555.326.28.351-.076 2.788-1.457 3.95l.002-.001zm-3.667-10.809c.126 0 .187.064.187.19v4.402c0 .125-.063.189-.187.189h-.552c-.126 0-.187-.064-.187-.19v-4.405c0-.126.064-.19.187-.19h.552v.004zm.155-1.827a.55.55 0 0 1 .155.41c0 .172-.05.307-.155.412-.104.104-.246.155-.426.155s-.322-.05-.427-.155a.551.551 0 0 1-.155-.411c0-.171.05-.306.155-.411.105-.105.246-.155.427-.155s.326.05.426.155z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#15191a"
      />
    </G>
  </Svg>
);

export default AmazonMusicLogo;
