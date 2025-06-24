
import React, { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col, Divider, Select, Card } from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";
import dayjs from "dayjs";
import {
    CloseOutlined,
    UploadOutlined,
    EyeOutlined,
    PlusOutlined,
    DeleteOutlined,
    FormOutlined,
    SaveOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const ProvincePage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();
    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const filterRef = useRef({ txt_search: "" });
    const fileRef = useRef(null);

    useEffect(() => {
        formCat.setFieldsValue({ status: "1" });
        getList();
    }, []);

    const getList = useCallback(async () => {
        setLoading(true);
        const param = { txt_search: filterRef.current.txt_search };
        try {
            const res = await request("province/getList", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error('Failed to fetch the list.');
        } finally {
            setLoading(false);
        }
    }, []);
    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({ ...item });

        setOpen(true);
    };
    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "លុប",
            content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
            okText: "លុប",
            cancelText: "បដិសេធ",
            okType: "danger",
            centered: true,
            onOk: async () => {
                const data = { Id: item.Id };
                const res = await request("province/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };
    const onTextSearch = (value) => {
        filterRef.current.txt_search = value;
        getList();
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({ status: "1" });
        setOpen(false);

    };
    const onFinish = async (item) => {
        const Id = formCat.getFieldValue("Id");
        const form = new FormData();
        form.append("Id", Id);
        form.append("Name_Province", item.Name_Province);
        form.append("Code_Province", item.Code_Province);  
        form.append("Other", item.Other);

        // form.append("PreImage", formCat.getFieldValue("file"));

        // if (fileSelected) form.append("file", fileSelected);

        const method = Id == null ? "post" : "put";
        const url = Id == null ? "province/create" : "province/update";

        try {
            const res = await request(url, method, form);
            if (res) {
                message.success(res.message);
                getList();
                onCloseModule();
            }
        } catch (error) {
            message.error('Failed to save the person.');
        }
    };

    return (

        <div>
            <MainPage loading={loading}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                    <Space>
                        <div className="txt_title" style={{ fontSize: 16 }}> ឈ្មោះពេញខេ​ត្ត /ក្រុង/កម្ពុជា</div>
                        <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                    </Space>
                    <Button onClick={() => setOpen(true)} type="primary"><PlusOutlined />បន្ថែមថ្មី</Button>
                </div>
                <hr />
              <Table
    dataSource={list}
    pagination={{ pageSize: 50 }}
    scroll={{ y: 450 }} // ← This makes the table scroll vertically
    columns={[
        // { key: "No", title: "ល.រ", render: (_, __, index) => index + 1 },
        { key: "Code_Province", title: "លេខកូដ", dataIndex: "Code_Province" },
        { key: "Name_Province", title: "ឈ្មោះខេត្ត និងក្រុងពេញ", dataIndex: "Name_Province" },
        { key: "Other", title: "ផ្សេងៗ", dataIndex: "Other" },
        {
            key: "Action", title: "ប្រតិបត្តិការណ៍", render: (_, item) => (
                <Space>
                    <Button onClick={() => onClickBtnEdit(item)}><FormOutlined />កែប្រែ</Button>
                    <Button onClick={() => onClickBtnDelete(item)} danger><DeleteOutlined />លុប</Button>
                </Space>
            )
        }
    ]}
/>


                <Modal
                    title={formCat.getFieldValue("Id") == null ? "បញ្ជីខេត្ត និងក្រុង/កម្ពុជា" : "កែប្រែ"}
                    open={open}
                    onCancel={onCloseModule}
                    footer={null}
                    width="50%"
                    maskClosable={false}
                >
                    <Form form={formCat} layout="vertical" onFinish={onFinish}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <Card title="បំពេញព័ត៌មាន" ariant="borderless" >
                                <Row gutter={16}>
                                     <Col xs={24} sm={24} md={24}>
                                        <Form.Item
                                            label="លេខកូដ"
                                            name="Code_Province"
                                            rules={[{ required: true, message: "សូមបំពេញឈ្មោះលេខកូដ!" }]}
                                        >
                                            <Input placeholder="លេខកូដ" />
                                        </Form.Item>
                                    </Col>

                                 
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item
                                            label="ឈ្មោះពេញខេ​ត្ត /ក្រុង/កម្ពុជា"
                                            name="Name_Province"
                                            rules={[{ required: true, message: "សូមបំពេញឈ្មោះពេញខេ​ត្ត /ក្រុង/កម្ពុជា!" }]}
                                        >
                                            <Input placeholder="ឈ្មោះពេញខេ​ត្ត /ក្រុង/កម្ពុជា" />
                                        </Form.Item>
                                    </Col>
                                    
                                      <Col xs={24} sm={24} md={24}>
                                      
                                       <Form.Item
                                                                    label="ផ្សេងៗ (Optional)"
                                                                    name="Other"
                                    
                                                                >
                                                                    <TextArea placeholder="ផ្សេងៗ" rows={4} />
                                       </Form.Item>
                                      </Col>




                                </Row>

                            </Card>
                         
                          
                           
                         

                        </Space>





                        <Form.Item style={{ textAlign: "right" }}>
                            <Space>
                                <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
                                <Button type="primary" htmlType="submit"><SaveOutlined />រក្សាទុក</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

            </MainPage>
         

        </div>

    );
};

export default ProvincePage;