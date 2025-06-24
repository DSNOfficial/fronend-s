import React, { useState } from 'react';
import { Carousel, Card, Col, Row, Divider, Button } from 'antd';
import { motion } from 'framer-motion';
import './ContentPageView.css'
import GoogleTranslatePageView from './GoogleTranslatePageView';

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

const ContentPageView = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const truncatedText = 'ឥទ្ធិពលបទចម្រៀងថ្មីរបស់ Taylor ធ្វើឱ្យគូជម្លោះ Kim Kardashian ធ្លាក់ Follower រាប់សែននាក់';
  const fullText = 'យ៉ាងណាមិញចំពោះមូលហេតុនៃការធ្លាក់ចុះតួលេខអ្នកតាមដានរបស់ Kim គឺត្រូវបានគេលើកឡើងថា...';

  return (
    <div style={containerStyle}>
  
  <Divider orientation="left" style={{marginTop:-20}}>
        <h3 className="custom-text">ព័ត៌មានថ្មីៗqqq</h3> 
      </Divider>


      <Row gutter={24}>
        <Col xs={24} sm={12} lg={9}>
          <Card title="News 1" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
              alt="News Image 1"
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

        <Col xs={24} sm={12} lg={9}> 
          <Card title="News 2" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
              alt="News Image 1"
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

        <Col xs={24} sm={24} lg={6}> 
         
          <Card title="News 3" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
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
      </Row>

      <Row gutter={24}>
        <Col xs={24} sm={24} lg={16}> 
          <h3>ព័ត៌មានថ្មីៗ</h3> 
          <Divider />
          <Card title="News 4" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
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
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>This is content for Card 1 with an image.</p>
          </Card>
        </Col>
      </Row>

      <Divider orientation="left">Vision, Mission, and Values</Divider>

      <Row gutter={24}>
        <Col xs={24} sm={24} lg={8}> 
          <Card title="ចក្ខុវិស័យ" style={cardStyle}>
            <motion.img
              src="http://192.168.11.103:81/tsnh/image6/image-1714445061728-806533927"
              alt="Announcement Image 1"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>This is content for Card 1 with an image.</p>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}> 
          <Card title="បេសកកម្ម" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>This is content for Card 2 with an image.</p>
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={8}>
          <Card title="តម្លៃ" style={cardStyle}>
            <motion.img
              src="http://192.168.100.105:81/tsnh/image6/image-1714445061728-806533927"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>This is content for Card 3 with an image.</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={5}>
        <Col>
        <GoogleTranslatePageView/>
        </Col>

      </Row>
    </div>
  );
};

export default ContentPageView;
