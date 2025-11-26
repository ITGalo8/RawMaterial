const SingleSelect = ({lists,selectedValue,setSelectedValue,label}) => {
   

    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
            <select
              value={selectedValue}
              onChange={(e) => {setSelectedValue(e.target.value); }}
              className="w-full px-2 py-2 border border-gray-300 rounded-xl text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">
                {lists?.length <= 0 ? "Loading roles..." : "Choose your role"}
              </option>
              {lists.map((list) => (         
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
    )
}

export default SingleSelect