import React, { useEffect, useState } from "react";
import { Row, Col, Card, message } from "antd";
import { request } from "../../config/request";
import { Config } from "../../config/helper";
import { NavLink } from "react-router-dom";
import "./InstructurePageView.css"; // Import the CSS file

const InstructurePageView = () => {
  const [leaderList, setLeaderList] = useState([]);
  const [leaderListFive, setLeaderListFive] = useState([]);
  const [leaderListThree, setLeaderListThree] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLeaderList();
    getLeaderListFive();
    getLeaderListThree();
  }, []);

  const getLeaderList = async () => {
    setLoading(true);
    try {
      const res = await request("leader/getList", "get");
      if (res && res.list && res.list.length > 0) {
        setLeaderList(res.list.slice(0,1));
      }
    } catch (error) {
      message.error("Failed to fetch the leader list");
    } finally {
      setLoading(false);
    }
  };

  const getLeaderListFive = async () => {
    setLoading(true);
    try {
      const res = await request("leader/getList", "get");
      if (res && res.list && res.list.length >= 5) {
        setLeaderListFive(res.list.slice(1,-3));
      }
    } catch (error) {
      message.error("Failed to fetch the leader list");
    } finally {
      setLoading(false);
    }
  };

  const getLeaderListThree = async () => {
    setLoading(true);
    try {
      const res = await request("leader/getList", "get");
      if (res && res.list && res.list.length >= 3) {
        setLeaderListThree(res.list.slice(-3));
      }
    } catch (error) {
      message.error("Failed to fetch the leader list");
    } finally {
      setLoading(false);
    }
  };

  const myStyle = {
    marginLeft: "-148px",
    marginRight: "-148px",
    padding: "0 15px",
    color:"#343293",
  };

  const cardStyle = {
    textAlign: "center",
    color:"#343293",
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <h1 style={{ textAlign: "center" ,color:"#343293"}}>ថ្នាក់ដឹកនាំ</h1>

      {/* Pyramid Layout */}
      <Row justify="center" style={{ marginBottom: "20px" }}>
        {leaderList.map((item, index) => (
          <Col key={index} xs={24} lg={5}>
            <NavLink>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div className="image-container">
                    <img
                      className="hover-image"
                      alt={item.title || item.Name}
                      src={Config.image_path + item.Image}
                    />
                  </div>
                }
              >
                   <h3>
                {item.title || item.Name}
                </h3>
                <p>
                {item.description}
                </p>
              </Card>
            </NavLink>
          </Col>
        ))}
      </Row>

      <Row gutter={[14, 8]} justify="center" style={myStyle}>
        {leaderListFive.map((item, index) => (
          <Col key={index} xs={20} lg={4}>
            <NavLink>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div className="image-container">
                    <img
                      className="hover-image"
                      alt={item.title || item.Name}
                      src={Config.image_path + item.Image}
                    />
                  </div>
                }
              >
                    <h3>
                {item.title || item.Name}
                </h3>
                <p>
                {item.description}
                </p>
              </Card>
            </NavLink>
          </Col>
        ))}
      </Row>

      <br />

      <Row justify="center" gutter={[14, 10]}>
        {leaderListThree.map((item, index) => (
          <Col key={index} xs={24} lg={5}>
            <NavLink>
              <Card
                hoverable
                style={cardStyle}
                cover={
                  <div className="image-container">
                    <img
                      className="hover-image"
                      alt={item.title || item.Name}
                      src={Config.image_path + item.Image}
                    />
                  </div>
                }
              >
                  
                  <h3>
                {item.title || item.Name}
                </h3>
                <p>
                {item.description}
                </p>
              </Card>
            </NavLink>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default InstructurePageView;
