import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Tag, DatePicker, Row, Col, InputNumber } from "antd"
import MainPage from "../component/page/MainPage";
import { formatDateClient, formatDateServer } from "../config/helper";
import ColumnGroup from "antd/es/table/ColumnGroup";
import dayjs from "dayjs";

const CustomerPage = () => {

    const [list, setList] = useState([]);
    const [role, setRole] = useState([]);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();



    useEffect(() => {
        formCat.setFieldsValue({
            Status: "1"
        })
        getList();
    }, [])

    const filterRef = useRef({
        txt_search: null,
        status: null,
        role_id : null
    })

    const getList = async () => {
        setLoading(true)
        var param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
            role_id : filterRef.current.role_id,
        }
        const res = await request("customer/getlist", "get", param);
        setLoading(false)
        if (res) {
            setList(res.list)
            setRole(res.role)
        }
    }
    const onClickBtnEdit = async (item) => {
        formCat.setFieldsValue({
            ...item,
            Dob:dayjs(item.Dob),
            Gender:item.Gender+"",
            Status:item.Status+"",
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
                    Id: item.Id
                }
                const res = await request("customer/delete", "delete", data);
                if (res) {
                    message.success(res.message)
                    getList();
                }
            }
        })
    }

    const onFinish = async (item) => {
        var Id = formCat.getFieldValue("Id")
        var data = {
            ...item,
            Id:Id,
            Dob:formatDateServer(item.Dob)
        }
        var method = (Id == null ? "post" : "put")
        var url = (Id == null ? "customer/create" : "customer/update")
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
            Status: "1"
        })
        setOpen(false)
    }
    const onSelectRole = (value) => {
        filterRef.current.role_id = value
        getList();
    }

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">Customer</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="Name or Code" onSearch={onTextSearch} />
                    <Select onChange={onChangeStatus} placeholder="Status" allowClear style={{ width: 120 }} >
                        <Select.Option value={"1"}>Active</Select.Option>
                        <Select.Option value={"0"}>InActive</Select.Option>
                    </Select>
               
                </Space>

                <Button onClick={() => { setOpen(true) }} type="primary">New</Button>
            </div>
            <hr></hr>
            <Table
                dataSource={list}
                pagination={{
                    pageSize: 7,
                }}
                columns={[
                    {
                        key: "No",
                        title: "No",
                        dataIndex: "Name",
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "Firstname",
                        title: "Firstname",
                        dataIndex: "Firstname",
                    },
                    {
                        key: "Lastname",
                        title: "Lastname",
                        dataIndex: "Lastname",
                    },
                    {
                        key: "Gender",
                        title: "Gender",
                        dataIndex: "Gender",
                        render: (value) => value == 1 ? "Male" : "Female"
                    },
                    {
                        key: "Dob",
                        title: "Dob",
                        dataIndex: "Dob",
                        render: (value) => formatDateClient(value)
                    },
                    {
                        key: "Tel",
                        title: "Tel",
                        dataIndex: "Tel",
                    },
                    {
                        key: "Address",
                        title: "Address",
                        dataIndex: "Address",
                    },
                    {
                        key: "Status",
                        title: "Status",
                        dataIndex: "Status",
                        render: (value) => (value === 1 ? <Tag color="green" >Actived</Tag> : <Tag color="red">InActived</Tag>)

                    },
                    {
                        key: "CreateAt",
                        title: "CreateAt",
                        dataIndex: "CreateAt",
                        render: (value) => formatDateClient(value)
                    },
                    {
                        key: "Action",
                        title: "Action",
                        dataIndex: "Status",
                        align:'right',
                        width:120,
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)} type="primary">Edit</Button>
                                <Button onClick={() => onClickBtnDelete(item)} type="primary" danger>Delete</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("Id") == null) ? "New Customer" : "Update Customer"}
                open={open}
                onCancel={(onCloseModule)}
                okText="Save"
                footer={null}
                width={600}
                maskClosable={false}
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
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Firstname"
                                name={"Firstname"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please write!!",
                                    }
                                ]}
                            >
                                <Input placeholder="Firstname name" />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Lastname"
                                name={"Lastname"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please write!!",
                                    }
                                ]}
                            >
                                <Input placeholder="Lastname name" />
                            </Form.Item>


                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Gender"
                                name={"Gender"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input gender!!",
                                    }
                                ]}
                            >
                               <Select placeholder="Select Gender">
                                    <Select.Option value="1">Male</Select.Option>
                                    <Select.Option value="0">Female</Select.Option>
                                    <Select.Option value="2">Other</Select.Option>
                                </Select>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Dob"
                                name={"Dob"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input DOB!!",
                                    }
                                ]}
                            >
                                <DatePicker
                                style={{width:"100%"}}
                                format={"DD/MM/YYYY"}
                                placeholder="Dob"
                                />
                                
                            </Form.Item>


                        </Col>
                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Tel"
                                name={"Tel"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input tel!!",
                                    }
                                ]}
                            >
                                <Input placeholder="Tel" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Email"
                                name={"Email"}
                                
                            >
                                <Input placeholder="Email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="Status"
                                name={"Status"}
                            >
                                <Select defaultValue={"1"}>
                                    <Select.Option value="1">Actived</Select.Option>
                                    <Select.Option value="0">InActived</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Address"
                                name={"Address"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input Address!!",
                                    }
                                ]}
                            >
                                <Input.TextArea style={{width:"100%"}} placeholder="Address" />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={5}>
                        <Col span={12}>
                            
                        </Col>
            
                    </Row>
                    
                    <Form.Item>
                        <Space>
                            <Button onClick={onCloseModule}>Cancel</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("Id") == null ? "Save" : "Update"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    )
}

export default CustomerPage