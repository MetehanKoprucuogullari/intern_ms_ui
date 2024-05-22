/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Checkbox, Divider, InputNumber, Button, message } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import { CheckboxChangeEvent } from "antd/es/checkbox";
import axios from 'axios'

interface typePlan {
  id: number;
  title: string;
  description: string;
  days: number;
};
interface typeIntern {
  id: number;
  name: string;
  grade: number;
  school: string;
  department: string;
  field: string;
  completed: number;
}
interface typeDetail {
  id: number;
  intern: typeIntern;
  plan: typePlan;
  startDate: string;
  endDate: string;
  done: boolean;
  point:number
}

interface typePoint{
  id:number
  value:number|null
}

const EditPlanModal: React.FC<{
  detail: typeDetail[];
  internId: string;
  changes : boolean[]
}> = (props) => {
  const [point,setPoint] = useState<typePoint>()
  const [messageApi, contextHolder] = message.useMessage();
  
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Puan girildi",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "hata",
    });
  };

  const onChange = (event:CheckboxChangeEvent) => {
    const a= event.target.name
    props.changes[Number(a)] = event.target.checked  
  };


  return (
    <div className="mt-5">
      {contextHolder}
      {props.detail
        .sort((a, b) => a.plan.id - b.plan.id)
        .map((detail, key) => (
          <div key={key}>
            <div className="flex justify-start gap-10">
              <Checkbox
                name={`${key}`}
                key={key}
                children={detail.plan.title}
                className="flex mb-5 bottom-1"
                defaultChecked={detail.done}
                onChange={onChange}
              />
              <div className={"flex justify-start "+(!detail.done ? "hidden" : "")} >
                <InputNumber 
                  className="-mt-2 mb-2"
                  min={1} 
                  max={100} 
                  defaultValue={detail.point}
                  onChange={(value)=>{
                    setPoint({id:detail.id,value:value})
                  }}
                />
                <Button 
                  className="-mt-2 h-full pb-3" 
                  type="primary"
                  onClick={()=>{
                    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
                    if(point){
                      if(point.id===detail.id){
                        axios.put('details/'+point.id,{...detail,point:point.value},{headers:{"jwt":jwt}})
                        .then(()=>{success()})
                        .catch(()=>{warning()})
                      }
                    }
                  }}
                >
                  <ArrowRightOutlined/>
                </Button>
              </div>
            </div>
            <Divider />
          </div>
        ))}
    </div>
  );
};

export default EditPlanModal;
