import React from 'react';
import { Table, Typography, Layout, Row, Col } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './styleTPageView.module.css'; // Import the CSS file

const { Title, Text } = Typography;
const { Header, Content } = Layout;

// Sample data for the table
const data = [
  {
    key: '1',
    no: '1',
    numberCode: 'NC123',
    name: 'John Doe',
    age: 30,
    gender: 'Male',
    description: 'Patient with flu symptoms',
    doctorName: 'Dr. Smith',
    operationWorking: 'No'
  },
  // Add more data as needed
];

// Define the columns for the table
const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
  },
  {
    title: 'Number Code',
    dataIndex: 'numberCode',
    key: 'numberCode',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Doctor Name',
    dataIndex: 'doctorName',
    key: 'doctorName',
  },
  {
    title: 'Operation Working',
    dataIndex: 'operationWorking',
    key: 'operationWorking',
    render: (text) => (
      <div>
        {text === 'Yes' ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
        <div>{text === 'Yes' ? 'Operation is active' : 'Operation is not active'}</div>
      </div>
    ),
  },
];

const TePageView = () => {
  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <Header className="header" >
        <Title level={2} className="header-title">Patient Information - Floor 2</Title>
      </Header>
      <Content style={{ margin: '24px 16px' }}>
        <Row justify="center">
          <Col>
            <img src="http://localhost:81/tsnh/image6/image-1718263437252-724206629" alt="Logo" style={{ width: '100px', height: '100px' }} />
          </Col>
        </Row>
        <Row justify="center" style={{ margin: '20px 0' }}>
          <Col>
            <Text>Here is patient information for Floor 2:</Text>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} />
      </Content>
    </Layout>
  );
};

export default TePageView;
