import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import "../component/assets/css/TextEditor.css";
import dayjs from "dayjs";
import { formatDateClient, formatDateServer } from "../config/helper";
import { CloseOutlined, UploadOutlined, EyeOutlined ,
    PlusOutlined,DeleteOutlined ,FormOutlined,ExclamationCircleOutlined,CloseCircleOutlined,SaveOutlined} from "@ant-design/icons";


const ModelPage = () => {
    const [list, setList] = useState([]);
    // const [province, setProvince] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formCat] = Form.useForm();
    const [formPassword] = Form.useForm();

    useEffect(() => {
        getList();
        formCat.setFieldsValue({ Status: "1" });
    }, []);

    const filterRef = useRef({ txt_search: null, status: null });

    const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        };
        const res = await request("Motor/getList", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
            // setProvince(res.province);
        }
    };

    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            Id: item.Id,
            Name_Motor: item.Name_Motor,
            Color_Motor: item.Color_Motor,
            // ProvinceId: item.ProvinceId
          
           
        });
        setOpen(true);
    };

    const onClickBtnDelete = (item) => {
        Modal.confirm({
            title: "លុប",
            content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                const data = { id: item.id };
                const res = await request("Motor/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            },
        });
    };

    const onClickBtnSetPassword = (item) => {
        setSelectedUser(item);
        formPassword.resetFields();
        setPasswordModalOpen(true);
    };

    const onFinish = async (item) => {
        const Id = formCat.getFieldValue("Id");
        const data = {
            Id: Id,
            Name_Motor: item.Name_Motor,
            Color_Motor: item.Color_Motor,       
            // ProvinceId: item.ProvinceId
           
           
        };
        const method = Id == null ? "post" : "put";
        const url = Id == null ? "Motor/create" : "Motor/update";
        const res = await request(url, method, data);
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
        setOpen(false);
    };



    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title" style={{fontSize:16}}>បញ្ជី ម៉ូឌែម៉ូតូ និងផ្លាកលេខខេត្ត /ក្រុង /កម្ពុជា</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" />
                </Space>
                <Button onClick={() => setOpen(true)} type="primary"><PlusOutlined/>បន្ថែមថ្មី</Button>
            </div>
            <hr />
            <Table
                dataSource={list}
                
                pagination={{ pageSize: 50 }}
                scroll={{ y: 450 }} // ← This makes the table scroll vertically
                columns={[
                    {
                        key: "No",
                        title: "ល.រ",
                      
                        align: 'left',
                        width:60,
                        render: (value, item, index) => index + 1,
                    },
                    {
                        key: "Name_Motor",
                        title: "ម៉ូឌែម៉ូតូ",
                        dataIndex: "Name_Motor",
                    },
                     {
                        key: "Color_Motor",
                        title: "ពណ៌",
                        dataIndex: "Color_Motor",
                    },
                    
                    
                    // {
                    //     key: "ProvinceId",
                    //     title: "ខេត្ត /ក្រុង",
                    //     dataIndex: "ProvinceId",
                    //     render: (ProvinceId) => province.find(r => r.Id === ProvinceId)?.Name_Province || 'Unknown',
                    // },
                 
                    {
                        key: "Action",
                        title: "កែប្រែ / លុប​ ",
                        render: (value, item) => (
                            <Space>

                                 <Button onClick={() => onClickBtnEdit(item)}><FormOutlined />កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger><DeleteOutlined />លុប</Button>
                           
                            </Space>
                        ),
                    },
                ]}
            />
            <Modal
                title={formCat.getFieldValue("Id") == null ? "ម៉ូឌែម៉ូតូ | បន្ថែមថ្មី" : "ម៉ូឌែម៉ូតូ | កែប្រែ"}
                open={open}
                onCancel={onCloseModule}
                footer={null}
                maskClosable={false}
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label="ឈ្មោះម៉ូឌែម៉ូតូ"
                                name="Name_Motor"
                                rules={[{ required: true, message: "សូមបំពេញម៉ូឌែម៉ូតូ!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="ម៉ូឌែម៉ូតូ" />
                            </Form.Item>
                        </Col>
                         <Col span={24}>
                            <Form.Item
                                label="ពណ៌"
                                name="Color_Motor"
                                rules={[{ required: true, message: "សូមបំពេញពណ៌!" }]}
                            >
                                <Input style={{ width: "100%" }} placeholder="ពណ៌" />
                            </Form.Item>
                        </Col>
                        
{/*                         
                        <Col span={24}>
                            <Form.Item
                                label="ខេត្ត /ក្រុង"
                                name="ProvinceId"
                                rules={[{ required: true, message: "សូមបំពេញខេត្ត/ក្រុង!" }]}
                            >
                                <Select placeholder="Please select province">
                                    {province.map((item) => (
                                        <Select.Option key={item.Id} value={item.Id}>{item.Name_Province}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col> */}
                        </Row>             
           
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>            
                            <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
                            <Button type="primary" htmlType="submit">
                                <SaveOutlined />
                                {formCat.getFieldValue("Id") == null ? "រក្សាទុក" : "កែប្រែ"}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
          
        </MainPage>
    );
};

export default ModelPage;
