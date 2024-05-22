import { Link, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Menu, Popconfirm, message } from "antd";
import {
  ProjectOutlined,
  CalendarOutlined,
  LogoutOutlined,
  EditOutlined,
  FileOutlined
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
      <div className="mt-[26px] text-[#7faae6] text-lg font-thin">
        Stajyer Paneli
      </div>
      <div className="mt-2 text-[#778ba7] text-base font-thin">{user?.name}</div>
      <Menu
        className="w-48 ml-1 pt-14 text-left"
        theme="dark"
        defaultSelectedKeys={["/intern/works"]}
        mode="inline"
      >
        <Menu.Item key="/intern/works" icon={<ProjectOutlined />}>
          <Link to={"/intern/works"}>Çalışmalar</Link>
        </Menu.Item>
        <Menu.Item key="/intern/attendance" icon={<CalendarOutlined />}>
          <Link to={"/intern/attendance"}>Devamsızlık Durumu</Link>
        </Menu.Item>
        <Menu.Item key="/intern/docs" icon={<FileOutlined />}>
          <Link to={"/intern/docs"}>Evrakları Düzenle</Link>
        </Menu.Item>
        <Menu.Item key="infos" icon={<EditOutlined />}>
          <Link to={"/intern/infos"}>Bilgileri Güncelle</Link>
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
