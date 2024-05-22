import TableApplications from '../../components/Hr/TableApplications'
import React, { useState } from 'react';

export const InternshipApplications = () => {
  const [header,setHeader] = useState("Güncel Başvurular")
  return (
    <div className='flex'>
      <div className="intern-table mr-20 w-full">
        <p className="text-white pl-16 text-xl fixed z-50 w-full pt-6 pb-6 border-b bg-[#001529]">
          {header}
        </p>
        <TableApplications setHeader={setHeader}/>
      </div>
    </div>
    
  )
}
