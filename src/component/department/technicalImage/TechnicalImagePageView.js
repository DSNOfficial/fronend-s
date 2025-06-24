import React from 'react';
import { Button, Card, Typography, Divider, Row, Col } from 'antd';

const cardStyle = {
  width: "100%",
};

const imgStyle = {
  display: 'block',
  width: "100%",
};

const technicalImagePageView = () => (
  <Card
    hoverable
    style={cardStyle}
    bodyStyle={{
      padding: 0,
      overflow: 'hidden',
    }}
  >
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} md={16}>
        <img
          alt="avatar"
          src="http://localhost:81/tsnh/image6/image-1718165771505-962187644"
          style={imgStyle}
        />
      </Col>
      <Col xs={24} md={8}>
        <div style={{ padding: 32 }}>
          <Typography.Title level={3}>
            “antd is an enterprise-class UI design language and React UI library.”
          </Typography.Title>
          <Divider>Text</Divider>
          <Typography.Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
            probare, quae sunt a te dicta? Refert tamen, quo modo.
          </Typography.Paragraph>
          <Button type="primary" href="#" target="_blank">
            Get Started
          </Button>
        </div>
      </Col>
    </Row>
  </Card>
);

export default technicalImagePageView;
