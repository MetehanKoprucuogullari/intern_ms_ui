import { Button, Descriptions } from 'antd'
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';

const userImg: any = require("../../images/user.png");

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

const InternInfoHR:React.FC<{intern:typeIntern|undefined}> = (props) => {
  const [image,setImage] = useState<any>()
  const [completed,setCompleted] = useState(0)

  useEffect(()=>{
    if(props.intern?.image){
      setImage(props.intern.image)
    }else{
      setImage(userImg)
    }
    const startDate = props.intern?.startdate
    const endDate = props.intern?.enddate
    const toDay = dayjs(Date.now()).format('YYYY-MM-DD')

    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const now = dayjs(toDay)
    
    const diffInternship = end.diff(start,'day')
    const diffNow = now.diff(start,'day')

    setCompleted(
      100/diffInternship*diffNow
    )

  },[props.intern])

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
      return null; 
    }
  };

  const showCv = () => {
    if(props.intern?.resume){
      let pdfUrl
      const pdfBlob = base64ToBlob(props.intern?.resume);
      if(pdfBlob){
        pdfUrl = URL.createObjectURL(pdfBlob);
      }
      window.open(pdfUrl, "_blank");
    }
    
  };

  return (
    <div className="flex justify-between gap-20 ">
      <img
        src={String(image)}
        className="w-full h-48"
        alt=""
      />
      <Descriptions className='-mr-24' title="Genel Bilgiler:" layout="vertical">
        <Descriptions.Item label="İsim">{props.intern?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{props.intern?.mail}</Descriptions.Item>
        <Descriptions.Item label="Sınıf">{props.intern?.grade}</Descriptions.Item>
        <Descriptions.Item label="Okul">{props.intern?.school}</Descriptions.Item>
        <Descriptions.Item label="Bölüm">
          {props.intern?.department}
        </Descriptions.Item>
        <Descriptions.Item label="Alan">{props.intern?.field}</Descriptions.Item>
        <Descriptions.Item label="Başlangıç Tarihi">{props.intern?.startdate}</Descriptions.Item>
        <Descriptions.Item label="Bitiş Tarihi">{props.intern?.enddate}</Descriptions.Item>
        <Descriptions.Item className="flex items-center" label="Tamamlandı %">
          <CircularProgressbar
            value={(completed)}
            maxValue={100}
            text={`${Math.floor(completed) || 0}%`}
            className="text-black h-24"
          />
        </Descriptions.Item>
      </Descriptions>
      <Button className='mr-20' hidden={(!props.intern?.resume)} onClick={showCv}>CV</Button>
    </div>
  )
}

export default InternInfoHR