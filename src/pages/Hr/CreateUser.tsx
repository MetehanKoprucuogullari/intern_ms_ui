import React, { useEffect, useState } from "react";
import Register from "../../components/User/Register";
import { Button, Input, List, Segmented, message } from "antd";
import {DeleteOutlined} from "@ant-design/icons"
import axios from "axios";

const CreateUser = () => {
  const [key,setKey] = useState(Date.now())
  const [keyField,setKeyField] = useState(Date.now())
  const [hidden, setHidden] = useState(true)
  const [field,setField] = useState("")
  const [fields,setFields] = useState<{id:string,name:string}[]>([{id:"0",name:""}])
  

  const jwt:string | number | boolean = localStorage.getItem("jwt") || ""

  const createField = () =>{
    setField("")
    const _field = { name: field }; 
    axios.post("../users/field",_field,{headers:{"jwt":jwt}})
    .then(()=>{
      setKeyField(Date.now())
      message.success("Oluşturuldu")
    })
    .catch(err=>message.error("Sunucu Hatası"))
  }

  const deleteField = (id:string) =>{
    axios.delete("../users/field/"+id,{headers:{"jwt":jwt}})
    .then(()=>{
      setKeyField(Date.now())
      message.info("silindi")
    })
    .catch(err=>message.error("Sunucu Hatası"))
    
  }

  useEffect(()=>{
    axios.get("../users/field",{headers:{"jwt":jwt}})
    .then(res=>setFields(res.data))
    .catch(err=>console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[keyField])
  
  return (
    <div className="flex">
      <div className="intern-table mr-20 w-full">
        <p className="text-white pl-16 text-xl fixed z-5 w-full pt-6 pb-6 border-b bg-[#001529]">
          {!hidden ? "Ekip Oluştur" : "Kullanıcı Oluştur"}
        </p>
        <div className="mt-44 text-center">
          <Segmented
            size="large"
            className="bg-[#001529] text-gray-300 w-auto"
            options={[
              "Kullanıcı Oluştur",
              "Ekip Oluştur",
            ]}
            onChange={()=>setHidden(!hidden)}
          />
        </div>
        <div hidden={!hidden}>
          <Register key={key} setKey={setKey}/>
        </div>
        <div hidden={hidden} className="text-center mt-10">
          <Input
            value={field} 
            onChange={(val)=>setField(val.target.value)}
            placeholder="Yeni Ekip İsmi" 
            className="w-[200px]" 
          />
          <Button onClick={createField} type="primary">Ekle</Button>
          <div key={keyField} className="flex justify-center mt-5">
            <List className="text-center w-[200px]">
              <List.Item className="text-base font-bold">Ekipler:</List.Item>
              {
                fields.map((item,index)=>(
                  <div className="flex justify-between">
                    <List.Item key={index}>{item.name}</List.Item>
                    <div className="mt-3 cursor-pointer text-red-600 hover:text-red-400">
                      <DeleteOutlined onClick={()=>deleteField(item.id)}/>
                    </div>
                  </div>
                ))
              }
            </List>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
