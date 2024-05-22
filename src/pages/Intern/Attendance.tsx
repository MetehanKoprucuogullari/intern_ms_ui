import React, { useEffect, useState } from "react";
import { Calendar, Card, Col, Popover, Row } from "antd";
import axios from "axios";
import InternInfoHR from "../../components/Hr/InternInfoHR";
import { CheckSquareOutlined, CloseSquareOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

interface typeIntern {
  id: number;
  name: string;
  mail:string
  grade: number;
  school: string;
  department: string;
  field: string;
  completed: number;
  image: string;
  resume: string;
  startdate:string;
  enddate:string;
}
interface typeAttendances {
  id: number;
  internId: number;
  date: string;
  value: boolean;
  note:string|null
}

const Attendance = () => {
  const [intern, setIntern] = useState<typeIntern>();
  const [attendances, setAttendances] = useState<typeAttendances[]>();
  const [date, setDate] = useState(() => dayjs(Date.now()));
  const [mail,setMail] = useState<{mail:string}>()


  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
    console.log(newValue.format("YYYY-MM-DD"));
  };

  const fetchDetail = () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
      axios.get("../interns/mail/"+mail,{headers:{"jwt":jwt}})
      .then(intern=>{
        axios
        .get("../interns/" + intern.data[0].id,{headers:{"jwt":jwt}})  
        .then((res) => {
          setIntern(res.data);
        })
        .catch(err => console.log(err));
      }).catch(err=>console.log(err))
    
  };

  const fetchAttendance = () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
      axios.get("../interns/mail/"+mail,{headers:{"jwt":jwt}})
      .then(intern=>{
        axios
        .get("../attendances/intern/" + intern.data[0].id,{headers:{"jwt":jwt}})  
        .then((res) => {
          setAttendances(res.data);
        })
        .catch(err => console.log(err));
      }).catch(err=>console.log(err))
   
  };

  useEffect(()=>{
    if(mail){
      fetchDetail()
      fetchAttendance()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[mail])

  useEffect(() => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../users/auth",{headers:{"jwt":jwt}})
    .then((res)=>{
      setMail(res.data.name)
    }).catch(err=>console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    if (attendances) {
      for (let i = 0; i < attendances?.length; i++) {
        if (attendances[i].date === dateStr) {
          if (attendances[i].value) {
            return (
              <div className="text-end">
                <Popover content={<>Katıldı</>}>
                  <CheckSquareOutlined className="text-2xl text-green-700" />
                </Popover>
              </div>
            );
          } else {
            return (
              <div className="text-end">
                <Popover content={<div className="w-52">{"Not: "+ (attendances[i].note||"Eklenmemiş.")}</div>}>
                  <CloseSquareOutlined className="text-2xl text-red-700" />
                </Popover>
              </div>
            );
          }
        }
      }
    }
  };


  return (
    <div>
      <p className="mb-5 pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
        Devamsızlık Durumu
      </p>
      <div className="mb-24 pt-32 pl-20">
        <InternInfoHR intern={intern}/>
      </div>
      <p className="pl-20 text-xl mb-10 text-[#001529]">Devamsızlık Bilgileri:</p>
      <div className="px-20 pb-32 text-center">
        <div>
        <Row gutter={16}>
            <Col span={8}>
              <Card title="Stajda geçen gün" bordered={false}>
                {attendances?.length}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Katıldığı Günler" bordered={false}>
                {attendances?.filter((item) => item.value)?.length}
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Katılmadığı Günler" bordered={false}>
                {attendances?.filter((item) => !item.value)?.length}
              </Card>
            </Col>
          </Row>
        </div>
        <div className="text-start mt-20">
          <p className="text-xl mb-10 text-[#001529]">Takvim:</p>
        </div>
        <div className="mt-5">
          <Calendar
            value={date}
            cellRender={cellRender}
            onSelect={onSelect}
            className="p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
