import React, { useEffect, useState, useRef } from "react";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import { Card, Typography, Divider, Row, Col, message, Pagination } from 'antd';
import dayjs from 'dayjs';

const containerStyle = {
    padding: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
    backgroundColor: 'white',
    marginTop: '-25px',
    color:'#343293',

};

const TechnicalPageView = () => {
    const [list, setList] = useState([]);
    const [departmentNews, setDepartmentNews] = useState([]);
    const [otherNews, setOtherNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(2); // Display 2 posts per page
    const departmentNewsRef = useRef(null);
    const otherNewsRef = useRef(null);

    useEffect(() => {
        getList();
        getOtherNews();
    }, []);

    const getList = async () => {
        setLoading(true);
        try {
            const res = await request("technical/getList", "get");
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

    const cardStyle = {
        width: "100%",
        marginBottom: "20px",
    };

    const imgStyle = {
        display: 'block',
        width: "100%",
    };

    const imgInlineStyle = {
        display: 'block',
        width: "100px",
        marginRight: '16px',
    };
 
    const textDate = {
        display: 'block',
        fontSize: '9.5px', // Change font size here
    };

    const { Paragraph, Text } = Typography;

    const getMaxHeight = () => {
        const departmentHeight = departmentNewsRef.current ? departmentNewsRef.current.clientHeight : 0;
        const otherHeight = otherNewsRef.current ? otherNewsRef.current.clientHeight : 0;
        return Math.max(departmentHeight, otherHeight);
    };

    const toKhmerNumeral = (num) => {
        const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        return num.toString().split('').map(digit => khmerNumerals[digit]).join('');
    };
      
    // Function to format date to Khmer format
    const formatKhmerDate = (date) => {
        const day = toKhmerNumeral(dayjs(date).date());
        const month = dayjs(date).locale('km').format('MMMM');
        const year = toKhmerNumeral(dayjs(date).year());
        return `ថ្ងៃទី${day} ខែ${month} ${year}`;
    };

    // Determine if the post is new
    const isNewPost = (date) => {
        const now = dayjs();
        const postDate = dayjs(date);
        return now.diff(postDate, 'day') <= 7;
    };

    // Animation effect for "ថ្មីៗ" label
    const newPostStyle = {
        animation: 'blinker 1.5s linear infinite',
        color: 'white',
        fontSize: '10px',
        backgroundColor: 'red',
        marginLeft: '5px',
        verticalAlign: 'middle',
        padding: '2px 6px',
        borderRadius: '4px',
        fontWeight: 'bold',
    };
       // CSS for the blink animation effect
       const styles = `
       @keyframes blinker {
       50% {
           opacity: 0;
       }
       }
       `;
       document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
   

    return (
        <div style={containerStyle}>
            <Row gutter={[16, 16]}>
                <Col xs={24} md={17}>
                    <h2 style={{ padding: 32,color:'#343293' }}>ការិយាល័យបច្ចេកទេស</h2>
                    <Divider />
                    {list.map((item, index) => (
                        <Card
                            key={index}
                            hoverable
                            style={cardStyle}
                            bodyStyle={{
                                padding: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <Row gutter={[16, 16]} align="middle">
                               
                            <Col xs={24} md={24}>
                                    <div style={{ padding: 32 }}>
                                                        <Paragraph>

                                                        <div 
            style={{ 
              marginTop: '20px', 
              textAlign: 'justify', 
              textJustify: 'inter-word' ,
              color:'#343293'
        

            }} 
            dangerouslySetInnerHTML={{ __html: item.description }} 
          />
                 
                                            {/* {item.description} */}
                                        </Paragraph>
                                        <Text type="secondary" style={textDate}>
                                            {/* {formatKhmerDate(item.CreateAt)}
                                            {isNewPost(item.CreateAt) && <span style={newPostStyle}> ថ្មីៗ</span>} */}
                                        </Text>
                                    </div>
                                </Col>
                                <Col xs={24} md={24}>
                                    <img
                                        alt="avatar"
                                        src={Config.image_path + item.Image}
                                        style={imgStyle}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
               
            </Row>
        </div>
    );
};

export default TechnicalPageView;


