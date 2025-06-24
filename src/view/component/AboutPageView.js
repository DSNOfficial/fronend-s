import React, { useState } from 'react';
// import { Carousel, Card, Col, Row, Divider, Button } from 'antd';
import { Card, Col, Button, Checkbox, Form, Input, Radio, Image, Section, Layout ,Row, Divider} from 'antd';
import { motion } from 'framer-motion';
import './ContentPageView.css'
import GoogleTranslatePageView from './GoogleTranslatePageView';
import UploadFilePage from './UploadFilePage';
import UseStateView from './UseStateView';

const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
};


const cardStyle = {
  marginBottom: '16px',
};

const carouselItems = [
  {
    src: 'http://localhost:81/tsnh/image6/image-1714445061728-806533927',
    alt: 'Slide 1',
  },
  {
    src: 'http://localhost:81/tsnh/image6/image-1714017865680-668672420',
    alt: 'Slide 2',
  },
  {
    src: 'http://localhost:81/tsnh/image6/image-1714013370493-566782115',
    alt: 'Slide 3',
  },
  {
    src: 'http://localhost:81/tsnh/image6/image-1714010496976-688175203',
    alt: 'Slide 4',
  },
];

const AboutPageView = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };
  const myStyle = {
  background: 'linear-gradient(to bottom, #e4e4e4, #e4e4e4)',
  padding: '20px',
  borderRadius: '10px'
};

  const truncatedText = 'ឥទ្ធិពលបទចម្រៀងថ្មីរបស់ Taylor ធ្វើឱ្យគូជម្លោះ Kim Kardashian ធ្លាក់ Follower រាប់សែននាក់';
  const fullText = 'យ៉ាងណាមិញចំពោះមូលហេតុនៃការធ្លាក់ចុះតួលេខអ្នកតាមដានរបស់ Kim គឺត្រូវបានគេលើកឡើងថា...';

  return (
    <div  style={containerStyle}>
      
  
  <Divider orientation="left" style={{marginTop:-20}}>
        <h3 className="custom-text">អំពីមន្ទីរពេទ្យជាតិ​ តេជោសន្តិភាព</h3>
      </Divider>

     
      <Row gutter={24}>
        <Col xs={24} sm={24} lg={16}> 
          <h3>ព័ត៌មានថ្មីៗ</h3> 
          <Divider />
          <Card title="News 4" style={cardStyle}>
            <motion.img
              src="http://localhost:81/tsnh/image6/image-1714445061728-806533927"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>
              {isCollapsed ? `${truncatedText.slice(0, 100)}...` : fullText}
              <Button type="link" onClick={toggleCollapse}>
                {isCollapsed ? 'Read More' : 'Read Less'}
              </Button>
            </p>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}> 
          <h3>សេចក្ដីជូនដំណឹង</h3> 
          <Divider />
          <Card title="Announcement 1" style={cardStyle}>
            <motion.img
              src="http://localhost:81/tsnh/image6/image-1714445061728-806533927"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>This is content for Card 1 with an image.</p>
          </Card>
        </Col>
      </Row>    
      <Row gutter={5}>
        <Col span={12}>
        <h1>Using status</h1>
        <GoogleTranslatePageView/>
       
        <UseStateView/>
        </Col>
        <Col span={12}> 
        <h1>Using Upload</h1>

        <UploadFilePage/>
        </Col>

      </Row>
    </div>
  );
};

export default AboutPageView;




