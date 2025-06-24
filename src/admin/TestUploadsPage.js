import React, { useState } from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const TestUploadsPage = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleUpload = ({ fileList }) => setFileList(fileList);

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        fileList.forEach((file) => {
            formData.append('images', file.originFileObj);
        });

        try {
            await axios.post('/api/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('News post added successfully');
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Error adding news post', error);
            message.error('Error adding news post');
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

export default TestUploadsPage;
