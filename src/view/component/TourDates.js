import React from 'react';
import { Card, Col, Row, Badge, Button, List, Typography, Image, Modal } from 'antd';

const { Title, Paragraph } = Typography;
const containerStyle = {
  padding: '20px',
  margin: '0 auto',
  maxWidth: '1200px',
  backgroundColor: 'white',
  marginTop: '-25px',
};

const TourDates = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  // const [list, setList] = useState([]);
  // const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    { month: 'September', status: 'Sold out' },
    { month: 'October', status: 'Sold out' },
    { month: 'November', status: '3' },
  ];

  return (
    <div style={containerStyle}>
 <div >
      <div style={{ margin: '0 auto', padding: '0 16px'}}>
   
        
      
        <Row gutter={[16, 32]} style={{ marginTop: '32px' }}>
          <Col xs={24} md={8}>
            <Card
              cover={<Image alt="New York" src="http://localhost:81/tsnh/image6/image-1714726406961-672226926" style={{ width: '100%' }} />}
            >
              <Card.Meta
                title="New York"
                description={
                  <>
                    <Paragraph type="secondary">Fri 27 Nov 2016</Paragraph>
                    <Paragraph>Praesent tincidunt sed tellus ut rutrum sed vitae justo.</Paragraph>
                    <Button type="primary" onClick={showModal}>Buy Tickets</Button>
                  </>
                }
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              cover={<Image alt="Paris" src="http://localhost:81/tsnh/image6/image-1714726406961-672226926" style={{ width: '100%' }} />}
            >
              <Card.Meta
                title="Paris"
                description={
                  <>
                    <Paragraph type="secondary">Sat 28 Nov 2016</Paragraph>
                    <Paragraph>Praesent tincidunt sed tellus ut rutrum sed vitae justo.</Paragraph>
                    <Button type="primary" onClick={showModal}>Buy Tickets</Button>
                  </>
                }
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              cover={<Image alt="San Francisco" src="http://localhost:81/tsnh/image6/image-1714726406961-672226926" style={{ width: '100%' }} />}
            >
              <Card.Meta
                title="San Francisco"
                description={
                  <>
                    <Paragraph type="secondary">Sun 29 Nov 2016</Paragraph>
                    <Paragraph>Praesent tincidunt sed tellus ut rutrum sed vitae justo.</Paragraph>
                    <Button type="primary" onClick={showModal}>Buy Tickets</Button>
                  </>
                }
              />
            </Card>
          </Col>
        </Row>

        <tbody className="container">

  </tbody >
      </div>

      <Modal title="Buy Tickets" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Ticket buying functionality goes here.</p>
      </Modal>
    </div>
    </div>
   
  );
};

export default TourDates;
