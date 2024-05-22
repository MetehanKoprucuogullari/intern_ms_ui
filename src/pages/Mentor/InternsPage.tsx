/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import TableIntern from "../../components/Mentor/TableIntern";

const InternsPage: React.FC = () => {
  return (
    <div className="flex">
      <div className="intern-table mr-20 w-full">
        <p className="pl-16 text-xl fixed z-50 text-white bg-[#001529] w-full pt-6 pb-6">
          Stajyer Listesi
        </p>
        <TableIntern/>
      </div>
    </div>
  );
};

export default InternsPage;
