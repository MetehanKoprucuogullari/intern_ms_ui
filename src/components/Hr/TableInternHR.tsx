/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {  Button, Popover, Space, Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DownloadOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import axios from 'axios';
import { Spin } from 'antd';

interface DataType {
  key:number
  id: number;
  name: string;
  mail:string;
  confirmed:boolean;
  school: string;
  grade: number;
  department: string;
  field:string
  completed : number;
  resume:string;
  isactive:boolean
}

const TableInternHR : React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data,setData] = useState<DataType[]>([])
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "loading",
      duration:1.5,
      content: "Dosyalar indiriliyor...",
    });
  };

  const warning = () => {
    messageApi.open({
      type: "error",
      content: "Dosya Yüklenmemiş",
    });
  };

  function downloadBase64File(base64Data:string, fileName:string) {
    const link = document.createElement('a');
    link.href = base64Data;
    link.download = fileName;
    link.click();
  }
  
  const download =  (id:number,name:string)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../docs/"+id,{headers:{"jwt":jwt}})
    .then((res)=>{ 
      const accFormBase64 = res.data[0].accForm;
      accFormBase64 && downloadBase64File(accFormBase64, `${name}-kabul_form.pdf`);
      const criFormBase64 = res.data[0].criRecord;
      criFormBase64 && downloadBase64File(criFormBase64, `${name}-adli_sicil.pdf`);
      const educFormBase64 = res.data[0].educDoc;
      educFormBase64 && downloadBase64File(educFormBase64, `${name}-ogrenim_belgesi.pdf`);
      const idFormBase64 = res.data[0].idRegister;
      idFormBase64 && downloadBase64File(idFormBase64, `${name}-nufus_kayit.pdf`);
      success()
    }).catch(()=>{
      warning()
    })
  }
  
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


  const showAccForm = (id:number)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../docs/"+id,{headers:{"jwt":jwt}})
    .then(res=>{
      let pdfUrl
      const pdfBlob = base64ToBlob(res.data[0].accForm);
      if(pdfBlob){
        pdfUrl = URL.createObjectURL(pdfBlob);
      }
      window.open(pdfUrl, "_blank");
    }).catch(()=>message.error("Dosya Yüklenmemiş"))
  }

  const showCriForm = (id:number)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../docs/"+id,{headers:{"jwt":jwt}})
    .then(res=>{
      let pdfUrl
      const pdfBlob = base64ToBlob(res.data[0].criRecord);
      if(pdfBlob){
        pdfUrl = URL.createObjectURL(pdfBlob);
      }
      window.open(pdfUrl, "_blank");
    }).catch(()=>message.error("Dosya Yüklenmemiş"))
  }

  const showEducForm = (id:number)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../docs/"+id,{headers:{"jwt":jwt}})
    .then(res=>{
      let pdfUrl
      const pdfBlob = base64ToBlob(res.data[0].educDoc);
      if(pdfBlob){
        pdfUrl = URL.createObjectURL(pdfBlob);
      }
      window.open(pdfUrl, "_blank");
    }).catch(()=>message.error("Dosya Yüklenmemiş"))
  }

  const showIdForm = (id:number)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../docs/"+id,{headers:{"jwt":jwt}})
    .then(res=>{
      let pdfUrl
      const pdfBlob = base64ToBlob(res.data[0].idRegister);
      if(pdfBlob){
        pdfUrl = URL.createObjectURL(pdfBlob);
      }
      window.open(pdfUrl, "_blank");
    }).catch(()=>message.error("Dosya Yüklenmemiş"))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      align : "left",
      width : "50px",
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'İsim',
      dataIndex: 'name',
      key: 'name',
      align : "left",
      width : "250px",
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      width : "100px",
      align : "left",
      key: 'mail',
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
      title: 'Detaylar',
      key: 'action',
      align : "left",
      width : "100px",
      render: (_, record) => (
        <Space size="large">
          <Link key={record.id} to={`../../hr/internDetail?id=${record.id}`}>
            <Button type='default' className='text-[#1677ff]' >Düzenle</Button>   
          </Link>
        </Space>
      ),
    },
    {
      title: 'Evraklar',
      key: 'action',
      align : "left",
      width : "100px",
      render: (_, record) => (
        <Space size="large">
            <Popover
              placement='bottomLeft'
              trigger="click"
              content={<div className='flex justify-center gap-4'>
                <div>
                  <ul>
                    <li>
                      <Button onClick={()=>showAccForm(record.id)} type='default' className='text-[#1677ff] mb-1 w-40' >
                        Başvuru Formu
                      </Button> 
                    </li>
                    <li>
                      <Button onClick={()=>showCriForm(record.id)} type='default' className='text-[#1677ff] mb-1 w-40' >
                        Adli Sicil Kaydı
                      </Button> 
                    </li>
                    <li>
                      <Button onClick={()=>showEducForm(record.id)} type='default' className='text-[#1677ff] mb-1 w-40' >
                        Öğrenim Belgesi
                      </Button> 
                    </li>
                    <li>
                      <Button onClick={()=>showIdForm(record.id)} type='default' className='text-[#1677ff] w-40' >
                        Nüfus Kayıt Örneği
                      </Button> 
                    </li>
                  </ul>
                </div>
                <div className='rounded-2xl bg-[#1677ff] hover:bg-blue-400
                  cursor-pointer h-8 w-8 pl-[6px] transition-all pt-[0.5%]'
                  onClick={()=>download(record.id,record.name)}
                >
                    <Popover content={<>Hepsini İndir</>}>
                      <DownloadOutlined className='text-xl text-white'/>
                    </Popover>
                </div>
              </div>}
            >
              <Button type='default' className='text-[#1677ff]' >
                Seçenekler
              </Button> 
            </Popover>
        </Space>
      ),
    },
  ];

  const fetchData = async()=>{
    let internArr:DataType[] = []
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios.get('../interns',{headers:{"jwt":jwt}})
    .then(res=>{
      internArr =res.data
    }).catch(err=>{
      console.log(err)
    })
    const sortedArr = internArr.filter(item=>item.isactive).sort((a,b)=>a.id-b.id)
    for(let i=0;i<sortedArr.length;i++){
      sortedArr[i].key = i+1
    }
    setData(sortedArr.filter(item=>item.isactive))
  }
  

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(() => {
    setLoading(false)
    console.log(data)
  }, [data]);

  return (
    <Spin spinning={loading}>
      {contextHolder}
      <Table pagination={{pageSize:6,}} className="ml-16 mt-28 mb-10" columns={columns} dataSource={data} />
    </Spin>
  )
}

export default TableInternHR