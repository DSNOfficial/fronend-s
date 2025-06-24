

import { useEffect, useState, useRef } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, Image, message, Row, Upload, Col, Divider } from "antd";
import { Config, isEmptyOrNull } from "../config/helper";
import MainPage from "../component/page/MainPage";
import dayjs from "dayjs";
import { CloseOutlined, DeleteFilled, UploadOutlined, PlusOutlined, CloseSquareFilled } from "@ant-design/icons";
import ReactQuill from 'react-quill';


var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
const getBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


const { TextArea } = Input;
const TrainingPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false); // State for view modal
    const [selectedTraining, setSelectedTraining] = useState(null); // State for selected training details
    const [formCat] = Form.useForm();
 

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [imageDefault, setImageDefault] = useState([]);
    const [imageOptional, setImageOptional] = useState([]);
    const [imageOptional_Old, setImageOptional_Old] = useState([]);

     const [isEditMode, setIsEditMode] = useState(false);
    

    const handlePreview = file =>
        __awaiter(void 0, void 0, void 0, function* () {
            if (!file.url && !file.preview) {
                file.preview = yield getBase64(file.originFileObj);
            }
            setPreviewImage(file.url || file.preview);
            setPreviewOpen(true);
        });
  
    const handleChangeImageDefault = ({ fileList }) => {
        setImageDefault(fileList);
    };

    const handleChangeImageOptional = ({ fileList: newFileList }) => setImageOptional(newFileList);

    useEffect(() => {
        formCat.setFieldsValue({
            Status: "1"
        });
        getList();
    }, []);

    const filterRef = useRef({
        txt_search: null,
        status: null,
        role_id: null
    });

    const fileRef = useRef(null);

    const getList = async () => {
        setLoading(true);
        var param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
            role_id: filterRef.current.role_id,
        };
        const res = await request("training/getList", "get", param);
        setLoading(false);
        if (res) {
            setList(res.list);
        }
    };

    const onClickBtnEdit = async (item) => {
        formCat.setFieldsValue({ ...item });
        setOpen(true);
        // setIsEditMode(true);

        // Set main image
        if (item.image !== "" && item.image !== null) {
            const imageTrain = [
                {
                    uid: "-1",
                    name: item.image,
                    status: "done",
                    url: Config.image_path + item.image,
                }
            ];
            setImageDefault(imageTrain);

        }
        // Fetch optional images
        const res_image = await request("tbtraining_image/" + item.id, "get");
        if (res_image && !res_image.error) {
            if (res_image.list) {
                var imageTrainOptional = [];
                res_image.list.map((item, index) => {
                    imageTrainOptional.push({
                        uid: index,
                        name: item.image,
                        status: "done",
                        url: Config.image_path + item.image,

                    });
                });
                setImageOptional(imageTrainOptional);
                setImageOptional_Old(imageTrainOptional);

            }
        }
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
                var data = {
                    id: item.id
                };
                const res = await request("training/delete", "delete", data);
                if (res) {
                    message.success(res.message);
                    getList();
                }
            }
        });
    };

    const onClickBtnView = async (item) => {
        const res_image = await request("tbtraining_image/" + item.id, "get");

        if (res_image && !res_image.error && res_image.list) {
            const imageTrainOptional = res_image.list.map((imgItem, index) => ({
                uid: index,
                name: imgItem.image,
                status: "done",
                url: Config.image_path + imgItem.image,
            }));
    
            setImageOptional(imageTrainOptional); // ← this line was missing
        } else {
            setImageOptional([]); // Clear if no images found
        }

        setSelectedTraining(item);
        setViewOpen(true);
    };

    const onFinish = async (item) => {
        ///kkkkk
        // console.log("imageTrainOptional",imageOptional_Old);
        // console.log(item);
        var imageOptional = [];
        if (imageOptional_Old.length > 0 && item.image_optional) {
            imageOptional_Old.map((item1, index1) => {
                var isFound = false;
                if (item.image_optional) {
                    // console.log(item.image_optional)
                    item.image_optional.fileList?.map((item2, index2) => {
                        //multi image
                        if (item1.name == item2.name) {
                            isFound = true;

                        }

                    });
                }


                if (isFound == false) {
                    imageOptional.push(item1.name);
                }

            });
        }
        
        var form = new FormData();
        form.append("title", item.title);
        form.append("description", item.description);
        form.append("image", formCat.getFieldValue("image"));

        if (imageOptional && imageOptional.length > 0) {
            // image for remove
            imageOptional.map((item) => {
                form.append("image_optional", item);
            });

        }


        form.append("id", formCat.getFieldValue("id"));
        if (item.image_default) {
            if (item.image_default.file.status === "removed") {
                form.append("image_remove", "1");
            } else {
                form.append(
                    "upload_image",
                    item.image_default.file.originFileObj,
                    item.image_default.file.name
                );
            }
        }

        if (item.image_optional) {
            // console.log(item.image_optional)
            item.image_optional.fileList?.map((items, index) => {
                //multi image
                if (items?.originFileObj) {
                    form.append("upload_image_optional", items.originFileObj, items.name);

                }


            });

        }
        var method = "post";
        if (formCat.getFieldValue("id")) {
            method = "put";
        }
        // const res = await request("")

        //var method = (id == null ? "post" : "put");
        var url = "training/create"
        if (formCat.getFieldValue("id")) {
            url = "training/update"
        }
        //  const url = (id == null ? "training/create" : "training/update");
        // const
        const res = await request(url, method, form);
        if (res) {
            if (res.error) {
                var mgs = "";
                Object.keys(res.message).map((key, index) => {
                    mgs += res.message[key];
                });
                message.error(mgs);
                return false;
            }
            // message.success(res.message);
            message.success("Insert Success");
            getList();
            onCloseModal();
            // window.location.reload();
        }
    };

    const onTextSearch = (value) => { };

    const onChangeSearch = (e) => {
        filterRef.current.txt_search = (e.target.value);
        getList();
    };

    const onCloseModal = () => {

        // formCat.setFieldsValue({
        //     Status: "1"
        // });
        setOpen(false);
        setImageDefault([]);
        setImageOptional([]);
        formCat.resetFields();

        // onRemoveFileSelected();
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


    const openNewModal = () => {
        // formCat.setFieldsValue({
        //     title:"A",
        //     description:"B"
        // })    
     //   setFilePreview(null);
        //setFileSelected(null);
      //  setIsEditMode(false);
        setOpen(true);
        formCat.resetFields();
    };
    return (
        <MainPage loading={loading}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Space>
                    <div className="txt_title">វគ្គបណ្តុះបណ្តាល</div>
                    <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                </Space>

                {/* <Button icon={<PlusOutlined />} type="primary" onClick={() => setOpen(true)}> */}
                <Button icon={<PlusOutlined />} type="primary" onClick={openNewModal}>
                    បន្ថែម
                </Button>
            </div>
            <Divider />
            <Table
                dataSource={list}
                pagination={{
                    pageSize: 5,
                }}
                columns={[
                    {
                        key: "No",
                        title: "ល.រ",
                        dataIndex: "Name",
                        align: 'left',
                        width: 60,
                        render: (value, item, index) => (index + 1)
                    },
                    {
                        key: "title",
                        title: "ចំណង់ជើង",
                        dataIndex: "title",
                        ellipsis: true,
                        width: 120,
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        webkitLineClamp: 3,
                    },
                    {
                        key: "description",
                        title: "មាតិកា",
                        dataIndex: "description",
                        ellipsis: true,
                        width: '20',
                        render: (value) => {
                            if (typeof value === 'string') {
                                return <span dangerouslySetInnerHTML={{ __html: value }} />;
                            }
                        }
                    },
                    {
                        key: "image",
                        title: "រូបភាព",
                        dataIndex: "image",
                        render: (value) => {
                            if (value != null && value != "") {
                                return (
                                    <Image
                                        src={Config.image_path + value}
                                        alt=""
                                        width={60}
                                    />
                                )
                            } else {
                                return (
                                    <div style={{ height: 40, width: 60, backgroundColor: "#888" }} />
                                )
                            }

                        }
                    },
                    {
                        key: "createdAt",
                        title: "ថ្ងៃបង្កើត",
                        dataIndex: "createdAt",
                        render: (value) => formatKhmerDate(value)
                    },
                    {
                        key: "Action",
                        title: "កែប្រែ/លុប",
                        dataIndex: "Status",
                        align: 'right',
                        width: 220,
                        render: (value, item, index) => (
                            <Space>
                                <Button onClick={() => onClickBtnView(item)}>មើល</Button> {/* View button */}
                                <Button onClick={() => onClickBtnEdit(item)}>កែប្រែ</Button>
                                <Button onClick={() => onClickBtnDelete(item)} danger>លុប</Button>
                            </Space>
                        )
                    }
                ]}
            />
            <Modal
                // title={(formCat.getFieldValue("id") == null) ? "វគ្គបណ្តុះបណ្តាល | បន្ថែមថ្មី" : " វគ្គបណ្តុះបណ្តាល | កែប្រែ"}
                title={isEditMode ? "វគ្គបណ្តុះបណ្តាល | បន្ថែមថ្មី" : " វគ្គបណ្តុះបណ្តាល | កែប្រែ"}
                open={open}
                onCancel={onCloseModal}
                footer={null}
                width={"100%"}
                maskClosable={false}
            >
                <Divider />

                <Form
                    form={formCat}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={5}>
                        <Col span={24}>
                            <Form.Item
                                label=" ចំណង់ជើង"
                                name={"title"}
                                rules={[
                                    {
                                        required: true,
                                        message: 'សូមបំពេញចំណង់ជើង!',
                                    },
                                ]}
                            >
                                <Input placeholder="ចំណង់ជើង" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Item name={"image_default"} label="Cover រូបភាព (Upload បានត្រឹមចំនួន ១​សន្លឹក )">
                            <Upload

                                customRequest={(options) => {
                                    options.onSuccess();
                                }}

                                multiple={true}
                                maxCount={1}
                                listType="picture-card"
                                fileList={imageDefault}
                                onPreview={handlePreview}
                                onChange={handleChangeImageDefault}
                            >
                                <div>+ Upload</div>
                            </Upload>
                        </Form.Item>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                label="មាតិកា"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "សូមបំពេញមាតិកា!",
                                    },
                                ]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    style={{ height: 500 }}
                                    onChange={(value) => formCat.setFieldsValue({ description: value })}
                                    value={formCat.getFieldValue("description")}
                                />
                            </Form.Item>

                        </Col>
                    </Row>
                   
                    <Row>
                        <Col span={12}>

                        </Col>
                    </Row>
                   
                    <br></br>

                    <Row>
                        <Form.Item name={"image_optional"} label="រូបភាពច្រើន(Upload បានត្រឹមចំនួន ១៥​​សន្លឹក ប៉ុណ្ណោះ)">
                            <Upload

                                customRequest={(options) => {
                                    options.onSuccess();
                                }}

                                multiple={true}
                                maxCount={15}
                                listType="picture-card"
                                fileList={imageOptional}
                                onPreview={handlePreview}
                                onChange={handleChangeImageOptional}
                            >
                                <div>+ Upload</div>
                            </Upload>

                        </Form.Item>
                    </Row>

                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: visible => setPreviewOpen(visible),
                                afterOpenChange: visible => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                    <Divider></Divider>
                    <Form.Item style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={onCloseModal}>បដិសេធ</Button>
                            <Button type="primary" htmlType="submit">{formCat.getFieldValue("id") == null ? "រក្សាទុក" : "កែប្រែ"}</Button>
                        </Space>
                    </Form.Item>

                </Form>

            </Modal>
            <Modal
                title="វគ្គបណ្តុះបណ្តាល | មើល"
                open={viewOpen}
                onCancel={() => setViewOpen(false)}
                footer={null}
                width={600}
                maskClosable={false}
            >
                {selectedTraining && (
                  <div style={{ padding: '16px', maxWidth: '1000px', margin: '0 auto' }}>
                  <h6 style={{ fontSize: '14px', marginBottom: '12px' }}>
                      ចំណងជើង: {selectedTraining.title}
                  </h6>
              
                  {selectedTraining.image && (
                      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                          <Image
                              src={Config.image_path + selectedTraining.image}
                              alt="រូបភាព"
                            //   style={{
                            //       maxWidth: '100%',
                            //       height: 'auto',
                            //       borderRadius: '10px',
                            //       boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                            //   }}
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '-30px',
                                marginTop: '10px'
                            }}
                          />
                      </div>
                  )}
              
                  <div
                      dangerouslySetInnerHTML={{ __html: selectedTraining.description }}
                      style={{ marginBottom: '16px', fontSize: '16px', lineHeight: '1.6' }}
                  />
              
                  <p style={{ fontStyle: 'italic', color: '#888' }}>
                      ថ្ងៃបង្កើត: {formatKhmerDate(selectedTraining.createdAt)}
                  </p>
              
                  <Divider />
              
                  {imageOptional.length > 0 && (
                      <Image.PreviewGroup>
                          <div
                              style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '12px',
                                  justifyContent: 'flex-start',
                                  marginTop: '10px'
                              }}
                          >
                              {imageOptional.map((file, index) => (
                                  <Image
                                  key={index}
                                  src={file.url}
                                  alt={`រូបភាពទី ${index + 1}`}
                                  width={180}
                                  height={120} // Add a fixed height
                                  style={{
                                      borderRadius: '8px',
                                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                      objectFit: 'cover', // Ensures crop instead of distortion
                                      width: '180px',
                                      height: '120px'
                                  }}
                              />
                              
                              ))}
                          </div>
                      </Image.PreviewGroup>
                  )}
              </div>
              
                )}
            </Modal>
        </MainPage>
    )
}

export default TrainingPage;



