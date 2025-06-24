import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Row, Col, Spin, Typography, Pagination } from 'antd';
import { NavLink } from "react-router-dom";
import './BlogPageView.css'; // Import the CSS file

const { Meta } = Card;
const { Paragraph } = Typography;

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
  fontFamily: 'KhmerOSSiemReap',
};

const fontKhmer = {
  fontFamily: 'KhmerOSSiemReap',
  color: "#343293"
};

const TrainingPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Number of items per page

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);
    try {
      const res = await request("training/getList", "get");
      if (res && res.list && res.list.length > 0) {
        setList(res.list); // Set all items in the list
      }
    } catch (error) {
      message.error("Failed to fetch the list");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Paginate the list
  const paginatedList = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={containerStyle}>
      <br />
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">
        <Row gutter={[16, 16]}>
          {paginatedList.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card
                hoverable
                style={{ width: '100%' }}
                cover={
                  <NavLink to={`/page/trainers/${item.id}`}>
                    <img alt="រូបភាព" src={Config.image_path + item.image} className="card-image" />
                  </NavLink>
                }
              >
                <NavLink to={`/page/trainers/${item.id}`}>
                  <h3 style={fontKhmer}>{item.title}</h3>
                </NavLink>
                <br />
                <Meta 
                    description={
                      <Paragraph style={fontKhmer} ellipsis={{ rows: 2, expandable: false }}>
                        {stripHtml(item.description) || "No Description"}
                      </Paragraph>
                    }
                  />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination 
            current={currentPage} 
            total={list.length} 
            pageSize={pageSize} 
            onChange={handlePageChange} 
            showSizeChanger={false} 
          />
        </div>
        
      </Spin>
    </div>
  );
}

export default TrainingPageView;
