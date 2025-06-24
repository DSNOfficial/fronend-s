import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import "../component/assets/css/TextEditor.css";
import dayjs from 'dayjs';
const { TextArea } = Input;

const MassagePage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // For view detail modal
    const [viewItem, setViewItem] = useState(null); // For storing the item to view details
    const [formCat] = Form.useForm();

    useEffect(() => {
        formCat.setFieldsValue({
            status: "1"
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
        const res = await request("massage/getlist", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
        }
    };

    const onClickBtnEdit = async (item) => {
        formCat.setFieldsValue({
            id: item.id,
            title: item.title,
            Email: item.Email,
            Phone: item.Phone,
            Massage: item.Massage,
        });
        setOpen(true);
    };

    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure you want to delete?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id,
                };
                const res = await request("massage/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };

    const onClickBtnView = (item) => {
        setViewItem(item);
        setViewOpen(true);
    };

    const onFinish = async (item) => {
        var id = formCat.getFieldValue("id");
        var data = {
            id: id,
            Title: item.Title,
            Email: item.Email,
            Phone: item.Phone,
            Massage: item.Massage,
        };
        var method = (id == null ? "post" : "put");
        var url = (id == null ? "Massage/create" : "Massage/update");
        const res = await request(url, method, data);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
        }
    };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = (e.target.value);
        getList();
    };

    const onChangeStatus = (value) => {
        filterRef.current.status = value;
        getList();
    };

    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            status: "1"
        });
        setOpen(false);
    };

    const onCloseViewModule = () => {
        setViewOpen(false);
        setViewItem(null);
    };

    const toKhmerNumeral = (num) => {
        const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        return num.toString().split('').map(digit => khmerNumerals[digit]).join('');
    };

    const formatKhmerDate = (date) => {
        const day = toKhmerNumeral(dayjs(date).date());
        const month = dayjs(date).locale('km').format('MMMM');
        const year = toKhmerNumeral(dayjs(date).year());
        return `ថ្ងៃទី${day} ខែ${month} ${year}`;
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">ទំនាក់ទំនងជាមួយអ៊ីម៉ែល</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
                </Space>
            </div>
            <hr />
            <Table
                dataSource={list}
                pagination={{
                    pageSize: 7,
                }}
                columns={[
                    {
                        key: "No",
                        title: "ល.រ",
                        align: 'left',
                        width: 60,
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "Title",
                        title: "ឈ្មោះ",
                        dataIndex: "Title",
                    },
                    // {
                    //     key: "Massage",
                    //     title: "សំបុត្រ",
                    //     dataIndex: "Massage",
                    // },
                    {
                        key: "Email",
                        title: "អ៊ីម៉ែល",
                        dataIndex: "Email",
                    },
                    {
                        key: "Phone",
                        title: "ទូរស័ព្ទ",
                        dataIndex: "Phone",
                    },
                    {
                        key: "CreatedAt",
                        title: "ថ្ងៃបង្កើត",
                        dataIndex: "CreatedAt",
                        render: (value) => formatKhmerDate(value),
                    },
                    {
                        key: "Action",
                        title: "កែប្រែ​​/​លុប",
                        dataIndex: "status",
                        render: (value, item, index) => (
                            <Space>
                                {/* <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button> */}
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                                <Button onClick={() => onClickBtnView(item)}>មើលព័ត៌មានលម្អិត</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "ទំនាក់ទំនងជាមួយអ៊ីម៉ែល | បន្ថែមថ្មី" : "ទំនាក់ទំនងជាមួយអ៊ីម៉ែល | កែប្រែ"}
                open={open}
                onCancel={onCloseModule}
                okText="Save"
                maskClosable={false}
                footer={null}
            >
                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="ឈ្មោះ"
                                name={"Title"}
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញឈ្មោះ!",
                                    }
                                ]}
                            >
                                <Input style={{ width: "100%" }} placeholder="ឈ្មោះ" />
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name={"Email"}
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញអ៊ីម៉ែល!",
                                    }
                                ]}
                            >
                                <Input style={{ width: "100%" }} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                label="លេខទូរសព្ទ"
                                name={"Phone"}
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញលេខទូរសព្ទ!",
                                    }
                                ]}
                            >
                                <Input style={{ width: "100%" }} placeholder="លេខទូរសព្ទ" />
                            </Form.Item>
                            <Form.Item
                                label="Massage"
                                name={"Massage"}
                            >
                                <Input style={{ width: "100%" }} placeholder="សំបុត្រ" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}>Cancel</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="ព័ត៌មានលម្អិត"
                open={viewOpen}
                onCancel={onCloseViewModule}
                footer={null}
                maskClosable={false}
            >
                {viewItem && (
                    <div>
                        <p><strong>ឈ្មោះ:</strong> {viewItem.Title}</p>
                        <p><strong>អ៊ីម៉ែល:</strong> {viewItem.Email}</p>
                        <p><strong>ទូរស័ព្ទ:</strong> {viewItem.Phone}</p>
                        <p><strong>សំបុត្រ:</strong> {viewItem.Massage}</p>
                        <p><strong>ថ្ងៃបង្កើត:</strong> {formatKhmerDate(viewItem.CreatedAt)}</p>
                    </div>
                )}
            </Modal>
        </MainPage>
    );
};

export default MassagePage;
