/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {  Button,Popconfirm, Popover, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from "dayjs";
import {sha1} from 'crypto-hash';
import { CheckCircleOutlined, CloseCircleOutlined, FilterOutlined,DeleteOutlined } from '@ant-design/icons'
import axios from 'axios';
import { Spin } from 'antd';

interface DataType {
  key:number
  id: number;
  name: string;
  mail:string
  confirmed:boolean|null;
  school: string;
  grade: number;
  department: string;
  field:string
  completed : number; 
  tag: string;
  resume:string
  isactive:boolean|null
}

const TableApplications : React.FC<{setHeader:React.Dispatch<React.SetStateAction<string>>}> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data,setData] = useState<DataType[]>([])
  const [filter,setFilter] = useState<boolean|null>(null)
  const [key,setKey] = useState(Date.now())
  const [index,setIndex] = useState({first:0,second:1})
  const [messageApi, contextHolder] = message.useMessage();

  const success = (type:string,msg:string) => {
    messageApi.open({
      type: type==="s" ? "success" : type==="w" ? "warning" : "info",
      content: msg,
    });
  };

  const warning = (msg:string) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const dynamicColumns:ColumnsType<DataType> =[
    {
      title: 'Kabul',
      key: 'action',
      align : "left",
      width : "100px",
      render: (_, record) => (
        <Space size="large" className='text-center cursor-pointer'>
          <Popconfirm
            title="Başvuru Kabul"
            description="Onaylıyor musunuz?"
            onConfirm={()=>Confirm(record)}
            onCancel={() => {}}
            okText="Evet"
            cancelText="İptal"
          >
            <CheckCircleOutlined className='pl-[10px] mb-1 text-2xl text-green-700 hover:text-green-400 duration-300'/>
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Ret',
      key: 'action',
      align : "left",
      width : "100px",
      render: (_, record) => (
        <Space size="large" className='text-center cursor-pointer'>
          <Popconfirm
            title="Başvuru İptal"
            description="Onaylıyor musunuz?"
            onConfirm={()=>Deny(record)}
            onCancel={() => {}}
            okText="Evet"
            cancelText="İptal"
          >
            <CloseCircleOutlined className='pl-[10px] mb-1 text-2xl text-red-700 hover:text-red-400 duration-300'/>
          </Popconfirm>
        </Space>
      ),
    },
    {},
    {
      title: 'Sil',
      key: 'action',
      align : "left",
      width : "100px",
      render: (_, record) => (
        <Space size="large" className='text-center cursor-pointer'>
          <Popconfirm
            title="Stajyer silinecek"
            description="Onaylıyor musunuz?"
            onConfirm={()=>Delete(record)}
            onCancel={() => {}}
            okText="Evet"
            cancelText="İptal"
          >
            <DeleteOutlined className='pl-[10px] mb-1 text-2xl text-red-700 hover:text-red-400 duration-300'/>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <Popover
          placement="bottomLeft"
          content={
            <>
              <ol className='text-sm'>
                <li>
                  <Button
                    onClick={()=>{
                      fetchData()
                      setKey(Date.now())
                      setFilter(null)
                      props.setHeader("Güncel Başvurular")
                      setIndex({first:0,second:1})
                    }} 
                    type='default' 
                    className='w-full mb-1'
                  >
                    Güncel Başvurular
                  </Button>
                </li>
                <li>
                  <Button 
                    onClick={()=>{
                      fetchData()
                      setKey(Date.now())
                      setFilter(true)
                      props.setHeader("Onaylanan Başvurular")
                      setIndex({first:3,second:2})
                    }} 
                    type='default' 
                    className='w-full mb-1'
                  >
                    Onaylanan Başvurular
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={()=>{
                      fetchData()
                      setKey(Date.now())
                      setFilter(false)
                      props.setHeader("Reddedilen Başvurular")
                      setIndex({first:0,second:3})
                    }} 
                    type='default' 
                    className='w-full'
                  >
                    Reddedilen Başvurular
                  </Button>
                </li>
              </ol>
            </>
          }
          trigger={"click"}
        >
          <FilterOutlined 
          className='pl-3 mb-2 text-gray-400 hover:text-gray-200'
          />
        </Popover>
      ),
      dataIndex: 'key',
      key: 'key',
      align : "left",
      width : "50px",
      render: (text, record, index) => index + 1
    },
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
      align : "left",
      width : "250px",
    },
    {
      title: 'Mail Adresi',
      dataIndex: 'mail',
      key: 'mail',
      align : "left",
      width : "250px",
    },
    {
      title: 'Sınıf',
      dataIndex: 'grade',
      width : "100px",
      align : "left",
      key: 'grade',
    },
    {
      title: 'Okul',
      dataIndex: 'school',
      align : "left",
      width : "200px",
      key: 'school',
    },
    {
      title: 'Bölüm',
      dataIndex: 'department',
      align : "left",
      width : "200px",
      key: 'department',
    },
    {
      title: 'Alan',
      key: 'field',
      align : "left",
      width : "200px",
      dataIndex: 'field',
    },
    {
      title: 'Cv',
      dataIndex: 'resume',
      width : "100px",
      align : "left",
      key: 'resume',
      render: (_, record) => (
        <Space size="large">
          <Button type='default' className='text-[#1677ff]' onClick={()=>{showCv(record.resume)}}>
            Görüntüle
          </Button>
        </Space>
      ),
    },
    dynamicColumns[index.first],
    dynamicColumns[index.second]
  ];
  const base64ToBlob = (base64: string) => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    try {
      return new Blob([byteArray], { type: "application/pdf" });
    } catch (error) {
      console.error("Blob conversion error:", error);
      return null; // Blob dönüşümünde hata oluşursa null döndürme
    }
  };
  
  const showCv = (resume:string|undefined) => {
    if(resume){
      if(resume){
        let pdfUrl
        const pdfBlob = base64ToBlob(resume);
        if(pdfBlob){
          pdfUrl = URL.createObjectURL(pdfBlob);
        }
        window.open(pdfUrl, "_blank");
      }
    }else{
      warning("Dosya Bulunamadı.")
    }
    
  };
  
  const creatDetail = (
    item: any,
    newIntern: DataType,
    startDate: string,
    endDate: string
  ) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
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
        headers: { "Content-Type": "application/json","jwt":jwt },
      }
    ).catch(err=>console.log(err));
  };

  const Confirm = async(record:DataType)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    let pass = "";
    for(let i=0;i<8;i++){
      var index = Math.floor(Math.random() * chars.length);
      pass += chars[index];
    }
    const subject = "Staj İçin Yaptığınız Başvuru Onaylandı"
    const object = "Sisteme ilk giriş için şifreniz: "+pass
    pass = await sha1(pass)
    axios.post(`../interns/sendmail`,{to:record.mail,subject:subject,object:object},{headers:{"jwt":jwt}}).catch(err=>console.log(err))
    axios.post('../users',JSON.stringify({name:record.mail,password:pass,role:"intern",field:"",},),
      {headers:{"Content-type":"Application/json","jwt":jwt}}
    ).catch(err=>console.log(err))
    axios.put(`../interns/${record.id}`, JSON.stringify({...record,confirmed:true,isactive:true}), {
      headers: { "Content-Type": "application/json","jwt":jwt },
    }).then(()=>{
      success("s","Başvuru Onaylandı.")
      fetchData()
    })
    .catch(err=>{
      warning("Sunucu hatası")
    })

    const res = await axios.get("../plans",{headers:{"jwt":jwt}});
      if (res.data) {
        let count = 1;
        let startDate = dayjs().format("YYYY-MM-DD");
        const filteredPlans = res.data.filter((i:any)=>i.field===record.field)
        for (const item of filteredPlans) {
          if (count>1) {
            startDate = "";;
          } 
          await creatDetail(item, record, startDate, "");
          count++;
        }
      }else{
        console.log("Sunucu Hatası")
      }
    axios.put("../interns/active/"+record.id,{headers:{"jwt":jwt}}).catch(err=>console.log(err))
  }
  
  const Deny = (record:DataType)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.put(`../interns/${record.id}`, JSON.stringify({...record,confirmed:false,isactive:false}), {
      headers: { "Content-Type": "application/json","jwt":jwt },
    }).then(()=>{
      success("d","Başvuru Reddedildi.")
      fetchData()
    })
    .catch(err=>{
      warning("Sunucu hatası")
    })
  }

  const Delete = (record:DataType)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.delete("../details/" + record.id,{headers:{"jwt":jwt}}).then(() => {
      success("w","Silindi")
      fetchData()
    }).catch(()=>{warning("Sunucu hatası")})
    axios.delete("../users/"+record.mail,{headers:{"jwt":jwt}}).catch(err=>console.log(err))
    axios.delete("../attendances/"+record.id,{headers:{"jwt":jwt}}).catch(err=>console.log(err))
    axios.delete("../docs/"+record.id,{headers:{"jwt":jwt}}).catch(err=>console.log(err))
  }
  const fetchData = async()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios.get('../interns',{headers:{"jwt":jwt}})
    .then(res=>{
      setData(res.data)
      setTimeout(()=>setKey(Date.now()),10)
    }).catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(() => {
    setLoading(false)
  }, [data]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Table 
        key={key} 
        pagination={{pageSize:6}} 
        className="ml-16 mt-28 mb-10" 
        columns={columns} 
        dataSource={data.filter(item=>item.confirmed===filter)} />
    </Spin>
  )
}

export default TableApplications
