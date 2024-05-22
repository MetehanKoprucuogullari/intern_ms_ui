import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import {sha1} from 'crypto-hash';
import axios from "axios";
import EditIntern from "../../components/Intern/EditIntern";

interface typeIntern {
  id: number;
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

const EditInternInfos: React.FC = () => {
  const [passArae, setPassArea] = useState(false);
  const [editArea, setEditArea] = useState(true);
  const [password, setPassword] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPass,setNewPass] = useState("")
  const [intern,setIntern] = useState<typeIntern>()
  const [user,setUser] = useState<{id:string,name:string,role:string}>()
  const [pass,setPass] = useState("")
  const [messageApi, contextHolder] = message.useMessage();
  const [key,setKey] = useState(Date.now())

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../users/auth",{headers:{"jwt":jwt}})
    .then(res => setUser(res.data))
    .catch(err=>console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const passwordValidator = (_: any, value: string) => {
    if (value !== "" && value.length < 5) {
      return Promise.reject("Şifre en az 5 karakter olabilir");
    } else {
      return Promise.resolve();
    }
  };

  const handlePasswordConfirm = (rule:any, value:string,callBack:()=>void) =>{
    const {getFieldValue} = form;

    if(value && value===getFieldValue("newPaswordItem")){
      callBack()
    }else{
      return Promise.reject("Parolalar eşleşmiyor")
    }

  }

  const [form] = Form.useForm()

  const onFinishPassword = async() => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    const password = await sha1(pass)
    axios.post("../users/login",JSON.stringify({...user,password:password}),
      {headers:{"Content-type":"Application/json","jwt":jwt},
        withCredentials: true
      }
    ).then(()=>{
      messageApi.success("Doğrulandı")
      setEditArea(false)
      setPassArea(true)
    }).catch(()=>{
      message.warning("Parola Hatalı")
    })
  };

  const onFinishEdit = async() => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    const _pass = await sha1(newPass)
    const __pass = await sha1(pass)
    axios.put('../users/'+user?.id,JSON.stringify({
      ...user,
      password:newPass===""?__pass:_pass}),
      {headers:{"Content-type":"Application/json","jwt":jwt}}
    ).then(()=>{
      messageApi.info("Bilgiler Değiştirildi. Tekrar Giriş Yapınız")
      setTimeout(()=>{
        axios.post("../users/logout",
          {headers:{"Content-type":"Application/json","jwt":jwt}}
        ).then(()=>{
          window.location.href = "/"
        })
      },1500)
    }).catch(err=>console.log(err))
    setKey(Date.now())
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex"> 
      {contextHolder}
      <EditIntern
        setIntern={setIntern}
        intern={intern}
        isModalOpen={isModalOpen}
        showModal={showModal}
        setIsModalOpen={setIsModalOpen}
      />
      <div className="mr-20 w-full">
        <p className="text-white pl-16 text-xl fixed z-5 w-full pt-6 pb-6 border-b bg-[#001529]">
          Bilgileri Düzenle
        </p>
        <div hidden={passArae} className="mt-52 mx-16 text-center">
          <div>Parolanızı Giriniz</div>
          <Form onFinish={onFinishPassword}>
            <Form.Item
              name="passwordItem"
              rules={[
                { required: true, message: "Lütfen Şifrenizi Giriniz!" },
                { validator: passwordValidator },
              ]}
            >
              <Input 
                onChange={(val)=>{setPass(val.target.value)}} 
                name="password" 
                type="password" 
                className="mt-3 w-40" 
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Onayla
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div hidden={editArea} className="mt-52 mx-16 text-center">
          <div className="flex justify-center">
            <p className="mt-1">Stajyer bilgileri</p>
            <EditOutlined
              onClick={showModal}
              className="text-lg ml-2"
            />
          </div>
          <div className="flex justify-center mt-5">
            <p className="mt-1">Parola</p>
            <EditOutlined
              onClick={() => setPassword(!password)}
              className="text-lg ml-2"
            />
          </div>
          <div key={key} hidden={password}>
            <Form 
              form={form}
              onFinish={onFinishEdit}
            >
              <Form.Item
                name="newPaswordItem" 
                rules={[
                  { required: true, message: "Lütfen Şifrenizi Giriniz!" },
                  { validator: passwordValidator },
                ]}
              >
                <Input
                  onChange={(val)=>setNewPass(val.target.value)}
                  placeholder="Yeni parola" 
                  name="newPasword" 
                  type="password" 
                  className="mt-3 w-40" />
              </Form.Item>
              <Form.Item
               className="-mt-6"
               name="formPasswordConfirm"
               rules={[
                 {required: true, message: "Lütfen Şifrenizi Giriniz!" },
                 {validator: handlePasswordConfirm}
               ]}
              >
                <Input
                  type="password"
                  placeholder="Parola Tekrar"
                  className="mt-3 w-40"
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary">
                  Onayla
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInternInfos;
