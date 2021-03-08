import * as React from "react";

const gradientArray = (spinPower) => {
  return [
    <stop
      key="0"
      offset="0%"
      stopColor="red"
      stopOpacity={spinPower >= 1 ? "100%" : "0%"}
    />,
    <stop
      key="1"
      offset="20%"
      stopColor="orange"
      stopOpacity={spinPower >= 2 ? "100%" : "0%"}
    />,
    <stop
      key="2"
      offset="40%"
      stopColor="yellow"
      stopOpacity={spinPower >= 3 ? "100%" : "0%"}
    />,
    <stop
      key="3"
      offset="60%"
      stopColor="#90ee90"
      stopOpacity={spinPower >= 4 ? "100%" : "0%"}
    />,
    <stop
      key="4"
      offset="80%"
      stopColor="green"
      stopOpacity={spinPower >= 5 ? "100%" : "0%"}
    />,
  ];
}

const PowerArrowIcon = (props) => (
  <svg
    width="200"
    height="40"
    viewBox="0 0 161 31"
    xmlns="http://www.w3.org/2000/svg"
    className={props.className}
  >
    {props.isGradient ? (
      <React.Fragment>
        <linearGradient id="gradientFill" x1="0%" y1="0%" x2="100%" y2="0%">
          {gradientArray(props.spinPower)}
        </linearGradient>
        <path
          fill="url('#gradientFill')"
          d="M130.5 8.5C66.5 30.5 17.3333 12.3333 0 2.5C26 35.7 101.5 32.8333 136 23L140.5 31L161 2.5L126 0L130.5 8.5Z"
        />
      </React.Fragment>
    ) : (
      <path
        fill="rgba(175, 175, 175, 0.548)"
        d="M130.5 8.5C66.5 30.5 17.3333 12.3333 0 2.5C26 35.7 101.5 32.8333 136 23L140.5 31L161 2.5L126 0L130.5 8.5Z"
      />
    )}
  </svg>
);

export default PowerArrowIcon;
