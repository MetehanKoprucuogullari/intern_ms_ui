import { Modal, Form, DatePicker, Input, message, Upload, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { RangeValue } from "rc-picker/lib/interface";
import axios from "axios";
import { PlusOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker;

interface typeProps {
  isModalOpen: boolean;
  showModal: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface typeIntern {
  name: string;
  mail:string
  grade: number;
  school: string;
  department: string;
  field: string;
  completed: number;
  image: string
  resume: string
  startdate:string
  enddate:string
}

const CreateIntern: React.FC<typeProps> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [key,setKey] = useState(Date.now)
  const [fields,setFields] = useState<{value:string,label:string}[]>()
  const [newIntern, setNewIntern] = useState<typeIntern>({
    name: "",
    mail:"",
    grade: 0,
    school: "",
    department: "",
    field: "",
    completed: 0,
    image: "",
    resume: "",
    startdate:"",
    enddate:""
  });

  const jwt:string | number | boolean = localStorage.getItem("jwt") || ""

  
  useEffect(()=>{
    let fieldOptions:{value:string,label:string}[] = []
    axios.get("../users/field",{headers:{"jwt":jwt}})
    .then(res=>{
      for(let i = 0; i<res.data.length; i++){
        fieldOptions[i] = {value:res.data[i].name,label:res.data[i].name}
      }
      setFields(fieldOptions)
    })
    .catch(err=>console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Başvuru Gönderildi.",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "Bu mail adresi kullanılıyor.",
    });
  };

  /*const creatDetail = (
    item: any,
    newIntern: typeIntern,
    startDate: string,
    endDate: string
  ) => {
    axios.post(
      "../details/intern",
      JSON.stringify({
        intern: newIntern.name,
        plan: item.id,
        startDate: startDate,
        endDate: endDate,
        done: false,
        point:0
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    ).catch(err=>console.log(err));
  };*/

  const handleOk = async () => {
    try {
      await axios.post("../interns", JSON.stringify({...newIntern,confirmed:null}), {
        headers: { "Content-Type": "application/json","jwt":jwt },
      }).then(()=>{
        success()
      }).catch(err=>console.log(err))
      
      /*const res = await axios.get("../plans/intern");
      if (res) {
        let count = 1;
        let startDate = dayjs().format("YYYY-MM-DD");
        const filteredPlans = res.data.filter((i:any)=>i.field===newIntern.field)
        for (const item of filteredPlans) {
          if (count>1) {
            startDate = "";;
          } 
          await creatDetail(item, newIntern, startDate, "");
          count++;
        }
      }*/
    } catch (err) {
      console.log(err);
      warning();
    }
    props.setIsModalOpen(false);
    setKey(Date.now())
    setNewIntern({
      name: "",
      mail:"",
      grade: 0,
      school: "",
      department: "",
      field: "",
      completed: 0,
      image:"",
      resume:"",
      startdate:"",
      enddate:""
    });
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
    setKey(Date.now())
    setNewIntern({
      name: "",
      mail:"",
      grade: 0,
      school: "",
      department: "",
      field: "",
      completed: 0,
      image:"",
      resume:"",
      startdate:"",
      enddate:""
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewIntern((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleRangePickerChange(
    values: RangeValue<Dayjs>,
    formatString: [string, string]
  ): void {
    const [start, end] = formatString;
    
    const startdate = dayjs(start).format('YYYY-MM-DD')
    const enddate = dayjs(end).format('YYYY-MM-DD')
    
    setNewIntern((prevState) => ({
      ...prevState,
      startdate,enddate
    }));
  }

  const handleFileChange = async(name: string, file: any) => {
    if(file){
      const reader = new FileReader()
      await reader.readAsDataURL(file)
      reader.onload =() =>{
        const base64 = reader.result?.toString()
        setNewIntern((prevState) => ({
          ...prevState,
          [name]: base64, 
        }));
      }
    }
  };
  const beforeUpload = (file: File) => {
    return false;
  };

  const handleSelectChange =(value:number|string)=>{
    if(typeof value === 'number'){
      setNewIntern((prevState)=>({...prevState,grade:value}))
    }else{
      setNewIntern((prevState)=>({...prevState,field:value}))
    }
  }

  return (
    <>
      {contextHolder}
      <Modal
        className="-mt-20"
        title="Başvuru Bilgileri:"
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Gönder"
        cancelText="İptal"
      >
        <Form
          key={key}
          className="mt-10 mb-5"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="İsim">
            <Input
              type="text"
              name="name"
              value={newIntern.name}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Mail Adresi">
            <Input
              type="text"
              name="mail"
              value={newIntern.mail}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item name="grade" label="Sınıf">
            <Select
              placeholder="Seçiniz..."
              options={[
                {value:1,label:"1.sınıf"},
                {value:2,label:"2.sınıf"},
                {value:3,label:"3.sınıf"},
                {value:4,label:"4.sınıf"},
              ]}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item label="Okul">
            <Input
              type="text"
              name="school"
              value={newIntern.school}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Bölüm">
            <Input
              type="text"
              name="department"
              value={newIntern.department}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item label="Alan">
            <Select
              placeholder="Seçiniz..."
              options={fields}
              onChange={handleSelectChange}
            />
          </Form.Item>
          <Form.Item className="flex flex-col">
            <p>Başlangıç - Bitiş:</p>
            <RangePicker
              onChange={handleRangePickerChange}
              className="mt-3 ml-14"
            />
          </Form.Item>
          <Form.Item label="Resim Ekle" valuePropName="image">
          <Upload beforeUpload={beforeUpload} onChange={(info) => handleFileChange("image", info.file)} action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
          <Form.Item label="Cv Ekle" valuePropName="resume">
          <Upload beforeUpload={beforeUpload} onChange={(info) => handleFileChange("resume", info.file)} action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateIntern;
