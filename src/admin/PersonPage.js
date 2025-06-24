
import React, { useEffect, useState, useRef, useCallback } from "react";
import { request } from "../config/request";
import { Table, Button, Space, Modal, Input, Form, message, Row, Col, Divider, Select, Card ,Checkbox} from "antd";
import MainPage from "../component/page/MainPage";
import { Config, isEmptyOrNull,getUser } from "../config/helper";
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

const PersonPage = ({initialIdValue=""}) => {
    const [list, setList] = useState([]);
    const [person, setPersonCount] = useState([]);
    const [model_motor, setModel] = useState([]);
    const [province, setProvince] = useState([]);
    const [users, setUsers] = useState([]);

    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);

    
    const [department, setDepartment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [formCat] = Form.useForm();

    const [fileSelected, setFileSelected] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const filterRef = useRef({ txt_search: "" });
    const fileRef = useRef(null);

    const [idType, setIdType] = useState("national"); // default to national

  const handleCheckboxChange = (checkedValues) => {
    const selected = checkedValues.includes("national") ? "national" : "work";
    setIdType(selected);
    formCat.setFieldsValue({ Id_Card: "" }); // Clear input if type changes
  };

    useEffect(() => {
        formCat.setFieldsValue({ status: "1" }); if (initialIdValue.length === 4) {
      setIdType("work");
    } else {
      setIdType("national");
    }
    formCat.setFieldsValue({
      Id_Card: initialIdValue,
      idType: [initialIdValue.length === 4 ? "work" : "national"],
    });
        

    getList();
    getPersonCount();
    
        
    }, [initialIdValue, formCat]);

    // const getList = useCallback(async () => {
    //     setLoading(true);
    //     const param = { txt_search: filterRef.current.txt_search };
    //     try {
    //         const res = await request("person/getList", "get", param);
    //         if (res) 
    //             (res.list);
    //     } catch (error) {
    //         message.error('Failed to fetch the list.');
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);
    
    const user = getUser();

     const getList = async () => {
        setLoading(true);
        const param = {
            txt_search: filterRef.current.txt_search,
            status: filterRef.current.status,
        };
        const res = await request("person/getList", "get", param);
    
        setLoading(false);
        if (res) {
            setList(res.list);
            setModel(res.model_motor);  
            setDepartment(res.department);
            setProvince(res.province);
            setUsers(res.users);
        }
        
    };
    const getPersonCount = async () => {
      setLoading(true);
      try {
        const res = await request("person/count", "get");
        if (res && typeof res.count === "number") {
          setPersonCount(res.count);
        }
      } catch (error) {
        message.error("Failed to fetch the count");
      } finally {
        setLoading(false);
      }
    };

    const onClickBtnView = (item) => {
  setSelectedPerson(item);
  setViewModalOpen(true);
};




   const onClickBtnEdit = (item) => {
  // Detect ID type based on length
  const detectedIdType = item.Id_Card?.length === 4 ? "work" : "national";
  setIdType(detectedIdType);

  // Set all fields in form, including computed `idType`
  formCat.setFieldsValue({
    ...item,
    idType: [detectedIdType], // for Checkbox.Group, use array
    // OR: idType: detectedIdType if using Radio.Group
  });

  setOpen(true); // Open the modal/form
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
                const res = await request("person/delete", "delete", data);
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
    // const onFinish = async (item) => {
    //     const Id = formCat.getFieldValue("Id");
    //     const form = new FormData();
    //     form.append("Id", Id);
    //     form.append("FullName", item.FullName);
    //     form.append("Phone", item.Phone);
    //     form.append("Gender", item.Gender);
    //     form.append("CreateBy", item.CreateBy);
    //     form.append("Motor_Number", item.Motor_Number);
    //     form.append("Id_Card", item.Id_Card);
        
    //     form.append("ModelId", item.ModelId);
    //     form.append("DepartmentId", item.DepartmentId);
    //     // form.append("PreImage", formCat.getFieldValue("file"));

    //     // if (fileSelected) form.append("file", fileSelected);

    //     const method = Id == null ? "post" : "put";
    //     const url = Id == null ? "person/create" : "person/update";

    //     try {
    //         const res = await request(url, method, form);
    //         if (res) {
    //             message.success(res.message);
    //             getList();
    //             onCloseModule();
    //         }
    //     } catch (error) {
    //         message.error('Failed to save the person.');
    //     }
    // };

    
    const onFinish = async (item) => {
        const Id = formCat.getFieldValue("Id");
        const data = {
            Id:Id,
            //UsersId:item.UsersId,
    
    
           
            CreateBy: item.CreateBy, // this must not be undefined
            ProvinceId:item.ProvinceId,
            ModelId: item.ModelId,
            DepartmentId: item.DepartmentId,
            Code_Number:item.Code_Number,
            Color_Motor_Person:item.Color_Motor_Person,
            Brand_Motor:item.Brand_Motor,
            Other:item.Other,
            FullName: item.FullName,
            Id_Card: item.Id_Card,
            Phone: item.Phone,
            Gender: item.Gender,
            CreateBy: user?.lastName,
            Motor_Number: item.Motor_Number,
           
        };
        const method = Id == null ? "post" : "put";
        const url = Id == null ? "person/create" : "person/update";
        const res = await request(url, method, data);
        if (res) {
            message.success(res.message);
            getList();
            onCloseModule();
        }
    };

    const formatPhone = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, ""); // remove non-digit characters
    // Example for Cambodian format: XXX-XXX-XXXX
    // if (cleaned.length === 10) {
    //     return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    // }
     if (cleaned.length === 9) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone; // fallback to original if not 10 digits
};

 const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters

    if (value.length <= 3) {
      value = value;
    } else if (value.length <= 6) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length <= 10) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    

    formCat.setFieldsValue({ Phone: value });
  };

  const handleModelNumberChange = (e) => {
  let input = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Remove special chars

  // Extract prefix (1–3 chars) and 4-digit number
  const prefix = input.slice(0, 3);
  const numberPart = input.slice(3, 7); // Only 4 digits allowed

  let formatted = prefix;
  if (numberPart.length > 0) {
    formatted += `-${numberPart}`;
  }

  formCat.setFieldsValue({ Motor_Number: formatted });
};




    return (

        <div>
            <MainPage loading={loading}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10 }}>
                    <Space>
                        <div className="txt_title" style={{ fontSize: 16 }}> ទិន្នន័យម៉ូតូរបស់បុគ្គលិក</div>
                        <Input.Search allowClear onChange={onChangeSearch} placeholder="ស្វែងរក" onSearch={onTextSearch} />
                    </Space>
                    <Button onClick={() => setOpen(true)} type="primary"><PlusOutlined />បន្ថែមថ្មី</Button>
                </div>
                <hr />
               
                     <Table
                    dataSource={list}
                    pagination={{ pageSize: 50 }}
                    scroll={{ y: 400 }} // ← This makes the table scroll vertically
                    columns={[
                      //  { key: "No", title: "ល.រ", render: (_, __, index) => index + 1 },
                        { key: "Code_Number", title: "លេខកូដ", dataIndex: "Code_Number" },
                        { key: "FullName", title: "ឈ្មោះពេញ", dataIndex: "FullName" },
                        { key: "Phone",
                          title: "លេខទូរស័ព្ទ", 
                          dataIndex: "Phone" ,
                          render: (Phone) => formatPhone(Phone)
                        
                        
                        },
                       // { key: "Gender", title: "ភេទ", dataIndex: "Gender" },
                        { key: "Motor_Number", 
                            title: "ផ្លាកលេខម៉ូតូ", 
                            dataIndex: "Motor_Number"
                        
                        },

                         { key: "Motor_Number", 
                            title: "ចំនួនស្នើសុំ", 
                            dataIndex: ""
                        
                        },
                     

                        
                      
                        // { 
                        //     key: "ModelId", 
                        //     title: "ខេត្ត ឬក្រុង ឬកម្ពុជា", 
                        //     dataIndex: "ModelId" ,
                        //     render: (ModelId) => model_motor.find(r => r.Id === ModelId)?.Name_Province || 'Unknown',
                        
                        // },
                        //    { key: "DepartmentId", title: "ការិយាល័យ /ផ្នែក/ឯកជន", 
                        //     dataIndex: "DepartmentId" ,
                        //     render: (DepartmentId) => department.find(r => r.Id === DepartmentId)?.Name_Dept || 'Unknown',
                        // },
                        // { 
                        //    key: "DepartmentId", 
                        //    title: "ចំនួនស្នើសុំ",
                        //    dataIndex: "DepartmentId" ,
                           
                        //    render: (DepartmentId) => department.find(r => r.Id === DepartmentId)?.Name_Type || 'Unknown',
                        
                        
                        // },
                        
                        //{ key: "CreateBy", title: "បង្កើតដោយ", dataIndex: "CreateBy" },

                       {
  key: "Action",
  title: "ប្រតិបត្តិការណ៍",
  render: (_, item) => (
    <Space size={4}>
      <Button
        size="small"
        icon={<EyeOutlined />}
        onClick={() => onClickBtnView(item)}
      >
        មើល
      </Button>
      <Button
        size="small"
        icon={<FormOutlined />}
        onClick={() => onClickBtnEdit(item)}
      >
        កែប្រែ
      </Button>
      <Button
        size="small"
        icon={<DeleteOutlined />}
        danger
        onClick={() => onClickBtnDelete(item)}
      />
    </Space>
  )
}

                    ]}
                />

            
               

                <Modal
                    title={formCat.getFieldValue("Id") == null ? "ការចុះឈ្មោះអ្នកប្រើប្រាស់បណ្ណម៉ូតូ" : "កែប្រែម៉ូតូ"}
                    open={open}
                    onCancel={onCloseModule}
                    footer={null}
                    width="50%"
                    maskClosable={false}
                >
                    <Form form={formCat} layout="vertical" onFinish={onFinish}>
                        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                            <Card title="ទិន្នន័យបុគ្គលិក និងឯកជន" ariant="borderless" >
                                <Row gutter={16}>

                                    
                                    <Col xs={24} sm={12} md={10}>
                                        <Form.Item
                                            label="ឈ្មោះពេញខ្មែរ"
                                            name="FullName"
                                            rules={[{ required: true, message: "សូមបំពេញឈ្មោះពេញ!" }]}
                                        >
                                            <Input placeholder="ឈ្មោះពេញខ្មែរ" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={4}>
                                        <Form.Item
                                            label="ភេទ"
                                            name="Gender"
                                            rules={[{ required: true, message: "សូមបំពេញភេទ!" }]}
                                        >
                                            <Select placeholder="ភេទ">
                                                <Select.Option value="ស្រី">ស្រី</Select.Option>
                                                <Select.Option value="ប្រុស">ប្រុស</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={10}>
                                     <Form.Item
                                          label="លេខទូរស័ព្ទ"
                                          name="Phone"
                                          rules={[
                                            { required: true, message: "សូមបំពេញលេខទូរស័ព្ទ!" },
                                            {
                                              pattern: /^\d{3}-\d{3}-\d{3,4}$/,
                                              message: "លេខទូរស័ព្ទត្រូវមានទ្រង់ទ្រាយ 012-123-232 ឬ 012-232-2131",
                                            },
                                          ]}
                                        >
                                          <Input
                                            maxLength={12}
                                            placeholder="012-123-232 or 012-232-2131"
                                            onChange={handlePhoneChange}
                                          />
                                        </Form.Item>

                                        {/* <Form.Item
                                            label="លេខទូរស័ព្ទ"
                                            name="Phone"
                                            mask="Phone"
                                            rules={[{ required: true, message: "សូមបំពេញលេខទូរស័ព្ទ!" }]}
                                        >
                                            <Input 
                                          
                                            
                                            placeholder="លេខទូរស័ព្ទ" 
                                            
                                            />
                                        </Form.Item> */}
                                    </Col>
                                     <Col xs={24} sm={24} md={24}>
                                       <Form.Item name="idType" label="ប្រភេទអត្តសញ្ញាណប័ណ្ណ">
  <Checkbox.Group
    value={[idType]} // make it behave like single-select
    onChange={(checkedValues) => {
      const selected = checkedValues[checkedValues.length - 1]; // last clicked
      setIdType(selected);
      formCat.setFieldsValue({ idType: [selected] });
    }}
  >
    <Checkbox value="national">អត្តសញ្ញាណជាតិ</Checkbox>
    <Checkbox value="work">អត្តលេខការងារ</Checkbox>
  </Checkbox.Group>
</Form.Item>


      <Form.Item
        label="អត្តសញ្ញាណប័ណ្ណ ឬអត្តលេខការងារ"
        name="Id_Card"
        rules={[
          { required: true, message: "សូមបំពេញអត្តសញ្ញាណប័ណ្ណ!" },
          {
            pattern: idType === "national" ? /^\d{9}$/ : /^\d{4}$/,
            message:
              idType === "national"
                ? "អត្តសញ្ញាណជាតិត្រូវមាន 9 ខ្ទង់លេខ!"
                : "អត្តលេខការងារត្រូវមាន 4 ខ្ទង់លេខ!",
          },
        ]}
      >
        <Input
          maxLength={idType === "national" ? 9 : 4}
          placeholder={
            idType === "national" ? "អត្តសញ្ញាណជាតិ" : "អត្តលេខការងារ"
          }
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            formCat.setFieldsValue({ Id_Card: onlyDigits });
          }}
        />
      </Form.Item>
                                     

                                    </Col>
                                    <Col xs={24} sm={24} md={24}>


                                       <Form.Item
                                label="ការិយាល័យ /ផ្នែក/ឯកជន"
                                name="DepartmentId"
                                rules={[{ required: true, message: "សូមបំពេញការិយាល័យ /ផ្នែក/ឯកជន" }]}
                            >
                                <Select placeholder="Please select ការិយាល័យ /ផ្នែក/ឯកជន">
                                    {department.map((item) => (
                                        <Select.Option key={item.Id} value={item.Id}>{item.Name_Dept}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                                 



                                    </Col>
                                    <Col xs={24} sm={24} md={24}>

                                     

                              <Form.Item
                                label="អ្នកស្នើសុំ/បុគ្គលិក"
                                name="DepartmentId"
                                rules={[{ required: true, message: "សូមបំពេញការអ្នកស្នើសុំ/បុគ្គលិក!" }]}
                            >
                                <Select 
                                placeholder="Please select អ្នកស្នើសុំ/បុគ្គលិក"
                                disabled
                                >
                                    {department.map((item) => (
                                        <Select.Option key={item.Id} value={item.Id}>{item.Name_Type}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                                    </Col>
                                  



                                </Row>

                            </Card>
                            <Space width={10} />
                            <Card title="ព័ត៌មានម៉ូតូ" ariant="borderless" >

                                <Row gutter={16}>
                                    <Col xs={24} sm={14} md={8}

                                    >


                                        <Form.Item
                                            label="លេខបណ្ណ"
                                            name="Code_Number"
                                          rules={[{ required: true, message: "សូមបំពេញលេខបណ្ណ!" }]}
                                        >
                                            <Input placeholder="លេខបណ្ណ" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={14} md={16}

                                    >
                                        <Form.Item
  label="លេខម៉ូតូ"
  name="Motor_Number"
  rules={[{ required: true, message: "សូមបំពេញលេខម៉ូតូ!" }]}
>
  <Input
    placeholder="e.g. 1BN-2134"
    maxLength={8}
    onChange={handleModelNumberChange}
  />
</Form.Item>


                               
                                    </Col>
                                    <Col xs={24} sm={12} md={14}>
                                       


                            <Form.Item
                                 label="ខេត្ត ឬក្រុង ឬកម្ពុជា"
                                name="ProvinceId"
                                rules={[{ required: true, message: "ខេត្ត ឬក្រុង ឬកម្ពុជា" }]}
                            >
                                <Select placeholder="Please select ខេត្ត ឬក្រុង ឬកម្ពុជា">
                                    {province.map((item) => (
                                        <Select.Option key={item.Id} value={item.Id}>{item.Name_Province}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>





                                    </Col>

                                    <Col xs={24} sm={12} md={10}>
                                      


                                        
                                          <Form.Item
                                 label="ពណ៌"
                                name="Color_Motor_Person"
                                rules={[{ required: true, message: "ពណ៌" }]}
                            >
                                   <Input placeholder="ពណ៌" />
                             
                            </Form.Item>
                                    </Col>

                                     <Col xs={24} sm={24} md={24}>
                                        <Form.Item
                                 label="ម៉ាកយានជំនិះ"
                                name="ModelId"
                                rules={[{ required: true, message: "ម៉ាកយានជំនិះ" }]}
                            >
                                 

                                  <Select placeholder="Please select ម៉ាកយានជំនិះ">
                                    {model_motor.map((item) => (
                                        <Select.Option key={item.Id} value={item.Id}>{item.Name_Motor}</Select.Option>
                                    ))}
                                </Select>
                               
                            </Form.Item>



                                    </Col>
                                </Row>

                                 <Form.Item
                                label="ផ្សេងៗ"
                                name="Other"

                            >
                                <TextArea placeholder="ផ្សេងៗ" rows={4} />
                            </Form.Item>


                            </Card>

                            <Form.Item label="បង្កើតដោយ">
                              <Input value={user?.lastName || "User"} disabled />
                            </Form.Item>
                                                      
                            


                           

                        </Space>





                        <Form.Item style={{ textAlign: "right" }}>
                            <Space>
                                <Button onClick={onCloseModule}><CloseCircleOutlined />បដិសេធ</Button>
                                <Button type="primary" htmlType="submit"><SaveOutlined />រក្សាទុក</Button>
                            </Space>
                        </Form.Item>
                    </Form>


                </Modal>
                <Modal
  open={viewModalOpen}
  onCancel={() => setViewModalOpen(false)}
  footer={null}
  title="ព័ត៌មានលម្អិត"
  width={700}
  centered
>
  {selectedPerson && (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      <Card title="ព័ត៌មានបុគ្គលិក" bordered>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p><strong>ឈ្មោះពេញ:</strong> {selectedPerson.FullName}</p>
          </Col>
          <Col span={12}>
            <p><strong>ភេទ:</strong> {selectedPerson.Gender}</p>
          </Col>
          <Col span={12}>
            <p><strong>លេខទូរស័ព្ទ:</strong> {formatPhone(selectedPerson.Phone)}</p>
          </Col>
          <Col span={12}>
          <p>
  <strong>
    {selectedPerson.Id_Card?.length === 4
      ? "អត្តលេខការងារ"
      : "អត្តសញ្ញាណប័ណ្ណ"}
    :
  </strong>{" "}
  {selectedPerson.Id_Card}
</p>

          </Col>
          <Col span={12}>
            <p><strong>ការិយាល័យ/ផ្នែក/ឯកជន:</strong> {department.find(r => r.Id === selectedPerson.DepartmentId)?.Name_Dept}</p>
          </Col>
          <Col span={12}>
            <p><strong>បង្កើតដោយ:</strong> {selectedPerson.CreateBy}</p>
          </Col>
          <Col span={12}>    
            <p>
            <strong>ថ្ងៃខែឆ្នាំបង្កើត:</strong>{' '}
            {selectedPerson.CreateAt ? dayjs(selectedPerson.CreateAt).format('YYYY-MM-DD') : 'N/A'}
          </p>
          </Col>
        </Row>
      </Card>

      <Card title="ព័ត៌មានម៉ូតូ" bordered>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <p><strong>លេខបណ្ណ:</strong> {selectedPerson.Code_Number}</p>
          </Col>
          <Col span={12}>
            <p><strong>លេខម៉ូតូ:</strong> {selectedPerson.Motor_Number}</p>
          </Col>
          <Col span={12}>
            <p><strong>ពណ៌:</strong> {selectedPerson.Color_Motor_Person}</p>
          </Col>
          <Col span={12}>
            <p><strong>ម៉ាកយានជំនិះ:</strong> {model_motor.find(r => r.Id === selectedPerson.ModelId)?.Name_Motor}</p>
          </Col>
          <Col span={12}>
            <p><strong>ខេត្ត:</strong> {province.find(r => r.Id === selectedPerson.ProvinceId)?.Name_Province}</p>
          </Col>
          <Col span={24}>
            <p><strong>ផ្សេងៗ:</strong> {selectedPerson.Other}</p>
          </Col>
        </Row>
      </Card>

    </div>
  )}
                </Modal>





            </MainPage>
            <h4>
                ចំនួនសរុបៈ {person}
            </h4>
            <Divider />

        </div>

    );
};

export default PersonPage;