import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Row, Col, Spin, Typography,Divider } from 'antd';
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
  color:'#343293'

};
const KhmerOSSiemReap =  {
  fontFamily: 'KhmerOSSiemReap',
  color:"#343293",
};

const PackagePatientPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);

    try {
      const res = await request("servicePackage/getList", "get");
      if (res && res.list && res.list.length > 0) {
        setList(res.list); // Set all items in the list
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
      <h2 style={{ color:'#343293'}}>កញ្ចប់សេវាព្យាបាល</h2>
      <Divider></Divider>
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card
                hoverable
                style={{ width: '100%' }}
                cover={
                  <NavLink to={`/page/package-patient/${item.id}`}>
                    <img alt="រូបភាព" src={Config.image_path + item.Image} className="card-image" />
                  </NavLink>
                }
              >
                <NavLink to={`/page/package-patient/${item.id}`}>
                  <h3 style={{ color:'#343293'}}>{item.Title}</h3>
                </NavLink>
                <br />
                <Meta 
                  description={
                    <Paragraph ellipsis={{ rows: 2, expandable: false }} style={KhmerOSSiemReap}>
                      <p
                      dangerouslySetInnerHTML={{ __html: item.Description }} 
                      
                      />


                      {/* {item.Description || "No Description"} */}
                    </Paragraph>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>
    </div>
  );
}

export default PackagePatientPageView;
