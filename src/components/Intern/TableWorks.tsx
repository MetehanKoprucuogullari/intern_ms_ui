import { Popover, Table } from 'antd'
import axios from 'axios';
import React, { useState,useEffect } from 'react'


interface typeDetail {
  id: number;
  intern: {
    id: number;
    name: string;
    grade: number;
    school: string;
    department: string;
    field: string;
    completed: number;
  };
  plan: {
    id: number;
    title: string;
    description: string;
    days: number;
  };
  startDate: string;
  endDate: string;
  done: boolean;
  point: number;
}

const TableWorks:React.FC<{internId:string}> = (props) => {
  const [data,setData] = useState<typeDetail[]>([])

  const columns = [
    {
      title: "",
      dataIndex:"key",
      key:"key"
    },
    {
      title: 'Çalışma',
      dataIndex: 'title',
      key: 'title',
      render: (_:string, record:any, index:number) =>(
        <Popover
          trigger="click"
          content={
            <div className='w-52 h-auto bg-gray-200 text-center pt-2'>
              <div className='text-base font-bold'>İçerik</div>
              <div className='text-start p-3 pb-3'>
                <div>
                  {data[index].plan.description}
                </div>
              </div>
            </div>
          }
        >
          <div 
            className='cursor-pointer hover:text-blue-600'
          >
            {_}
          </div>
        </Popover>
      ),
    },
    {
      title: 'Süre',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: 'Başlangıç',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Bitiş',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Puan',
      dataIndex: 'point',
      key: 'point',
    },
];

  const fetchDetail = async () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    if(props.internId){
    await axios
    .get("../details/" + props.internId,{headers:{"jwt":jwt}})
    .then((res) => {
      setData(res.data);
    })
    .catch(err=>console.log(err))
  }
  };
  
  useEffect(()=>{
    fetchDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const updatedDataSource = data.sort((a,b)=>a.id-b.id).map((item,index) => {
      return{
      key: (index+1).toString(), 
      title: item.plan.title,
      days: item.plan.days + " gün", 
      startDate: item.startDate || "Henüz Başlamadı",
      endDate: item.endDate === "" && item.startDate !== "" ? "Devam ediyor":item.endDate,
      point: item.endDate === "" ? "-":item.point,
      }
  });

  return (
    <div>
        <Table pagination={{pageSize:8,}} dataSource={updatedDataSource} columns={columns} />
    </div>
  )
}

export default TableWorks