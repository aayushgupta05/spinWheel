import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import parse from "html-react-parser";
import spinOptions from "./spinOptions";
import PointerIcon from "../../assets/images/pointer.svg";
import PointerBaseIcon from "../../assets/images/pointerBase.svg";
import PowerArrowIcon from "./powerArrow";
import PowerBoundaryIcon from "../../assets/images/powerBoundary.svg";

class SpinWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpinned: false,
      isClockwise: false,
      mouseOnHold: false,
      startAngle: null,
      spin: {
        relativeAngle: null,
        power: 0,
      },
      finalIndex: Math.floor(
        Math.random() * 
        process.env.REACT_APP_OPTIONS_NUMBER
      ),
      spinButtonCoordinates: {
        x: null,
        y: null,
      },
    };
  }

  componentDidMount() {
    const spinnerCoordinates = this.spinner.getBoundingClientRect();
    this.setState({
      spinButtonCoordinates: {
        x: (spinnerCoordinates.left + spinnerCoordinates.right) / 2,
        y: (spinnerCoordinates.top + spinnerCoordinates.bottom) / 2,
      },
    });
  }

  calculateAngle = (e) => {
    const radianAngle = Math.atan2(
      this.state.spinButtonCoordinates.y - e.pageY,
      this.state.spinButtonCoordinates.x - e.pageX
    );
    const degreeAngle = Math.round(radianAngle * (180 / Math.PI));
    return degreeAngle;
  };

  handleMouseDown = (e) => {
    e.stopPropagation();
    const startAngle = this.calculateAngle(e);
    this.setState({
      mouseOnHold: true,
      startAngle,
    });
  };

  handleMouseMove = (e) => {
    const { startAngle, spin, isClockwise } = this.state;
    const { power, relativeAngle } = spin;
    if (this.state.mouseOnHold) {
      const currentAngle = this.calculateAngle(e);
      const isBothSameSign = (
        (startAngle >= 0 && currentAngle >= 0) ||
        (startAngle <= 0 && currentAngle <= 0)
      ) ? true : false;
      if (this.state.spin.power >= 0 && this.state.spin.power <= 5) {
        let newRelativeAngle = Math.abs(startAngle - currentAngle);
        if (!isClockwise) {
          if (
            startAngle > currentAngle &&
            (isBothSameSign ||
              (startAngle >= 0 &&
                currentAngle <= 0 &&
                !(startAngle > 90 && currentAngle < -90)))
          ) {
            //denote anticlockwise movement
            newRelativeAngle = -newRelativeAngle;
          } else if (
            startAngle < currentAngle &&
            startAngle <= 0 &&
            currentAngle > 0 &&
            !(startAngle > -90 && currentAngle < 90)
          ) {
            //convert to equivalent acute angle
            newRelativeAngle = -(360 - newRelativeAngle);
          } else if (currentAngle !== startAngle){
            this.setState({
              isClockwise: true,
            });
          }
        }
        if (
          //probihit anticlockwise rotation beyond spin power-bar
          (power !== 5 ||
          newRelativeAngle > relativeAngle) &&
          !isClockwise
        ) {
          this.spinner.style.transform = `rotate(${newRelativeAngle - 90}deg)`;
          if (
            Math.abs(Math.floor(newRelativeAngle / 30)) !== power
          ) {
            this.setState({
              spin: {
                power: Math.abs(Math.floor(relativeAngle / 30)),
                relativeAngle: newRelativeAngle,
              },
            });
          } else {
            this.setState({
              spin: {
                power,
                relativeAngle: newRelativeAngle,
              },
            });
          }
        }
      }
    }
  };

  handleMouseUp = (e) => {
    const { power, relativeAngle } = this.state.spin;
    e.stopPropagation();
    if (this.state.spin.power > 2) {
      this.onSpinSubmit(power);
    } else {
      //bring spin-wheel to default position in
      //case of less than required anti-clockwise rotation
      this.spinner.animate(
        [
          { transform: `rotate(${relativeAngle - 90}deg)` },
          { transform: `rotate(-90deg)` },
        ],
        {
          easing: "ease-out",
          duration: 1000,
          iterations: 1,
        }
      );
      this.spinner.style.transform = `rotate(-90deg)`;
      this.setState({
        isClockwise: false,
        mouseOnHold: false,
        startAngle: null,
        spin: {
          power: 0,
          relativeAngle: null,
        },
      });
    }
  };

  onSpinSubmit = (spinPower = 3) => {
    const { isSpinned, finalIndex } = this.state;
    if (isSpinned === false) {
      let finalDegree =
        finalIndex === 0
        ? 270
        : finalIndex *
            (360 / (Number(process.env.REACT_APP_OPTIONS_NUMBER) + 1)) - 90;
      if (finalDegree < 0) {
        finalDegree = 360 + finalDegree;
      }
      this.spinner.animate([{ transform: `rotate(${finalDegree}deg)` }], {
        easing: "ease-out",
        duration: 6000 / spinPower,
        iterations: 1,
        fill: "forwards",
      });
      this.setState({
        isSpinned: true,
        isClockwise: false,
        mouseOnHold: false,
        startAngle: null,
        spin: {
          power: 0,
          relativeAngle: null,
        },
      });
      setTimeout(() => {
        this.props.history.go(0);
        }, 6000/spinPower + 1000)
      this.props.uploadResult(finalIndex);
    }
  };

  render() {
    const pointerClassList = this.state.isSpinned
      ? "pointer-container sliding"
      : "pointer-container";
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
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseMove={(e) => this.handleMouseMove(e)}
          onMouseUp={(e) => this.handleMouseUp(e)}
          className="wheel-outer-container"
          ref={(el) => {
            this.spinner = el;
          }}
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
              <div className="option-corner-point left-one"> </div>
              <div className="option-corner-point right-one"> </div>
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
            onClick={() => this.onSpinSubmit()}
          >
            <div>
              <h6>Spin</h6>
            </div>
          </Button>
        </div>
        <PowerArrowIcon className="power-arrow-icon-background" />
        <PowerArrowIcon
          className="power-arrow-icon"
          isGradient={true}
          spinPower={this.state.spin.power === 0 ? -1 : this.state.spin.power}
        />
        <Image
          src={PowerBoundaryIcon}
          className="power-arrow-boundary"
          alt="Minimum Required Power"
        />
      </React.Fragment>
    );
  }
}

export default SpinWheel;
