import React, { useEffect, useState } from "react";
import TableWorks from '../../components/Intern/TableWorks'
import axios from "axios";

const Works:React.FC = () => {
  const [mail,setMail] = useState<{mail:string}>()
  const [internId,setInternId] = useState("")
  const [key,setKey] = useState(Date.now())
  

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    if(mail){
      axios.get("../interns/mail/"+mail,{headers:{"jwt":jwt}})
      .then(intern=>{
        setInternId(intern.data[0].id)
        setKey(Date.now())
      }).catch(err=>console.log(err))
    }
  },[mail])

  useEffect(()=>{
    const jwt:string | number | boolean = localStorage.getItem("jwt") || ""
    axios.get("../users/auth",{headers:{"jwt":jwt}})
    .then((res)=>{
      setMail(res.data.name)
    }).catch(err=>console.log(err))
  })

  return (
    <div>
      <p className="mb-5 pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
        Çalışmalar
      </p>
      <div className="px-20 py-32 text-center">
        <TableWorks internId={internId} key={key}/>
      </div>  
    </div>
  )
}

export default Works