import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, DatePicker, Col, Row } from "antd"
import MainPage from "../component/page/MainPage";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const CategoryPage = () => {
    
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();
    

    useEffect(() => {
        formCat.setFieldsValue({
            Status: "1"
        });
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
        status: null
    });

    const getList = async () => {
        setLoading(true);
        var param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        };
        const res = await request("category/getlist", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
        }
    };

    const onClickBtnEdit = async (item) => {
        formCat.setFieldsValue({
            id: item.id,
            parentId: item.parentId,
            title: item.title,
            metaTitle: item.metaTitle,
            slug: item.slug,
            content: item.content,
        });
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
                setActionLoading(true);
                var data = { id: item.id };
                const res = await request("category/delete", "delete", data);
                setActionLoading(false);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };

    const onFinish = async (item) => {
        setActionLoading(true);
        var id = formCat.getFieldValue("id");
        var data = {
            id: id,
            title: item.title,
            metaTitle: item.metaTitle,
            slug: item.slug,
            content: item.content,
        };
        var method = (id == null ? "post" : "put");
        var url = (id == null ? "category/create" : "category/update");
        const res = await request(url, method, data);
        setActionLoading(false);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
        }
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = e.target.value;
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.status = value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            Status: "1"
        });
        setOpen(false);
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">Category</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="Name or Code" />
                    <Select onChange={onChangeStatus} placeholder="Status" allowClear style={{ width: 120 }}>
                        <Select.Option value={"1"}>Active</Select.Option>
                        <Select.Option value={"0"}>Inactive</Select.Option>
                    </Select>
                    <DatePicker />
                    <DatePicker />
                </Space>
                <Button onClick={() => { setOpen(true) }} type="primary">New</Button>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{ pageSize: 7 }}
                columns={[
                    {
                        key: "No",
                        title: "No",
                        dataIndex: "title",
                        // render: (value,record, index) => (index + 1)
                        render: (text, record, index) => index + 1
                    },
                    {
                        key: "t",
                        title: "Title",
                        dataIndex: "title",
                    },
                    {
                        key: "m",
                        title: "Meta Title",
                        dataIndex: "metaTitle",
                    },
                    {
                        key: "slug",
                        title: "Slug",
                        dataIndex: "slug",
                    },
                    {
                        key: "Action",
                        title: "Action",
                        render: (value, item) => (
                            <Space>
                                <Button 
                                    onClick={() => onClickBtnEdit(item)} 
                                    type="primary" 
                                    loading={actionLoading}
                                    disabled={actionLoading}
                                >
                                    Edit
                                </Button>
                                <Button 
                                    onClick={() => onClickBtnDelete(item)} 
                                    type="primary" 
                                    danger 
                                    loading={actionLoading}
                                    disabled={actionLoading}
                                >
                                    Delete
                                </Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "New Category" : "Update Category"}
                open={open}
                onCancel={onCloseModule}
                footer={null}
                maskClosable={false}
            >
                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Title"
                                name={"title"}
                                rules={[{ required: true, message: "Please input title!" }]}
                            >
                                <Input placeholder="Title" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Slug"
                                name={"slug"}
                                rules={[{ required: true, message: "Please input slug!" }]}
                            >
                                <Input placeholder="Slug" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label="Meta Title"
                        name={"metaTitle"}
                    >
                        <Input placeholder="Meta Title" />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>បដិសេធ</Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={actionLoading}
                                disabled={actionLoading}
                            >
                                {formCat.getFieldValue("id") == null ? "Save" : "Update"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default CategoryPage;
