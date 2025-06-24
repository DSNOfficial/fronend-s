
import React, { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col } from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull } from "../config/helper";
import dayjs from "dayjs";
import { 
    CloseOutlined,
     UploadOutlined,
      EyeOutlined ,
      PlusOutlined,
      DeleteOutlined,
      FormOutlined,
      SaveOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";



const { TextArea } = Input;

const DepartPage = () => {
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
            const res = await request("departmentP/getList", "get", param);
            if (res) setList(res.list);
        } catch (error) {
            message.error('Failed to fetch the list.');
        } finally {
            setLoading(false);
        }
    }, []);

   

    const onClickBtnEdit = (item) => {
   // formCat.setFieldsValue({ ...item  });
    formCat.setFieldsValue({ ...item, file: item.file_path });


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
                const res = await request("departmentP/delete", "delete", data);
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
        form.append("Name_Dept", item.Name_Dept);
        form.append("Name_Type", item.Name_Type);
       
       // form.append("PreImage", formCat.getFieldValue("file"));

       // if (fileSelected) form.append("file", fileSelected);

        const method = Id == null ? "post" : "put";
        const url = Id == null ? "departmentP/create" : "departmentP/update";

        try {
            const res = await request(url, method, form);
            if (res) {
                message.success(res.message);
                getList();
                onCloseModule();
            }
        } catch (error) {
            message.error('Failed to save the departmentj.');
        }
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title"style={{fontSize:16}}> បញ្ចីនៃការិយាល័យ /ផ្នែក/ឯកជន</div>
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
                    { key: "No", title: "ល.រ", render: (_, __, index) => index + 1 },
                    { key: "Name_Dept", title: "ការិយាល័យ /ផ្នែក/ឯកជន", dataIndex: "Name_Dept" },
                    { key: "Name_Type", title: "ប្រភេទ", dataIndex: "Name_Type" },
                  
                    //{ key: "CreateBy", title: "បង្កើតដោយ", dataIndex: "CreateBy" },
                  
                    {
                        key: "Action", title: "ប្រតិបត្តិការណ៍", render: (_, item) => (
                            <Space>
                                <Button onClick={() => onClickBtnEdit(item)}><FormOutlined />កែប្រែ</Button>
                            {/* //// <Button onClick={() => onClickBtnEdit(item)}><FormOutlined />ព្រីនប្រវត្តិនៃអ្នកប្រើប្រាស់បណ្ណម៉ូតូ</Button> */}
                                <Button onClick={() => onClickBtnDelete(item)} danger><DeleteOutlined />លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />

            <Modal
                title={formCat.getFieldValue("Id") == null ? "ការចុះឈ្មោះការិយាល័យ /ផ្នែក/ឯកជន" : "កែប្រែ"}
                open={open}
                onCancel={onCloseModule}
                footer={null}
                width="50%"
                maskClosable={false}
            >
                <Form form={formCat} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="ឈ្មោះ ការិយាល័យ /ផ្នែក/ឯកជន"
                        name="Name_Dept"
                        rules={[{ required: true, message: "សូមបំពេញឈ្មោះពេញ!" }]}
                    >
                        <Input placeholder="ឈ្មោះពេញ" />
                    </Form.Item>

                    <Form.Item
                        label="ប្រភេទ"
                        name="Name_Type"
                        rules={[{ required: true, message: "សូមបំពេញប្រភេទ!" }]}
                    >
                        <TextArea placeholder="ប្រភេទ" rows={4} />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
                            <Button type="primary" htmlType="submit"><SaveOutlined />រក្សាទុក</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </MainPage>
    );
};

export default DepartPage;