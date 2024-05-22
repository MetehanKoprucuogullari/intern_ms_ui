import { Link, useNavigate } from "react-router-dom";
import { Menu, Popconfirm, message } from "antd";
import {useEffect, useState} from "react";
import {
  ProjectOutlined,
  AlignLeftOutlined,
  LogoutOutlined,
  EditOutlined
} from "@ant-design/icons";
import axios from "axios";

const HeaderMenu = () => {
  const [user,setUser] = useState<{name:string,field:string}>()
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("users/auth",{headers:{"jwt":jwt}}).then((res)=>setUser(res.data))
    .catch(()=>window.location.href="/")
  },[])

  return (
    <div className="text-center fixed h-full border-r border-[#518fe5] pr-[3px]">
      {contextHolder}
      <div className="mt-[24px] text-[#7faae6] text-lg font-thin">
        {user?.field}
      </div>
      <div className="-mt-2 text-[#7faae6] text-lg font-thin">
        Danışman Paneli
      </div>
      <div className="mt-2 text-[#778ba7] text-base font-thin">{user?.name}</div>
      <Menu
        className="w-48 ml-1 pt-14 text-left"
        theme="dark"
        defaultSelectedKeys={["/interns"]}
        mode="inline"
      >
        <Menu.Item key="/interns" icon={<AlignLeftOutlined />}>
          <Link to={"/interns"}>Stajyer Listesi</Link>
        </Menu.Item>
        <Menu.Item key="/edit" icon={<ProjectOutlined />}>
          <Link to={"/edit"}>Çalışma Planı</Link>
        </Menu.Item>
        <Menu.Item key="infos" icon={<EditOutlined />}>
          <Link to={"/infos"}>Bilgileri Güncelle</Link>
        </Menu.Item>
      </Menu>
      <Popconfirm
        title="Çıkış Yap"
        description="Emin misiniz?"
        onConfirm={()=>{
          localStorage.clear()
          messageApi.info("Hesaptan Çıkış Yapıldı")
          setTimeout(()=>{
            axios.post("users/logout")
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

export default HeaderMenu;
