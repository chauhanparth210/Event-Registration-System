import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import config from "../config";
import Spinner from "../utils/Spinner";
import authToken from "../utils/SetAuthToken";
import "./style.css";

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [overviewData, setOverviewData] = useState({});

  useEffect(() => {
    const fetchOverview = async () => {
      const fetch = await axios.get(
        `${config.URL}/api/admin/overview`,
        authToken()
      );
      setOverviewData(fetch.data);
      setLoading(false);
    };
    setLoading(true);
    fetchOverview();
  }, []);

  const data = {
    labels: ["Self", "Group", "Corporate", "Others"],
    datasets: [
      {
        data: [
          overviewData.selfCount,
          overviewData.groupCount,
          overviewData.corporateCount,
          overviewData.othersCount,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return !loading ? (
    <div>
      <h1 className="title">Registration type Chart</h1>
      <Doughnut
        data={data}
        width={300}
        height={300}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  ) : (
    <Spinner />
  );
};

export default Overview;
