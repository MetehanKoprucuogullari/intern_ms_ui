import React from "react";
import { Timeline } from "antd";
import { Popover,Descriptions  } from 'antd';

export interface typeDetail {
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
  point:number
}


const TimeLine: React.FC<{detail:typeDetail[]}> = (
  props
) => {
  const timeLineItems = props.detail.sort((a,b)=>a.plan.id-b.plan.id).map((data,key)=> ({
    children: (
      <div data-testid="detail-list" className="flex justify-start" key={key}>
        <Popover 
          content={
            <>
              <p className={data.startDate==="" ? "" : "hidden"}>Çalışma başlamadı</p>
              <div className={data.startDate==="" ? "hidden" : ""}>
              <Descriptions 
                title={data.done ? "Çalışma tamamlandı" : "Çalışma devam ediyor"}
                className="bg-gray-100 w-52" 
                layout="vertical"
              >
                <Descriptions.Item label="Puanı">{data.point===0 ? "-" : data.point}</Descriptions.Item>
                <br className="w-1"/>
                <Descriptions.Item label="Süre">{data.plan.days+" gün"}</Descriptions.Item>
                <Descriptions.Item label="Başlangıç">{data.startDate||"-"}</Descriptions.Item>
                <br className="w-1"/>
                <Descriptions.Item label="Bitiş">{data.endDate||"-"}</Descriptions.Item>
              </Descriptions>
              </div>
            </>
          } 
          trigger={"hover"}
        >
            <p>{data.plan.title}:</p>
            <p>{data.plan.description}</p>
        </Popover>
      </div>
    ),
    color: (()=>{
      return data.done ? 'green' : data.startDate!=="" ? 'blue' : 'gray'
    })(),
  }));
  return <Timeline items={timeLineItems}/>;
};

export default TimeLine;
