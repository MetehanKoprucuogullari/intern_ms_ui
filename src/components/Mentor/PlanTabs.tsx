import { Popconfirm, Tabs, message } from "antd";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Spin, Descriptions } from "antd";

export interface typePlan {
  id: number;
  title: string;
  description: string;
  days: number;
}

interface typeProps {
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  setTabKey: React.Dispatch<React.SetStateAction<number>>
}

const PlanTabs: React.FC<typeProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [plans, SetPlans] = useState<typePlan[]>([]);
  const [deletedId,setDeletedId] = useState<number>()
  const [messageApi, contextHolder] = message.useMessage();

  const successDelete = () => {
    messageApi.open({
      type: "info",
      content: "Plan Silindi",
    });
  };

  const warningDelete = () => {
    messageApi.open({
      type: "warning",
      content: "hata",
    });
  };

  const fetchData = async (field:string) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios
      .get("plans",{headers:{"jwt":jwt}})
      .then((res) => {
        const plans:any[] = res.data.filter((i:any)=>i.field===field)
        const sortedPlans = plans.sort((a,b)=>a.id-b.id)
        SetPlans(sortedPlans);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    props.setCounter(plans.length);
    axios.get("users/auth",{headers:{"jwt":jwt}})
    .then(res=>{
      fetchData(res.data.field);
    }).catch(err=>console.log(err))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const deletePlan = ()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.delete("plans/"+String(deletedId),{headers:{"jwt":jwt}})
    .then(()=>{
      successDelete()
      setTimeout(() => {
        props.setCounter(plans.length);
        props.setTabKey(Date.now())
      },500);
    }).catch(()=>{
      warningDelete()
    })
  }

  return (
    <div className="w-full ml-16 mt-11">
      {contextHolder}
      <Spin spinning={loading} className="">
        <Tabs
          className="mt-5 w-full"
          defaultActiveKey="1"
          tabPosition="top"
          style={{ height: 500, width: 800 }}
        >
          {plans.map((plan, i) => {
            const id = String(i + 1);
            return (
              <Tabs.TabPane tab={`Hafta-${id}`} key={id} disabled={i === 28}>
                <div className="lg:ml-10 w-full lg:flex ">
                <Popconfirm
                  title="Plan Silinecek"
                  description="Emin misiniz?"
                  onConfirm={deletePlan}
                  onCancel={() => {}}
                  okText="Evet"
                  cancelText="İptal"
                >
                  <div className="-ml-8 rounded-full h-11 w-11">
                    <div
                      className="text-lg rounded-full h-11 -mt-2 w-11 cursor-pointer text-red-700 hover:text-red-500"
                      onClick={()=>{setDeletedId(plan.id)}}
                    >
                      <DeleteOutlined />
                    </div>
                  </div>
                  </Popconfirm>
                  <Descriptions className="pr-[40%]" layout="vertical">
                    <Descriptions.Item data-testid="plan-title" label={`${id}. Hafta Konu`}>
                      {plan.title}
                    </Descriptions.Item>
                    <br className="w-7" />
                    <Descriptions.Item label={`İçerik`}>
                      {plan.description}
                    </Descriptions.Item>
                    <Descriptions.Item label={`Süre`}>
                      {plan.days + " gün"}
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </Spin>
    </div>
  );
};

export default PlanTabs;
