import React from 'react';
import { Layout } from 'antd';
import NewsListPage from './NewsListPage'

const { Header, Content } = Layout;

const NewsPostListPage = () => (
    <div>
            <Header>
            <h1 style={{ color: 'white' }}>News App</h1>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: '20px' }}>
            <NewsListPage />
        </Content>
    </div>
    
  
);

export default NewsPostListPage;
