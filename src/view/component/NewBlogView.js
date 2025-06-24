import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";

const NewBlogView = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const res = await request("training/getList", "get");
      if (res && res.list) {
        setList(res.list.slice(0, 3)); // Limit to 3 items
      }
    } catch (error) {
      message.error("Failed to fetch the list");
    }
  };

  // Function to check if the post is new (posted within the last 2 days)
  const isNewPost = (postDate) => {
    const today = dayjs();
    const postDateFormatted = dayjs(postDate);
    const diffInDays = today.diff(postDateFormatted, "day");
    return diffInDays >= 0 && diffInDays <= 2;
  };

  // Responsive container styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "10px",
  };

  const cardStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
  };

  const imageStyle = {
    width: "121px",
    height: "85px",
    objectFit: "cover",
    borderRadius: "4px",
  };

  const textContainerStyle = {
    flex: 1,
  };

  const titleStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    lineHeight: "1.5",
    margin: 0,
  };

  const newLabelStyle = {
    display: "inline-block",
    backgroundColor: "#ff9800",
    color: "#fff",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    marginLeft: "10px",
    fontWeight: "bold",
  };

  // Media query adjustments for responsiveness
  const responsiveCardStyle = {
    ...cardStyle,
    flexDirection: "row",
  };

  const responsiveImageStyle = {
    ...imageStyle,
    width: "100px",
    height: "70px",
  };

  const responsiveTitleStyle = {
    ...titleStyle,
    fontSize: "12px",
  };

  return (
    <div style={containerStyle}>
      {list.map((item, index) => (
        <div key={index} style={responsiveCardStyle}>
          <NavLink to={`/page/trainers/${item.id}`}>
            <img
              style={responsiveImageStyle}
              src={Config.image_path + item.Image}
              alt={item.title || "News"}
            />
          </NavLink>
          <div style={textContainerStyle}>
            <NavLink to={`/page/trainers/${item.id}`}>
              <p style={responsiveTitleStyle}>
                {item.title}{" "}
                {isNewPost(item.date) && <span style={newLabelStyle}>ថ្មី</span>}
              </p>
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewBlogView;
