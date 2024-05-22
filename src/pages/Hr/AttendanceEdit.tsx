import React, { useEffect, useState } from "react";
import {
  Button,
  Calendar,
  Card,
  Col,
  Input,
  Popover,
  Row,
  Spin,
  message,
} from "antd";
import { CheckSquareOutlined, CloseSquareOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InternInfoHR from "../../components/Hr/InternInfoHR";

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

const AttendanceEdit: React.FC = () => {
  const [intern, setIntern] = useState<typeIntern>();
  const [attendances, setAttendances] = useState<typeAttendances[]>();
  const [date, setDate] = useState(() => dayjs(Date.now()));
  const [key,setKey] = useState(Date.now())
  const [loading, setLoading] = useState(false);
  const [newNote,setNewNote] = useState("")
  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const internId = searchParams.get("id");

  const success = (msg:string) => {
    let result = ""
    if(msg==="delete") result = "İşaret Kaldırıldı"
    if(msg==="here") result = "Katıldı olarak işaretlendi"
    if(msg==="notHere") result = "Katılmadı olarak işaretlendi"
    if(msg==="putNote") result = "Not Girildi"
    messageApi.open({
      type: 'success',
      content: result,
    });
  };
  const warning = (err:any) => {
    messageApi.open({
      type: 'warning',
      content: err,
    });
  };

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
  };

  const fetchDetail = async () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios
      .get("../interns/" + internId,{headers:{"jwt":jwt}})
      .then((res) => {
        setIntern(res.data);
      })
      .catch((err) => console.log('detail'+err));
  };

  const fetchAttendance = () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../attendances/intern/" + internId,{headers:{"jwt":jwt}})
      .then((res) => {
        setAttendances(res.data);
      }).then(()=>{
        setKey(Date.now())
      }).catch((err) => console.log('attendance'+err)
      ).finally(()=>setLoading(false))
  };

  useEffect(() => {
    fetchDetail();
    fetchAttendance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  

  const internIsHere= async(date:string) =>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await setLoading(true)
    await axios.post("../attendances", JSON.stringify({internid:internId,date:date,value:true}), {
      headers: { "Content-Type": "application/json","jwt":jwt},
    }).then(()=>{
      success("here")
      fetchAttendance()
    }).catch(err=>{
      setTimeout(()=>warning(err),1000)
    })

    
  }

  const internNotIsHere= (date:string) =>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true)
    axios.post("../attendances", JSON.stringify({internid:internId,date:date,value:false}), {
      headers: { "Content-Type": "application/json","jwt":jwt},
    }).then(()=>{
      setTimeout(()=>success("notHere"),1000)
      fetchAttendance()
    }).catch(err=>{
      setTimeout(()=>warning(err),1000)
    })
  }

  const { TextArea } = Input;

  const deleteRecord = (date:string)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true)
    axios.delete('../attendances/'+internId+"/"+date,{headers:{"jwt":jwt}})
    .then((res)=>{
      if(res.data[1]) setTimeout(()=>success("delete"),1000)
      fetchAttendance()
    }).catch(err=>{
      setTimeout(()=>warning(err),1000)
    })
  }

  const putNote = (date:string)=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true)
    axios.put('../attendances/note',
    JSON.stringify({internid:internId,date:date,note:newNote}), {
      headers: { "Content-Type": "application/json","jwt":jwt },
    }).then(()=>{
      setTimeout(()=>success("putNote"),1000)
      fetchAttendance()
      setNewNote("")
    }).catch(err=>{
      setTimeout(()=>warning(err),1000)
    })
  }

  const cellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    if (dateStr === date.format("YYYY-MM-DD")) {
      return (
        <Spin spinning={loading}>
          <div className="flex justify-center gap-1">
            <Popover content={<>Katıldı olarak işaretle</>}>
              <CheckSquareOutlined
                className="text-2xl text-green-700 hover:text-green-400"
                onClick={()=>internIsHere(dateStr)}
              />
            </Popover>
            <Popover content={<>Katılmadı olarak işaretle</>}>
            <Popover content={<>Not Ekle</>}>
              <Popover
                trigger="click"
                content={
                  <div className="flex flex-col">
                    <TextArea
                      className="w-64" 
                      placeholder="Notu giriniz..."
                      rows={5}
                      onChange={(v)=>setNewNote(v.target.value)}
                    />
                    <Button 
                      className="mt-1" 
                      type="primary"
                      onClick={()=>{
                        internNotIsHere(dateStr)
                        putNote(dateStr)
                      }}
                    >
                        {">"}
                    </Button>
                  </div>
                }
              >
                <CloseSquareOutlined 
                  className="text-2xl text-yellow-700 hover:text-yellow-400"
                />
              </Popover>
            </Popover>
            </Popover>
            <Popover content={<>İşareti Kaldır</>}>
              <DeleteOutlined 
                className="text-2xl text-red-700 hover:text-red-400"
                onClick={()=>deleteRecord(dateStr)}
              />
            </Popover>
          </div>
        </Spin>
      );
    }
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
                <Popover content={<div className="w-52">{"Katılmadı ("+ (attendances[i].note||"Bilgi Yok")+")"}</div>}>
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
      {contextHolder}
      <p className="mb-5 pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
        Stajyer Bilgileri
      </p>
      <div className="mb-24 pt-32 pl-20">
        <InternInfoHR intern={intern} />
      </div>
      <p className="pl-20 text-xl mb-10 text-[#001529]">
        Devamsızlık Bilgileri:
      </p>
      <div key={key} className="px-20 pb-32 text-center">
        <div className="mb-10">
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
          <p className="text-xl mb-10 text-[#001529]">Yoklama Girişi:</p>
        </div>
        <div className="mt-5">
          <Calendar
            value={date}
            cellRender={cellRender}
            onSelect={onSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceEdit;
