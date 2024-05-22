import { Avatar, Input, List, Modal, Select, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";

interface typeIntern {
  id:number
  name: string;
  mail: string;
  grade: number;
  school: string;
  department: string;
  field: string;
  completed: number;
  image: string;
  resume: string;
  startdate: string;
  enddate: string;
}

interface typeProps {
  isModalOpen: boolean;
  showModal: () => void;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  intern: typeIntern | undefined;
  setIntern:React.Dispatch<React.SetStateAction<typeIntern | undefined>>
}

const EditIntern: React.FC<typeProps> = (props) => {
  const [visible,setVisible] = useState<
    {name:boolean,school:boolean,department:boolean,grade:boolean}
  >({name:true,school:true,department:true,grade:true})
  const [intern,setIntern] = useState<{id:string,name:string,school:string,department:string,grade:number}>()
  const [edited,SetEdited] = useState<{name:string,school:string,department:string,grade:number}>(
    {name:"",school:"",department:"",grade:0}
  )
  const [key,setKey] = useState(Date.now())

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../users/auth",{headers:{"jwt":jwt}}).then(res=>{
      axios.get("../interns/mail/"+res.data.name,{headers:{"jwt":jwt}})
      .then(intern=>{
        axios.get("../interns/"+intern.data[0].id,{headers:{"jwt":jwt}}).then(res=>{
          setIntern(res.data)
          SetEdited(res.data)
        }).catch(err=>console.log(err))
      }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
  },[])

  const handleOk = async () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setKey(Date.now())
    await axios.put(`../interns/${intern?.id}`, JSON.stringify(
      {...intern,...edited}
    ), {
      headers: { "Content-Type": "application/json","jwt":jwt},
    }).then(()=>{
      message.success("Bilgiler Değiştirildi")
    }).catch(err=>console.log(err))
    props.setIsModalOpen(false);
  };

  const handleCancel = () => {
    setVisible({name:true,school:true,department:true,grade:true})
    setKey(Date.now())
    props.setIsModalOpen(false);
  };

  return (
    <>
      <Modal
        key={key}
        className="-mt-5"
        title="Bilgileri Güncelle:"
        open={props.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Gönder"
        cancelText="İptal"
      >
        <div className="pt-5">
          <List
            itemLayout="horizontal"
          >
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    className="w-3 h-3 mr-5"
                  />
                }
                title={`İsim: ${intern?.name}`}
                description={props.intern?.name}
              />
              <div className="mr-32" hidden={visible.name}>
                <Input
                  name="name"
                  onChange={(value)=>SetEdited({...edited,name:value.target.value})} 
                  placeholder="Yeni İsim"
                />
              </div>
              <div>
                <EditOutlined
                  onClick={()=>{setVisible({...visible,name:!visible.name})}}
                  className="text-lg"
                />
              </div>
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    className="w-3 h-3 mr-5"
                  />
                }
                title={`Okul: ${intern?.school}`}
                description={props.intern?.school}
              />
              <div className="mr-32" hidden={visible.school}>
                <Input
                  name="school"
                  onChange={(value)=>SetEdited({...edited,school:value.target.value})}  
                  placeholder="Yeni Okul"/>
              </div>
              <div>
                <EditOutlined
                  onClick={()=>{setVisible({...visible,school:!visible.school})}}
                  className="text-lg"
                />
              </div>
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    className="w-3 h-3 mr-5"
                  />
                }
                title={`Bölüm: ${intern?.department}`}
                description={props.intern?.department}
              />
              <div className="mr-32" hidden={visible.department}>
                <Input
                  name="department"
                  onChange={(value)=>SetEdited({...edited,department:value.target.value})}  
                  placeholder="Yeni Bölüm"/>
              </div>
              <div>
                <EditOutlined
                  onClick={()=>{setVisible({...visible,department:!visible.department})}}
                  className="text-lg"
                />
              </div>
            </List.Item>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    className="w-3 h-3 mr-5"
                  />
                }
                title={`Sınıf: ${intern?.grade}`}
                description={props.intern?.grade}
              />
              <div className="mr-32" hidden={visible.grade}>
                <Select
                  className="w-full"
                  placeholder="Seçiniz..."
                  options={[
                    {value:1,label:"1.sınıf"},
                    {value:2,label:"2.sınıf"},
                    {value:3,label:"3.sınıf"},
                    {value:4,label:"4.sınıf"},
                  ]}
                  onChange={(value)=>SetEdited({...edited,grade:value})}
                />
              </div>
              <div>
                <EditOutlined
                  onClick={()=>{setVisible({...visible,grade:!visible.grade})}}
                  className="text-lg"
                />
              </div>
            </List.Item>
          </List>
        </div>
      </Modal>
    </>
  );
};

export default EditIntern;
