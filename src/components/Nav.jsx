import { signOut } from "firebase/auth"
import { navSections } from "../constants"
import { auth } from "../firebase/config"


const Nav = () => {

  return (
    <nav className="flex flex-col justify-between items-end p-4">
        <div className="">
          <div className="flex justify-end my-3">
          <img className="w-22 h-12"  src="/x-logo.webp"/>
          </div>

          {navSections.map((sec, i)=>(
            <div className="flex rounded items-center gap-3 p-3 cursor-pointer transition hover:bg-gray-900">
              {sec.icon}
              <span>{sec.title}</span>
            </div>
          ))}
        </div>



        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-1">
          <img className="w-12 h-12 rounded-full" src={auth?.currentUser?.photoURL} alt="" />
            <p>{auth?.currentUser?.displayName}</p>
          </div>
          <div></div>
          <button onClick={()=> signOut(auth)} className="bg-gray-700 p-1 rounded-lg">Çıkış Yap</button>
        </div>
    </nav>
  )
}

export default Nav