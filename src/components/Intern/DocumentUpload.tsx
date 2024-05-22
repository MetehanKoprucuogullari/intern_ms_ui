import { Form, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";

interface typeDocs{
    internid: number
    accForm:string
    criRecord:string
    educDoc:string
    idRegister:string
}

const DocumentUpload: React.FC<{
  docOpen: boolean;
  setDocOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uname:string
  setKey:React.Dispatch<React.SetStateAction<number>>
}> = (props) => {
  const [docs,setDocs] = useState<typeDocs>({internid:0,accForm:"",criRecord:"",educDoc:"",idRegister:""})
  const [key,setKey] = useState(Date.now())
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Dosyalar eklendi",
    });
  };

  const warning = () => {
    messageApi.open({
      type: "error",
      content: "Sunucu hatası",
    });
  };

  const beforeUpload = (file: File) => {
    return false;
  };


  const handleFileChange = async(name: string, file: any) => {
    if(file){
      const reader = new FileReader()
      await reader.readAsDataURL(file)
      reader.onload =() =>{
        const base64 = reader.result?.toString()
        setDocs((prevState) => ({
          ...prevState,
          [name]: base64,
           
        }));
      }
    }
  };
  
  const handleCancel = () =>{
    props.setDocOpen(false)
    setDocs({internid:0,accForm:"",criRecord:"",educDoc:"",idRegister:""})
    setKey(Date.now())
  }

  const handleOk = ()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../interns/mail/"+props.uname,{headers:{"jwt":jwt}})
    .then(res=>{
      const internId = res.data[0].id
      axios.get("../docs/"+internId,{headers:{"jwt":jwt}})
      .then((res)=>{
        console.log(res.data)
        const accForm = docs.accForm || res.data[0].accForm
        const criRecord = docs.criRecord || res.data[0].criRecord
        const educDoc = docs.educDoc || res.data[0].educDoc
        const idRegister = docs.idRegister || res.data[0].idRegister

        axios.post("../docs",
        JSON.stringify(
          {internid:internId,accForm:accForm,criRecord:criRecord,educDoc:educDoc,idRegister:idRegister}
        ),
        { headers: { "Content-Type": "application/json","jwt":jwt},}
        ).then(async()=>{
          await success()
          await props.setKey(Date.now())
        }).catch(err=>console.log(err))
      }).catch(()=>{
        const accForm = docs.accForm || ""
        const criRecord = docs.criRecord || ""
        const educDoc = docs.educDoc || ""
        const idRegister = docs.idRegister || ""
        axios.post("../docs",
        JSON.stringify(
          {internid:internId,accForm:accForm,criRecord:criRecord,educDoc:educDoc,idRegister:idRegister}
        ),
        { headers: { "Content-Type": "application/json","jwt":jwt},}
        ).then(async()=>{
          await success()
          await props.setKey(Date.now())
        }).catch(err=>console.log(err))
      })
    }).catch(()=>{
      warning()
    })
    props.setDocOpen(false)
    setDocs({internid:0,accForm:"",criRecord:"",educDoc:"",idRegister:""})
    setKey(Date.now())
  }

  return (
    <div>
      {contextHolder}
      <Modal
        className="-mt-16"
        open={props.docOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="mb-10 text-base">
          Aşağıdaki belgeleri yüklemeniz gerekmektedir. {"(Dosyalar PDF formatında olmalı)"}
        </div>
        <Form key={key}>
          <Form.Item label="Kabul Formu" valuePropName="accForm">
            <Upload
              className="ml-12"
              onChange={(info) => handleFileChange("accForm", info.file)}
              beforeUpload={beforeUpload}
              action="/upload.do"
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="Adli Sicil Kaydı" valuePropName="criRecord">
            <Upload
              className="ml-9"
              onChange={(info) => handleFileChange("criRecord", info.file)}
              beforeUpload={beforeUpload}
              action="/upload.do"
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="Öğrenim Belgesi" valuePropName="educDoc">
            <Upload
              className="ml-6"
              onChange={(info) => handleFileChange("educDoc", info.file)}
              beforeUpload={beforeUpload}
              action="/upload.do"
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="Nüfus Kayıt Örneği" valuePropName="idRegister">
            <Upload
              className="ml-[10px]"
              onChange={(info) => handleFileChange("idRegister", info.file)}
              beforeUpload={beforeUpload}
              action="/upload.do"
              listType="picture-card"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentUpload;