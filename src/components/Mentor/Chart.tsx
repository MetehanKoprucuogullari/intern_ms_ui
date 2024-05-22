import React from 'react';
import { Column } from '@ant-design/charts';

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
  point:number
}


export const Chart: React.FC<{detail:typeDetail[]}> = (props) => {
  
  let data =[]

  for(let i = 0;i<props.detail.length;i++){
    if(props.detail[i].done){
      data.push({title:props.detail[i].plan.title,value:(props.detail[i].point)})
    }
  }

  const config = {
    data,
    xField: 'title',
    yField: 'value',
    columnWidthRatio:0.3,
    label: {
      offset:10
    },
    state: {
      active: {
        style: {
          shadowBlur: 2,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
  };

  return <Column {...config} />;
};

