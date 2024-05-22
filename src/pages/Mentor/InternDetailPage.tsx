import InternInfo from "../../components/Mentor/InternInfo";
import TimeLine from "../../components/Mentor/TimeLine";
import { Chart } from "../../components/Mentor/Chart";
import {
  Button,
  Calendar,
  Card,
  Col,
  FloatButton,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Segmented,
  Spin,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import EditPlanModal from "../../components/Mentor/EditPlanModal";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";

interface typeDetail {
  id: number;
  intern: {
    id: number;
    name: string;
    mail: string;
    grade: number;
    school: string;
    department: string;
    field: string;
    completed: number;
    startdate:string
    enddate:string
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
  point: number;
}

interface typeAttendances {
  id: number;
  internId: number;
  date: string;
  value: boolean;
  note: string | null;
}

const InternDetailPage: React.FC = () => {
  const [total,setTotal] = useState(0)
  const [length,setLength] = useState(0)
  const [hidden,setHidden] = useState(true)
  const [attendances, setAttendances] = useState<typeAttendances[]>();
  const [date, setDate] = useState(() => dayjs(Date.now()));
  const [newNote, setNewNote] = useState("");
  const [key, setKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const internId = searchParams.get("id");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detail, setDetail] = useState<typeDetail[]>([]);
  const [keyDetail, setKeyDetail] = useState(Date.now());
  const [keyModal, setKeyModal] = useState(Date.now());

  const changes: boolean[] = [];

  const successDelete = () => {
    messageApi.open({
      type: "info",
      content: "Stajyer Silindi",
    });
  };

  const warningDelete = () => {
    messageApi.open({
      type: "warning",
      content: "hata",
    });
  };

  const successEdit = () => {
    messageApi.open({
      type: "success",
      content: "Düzenleme başarılı",
    });
  };

  const warningEdit = () => {
    messageApi.open({
      type: "warning",
      content: "hata",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const putDetail = async (item: typeDetail, updatedDetail: typeDetail) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios
      .put(`details/${item.id}`, JSON.stringify(updatedDetail), {
        headers: { "Content-Type": "application/json","jwt":jwt },
      })
      .then(() => {
        setKeyDetail(Date.now());
      }).catch(err=>console.log(err));
  };

  const editPlans = async () => {
    try {
      changes.map(async (item, key) => {
        let endDate = "";
        if (item) {
            endDate = dayjs().format("YYYY-MM-DD");
            await putDetail(detail[key], {
              ...detail[key],
              done: item,
              endDate: endDate,
            });
            setTimeout(async () => {
              for (let i = 0; i < detail.length; i++) {
                if (i !== key) {
                  if (detail[i].startDate !== "" && detail[i].endDate === "") {
                    break;
                  }
                  if (!detail[i].done && detail[i].startDate === "") {
                    await putDetail(detail[i], {
                      ...detail[i],
                      startDate: endDate,
                    });
                    break;
                  }
                }
              }
            }, 200);
        } else {
          await putDetail(detail[key], {
            ...detail[key],
            point: 0,
            done: item,
            endDate: endDate,
          });
        }
      });
      successEdit();
    } catch (err) {
      warningEdit();
    }
  };

  const handleOk = async () => {
    await editPlans();
    setTimeout(() => {
      fetchDetail();
    }, 200);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setKeyModal(Date.now());
    }, 200);
  };

  const fetchDetail = async () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await axios
      .get("details/" + internId,{headers:{"jwt":jwt}})
      .then((res) => {
        setDetail(res.data);
        let _total = 0
        let _length = 0
        for(let i=0; i<res.data.length;i++){
          if(res.data[i].point) _total += res.data[i].point
          if(res.data[i].done) _length += 1
        }
        setTotal(_total)
        setLength(_length || 1)
      })
      .catch(err=>console.log(err));
    setKeyModal(Date.now());
    setIsModalOpen(false);
  };

  const deleteIntern = () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios
      .delete("details/" + internId,{headers:{"jwt":jwt}})
      .then(() => {
        successDelete();
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      })
      .catch(() => {
        warningDelete();
      });
    axios.delete("users/" + detail[0].intern.mail,{headers:{"jwt":jwt}}).catch(err=>console.log(err));
    axios.delete("attendances/" + internId,{headers:{"jwt":jwt}}).catch(err=>console.log(err));
    axios.delete("docs/" + internId,{headers:{"jwt":jwt}}).catch(err=>console.log(err));
  };

  const fetchAttendance = () => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios
      .get("attendances/intern/" + internId,{headers:{"jwt":jwt}})
      .then((res) => {
        setAttendances(res.data);
      })
      .then(() => {
        setKey(Date.now());
      })
      .catch((err) => console.log("attendance" + err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const internIsHere = async (date: string) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    await setLoading(true);
    await axios
      .post(
        "attendances",
        JSON.stringify({ internid: internId, date: date, value: true }),
        {
          headers: { "Content-Type": "application/json","jwt":jwt },
        }
      )
      .then(() => {
        setTimeout(() => {message.success("Katıldı Olarak İşaretlendi")}, 1000);
        fetchAttendance();
      })
      .catch((err) => message.error("Sunucu Hatası"));
  };

  const putNote = (date: string) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true);
    axios
      .put(
        "attendances/note",
        JSON.stringify({ internid: internId, date: date, note: newNote }),
        {
          headers: { "Content-Type": "application/json","jwt":jwt },
        }
      )
      .then(() => {
        setTimeout(() => {message.success("Not Eklendi")}, 1000);
        fetchAttendance();
        setNewNote("");
      })
      .catch((err) => {
        message.error("Sunucu Hatası");
      });
  };

  const deleteRecord = (date: string) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true);
    axios
      .delete("attendances/" + internId + "/" + date,{headers:{"jwt":jwt}})
      .then((res) => {
        if (res.data[1]) setTimeout(() => {message.success("İşaret Kaldırıldı")}, 1000);
        fetchAttendance();
      })
      .catch((err) => {
        message.error("Sunucu Hatası")
      });
  };

  const internNotIsHere = (date: string) => {
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    setLoading(true);
    axios
      .post(
        "attendances",
        JSON.stringify({ internid: internId, date: date, value: false }),
        {
          headers: { "Content-Type": "application/json","jwt":jwt},
        }
      )
      .then(() => {
        setTimeout(() => {message.info("Katılmadı Olarak İşaretlendi")}, 1000);
        fetchAttendance();
      })
      .catch((err) => {
        message.error("Sunucu Hatası")
      });
  };

  const onSelect = (newValue: Dayjs) => {
    setDate(newValue);
  };

  const cellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD");
    if (dateStr === date.format("YYYY-MM-DD")) {
      return (
        <Spin spinning={loading}>
          <div className="flex justify-center gap-1">
            <Popover content={<>Katıldı olarak işaretle</>}>
              <CheckSquareOutlined
                className="text-2xl text-green-700 hover:text-green-400"
                onClick={() => internIsHere(dateStr)}
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
                        onChange={(v) => setNewNote(v.target.value)}
                      />
                      <Button
                        className="mt-1"
                        type="primary"
                        onClick={() => {
                          internNotIsHere(dateStr);
                          putNote(dateStr);
                        }}
                      >
                        {">"}
                      </Button>
                    </div>
                  }
                >
                  <CloseSquareOutlined className="text-2xl text-yellow-700 hover:text-yellow-400" />
                </Popover>
              </Popover>
            </Popover>
            <Popover content={<>İşareti Kaldır</>}>
              <DeleteOutlined
                className="text-2xl text-red-700 hover:text-red-400"
                onClick={() => deleteRecord(dateStr)}
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
                <Popover
                  content={
                    <div className="w-52">
                      {"Katılmadı (" +
                        (attendances[i].note || "Bilgi Yok") +
                        ")"}
                    </div>
                  }
                >
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
    <div className="flex">
      {contextHolder}
      <div className="intern-table mr-20 w-full">
        <p className="pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
          Stajyer Detayları
        </p>
        <div className="mt-24 pl-16 pt-3">
          <div className="introduce flex flex-row justify-start mt-5 mb-20">
            <div className="flex flex-col gap-2">
              <InternInfo
                key={keyDetail}
                internId={String(internId)}
                detail={detail}
              />
            </div>
          </div>
          <div className="text-center mb-10"> 
            <Segmented
              size="large"
              className="bg-[#001529] text-gray-300 w-auto"
              options={[
                "Çalışma",
                "Devamsızlık",
              ]}
              onChange={()=>{setHidden(!hidden)}}
            />  
          </div>
          <div className="flex justify-between gap-5">
            <div hidden={!hidden} className="mt-5 w-2/5 text-lg pr-5">
              <p className="my-10">Görevler:</p>
              <TimeLine key={keyDetail} detail={detail} />
            </div>
            <div hidden={!hidden} className="mt-5 w-3/5 -ml-10 mb-10 text-lg">
              <p className="my-10">{"Ortalama: "+(total?(total/length).toFixed(2):"Henüz Not Girilmedi")}</p>
              <Chart key={keyDetail} detail={detail} />
            </div>
          </div>
        </div>
        <div className="max-h-9">
          <Modal
            key={keyModal}
            width={1000}
            title="Planı Düzenle"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <EditPlanModal
              changes={changes}
              detail={detail}
              internId={String(internId)}
            />
          </Modal>
        </div>
        <div hidden={hidden} key={key} className="mt-16">
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
      </div>
      <FloatButton
        icon={<EditOutlined />}
        type="primary"
        style={{ top: 20, right: 140 }}
        onClick={showModal}
      />
      <Popconfirm
        title="Stajyer silinecek"
        description="Emin misiniz?"
        onConfirm={deleteIntern}
        onCancel={() => {}}
        okText="Evet"
        cancelText="İptal"
      >
        <FloatButton
          className="bg-[#ff5f61]"
          icon={<DeleteOutlined />}
          type="default"
          style={{ top: 20, right: 85 }}
        />
      </Popconfirm>
    </div>
  );
};

export default InternDetailPage;
