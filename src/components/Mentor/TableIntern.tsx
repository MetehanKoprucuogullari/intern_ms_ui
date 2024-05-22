/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {  Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from "react-router-dom";
import axios from 'axios';
import { Spin } from 'antd';

interface DataType {
  key:number
  id: number;
  name: string;
  school: string;
  grade: number;
  department: string;
  completed : number; 
  tag: string;
  field:string
}

const columns: ColumnsType<DataType> = [
  {
    title: '',
    dataIndex: 'key',
    key: 'key',
    align : "left",
    width : "50px",
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
    title: 'Tamamlandı %',
    dataIndex: 'completed',
    width : "100px",
    align : "left",
    key: 'completed',
  },
  {
    title: 'Seçenekler',
    key: 'action',
    align : "left",
    width : "100px",
    render: (_, record) => (
      <Space size="large">
        <Link className='text-[#1677ff]' key={record.id} to={`/internDetail?id=${record.id}`}>Görüntüle</Link>
      </Space>
    ),
  },
];

const TableIntern : React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data,setData] = useState<DataType[]>([])
  
  const fetchData = async(field:string)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    let internArr:DataType[] = []
    await axios.get('interns',{headers:{"jwt":jwt}})
    .then(res=>{
      internArr =res.data.filter((i:any)=>i.field===field&&i.isactive)
    }).catch(err=>{
      console.log(err)
    })
    const sortedArr = internArr.sort((a,b)=>a.id-b.id)
    for(let i=0;i<internArr.length;i++){
      sortedArr[i].key = i+1
    }
    setData(internArr)
  }

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("users/auth",{headers:{"jwt":jwt}})
    .then(res=>{
      fetchData(res.data.field)
    }).catch(err=>console.log(err))
  },[])

  useEffect(() => {
    setLoading(false)
  }, [data]);

  return (
    <Spin spinning={loading}>
      <Table pagination={{pageSize:6,}} className="ml-16 mt-28 mb-10" columns={columns} dataSource={data} />
    </Spin>
  )
}

export default TableIntern