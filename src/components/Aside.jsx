
import axios from "axios"
import { useEffect, useState } from "react"
import {AiFillSetting} from "react-icons/ai"
import {FaHashtag} from "react-icons/fa"
import { options } from "../api/search"

const Aside = () => {
  const [news, SetNews] = useState(null)

  useEffect(()=>{
    axios.request(options)
    .then((res)=> SetNews(res.data))
  },[])

  return (
    <aside className="main hidden lg:block overflow-y-auto">

      <div className="flex items-center mt-4 p-1 gap-1 cursor-pointer">
        <input className="outline-none w-full rounded-full pl-2 bg-slate-800" type="text" placeholder="Twitter'da Ara"/>
        <AiFillSetting />
      </div>

      <div className="p-3 cursor-pointer">
        {!news && <p className="p-3 text-center">Loading...</p>}

        {news?.timeline?.map((item, idx)=> (
          <div className="flex flex-col gap-3 pl-1 w-[250px]" key={idx}>
            <p>{item.text.slice(0,30)}...</p>
            <div className="flex items-center gap-3 hover:bg-slate-700 rounded-full p-1">
              <FaHashtag />
              <p className="pl-4">{item.screen_name}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Aside