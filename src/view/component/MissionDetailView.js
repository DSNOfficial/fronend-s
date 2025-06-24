
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import {
  Card,
  message,
  Spin,
  Image,
  Divider,
  Col,
  Row,
  Typography,
} from "antd";
import ErrorFoundPageView from "./ErrorFoundPageView";

const { Title, Paragraph } = Typography;

const containerStyle = {
  padding: "40px 20px",
  margin: "0 auto",
  maxWidth: "1000px",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  borderRadius: "12px",
  marginTop: "30px",
};

const imageStyle = {
  width: "100%",
  height: "auto",
  maxHeight: "500px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "24px",
};

const MissionDetailView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    getOne();
  }, [id]);

  const getOne = async () => {
    setLoading(true);
    try {
      const res = await request(`mission/getone`, "post", { id });
      if (res && res.data) {
        setBlog(res.data);
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      } else {
        message.error("Value not found");
      }
    } catch (error) {
      message.error("Failed to fetch the value post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <Spin spinning tip="កំពុងដំណើរការ... សូមរងចាំ" />
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
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
          
            {blog.image && (
              
             <Image
  src={Config.image_path + blog.image}
  alt={blog.Title}
  preview={false}
  // style={{
  //   width: "100%",
  //   maxHeight: "500px",
  //   objectFit: "cover",
  //   borderRadius: "12px",
  //   boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  //   transition: "transform 0.3s ease",
  // }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.01)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
/>

            )}
          </Col>

          <Col span={24}>
            <Card
              bordered={false}
              style={{ background: "transparent", boxShadow: "none" }}
            >
              {/* <Title level={3} style={{ color: "#2c4089", marginBottom: 0,marginTop: -20 }}>
                {blog.Title}
              </Title> */}

            
<div
  style={{
    fontSize: "16px",
    lineHeight: 1.8,
    color: "#1a237e",
    textAlign: "justify",
    textJustify: "inter-word",
  }}
  dangerouslySetInnerHTML={{ __html: blog.Description }}
/>
  <Divider />

            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default MissionDetailView;









