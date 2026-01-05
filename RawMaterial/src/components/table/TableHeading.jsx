import React from "react";
const TableHeading = ({list}) =>{
    return(
        <>
            <thead className="sticky top-0 z-20 text-xs border border-gray-150 bg-gray-800 text-gray-100 uppercase">
                {list.map((item, index) => (
                    <th key={index} scope="col" className='px-6 py-3 text-center font-semibold'>
                        {item}
                    </th>
                ))}               
            </thead>
            
        </>
    );
}

export default TableHeading;