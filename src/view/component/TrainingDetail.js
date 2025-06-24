import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import {
  Card,
  message,
  Spin,
  Image,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/km";
import { CalendarOutlined } from "@ant-design/icons";

import ErrorFoundPageView from "./ErrorFoundPageView";

dayjs.locale("km");
const { Title, Paragraph } = Typography;

const containerStyle = {
  padding: "40px 20px",
  margin: "0 auto",
  maxWidth: "1000px",
  backgroundColor: "#fff",
};

const bannerImageStyle = {
  width: "100%",
  height: "auto",
  borderRadius: "12px",
  marginBottom: "20px",
};

const descriptionStyle = {
  textAlign: "justify",
  textJustify: "inter-word",
  lineHeight: "1.8",
  color: "rgb(26, 35, 126)",
};

// Khmer number conversion with fallback
const convertToKhmerNumber = (number) => {
  const khmerNumbers = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
  return number
    .toString()
    .split("")
    .map((digit) => (/\d/.test(digit) ? khmerNumbers[digit] : digit))
    .join("");
};

// Format Khmer date string
const formatKhmerDate = (dateString) => {
  const date = dayjs(dateString);
  const day = convertToKhmerNumber(date.date());
  const month = date.month(); // 0-indexed
  const year = convertToKhmerNumber(date.year());

  const khmerMonths = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
  ];

  return `ថ្ងៃ​ទី ${day} ខែ ${khmerMonths[month]} ឆ្នាំ ${year}`;
};

const TrainingDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [imageOptional, setImageOptional] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    getOne();
  }, [id]);

  const getOne = async () => {
    setLoading(true);
    try {
      const res = await request("training/getone", "post", { id });
      if (res && res.data) {
        setBlog(res.data);
        fetchImages(res.data.id);
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } else {
        message.error("Training post not found");
      }
    } catch (error) {
      message.error("Failed to fetch the training post");
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (trainingId) => {
    const res_image = await request("tbtraining_image/" + trainingId, "get");
    if (res_image && !res_image.error && res_image.list) {
      const imageTrainOptional = res_image.list.map((imgItem, index) => ({
        uid: index,
        name: imgItem.image,
        status: "done",
        url: Config.image_path + imgItem.image,
      }));
      setImageOptional(imageTrainOptional);
    } else {
      setImageOptional([]);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Spin spinning={true} tip="កំពុងទាញយកទិន្នន័យ..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={containerStyle}>
        <ErrorFoundPageView />
      </div>
    );
  }

  return (
    <div style={containerStyle} ref={contentRef}>
      <Card bordered={false} style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        {/* Main Image */}
        {blog.image && (
          <img
            alt="Cover​ រូបភាព"
            src={`${Config.image_path}${blog.image}`}
            style={bannerImageStyle}
          />
        )}
    
        {/* Title */}
        <Title level={3} style={{ color: "#1a237e", marginBottom: "10px",    fontFamily: "'Siemreap', 'Khmer OS', sans-serif",}}>
          {blog.title}
        </Title>

        {/* Date */}
        <p style={{ color: "rgb(26, 35, 126)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarOutlined style={{ fontSize: 16 }} />
          {blog.createdAt ? formatKhmerDate(blog.createdAt) : ""}
        </p>

        {/* Description */}
        <Paragraph style={descriptionStyle}>
          <div dangerouslySetInnerHTML={{ __html: blog.description }} />
        </Paragraph>

        {/* Training Images */}
        {imageOptional.length > 0 && (
          <Image.PreviewGroup>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                justifyContent: "flex-start",
                marginTop: "20px",
              }}
            >
              {imageOptional.map((file, index) => (
                <Image
                  key={index}
                  src={file.url}
                  alt={`រូបភាពទី ${index + 1}`}
                  width={180}
                  height={120}
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        )}
      </Card>
    </div>
  );
};

export default TrainingDetail;
