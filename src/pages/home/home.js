import React, { Component } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import {
  isChrome,
  isFirefox,
  isIE,
  isSafari,
  isOpera,
} from "react-device-detect";
import SpinWheel from "../../components/spinWheel/spinWheel";
import ActionCard from "../../components/actionCard/actionCard";
import LoadingIcon from "../../assets/images/loading.gif";

const { GoogleSpreadsheet } = require("google-spreadsheet");
const doc = new GoogleSpreadsheet(process.env.REACT_APP_SPREADSHEET_ID);
let sheet;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnecting: true,
      isGoogleSheet: false,
      initialClick: {
        x: null,
        y: null,
      },
    };
  }

  async componentDidMount() {
    try {
      //initiate Google Sheets API connection
      await doc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_CLIENT_EMAIL,
        private_key: process.env.REACT_APP_PRIVATE_KEY,
      });
      await doc.loadInfo();
      sheet = doc.sheetsByIndex[process.env.REACT_APP_SHEET_ID];
      this.setState({
        isGoogleSheet: true,
        isConnecting: false,
      });
    } catch (error) {
      this.setState({
        isGoogleSheet: false,
        isConnecting: false,
      });
      console.log(error);
    }
  }

  getUserClient = () => {
    if (isChrome) {
      return "Chrome";
    } else if (isFirefox) {
      return "Firefox";
    } else if (isSafari) {
      return "Safari";
    } else if (isIE) {
      return "IE";
    } else if (isOpera) {
      return "Opera";
    } else {
      return "Unknown";
    }
  };

  uploadResult = async (resultIndex) => {
    await sheet.addRow({
      WebClient: `${this.getUserClient()}`,
      TimeStamp: `${new Date()}`,
      SpinResultIndex: `${resultIndex}`,
    });
  };

  handleMouseDown = (e) => {
    e.stopPropagation();
    this.setState({ initialClick: {
      x: e.clientX,
      y: e.clientY,
    }});
  };

  handleMouseUp = (e) => {
    e.stopPropagation();
    if (
      this.state.initialClick.x !== null &&
      this.state.initialClick.y !== null &&
      this.state.initialClick.y < e.clientY &&
      this.state.initialClick.x - e.clientX <= 10
    ) {
      this.props.history.go(0);
    }
    this.setState({
      initialClick: {
        x: null,
        y: null,
      },
    });
  };

  render() {
    if (this.state.isConnecting) {
      return (
        <Container fluid className="main-container">
          <Row className="center-row loading-row">
            <Col>
              <div className="loading-container">
                <Image
                  src={LoadingIcon}
                  className="loading-icon"
                  alt="Loading"
                />
              </div>
            </Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <Container
          fluid
          className="main-container"
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseUp={(e) => this.handleMouseUp(e)}
        >
          <Row className="center-row">
            <Col>
              {!this.state.isGoogleSheet && (
                <div className="connection-error-container">
                  <h6>
                    Some error occurred while connecting to Google Sheets.{" "}
                    Please refresh the page.
                  </h6>
                </div>
              )}
              <SpinWheel uploadResult={this.uploadResult} history={this.props.history} />
              <ActionCard />
              <h6 className="help-text">
                Have a question?
                <span className="orange-text"> Get Help</span>
              </h6>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default Home;
