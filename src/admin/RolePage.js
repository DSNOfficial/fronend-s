import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Tag, DatePicker, Span ,Col, Row } from "antd"
import MainPage from "../component/page/MainPage";
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { CloseOutlined, UploadOutlined, EyeOutlined ,PlusOutlined,DeleteOutlined ,FormOutlined,CloseCircleOutlined,SaveOutlined} from "@ant-design/icons";

import "../component/assets/css/TextEditor.css";

const RolePage = () => {

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();
    const [content, setContent] = useState('');

    const handleContentChange = (value) => {
        setContent(value);
    };

    useEffect(() => {
        formCat.setFieldsValue({
            status: "1"
        })
        getList();
    }, [])

    const filterRef = useRef({
        txt_search: null,
        status: null
    })
    const getList = async () => {
        setLoading(true)
        var param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        }
        const res = await request("role/getlist", "get", param);
        setLoading(false)
        if (res) {
            setList(res.list)
        }
    }
    const onClickBtnEdit = async (item) => {
        formCat.setFieldsValue({
            // Id : item.Id, //
            id: item.id,
            name: item.name,
            code: item.code,
            status: item.status
          
        })
        setOpen(true)
        console.log(item)

        // console.log(item)

    }
    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "Delete",
            content: "Are you sure you want to delete ?",
            okText: "Yes",
            cancelText: "No",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id,
                    // parentId: item.parentId
                }
                const res = await request("role/delete", "delete", data);
                if (res) {
                    message.success(res.message)
                    getList();
                }
            }
        })
    }

    const onFinish = async (item) => {
        var id = formCat.getFieldValue("id")
        var data = {
            id: id,
            name: item.name,
            code: item.code,
            status: item.status+""
          
        }
        var method = (id == null ? "post" : "put")
        var url = (id == null ? "role/create" : "role/update")
        const res = await request(url, method, data);
        if (res) {
            message.success(res.message)
            getList();
            onCloseModule();
        }

    }
    const onTextSearch = (value) => {
        // filterRef.current.txt_search = value // set value to ref key txt_search
        // // var x = filterRef.current.txt_search // get 
        // getList();
    }
    const onChangeSearch = (e) => {
        filterRef.current.txt_search = (e.target.value)
        getList();
    }
    const onChangeStatus = (value) => {
        filterRef.current.status = value
        getList();
    }
    const onCloseModule = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            status: "1"
        })
        setOpen(false)
    }

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title" style={{fontSize:16}}>កំណត់តួនាទីគណនីអ្នកប្រើប្រាស់</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                  
                </Space>

                <Button onClick={() => { setOpen(true) }} type="primary"><PlusOutlined/>បន្ថែមថ្មី</Button>
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
                        width:60,
                        render: (value, item, index) => (index + 1)
                        
                    },
                    {
                        key: "name",
                        title: "ឈ្មោះអង់គ្លេស",
                        dataIndex: "name",
                     
                    },
                    {
                        key: "code",
                        title: "ឈ្មោះខ្មែរ",
                        dataIndex: "code",
                     
                    },
                    {
                        key: "status",
                        title: "ដំណើរការ / មិនដំណើរការ",
                        dataIndex: "status",
                  
                        render:(value)=>(value===1 ? <Tag color="green" >Actived</Tag> : <Tag color="red">InActived</Tag>)

                    },
             
                    {
                        key: "Action",
                        title: "កែប្រែ​​/​លុប",
                        dataIndex: "status",
                        render: (value, item, index) => (
                            <Space>
                                 <Button onClick={() => onClickBtnEdit(item)}><FormOutlined />កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger><DeleteOutlined />លុប</Button>
                            
                        </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "កំណត់តួនាទី | បន្ថែមថ្មី" : "កំណត់តួនាទី | កែប្រែ"}
                open={open}
                onCancel={(onCloseModule)}
                okText="Save"
                maskClosable={false}
                footer={null}
            
            >
                <Form
                    // labelCol={{
                    //     span:8
                    // }}
                    // wrapperCol={{
                    //     span:16
                    // }}
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}

                >
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="ឈ្មោះអង់គ្លេស"
                                name={"name"}
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញឈ្មោះអង់គ្លេស!",
                                    }
                                ]}
                            >

                                <Input style={{ width: "100%" }} placeholder="ឈ្មោះអង់គ្លេស" />

                            </Form.Item>
                            <Form.Item
                                label="ឈ្មោះខ្មែរ"
                                name={"code"}
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញឈ្មោះខ្មែរ!",
                                    }
                                ]}
                            >

                                <Input style={{ width: "100%" }} placeholder="ឈ្មោះខ្មែរ" />

                            </Form.Item>

                        </Col>
                       

                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name={"status"}
                            >
                                <Select defaultValue={"1"}>
                                    <Select.Option value="1">ដំណើរការ</Select.Option>
                                    <Select.Option value="0">មិនដំណើរការ</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                   

                    </Row>
                  


                    <Form.Item style={{textAlign:"right"}}>
                        <Space>
                            
                            <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
                            <Button type="primary" htmlType="submit"><SaveOutlined />{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>

                </Form>

            </Modal>
        </MainPage>
    )
}

export default RolePage