import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { NavLink } from "react-router-dom";
import dayjs from "dayjs";

const ImageGeneralNewView = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      try {
        const res = await request("training/getList", "get");
        if (res && res.list) {
          setList(res.list.slice(0, 4)); // Limit to 4 items
        }
      } catch (error) {
        message.error(`Failed to fetch the list: ${error.message}`);
      }
    };

    getList();
  }, []);

  const isNewPost = (postDate) => {
    const today = dayjs();
    const postDateFormatted = dayjs(postDate);
    const diffInDays = today.diff(postDateFormatted, "day");
    return diffInDays >= 0 && diffInDays <= 2;
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      color: "#343293",
    },
    card: {
      display: "flex",
      alignItems: "flex-start",
      gap: "15px",
      borderRadius: "8px",
      padding: "15px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    imageBox: {
      width: "121px",
      height: "85px",
      borderRadius: "4px",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      flexShrink: 0,
      backgroundColor: "#eee",
      transition: "transform 0.4s ease",
    },
    imageBoxHover: {
      transform: "scale(1.05)",
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#343293",
      lineHeight: "1.5",
      margin: 0,
      display: "-webkit-box",
      WebkitLineClamp: 4,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    newLabel: {
      display: "inline-block",
      backgroundColor: "#ff9800",
      color: "#fff",
      padding: "2px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      marginLeft: "10px",
      fontWeight: "bold",
      animation: "flash 1.5s infinite",
    },
  };

  // Optional: Add inline animation style
  const flashKeyframes = `
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  return (
    <>
      <style>{flashKeyframes}</style>
      <div style={styles.container}>
        {list.map((item) => (
          <div key={item.id} style={styles.card}>
            <NavLink to={`/page/trainers/${item.id}`}>
              <div
                style={{
                  ...styles.imageBox,
                  backgroundImage: `url(${item.image ? `${Config.image_path}${item.image}` : "/placeholder.png"})`,
                }}
                className="hover-zoom"
              />
            </NavLink>
            <div style={styles.textContainer}>
              <NavLink to={`/page/trainers/${item.id}`}>
                <p style={styles.title}>
                  {isNewPost(item.createdAt) && <span style={styles.newLabel}>ថ្មី</span>}
                  {item.title || "Untitled"}
                </p>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <br></br>
      <div style={{textAlign:"right"}}>
        <NavLink to={`/page/trainers/`} style={styles.readMore}>
            ព័ត៌មានបន្ថែម
        </NavLink>
  
      </div>

      {/* CSS for hover zoom animation */}
      <style>
        {`
          .hover-zoom {
            transition: transform 0.4s ease;
          }
          .hover-zoom:hover {
            transform: scale(1.05);
          }
        `}
      </style>
    </>
  );
};

export default ImageGeneralNewView;
