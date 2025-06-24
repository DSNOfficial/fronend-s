import React, { useEffect, useState } from "react";
import { Line, Bar } from "@ant-design/charts";
import { Divider, Card, Statistic ,Table,message} from "antd";
import { request } from "../config/request"; // Custom Axios wrapper or fetch

const HomePage = () => {
  const [person, setPersonCount] = useState([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
          getPersonCount();
      }, []);


const getPersonCount = async () => {
  setLoading(true);
  try {
    const res = await request("person/count", "get");
    if (res && typeof res.count === "number") {
      setPersonCount(res.count);
    }
  } catch (error) {
    message.error("Failed to fetch the count");
  } finally {
    setLoading(false);
  }
};




  // Sample chart data
  const viewerData = [
    { day: "Monday", views: 120 },
    { day: "Tuesday", views: 200 },
    { day: "Wednesday", views: 150 },
    { day: "Thursday", views: 220 },
    { day: "Friday", views: 180 },
    { day: "Saturday", views: 280 },
    { day: "Sunday", views: 300 },
  ];

  const viewerConfig = {
    data: viewerData,
    xField: "day",
    yField: "views",
    height: 300,
    point: { size: 5, shape: "circle" },
    smooth: true,
  };

  const analysisData = [
    { metric: "Metric 1", value: 100 },
    { metric: "Metric 2", value: 200 },
    { metric: "Metric 3", value: 150 },
  ];

  const analysisConfig = {
    data: analysisData,
    xField: "metric",
    yField: "value",
    height: 300,
    label: {
      position: "top",
      style: { fill: "#FFFFFF", opacity: 0.6 },
    },
    meta: {
      metric: { alias: "Metric" },
      value: { alias: "Value" },
    },
  };

  const seoData = [
    { month: "Jan", seoScore: 80 },
    { month: "Feb", seoScore: 85 },
    { month: "Mar", seoScore: 90 },
    { month: "Apr", seoScore: 88 },
    { month: "May", seoScore: 92 },
    { month: "Jun", seoScore: 95 },
  ];

  const seoConfig = {
    data: seoData,
    xField: "month",
    yField: "seoScore",
    height: 300,
    point: { size: 5, shape: "diamond" },
    smooth: true,
  };

  return (
    <div>

            <h4>ផ្ទាំងគ្រប់គ្រង</h4>
    <Divider />

      {/* Total Person Count */}
      <div style={{ padding: "0 20px" }}>
        <Card style={{ textAlign: "center" }}>
          <Statistic
            title="ចំនួនទិន្នន័យបណ្ណម៉ូតូសរុប (Imported Motorbycle)"
            value={person}
          />
        </Card>
      </div>

      <Divider />

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "20px",
          padding: "20px",
        }}
      >
        <div>
          <h2 style={{ textAlign: "center" }}>ចំនួនទិន្នន័យបណ្ណម៉ូតូសរុប</h2>
          <Line {...viewerConfig} />
        </div>

        <div>
          <h2 style={{ textAlign: "center" }}>ចំនួនបោះពុម្ព</h2>
          <Line {...seoConfig} />
        </div>

        <div>
          <h2 style={{ textAlign: "center" }}>វិភាគទិន្នន័យ</h2>
          <Bar {...analysisConfig} />
        </div>
      </div>

      
    </div>
  );
};

export default HomePage;
