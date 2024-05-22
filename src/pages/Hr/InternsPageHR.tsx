import TableInternHR from '../../components/Hr/TableInternHR'

const InternsPageHR = () => {
  return (
    <div className='flex'>
        <div className="intern-table mr-20 w-full">
        <p className="text-white pl-16 text-xl fixed z-50 w-full pt-6 pb-6 border-b bg-[#001529]">
          Stajyer Listesi
        </p>
        <TableInternHR/>
      </div>
    </div>
  )
}

export default InternsPageHR