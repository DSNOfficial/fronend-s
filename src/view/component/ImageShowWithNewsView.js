import React, { useEffect, useState, useRef } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, Typography, Divider, Row, Col, message, Pagination,Tabs } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import logo12 from "../../component/assets/image/a.png"

import dayjs from 'dayjs';
import ImageShowPageView from "./ImageShowPageView";
import ImageGeneralNewView from "./ImageGeneralNewView";
const containerStyle = {
    padding: '23px',
    margin: '0 auto',
    maxWidth:'100%',
    backgroundColor: 'white',
    marginTop: '-25px',
    color: '#343293',
    backgroundColor: 'white',
    // padding: '20px'
};

const ImageShowWithNewsView = () => {
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
                            <Row gutter={[16, 10]} justify="center">
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
                                                        
                                                        អំពីយើង<RightOutlined />
                                                    </p>
                                                ),
                                                key: '1',
                                                // dataIndex:item.Description ,
                                                children: ''

                                                },
                                            ]}
                                            />
                                            <br/>
                                            <ImageShowPageView/>
                                        <p>
                                        
                                            <br></br>
                                            <div style={{  margin: '-10px -2px -90px',paddingRight:0}}>
                                           {/* // <img */}
                                    
                                        
                                    {/* /> */}

                                            </div>
                                            {/* <Divider/> */}
                                           
                                        
                        {/* <p
                              style={{
                            marginTop: '20px',
                            textAlign: 'justify',
                            textJustify: 'inter-word',
                            color: '#343293'
                        }}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    /> */}
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
                                                        
                                                        ព័ត៌មានទូទៅ <RightOutlined />
                                                    </p>
                                                ),
                                                key: '1',
                                                // dataIndex:item.Description ,
                                                children: ''

                                                },
                                            ]}
                                            />
                                            <ImageGeneralNewView/>
                                    
                                    </Card>
                                </Col>
                            </Row>
                        {/* </div> */}

        </div>
     
    );
};

export default ImageShowWithNewsView;
