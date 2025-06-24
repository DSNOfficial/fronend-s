import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Spin, Image, Divider } from 'antd';
import ErrorFoundPageView from "./ErrorFoundPageView";
// import PartnerPageView from "./PartnerPageView";

const { Meta } = Card;

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
};

const BookDetail = () => {
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
      const res = await request(`book/getone`, "post", { id });
      if (res && res.data) {
        setBlog(res.data);
        setTimeout(() => {
          contentRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        message.error("Book post not found");
      }
    } catch (error) {
      message.error("Failed to fetch the blog post");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <Spin spinning={loading} />
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
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">
        <h2 style={{color:"#2c4089"}}>{blog.title}</h2>
        <Divider/>
        <Card
          hoverable
          style={{ width: '100%', margin: '50px auto', padding: '20px' }}
          cover={
            <div style={{ width: '100%', overflow: 'hidden', maxHeight: '500px' }}>
              <Image
                alt={blog.title}
                src={Config.image_path + blog.Image}
                style={{ width: '100%', objectFit: 'cover' }}
                preview={true} // Enable image preview
              />
            </div>
          }
        >
          <Meta title={blog.title} description={blog.description} />
      
        </Card>
      </Spin>
    </div>
  );
}

export default BookDetail;
