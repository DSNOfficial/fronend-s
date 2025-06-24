import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Row, Col, Spin } from 'antd';
import { NavLink } from "react-router-dom";
import './BlogPageView.css'; // Import the CSS file

const { Meta } = Card;

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
  color:"#343293",

};
const colorFont={
  color:"#343293",
}

const BlogPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);

    try {
      const res = await request("department/getList", "get");
      if (res && res.list && res.list.length > 0) {
        setList(res.list);
      }
    } catch (error) {
      message.error("Failed to fetch the list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <br />
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <NavLink to={`/page/blog/${item.id}`}>
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img alt="រូបភាព" src={Config.image_path + item.Image} className="card-image" />}
                >
                  
                  <h3 style={colorFont}>{item.Name}</h3>
                  <p style={colorFont}> {item.Description}</p>
                {/* <Meta style={colorFont} title={item.Name || "No Title"} description={item.Description || "No Description"} />
                  */}
              
                  
                </Card>
              </NavLink>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
}

export default BlogPageView;
