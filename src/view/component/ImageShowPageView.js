import React, { useEffect, useState } from "react";
import { message, Button, Typography, Card } from "antd";
import { Config } from "../../config/helper";
import { request } from "../../config/request";
import "./InstructurePageView.css"; // Import the CSS file

const { Paragraph, Title } = Typography;

const ImageShowPageView = () => {
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getHistoryList();
    }, []);

    const getHistoryList = async () => {
        setLoading(true);
        try {
            const res = await request("history/getList", "get");
            if (res && res.list && res.list.length > 0) {
                setHistoryList(res.list);
            }
        } catch (error) {
            message.error("Failed to fetch the list");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {historyList.map((item, index) => (
                <ContentCard
                    key={index}
                    imageSrc={Config.image_path + item.Image}
                    title={item.title}
                    description={item.description}
                />
            ))}
        </div>
    );
};

const ContentCard = ({ imageSrc, title, description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 150; // Character limit for truncated text

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
      
            <div style={{ display: "flex", flexDirection: "column" }}>
                <img
                    alt="រូបភាព"
                    src={imageSrc}
                    style={{ borderRadius: 5, width: "100%", marginBottom: 16 }}
                />
                <Title level={4} style={{ color: "#343293" ,  fontFamily: 'KhmerOSSiemReap'}}>
                    {title}
                </Title>
                <Paragraph
                style={{ color: "#343293", fontFamily: "KhmerOSSiemReap" }}
                >
                <div
                    dangerouslySetInnerHTML={{ __html: isExpanded
                        ? description
                        : description.slice(0, maxLength) + '...',
                        
                    }}
                />
                </Paragraph>
                <h4>hello</h4>
                {description.length > maxLength && (
                    <Button type="link" onClick={toggleExpand} style={{marginLeft:"auto",  fontFamily: 'KhmerOSSiemReap',}}>
                        {isExpanded ? "បង្ហាញ" : "អានបន្ថែម"}
                    </Button>
                )}
            </div>
     
    );
};

export default ImageShowPageView;
