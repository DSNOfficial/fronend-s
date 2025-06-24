import React, { useEffect, useState, useRef, useCallback } from "react";
import { Table, Button, Space, Input, message, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { request } from "../../config/request";
import { Config } from "../../config/helper";
import '@react-pdf-viewer/core/lib/styles/index.css';

const BooksPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewPDF, setViewPDF] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [clickedRow, setClickedRow] = useState(null); // Track only one clicked row at a time
    const filterRef = useRef({ txt_search: "" });

    useEffect(() => {
        getList();
    }, []);

    const getList = useCallback(async () => {
        setLoading(true);
        const param = { txt_search: filterRef.current.txt_search };
        try {
            const res = await request("book/getlist", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error('Failed to fetch the list.');
        } finally {
            setLoading(false);
        }
    }, []);

    const onTextSearch = (value) => {
        filterRef.current.txt_search = value;
        getList();
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onViewPDF = (url) => {
        setFileUrl(url);
        setViewPDF(true);
    };

    const onCloseViewPDF = () => {
        setViewPDF(false);
        setFileUrl(null);
    };

    const handleTitleClick = (file_path, key) => {
        onViewPDF(Config.image_path + file_path);
        setClickedRow(key); // Update to the current clicked row
    };

    return (
        <div style={{ padding: '20px', margin: '0 auto', maxWidth: '1200px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                <div className="txt_title" style={{ color: '#343293' }}>ច្បាប់ និងបទដ្ឋានគតិយុត្ត</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរកច្បាប់ និងបទដ្ឋានគតិយុត្ត
" onSearch={onTextSearch} />
                </Space>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{ pageSize: 7 }}
                columns={[
                    {
                        key: "title",
                        title: <span style={{ color: '#343293' }}>ចំណងជើង</span>,
                        dataIndex: "title",
                        width: 420,
                        render: (text, item) => (
                            <span
                                style={{
                                    color: clickedRow === item.key ? '343293' : '#343293', // Change color only for the clicked row
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleTitleClick(item.file_path, item.key)}
                            >
                                {text}
                            </span>
                        )
                    },
                    {
                        key: "file_path",
                        title: <span style={{ color: '#343293' }}>ឯកសារ</span>,
                        dataIndex: "file_path",
                        width: 200,
                        render: (value, item) => (
                            <Space>
                                <Button
                                    icon={<EyeOutlined />}
                                    onClick={() => onViewPDF(Config.image_path + item.file_path)}
                                    style={{ color: '#343293' }}
                                >
                                    មើល
                                </Button>
                            </Space>
                        )
                    },
                ]}
                loading={loading}
            />

            <Modal
                visible={viewPDF}
                onCancel={onCloseViewPDF}
                footer={null}
                width={800}
                bodyStyle={{ height: '80vh' }}
            >
                <iframe src={fileUrl} style={{ width: '100%', height: '100%' }} />
            </Modal>
        </div>
    );
};

export default BooksPage;
