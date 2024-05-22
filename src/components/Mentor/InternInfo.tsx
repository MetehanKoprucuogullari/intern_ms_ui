import React, { useEffect, useState } from "react";
import { Button, Descriptions } from "antd";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const userImg: any = require("../../images/user.png");


interface typeDetail{
  id:number
  intern:{
    id:number,
    name:string,
    grade:number,
    school:string,
    department:string,
    field:string,
    completed:number
    mail:string
    startdate:string
    enddate:string
  }
  plan: {
    id: number;
    title: string;
    description: string;
    days: number;
  };
  startDate:string
  endDate:string
  done:boolean
}

interface typeIntern {
  id: number;
  name: string;
  grade: number;
  school: string;
  department: string;
  field: string;
  completed: number;
  image: string;
  resume: string;
  mail:string
  startdate:string
  enddate:string
}

const InternInfo: React.FC<{internId:string,detail:typeDetail[]}> = (props) => {
  const [intern, setIntern] = useState<typeIntern>();
  const [image,setImage] = useState<any>()
  const [completed,setCompleted] = useState(0)

  const fetchIntern = async () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios
      .get("interns/" + props.internId,{headers:{"jwt":jwt}})
      .then((res) => {
        setIntern(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
      const done = props.detail.filter(item=>item.done) 
      const completed = done.length * (100 / props.detail.length)
      setCompleted(
        Number(completed.toFixed(1)) 
      )
  };

  useEffect(() => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    fetchIntern();
    setTimeout(() => {
      if(completed){
        axios.put("interns/"+intern?.id,{...intern,completed:completed},{headers:{"jwt":jwt}}).catch(err=>console.log(err))
      }
    }, 500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props,completed]);

  useEffect(()=>{
    if(intern?.image){
      setImage(intern.image)
    }else{
      setImage(userImg)
    }
  },[intern?.image])

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
    if(intern?.resume){
      let pdfUrl
      const pdfBlob = base64ToBlob(intern?.resume);
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
      <Descriptions className="-mr-24" title="Genel Bilgiler:" layout="vertical">
        <Descriptions.Item label="İsim">{intern?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{intern?.mail}</Descriptions.Item>
        <Descriptions.Item label="Sınıf">{intern?.grade}</Descriptions.Item>
        <Descriptions.Item label="Okul">{intern?.school}</Descriptions.Item>
        <Descriptions.Item label="Bölüm">
          {intern?.department}
        </Descriptions.Item>
        <Descriptions.Item label="Alan">{intern?.field}</Descriptions.Item>
        <Descriptions.Item label="Başlangıç">{intern?.startdate}</Descriptions.Item>
        <Descriptions.Item label="Bitiş">{intern?.enddate}</Descriptions.Item>
        <Descriptions.Item className="flex items-center" label="Çalışmalar Tamamlandı %">
          <CircularProgressbar
            value={(completed)}
            maxValue={100}
            text={`${completed || 0}%`}
            className="text-black h-24"
          />
        </Descriptions.Item>
      </Descriptions>
      <Button hidden={(!intern?.resume)} onClick={showCv}>CV</Button>
    </div>
  );
};

export default InternInfo;
