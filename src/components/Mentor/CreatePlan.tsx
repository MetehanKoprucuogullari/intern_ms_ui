import { Modal, DatePicker, Form, Input, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { RangeValue } from "rc-picker/lib/interface";
import { useEffect, useState } from "react";
import axios from "axios";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface typeProps {
  user:{
    id:string,
    field:string
  }
  isModalOpen: boolean;
  showModal: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  counter: number;
  setTabKey: React.Dispatch<React.SetStateAction<number>>
}

interface typeDetail{
  intern:{
    id:number
  }
  done:boolean
}

interface typePlan {
  title: string;
  description: string;
  days:number
  field:string
}

const CreatePlan: React.FC<typeProps> = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [detail,setDetail] = useState<typeDetail[]>()

  const [newPlan, setNewPlan] = useState<typePlan>({
    title: "",
    description: "",
    days:0,
    field:""
  });

  const fetchDetail =()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("details",{headers:{"jwt":jwt}})
    .then(res=>{setDetail(res.data)}).catch((err)=>{console.log(err)})
    .catch(err=>console.log(err))
  }

  useEffect(()=>{
    fetchDetail()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Plan Eklendi",
    });
  };
  const warning = () => {
    messageApi.open({
      type: "warning",
      content: "hata",
    });
  };

  const creatDetail = (
    item: any,
    newPlan: typePlan,
    startDate: string,
    endDate: string
  ) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.post(
      "details/plan",
      JSON.stringify({
        intern: item.id,
        plan: newPlan.title,
        startDate: startDate,
        endDate: endDate,
        done: false,
        point:0
      }),
      {
        headers: { "Content-Type": "application/json","jwt":jwt },
      }
    ).catch(err=>console.log(err))
  };

  const handleOk = async () => {
    try {
      const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
      const field = props.user.field
      await axios.post("plans", JSON.stringify({...newPlan,field}), {
        headers: { "Content-Type": "application/json","jwt":jwt },
      }).catch(err=>console.log(err));
      const res = await axios.get("interns/plan",{headers:{"jwt":jwt}})
      const times = await axios.get("plans/intern",{headers:{"jwt":jwt}})
      if (res && detail) {
        let startDate = "";
        const filteredPlans = res.data.filter((i:any)=>i.field===field)
        for (const item of filteredPlans) {
          const isDone = await detail.filter(data=>(data.intern.id===item.id && !data.done))
          if(times.data.length===1){
            startDate=dayjs().format("YYYY-MM-DD")
          }else{
            if(isDone.length){
              startDate = ""
            }else{
              startDate = startDate=dayjs().format("YYYY-MM-DD")
            }
          }
          await creatDetail(item, newPlan, startDate, "");
        }
        success();
      }
    } catch (error) {
      console.log(error);
      warning();
    }
    props.setTabKey(Date.now())
    props.setIsModalOpen(false);
  };

  const handleCancel = () => {
    props.setIsModalOpen(false);
  };

  function handleRangePickerChange(
    values: RangeValue<Dayjs>,
    formatString: [string, string]
  ): void {
    const [startDate, endDate] = formatString;
    
    const start = dayjs(startDate)
    const end = dayjs(endDate)
    const days = end.diff(start,'day')
    
    setNewPlan((prevState) => ({
      ...prevState,
      days
    }));
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNewPlan((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={`${props.counter + 1}. haftanın planı:`}
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          className="mt-10 mb-5"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Başlık">
            <Input name="title" onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="İçerik">
            <TextArea
              name="description"
              rows={4}
              onChange={handleInputChange}
            />
          </Form.Item>
          <Form.Item className="flex flex-col">
            <p>Başlangıç - Bitiş:</p>
            <RangePicker
              onChange={handleRangePickerChange}
              className="mt-3 ml-14"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreatePlan;
