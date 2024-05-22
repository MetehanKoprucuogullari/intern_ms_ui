import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import {sha1} from 'crypto-hash';
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditInfos: React.FC = () => {
  const navigate = useNavigate();

  const [passArae, setPassArea] = useState(false);
  const [editArea, setEditArea] = useState(true);
  const [username, setUsername] = useState(true);
  const [password, setPassword] = useState(true);

  const [newName,setNewName] = useState("")
  const [newPass,setNewPass] = useState("")
  const [pass,setPass] = useState("")
  const [user,setUser] = useState<{id:string,name:string,role:string}>()
  const [messageApi, contextHolder] = message.useMessage();

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

  const userNameValidator = (rule:any, value:string,callBack:()=>void) =>{
    if (value !== "" && value.length < 5) {
      return Promise.reject("Bu kullanıcı adı kullanılamaz");
    } else {
      return Promise.resolve();
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
      name:newName===""?user?.name:newName,
      password:newPass===""?__pass:_pass,
      role:user?.role}),
      {headers:{"Content-type":"Application/json","jwt":jwt}}
    ).then(()=>{
      messageApi.info("Bilgiler Değiştirildi. Tekrar Giriş Yapınız")
      setTimeout(()=>{
        axios.post("../users/logout",
          {headers:{"Content-type":"Application/json","jwt":jwt}}
        ).then(()=>{
          navigate("/")
        }).catch(err=>console.log(err))
      },1500)
    }).catch(err=>console.log(err))
  };

  return (
    <div className="flex">
      {contextHolder}
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
            <p className="mt-1">Kullanıcı Adı</p>
            <EditOutlined
              onClick={() => setUsername(!username)}
              className="text-lg ml-2"
            />
          </div>
          <div hidden={username}>
            <Form
              form={form} 
            >
              <Form.Item
                name="userNameItem"
                rules={[
                  { validator: userNameValidator },
                ]} 
              >
                <Input 
                  name="userNameInput"
                  placeholder={user?.name} 
                  className="mt-3 w-40"
                  onChange={(val)=>{setNewName(val.target.value)}} 
                />
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-center mt-5">
            <p className="mt-1">Parola</p>
            <EditOutlined
              onClick={() => setPassword(!password)}
              className="text-lg ml-2"
            />
          </div>
          <div hidden={password}>
            <Form 
              form={form}
            >
              <Form.Item
                name="newPaswordItem" 
                rules={[
                  { required: true, message: "Lütfen Şifrenizi Giriniz!" },
                  { validator: passwordValidator },
                ]}
              >
                <Input
                  onChange={(val)=> setNewPass(val.target.value)}
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
            </Form>
          </div>
          <div hidden={username && password} className="mt-5">
            <Button onClick={onFinishEdit} type="primary">Onayla</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInfos;
