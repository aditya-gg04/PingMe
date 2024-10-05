export function InputBox({label,place,onChange}){
    return <div className="py-2">
        <div className=" flex items-start px-6">{label}</div>
        <div className="px-6 flex items-start">
        <input onChange={onChange} type="text" placeholder={place} className="px-3 py-1 w-full border rounded-sm "/>
        </div>
    </div>
}