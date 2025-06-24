import React, { useEffect, useState } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, message, Row, Col, Spin, Button ,Typography} from 'antd';
import { NavLink } from "react-router-dom";
import './BlogPageView.css'; // Import the CSS file
import './FontKhmer.css'
import { BiFontFamily } from "react-icons/bi";

const { Meta } = Card;
const { Paragraph } = Typography;

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
  fontFamily:'KhmerOSSiemReap',
  color:"#343293"

};
const KhmerOSSiemReap =  {
  fontFamily: 'KhmerOSSiemReap',
};
const colorFont ={
  color:"#343293"

}

const PartnerPageView = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    setLoading(true);

    try {
      const res = await request("partner/getList", "get");
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
      <br />
      <Spin spinning={loading} tip="ប្រព័ន្ធកំពុងដំណើរការ... សូមរងចាំ">
        <Row gutter={[16, 16]}>
          {list.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
            
                <Card
                  hoverable
                  style={{ width: '100%' }}
                  cover={<img alt="រូបភាព" src={Config.image_path + item.Image} className="card-image" />}
                >
                <h3 style={colorFont}>{item.title}</h3>
          
                <Meta style={{fontFamily:'KhmerOSSiemReap'}}                
                  description={
                    <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{fontFamily:'KhmerOSSiemReap',color:'#343293'}}>
                      {item.description || "No Description"}
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

export default PartnerPageView;
