import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Select, message, Tag, DatePicker, Row, Col, InputNumber, Image } from "antd"
import { Config, formartDateClient, formartDateServer,isEmptyOrNull } from "../config/helper";
import MainPage from "../component/page/MainPage";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from "dayjs";
import { CloseOutlined, DeleteFilled, UploadOutlined, EyeOutlined } from "@ant-design/icons";


const DepartmentPage = () => {
    const [list, setList] = useState([]);
    const [role, setRole] = useState([]);
    const [category,setCategory] = useState([]);
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formCat] = Form.useForm();
    const [content, setContent] = useState('');
    const [fileSelected,setFileSelected] = useState(null); // past to api
    const [filePreview,setFilePreview] = useState(null); // preview in client

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

    const fileRef = useRef(null);

    const getList = async () => {
        setLoading(true)
        var param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
            role_id : filterRef.current.role_id,
        }
        const res = await request("department/getList", "get",param);
        setLoading(false)
        if (res) {
            setList(res.list)
            // setCategory(res.category)
        }
    }
    
    const handleContentChange = (value) => setContent(value);
    const onClickBtnEdit = (item) => {
        formCat.setFieldsValue({
            ...item,
            "image":item.Image
            // Status: item.Status === null ? "0" : item.Status+"",
        })
        setFilePreview(Config.image_path+item.Image)
        setOpen(true)
    }
    const onClickBtnDelete = async (item) => {
        Modal.confirm({
            title: "លុប",
            content: "តើលោកអ្នកចង់លុបមែន ឬទេ?",
              okText: "លុប",
              cancelText: "បដិសេធ",
            okType: "danger",
            centered: true,
            onOk: async () => {
                var data = {
                    id: item.id
                }
                const res = await request("department/delete", "delete", data);
                if (res) {
                    message.success(res.message)
                    getList();
                }
            }
        })

    }
    const onClickBtnView = (item) => {
        setSelectedItem(item);
        setViewOpen(true);
    }
    const onFinish = async (item) => {
        var id = formCat.getFieldValue("id")
        var form = new FormData();
        form.append("id",id);
        form.append("Title",item.Title);
        form.append("Name",item.Name);
        form.append("Description",item.Description);
        form.append("Content",item.Content);
        form.append("timeCheck",item.timeCheck);
        form.append("Status",item.Status);
        form.append("PreImage",formCat.getFieldValue("image"));
        if(fileSelected != null){
            form.append("image",fileSelected);
        }
        var method = (id == null ? "post" : "put")
        const url = (id == null ? "department/create" : "department/update")
        const res = await request(url, method, form);
        if (res) {
            if(res.error){
                var mgs = ""
                Object.keys(res.message).map((key,index)=>{
                    mgs += res.message[key]
                })
                message.error(mgs)
                return false
            }
            message.success(res.message)
            getList();
            onCloseModal();
            window.location.reload();  // Refresh the page
        }
    }
    const onTextSearch = (value) => {

    }
    const onChangeSearch = (e) => {
        filterRef.current.txt_search = (e.target.value)
        getList();
    }
    const onChangeStatus = (value) => {
        filterRef.current.value = value
        getList();
    }
    const onCloseModal = () => {
        formCat.resetFields();
        formCat.setFieldsValue({
            Status: "1"
        })
        setOpen(false)
        onRemoveFileSelected();
    }

    const onSelectRole = (value) => {
        filterRef.current.role_id = value
        getList();
    }

    const onChnageFile = (e) => {
        var file = e.target.files[0];
        var filePreview = URL.createObjectURL(file);
        setFileSelected(file);
        setFilePreview(filePreview);
    }

    const onRemoveFileSelected = () => {
        fileRef.current.value = null;
        setFileSelected(null)
        setFilePreview(null)
    }
    const handleChangeFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            const filePreview = URL.createObjectURL(file);
            setFileSelected(file);
            setFilePreview(filePreview);
        }
    };

    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">សេវាព្យាបាល</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                </Space>

                <Button onClick={() => { setOpen(true) }} type="primary">បន្ថែមថ្មី</Button>
            </div>
            <Table
                dataSource={list}
                bordered
         
                loading={loading}
                pagination={{ pageSize: 10 }}
                  
                columns={[
                    {
                        key: "No",
                        title: "ល.រ",
                        align: 'left',
                        width:55,
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "Name",
                        title: "ភាសាខ្មែរ",
                        dataIndex: "Name",
                        width:'25%',
                    },
                    {
                        key: "Description",
                        title: "English",
                        dataIndex: "Description",
                        width:'12%',
                    },
                    {
                        key: "timeCheck",
                        title: "ម៉ោងពិនិត្យសុខភាព",
                        dataIndex: "timeCheck",
                        width:'12%',
                    },
                    {
                        key: "Title",
                        title: "អក្សរកាត់ជាអង់គ្លេស",
                        dataIndex: "Title",
                    },
                    {
                        key: "Image",
                        title: "រូបភាព",
                        dataIndex: "Image",
                        render : (value) => {
                            if(value != null && value != ""){
                                return (
                                    <Image 
                                        src={Config.image_path+value}
                                        alt=""
                                        width={60}
                                    />
                                )
                            }else{
                                return (
                                    <div style={{height:40,width:60,backgroundColor:"#888"}}/>
                                )
                            }
                        }
                    },
                    // {
                    //     key: "Content",
                    //     title: "មាតិកា",
                    //     dataIndex: "Content",
                    //     ellipsis: true,
                    //     align: 'left',
                    //     width:'20',
                    //     render: (value) => {
                    //         if (typeof value === 'string') {
                    //             return <span dangerouslySetInnerHTML={{ __html: value }} />;
                    //         }
                    //     }
                    // },
                    {
                        key: "Action",
                        title: "សកម្មភាព",
                        dataIndex: "Status",
                        align:'right',
                        width:200,
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onClickBtnView(item)} icon={<EyeOutlined />}>មើល</Button>
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                title={(formCat.getFieldValue("id") == null) ? "សេវាកម្មមន្ទីរពេទ្យ | បន្ថែម" : "សេវាកម្មមន្ទីរពេទ្យ | កែប្រែ"}
                open={open}
                onCancel={onCloseModal}
                footer={null} 
                maskClosable={false}
                okText="Save"
                width="100%"
                height="100%"
            >
                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={5}>
                        <Col span={12}>
                            <Form.Item
                                label="ខ្មែរ"
                                name={"Name"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'សូមបំពេញឈ្មោះខ្មែរ!',
                                    },
                                ]}
                            >
                                <Input placeholder="ឈ្មោះខ្មែរ" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label=" English"
                                name={"Description"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'សូមបំពេញអង់គ្លេស!',
                                    },
                                ]}
                            >
                                <Input placeholder="អង់គ្លេស" />
                            </Form.Item>
                        </Col>
                    </Row> 
                    <Row gutter={5}>

                    <Col span={24}>
                            <Form.Item
                                label=" ម៉ោងពិនិត្យ"
                                name={"timeCheck"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'សូមបំពេញម៉ោងពិនិត្យ',
                                    },
                                ]}
                            >
                                <Input placeholder="ម៉ោងពិនិត្យ" />
                            </Form.Item>
                        </Col>
                        </Row>  
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label=" អក្សរកាត់ជាអង់គ្លេស"
                                name={"Title"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'សូមបំពេញអក្សរកាត់ជាអង់គ្លេស',
                                    },
                                ]}
                            >
                                <Input placeholder="អក្សរកាត់ជាអង់គ្លេស" />
                            </Form.Item>
                        </Col>
                    </Row>                               
                    <Row gutter={5}> 
                        <Col span={12}>
                            <Form.Item label="Upload រូបភាព">
                                <>
                                    <div style={{ width: "20%", position: 'relative' }}>
                                        {!isEmptyOrNull(filePreview) &&
                                            <CloseOutlined
                                                onClick={onRemoveFileSelected}
                                                style={{ color: "red", fontSize: 18, position: 'absolute', top: -6, right: -6, backgroundColor: "#EEE", padding: 3 }} />
                                        }
                                        {!isEmptyOrNull(filePreview) ?
                                            <img src={filePreview} style={{ width: "90%" }} alt="" />
                                            :
                                            <div style={{ width: 70, height: 70, backgroundColor: '#EEE' }}></div>
                                        }
                                    </div>
                                    <input onChange={handleChangeFile} ref={fileRef} type="file" id="selectedFile" style={{ display: "none" }} />
                                    <Button
                                        icon={<UploadOutlined />}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById('selectedFile').click();
                                        }}
                                        style={{ marginTop: 10, marginLeft: 3, width: "50%" }}
                                    >
                                        Browse...
                                    </Button>
                                </>
                            </Form.Item>
                        </Col>
                    </Row> 
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="មាតិកា"
                                name="Content"
                                rules={[{ required: true, message: "សូមបំពេញមាតិកា!" }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    placeholder="សរសេរអត្ថបទ"
                                    value={content}
                                    onChange={handleContentChange}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            [{ size: [] }],
                                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                            ['link'],
                                            ['clean']
                                        ]
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModal}>Cancel</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="មើលសេវាកម្មមន្ទីរពេទ្យ"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
                width="70%"
            >
                {selectedItem && (
                    <div>
                        <p><strong>ឈ្មោះខ្មែរ:</strong> {selectedItem.Name}</p>
                        <p><strong>អង់គ្លេស:</strong> {selectedItem.Description}</p>
                        <p><strong>អក្សរកាត់ជាអង់គ្លេស:</strong> {selectedItem.Title}</p>
                        <p><strong>ម៉ោងពិនិត្យសុខភាព:</strong> {selectedItem.timeCheck}</p>
                        <p><strong>មាតិកា:</strong></p>
                        <div dangerouslySetInnerHTML={{ __html: selectedItem.Content }} />
                        {selectedItem.Image && (
                            <Image
                                src={Config.image_path + selectedItem.Image}
                                alt={selectedItem.Name}
                                width={200}
                            />
                        )}
                    </div>
                )}
            </Modal>
        </MainPage>
    )
}

export default DepartmentPage;
