import React, { useState, useEffect } from 'react';
import { List, Card, Image, Spin, Button, Modal, message } from 'antd';
import axios from 'axios';
import NewsPostForm from './NewsPostFormPage';

const NewsListPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/postnew/getList');
            const newsData = await Promise.all(response.data.map(async (item) => {
                const imagesResponse = await axios.get(`/api/postnew/getImages?news_id=${item.id}`);
                return { ...item, images: imagesResponse.data };
            }));
            setNews(newsData);
        } catch (error) {
            message.error('Failed to load news');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete('/api/postnew/delete', { data: { id } });
            message.success('News post deleted successfully');
            fetchNews();
        } catch (error) {
            message.error('Failed to delete news post');
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setEditingItem(null);
        fetchNews();
    };

    return (
        <Spin spinning={loading}>
            <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
                Add News Post
            </Button>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={news}
                renderItem={item => (
                    <List.Item>
                        <Card
                            title={item.title}
                            extra={
                                <>
                                    <Button onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button onClick={() => handleDelete(item.id)} type="danger" style={{ marginLeft: 8 }}>
                                        Delete
                                    </Button>
                                </>
                            }
                        >
                            <p>{item.description}</p>
                            {item.images.map((image, index) => (
                                <Image 
                                    key={index} 
                                    width={200} 
                                    src={`/uploads/${image.image_path}`} 
                                    alt={`image-${index}`}
                                />
                            ))}
                        </Card>
                    </List.Item>
                )}
            />
            <Modal
                title={editingItem ? 'Edit News Post' : 'Add News Post'}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <NewsPostForm newsItem={editingItem} onSubmit={handleModalClose} />
            </Modal>
        </Spin>
    );
};

export default NewsListPage;
