import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import spinOptions from "./spinOptions";
import PointerIcon from "../../assets/images/pointer.svg";
import PointerBaseIcon from "../../assets/images/pointerBase.svg";

class SpinWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startedSpinning: false,
      currentSelection: null,
      finalIndex: Math.floor(
        Math.random() * process.env.REACT_APP_OPTIONS_NUMBER
      ),
    };
  }

  render() {
    const { startedSpinning, finalIndex } = this.state;
    const containerClassList = startedSpinning
      ? "wheel-outer-container spinning"
      : "wheel-outer-container";
    const pointerClassList = startedSpinning
      ? "pointer-container sliding"
      : "pointer-container";
    const finalDegree = finalIndex === 0 ? 270 :
      ((finalIndex * (360 / (Number(process.env.REACT_APP_OPTIONS_NUMBER) + 1))) - 90);
    return (
      <React.Fragment>
        <div className={pointerClassList}>
          <Image
            src={PointerBaseIcon}
            className="pointer-base-icon"
            alt="Pointer Base"
          />
          <Image src={PointerIcon} className="pointer-icon" alt="Pointer" />
        </div>
        <div
          className={containerClassList}
          style={
            startedSpinning ? { transform: `rotate(${finalDegree}deg)` } : {}
          }
        >
          {spinOptions.map((option) => (
            <div
              key={option.id}
              className="wheel-option-container"
              style={{
                backgroundColor: option.colorCode,
                border: `1px solid ${option.colorCode}`,
                boxShadow: `${option.boxShadow} rgba(0, 0, 0, 0.25)`,
                transform: `rotate(-${25 + option.id * 45}deg) skew(45deg)`,
              }}
            >
              <div className="option-corner-point-left"> </div>
              <div className="option-corner-point-right"> </div>
              <p
                className={option.subtext ? "option-main-text" : "option-text"}
              >
                {parse(option.text)}
              </p>
              {option.subtext && (
                <p className="option-sub-text">{parse(option.subtext)}</p>
              )}
            </div>
          ))}
          <Button
            variant=""
            className="wheel-spin-button"
            onClick={() => {
              if (startedSpinning === false) {
                this.setState({
                  startedSpinning: true,
                  currentSelection: finalIndex,
                });
                this.props.uploadResult(finalIndex);
              }
            }}
          >
            <div>
              <h6>Spin</h6>
            </div>
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default SpinWheel;
