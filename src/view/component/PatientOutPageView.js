import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Row, Col, Divider, Spin, Typography, Pagination } from 'antd';
import { NavLink, useParams } from "react-router-dom"; // Import useParams
import './BlogPageView.css'; // Import the CSS file

const { Meta } = Card;
const { Paragraph } = Typography;

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
};

const PatientOutPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Set the number of items per page

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);

    try {
      const res = await request("department/getList", "get");
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

  // Array of IDs you want to filter
  const filterIds = [19, 11,17,13]; 

  // Filter the list based on the array of IDs
  const filteredList = list.filter((item) => filterIds.includes(item.id));

  // Get the current list based on pagination
  const paginatedList = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div style={containerStyle}>
      <br />
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">
        <h2 style={{color:'#2d408b'}}>សេវាពិគ្រោះជំងឺក្រៅ</h2>
        <Divider></Divider>



        {/* Display paginated cards */}
        <Row gutter={[16, 16]}>
          {paginatedList.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card
                hoverable
                style={{ width: '100%' }}
                cover={
                  <NavLink to={`/page/blog/${item.id}`}>
                    <img alt="រូបភាព" src={Config.image_path + item.Image} className="card-image" />
                  </NavLink>
                }
              >
                <NavLink to={`/page/blog/${item.id}`}>
                  <h3 style={{color:'#2d408b'}} >{item.Name}</h3>
                </NavLink>
                <br />
                <Meta 
                  description={
                    <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ color:'#343293'}}>
                      {item.Description || "No Description"}
                    </Paragraph>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination Component aligned to the right */}
        <div style={{ textAlign: 'right', marginTop: '20px' }}>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredList.length}
            onChange={handlePageChange}
          />
        </div>
      </Spin>
    </div>
  );
}

export default PatientOutPageView;
