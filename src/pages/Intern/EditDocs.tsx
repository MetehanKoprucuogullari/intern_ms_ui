import { Button, List, Popover, message } from "antd";
import React, { useEffect, useState } from "react";
import DocumentUpload from "../../components/Intern/DocumentUpload";
import axios from "axios";
import { FilePdfOutlined, FolderViewOutlined } from "@ant-design/icons";

export const EditDocs: React.FC = () => {
  const [key,setKey] = useState(Date.now())
  const [docOpen, setDocOpen] = useState(false);
  const [docs, setDocs] = useState<{
    accForm: string;
    criRecord: string;
    educDoc: string;
    idRegister: string;
  }>();
  const [uname, setUname] = useState("");

  const fetchData = () => {
    const jwt: string | number | boolean = localStorage.getItem("jwt") || "";
    axios.get("../users/auth", { headers: { "jwt": jwt } }).then((res) => {
      setUname(res.data.name);
      axios
        .get("../interns/mail/" + res.data.name, { headers: { "jwt": jwt } })
        .then((intern) => {
          axios
            .get("../docs/" + intern.data[0].id, { headers: { "jwt": jwt } })
            .then((docs) => {
              setDocs(docs.data[0])
            }).catch(err=>console.log(err));
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
  }

  useEffect(() => {
    fetchData()
  }, [key]);

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
      return null; // Blob dönüşümünde hata oluşursa null döndürme
    }
  };

  const showAccForm = () => {
    if (docs) {
      if (docs.accForm) {
        let pdfUrl;
        const pdfBlob = base64ToBlob(docs.accForm);
        if (pdfBlob) {
          pdfUrl = URL.createObjectURL(pdfBlob);
        }
        window.open(pdfUrl, "_blank");
      } else {
        message.info("Dosya Bulunamadı");
      }
    } else {
      message.info("Dosya Bulunamadı");
    }
  };

  const showCriForm = () => {
    if (docs) {
      if (docs.criRecord) {
        let pdfUrl;
        const pdfBlob = base64ToBlob(docs.criRecord);
        if (pdfBlob) {
          pdfUrl = URL.createObjectURL(pdfBlob);
        }
        window.open(pdfUrl, "_blank");
      } else {
        message.info("Dosya Bulunamadı");
      }
    } else {
      message.info("Dosya Bulunamadı");
    }
  };

  const showEducForm = () => {
    if (docs) {
      if (docs.educDoc) {
        let pdfUrl;
        const pdfBlob = base64ToBlob(docs.educDoc);
        if (pdfBlob) {
          pdfUrl = URL.createObjectURL(pdfBlob);
        }
        window.open(pdfUrl, "_blank");
      } else {
        message.info("Dosya Bulunamadı");
      }
    } else {
      message.info("Dosya Bulunamadı");
    }
  };

  const showIdForm = () => {
    if (docs) {
      if (docs.idRegister) {
        let pdfUrl;
        const pdfBlob = base64ToBlob(docs.idRegister);
        if (pdfBlob) {
          pdfUrl = URL.createObjectURL(pdfBlob);
        }
        window.open(pdfUrl, "_blank");
      } else {
        message.info("Dosya Bulunamadı");
      }
    } else {
      message.info("Dosya Bulunamadı");
    }
  };

  return (
    <div>
      <DocumentUpload setKey={setKey} docOpen={docOpen} setDocOpen={setDocOpen} uname={uname} />
      <p className="mb-5 pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
        Evrakları Düzenle
      </p>
      <div className="pt-32">
        <div className="flex justify-center">
        <List key={key} itemLayout="horizontal" className="pl-5 w-[25%]">
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className={`${docs?.accForm ? "text-green-800 text-2xl mr-3" : "text-red-800 text-2xl mr-3"}`}>
                  <FilePdfOutlined />
                </div>
              }
              title={<>Başvuru Formu</>}
              description={
                <div className="flex justify-start">
                  <div
                    className={`${docs?.accForm ? "text-green-600" : "text-red-600"}`}
                  >
                    {docs?.accForm ? "Yüklendi" : "Yüklenmedi"}
                  </div>
                  <div
                    className="ml-28 pb-5 -mt-3  text-xl text-black hover:text-blue-600 cursor-pointer"
                    onClick={showAccForm}
                  >
                    <Popover content="Yeni Sekmede Aç">
                      <FolderViewOutlined />
                    </Popover>
                  </div>
                </div>
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className={`${docs?.criRecord ? "text-green-800 text-2xl mr-3" : "text-red-800 text-2xl mr-3"}`}>
                  <FilePdfOutlined />
                </div>
              }
              title={<>Adli Sicil Kaydı</>}
              description={
                <div className="flex justify-start">
                  <div
                    className={`${docs?.criRecord ? "text-green-600" : "text-red-600"}`}
                  >
                    {docs?.criRecord ? "Yüklendi" : "Yüklenmedi"}
                  </div>
                  <div
                    className="ml-28 pb-5 -mt-3  text-xl text-black hover:text-blue-600 cursor-pointer"
                    onClick={showCriForm}
                  >
                    <Popover content="Yeni Sekmede Aç">
                      <FolderViewOutlined />
                    </Popover>
                  </div>
                </div>
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className={`${docs?.educDoc ? "text-green-800 text-2xl mr-3" : "text-red-800 text-2xl mr-3"}`}>
                  <FilePdfOutlined />
                </div>
              }
              title={<>Öğrenim Belgesi</>}
              description={
                <div className="flex justify-start">
                  <div
                    className={`${docs?.educDoc ? "text-green-600" : "text-red-600"}`}
                  >
                    {docs?.educDoc ? "Yüklendi" : "Yüklenmedi"}
                  </div>
                  <div
                    className="ml-28 pb-5 -mt-3  text-xl text-black hover:text-blue-600 cursor-pointer"
                    onClick={showEducForm}
                  >
                    <Popover content="Yeni Sekmede Aç">
                      <FolderViewOutlined />
                    </Popover>
                  </div>
                </div>
              }
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={
                <div className={`${docs?.idRegister ? "text-green-800 text-2xl mr-3" : "text-red-800 text-2xl mr-3"}`}>
                  <FilePdfOutlined />
                </div>
              }
              title={<>Nüfus Kayıt Örneği</>}
              description={
                <div className="flex justify-start">
                  <div
                    className={`${docs?.idRegister ? "text-green-600" : "text-red-600"}`}
                  >
                    {docs?.idRegister ? "Yüklendi" : "Yüklenmedi"}
                  </div>
                  <div
                    className="ml-28 pb-10 -mt-3 text-xl text-black hover:text-blue-600 cursor-pointer"
                    onClick={showIdForm}
                  >
                    <Popover content="Yeni Sekmede Aç">
                      <FolderViewOutlined />
                    </Popover>
                  </div>
                </div>
              }
            />
          </List.Item>
        </List>
        </div>
        <div className="mt-3 text-center">
            <Button
              onClick={() => setDocOpen(true)}
              type="primary"
              className="w-50"
            >
              Belge Ekle veya Güncelle
            </Button>
          </div>
      </div>
    </div>
  );
};
