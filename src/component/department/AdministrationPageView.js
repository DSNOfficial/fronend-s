import React, { useEffect, useState, useRef } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, Typography, Divider, Row, Col, message, Pagination,Tabs } from 'antd';
import { RightOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
import ListDocsPageView from "../../view/component/ListDocsPageView";
const containerStyle = {
    padding: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
    backgroundColor: 'white',
    marginTop: '-25px',
    color: '#343293',
    backgroundColor: '#f5f5f5',
    padding: '20px'
};

const AdministrationPageView = () => {
    const [list, setList] = useState([]);
    const [departmentNews, setDepartmentNews] = useState([]);
    const [otherNews, setOtherNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2); // Display 2 posts per page
    const [numTabs, setNumTabs] = useState(2); // Initial number of tabs

    useEffect(() => {
        getList();
        getOtherNews();
        setNumTabs(2);
    }, []);

    const getList = async () => {
        setLoading(true);
        try {
            const res = await request("administration/getList", "get");
            if (res && res.list && res.list.length > 0) {
                const lastItem = res.list[res.list.length - 1];
                setList([lastItem]);
            }
        } catch (error) {
            message.error("Failed to fetch the list");
        } finally {
            setLoading(false);
        }
    };

    const getOtherNews = async () => {
        setLoading(true);
        try {
            const res = await request("tbmarquee/getlist", "get");
            if (res && res.list) {
                setOtherNews(res.list);
            }
        } catch (error) {
            message.error("Failed to fetch other news");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedDepartmentNews = departmentNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={containerStyle}>
            <br></br>
               {/* <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}> */}
                            <Row gutter={[16, 16]} justify="center">
                                {/* Main Content */}
                                <Col xs={24} sm={24} md={18} lg={16} xl={16}>
                                    {list.map((item, index) => (
                                        <Card key={index} style={{ marginBottom: '16px', padding: '20px' }}>
                                         
                                          <Tabs style={{
                                                                            marginBlock:-18
                                                                        }}
                                            defaultActiveKey="1"
                                            className="custom-tabs"
                                            items={[
                                                {
                                                label: (
                                                    <p style={{ color: numTabs > 2 ? 'var(--tab-color2)' : 'var(--tab-color1)', 
                                                        marginInline:'initial',
                                                        paddingInline:2,
                                                        fontSize:12,
                                                        marginBlock:-6
                                                    }}>
                                                        
                                                        ការិយាល័យរដ្ឋបាល និងបុគ្គលិក <RightOutlined />
                                                    </p>
                                                ),
                                                key: '1',
                                                // dataIndex:item.Description ,
                                                children: ''

                                                },
                                            ]}
                                            />
                                        <p>
                                        <img
                                        alt="avatar"
                                        src={Config.image_path + item.Image}
                                        
                                    />
                    <p
                        style={{
                            marginTop: '20px',
                            textAlign: 'justify',
                            textJustify: 'inter-word',
                            color: '#343293'
                        }}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                </p>
                

                                        </Card>
                                    ))}
                                </Col>

                                {/* Sidebar */}
                                <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                                    <Card style={{ padding: '16px', textAlign: 'left' }}>
                                                                        <Tabs style={{
                                                                            marginBlock:-18
                                                                        }}
                                            defaultActiveKey="1"
                                            className="custom-tabs"
                                            items={[
                                                {
                                                label: (
                                                    <p style={{ color: numTabs > 2 ? 'var(--tab-color2)' : 'var(--tab-color1)', 
                                                        marginInline:'initial',
                                                        paddingInline:2,
                                                        fontSize:12,
                                                        marginBlock:-6
                                                    }}>
                                                        
                                                    លិខិតផ្សេងៗ <RightOutlined />
                                                    </p>
                                                ),
                                                key: '1',
                                                // dataIndex:item.Description ,
                                                children: ''

                                                },
                                            ]}
                                            />
                                            <ListDocsPageView/>
                                    
                                    </Card>
                                </Col>
                            </Row>
                        {/* </div> */}

        </div>
     
    );
};

export default AdministrationPageView;
