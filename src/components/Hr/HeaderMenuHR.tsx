import { Link, useNavigate } from "react-router-dom";
import { Menu, Popconfirm, message } from "antd";
import React, {useEffect, useState} from "react";
import {
  UserAddOutlined,
  LogoutOutlined,
  AlignLeftOutlined,
  FormOutlined,
  EditOutlined
} from "@ant-design/icons";
import axios from "axios";

const HeaderMenuHR:React.FC = () => {
  const [user,setUser] = useState<{name:string}>()
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();



  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../users/auth",{headers:{"jwt":jwt}}).then((res)=>setUser(res.data))
    .catch(()=>window.location.href="/")
  },[])

  return (
    <div className="text-center fixed h-full border-r border-[#518fe5] pr-[3px]">
      {contextHolder}
      <div className="mt-[26px] text-[#7faae6] text-lg font-thin">İnsan Kaynakları Paneli</div>
      <div className="mt-2 text-[#778ba7] text-base font-thin">{user?.name}</div>
      <Menu
      className="w-48 ml-1 pt-14 text-left"
      theme="dark"
      defaultSelectedKeys={["/hr/interns"]}
      mode="inline"
    >
      <Menu.Item key="/hr/interns" icon={<AlignLeftOutlined />}>
        <Link to={"/hr/interns"}>Stajyer Listesi</Link>
      </Menu.Item>
      <Menu.Item key="/hr/applications" icon={<FormOutlined />}>
        <Link to={"/hr/applications"}>Başvurular</Link>
      </Menu.Item>
      <Menu.Item key="/hr/user" icon={<UserAddOutlined />}>
        <Link to={"/hr/user"}>Kullanıcı Oluştur</Link>
      </Menu.Item>
      <Menu.Item 
        key="/hr/infos" 
        icon={<EditOutlined />}
      >
        <Link to={"/hr/infos"}>Bilgileri Güncelle</Link>
      </Menu.Item>
    </Menu>
      <Popconfirm
        title="Çıkış Yap"
        description="Emin misiniz?"
        onConfirm={()=>{
          localStorage.clear()
          messageApi.info("Hesaptan Çıkış Yapıldı")
          setTimeout(()=>{
            axios.post("../users/logout")
            .then(()=>{
              navigate("/")
            }).catch(err=>console.log(err))
          },1000)
        }}
        onCancel={() => {}}
        okText="Evet"
        cancelText="İptal"
      >
        <div
          className="
          absolute 
          left-14
          bottom-4 
          text-red-500 
          text-lg flex justify-center gap-[5px] cursor-pointer hover:text-red-400"
        >
          <div className="mb-3 text-base">
            <LogoutOutlined />
          </div>
          <div className="mt-[2px]">Çıkış</div>
        </div>
      </Popconfirm>
    </div>
  );
};

export default HeaderMenuHR;