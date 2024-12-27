import React, { Component } from "react";
import "./Dashboard.scss";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as actions from "../../../store/actions";
import { GiPositionMarker } from "react-icons/gi";
import { LanguageUtils, languages } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { adminChangePasswordService } from "../../../services/userService";
import { toast } from "react-toastify";
import Chart from "chart.js/auto";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const data = {
        title: {
            display: true,
            text: 'Your Chart Title Here',  // Title for the chart
            font: {
              size: 18
            }
        },
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(255, 167, 38)",
          tension: 0.1,
        }
      ]
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      height: 300,
      plugins: {
        title: {
          display: true,
          text: 'Your Chart Title Here',  // Title for the chart
          font: {
            size: 18
          }
        },
        legend: {
          display: false // Hides the legend (removes labels)
        }
      },
      scales: {
        x: {
          // display: false, // Hides the x-axis labels
        },
        y: {
          // display: false // Hides the y-axis labels
        }
      }
    };

    const config = {
      type: "line",
      data: data,
      options: options
    };

    new Chart(this.chartRef.current, config);
  }

  render() {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">
          Hi, Admin, welcome back to App Admin!
        </p>

        <div className="dashboard-stats">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">
                <GiPositionMarker />
              </div>
              <div className="stat-info">
                <p className="stat-number">100</p>
                <p className="stat-label">Total Cafes</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-charts">
          <div className="chart-container">
            <h3 className="chart-title">Most Searched Cafe</h3>
            <div className="chart-bar">
              <p className="bar-label">Rosie Coffee</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "100%" }}></div>
                <span className="bar-value">72</span>
              </div>
            </div>
            <div className="chart-bar">
              <p className="bar-label">ABC</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "58%" }}></div>
                <span className="bar-value">42</span>
              </div>
            </div>
            <div className="chart-bar">
              <p className="bar-label">Mèo</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "42%" }}></div>
                <span className="bar-value">30</span>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Most Searched Cafe</h3>
            <div className="chart-bar">
              <p className="bar-label">Rosie Coffee</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "100%" }}></div>
                <span className="bar-value">72</span>
              </div>
            </div>
            <div className="chart-bar">
              <p className="bar-label">ABC</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "58%" }}></div>
                <span className="bar-value">42</span>
              </div>
            </div>
            <div className="chart-bar">
              <p className="bar-label">Mèo</p>
              <div className="bar">
                <div className="bar-fill" style={{ width: "42%" }}></div>
                <span className="bar-value">30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart">
            <canvas ref={this.chartRef}></canvas>
          </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    switchLanguageOfWebsite: (language) =>
      dispatch(actions.switchLanguageOfWebsite(language)),
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
