import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const NewsPostForm = ({ newsItem, onSubmit }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (newsItem) {
            form.setFieldsValue(newsItem);
            if (newsItem.images) {
                setFileList(newsItem.images.map((image, index) => ({
                    uid: index,
                    name: image.image_path,
                    status: 'done',
                    url: `/uploads/${image.image_path}`
                })));
            }
        }
    }, [newsItem, form]);

    const handleUpload = ({ fileList }) => setFileList(fileList);

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('id', newsItem ? newsItem.id : '');
        formData.append('title', values.title);
        formData.append('description', values.description);
        fileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append('images', file.originFileObj);
            }
        });

        try {
            const url = newsItem ? '/api/postnew/update' : '/api/postnew/create';
            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success(`News post ${newsItem ? 'updated' : 'added'} successfully`);
            onSubmit();
            form.resetFields();
            setFileList([]);
        } catch (error) {
            message.error(`Failed to ${newsItem ? 'update' : 'add'} news post`);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter the title' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please enter the description' }]}
            >
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item
                name="images"
                label="Upload Images"
                rules={[{ required: true, message: 'Please upload at least one image' }]}
            >
                <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={handleUpload}
                    beforeUpload={() => false}
                    multiple
                >
                    <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default NewsPostForm;
