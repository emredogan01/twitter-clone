import { Routes, Route, useNavigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "./firebase/config";


function App() {
  const navigate = useNavigate();

  useEffect(()=>{
    // aktif oturumdaki değişiklikleri izleme
    onAuthStateChanged(auth, (user)=>{
      // oturum açık ise anasayfaya
      if(user){
        navigate("/feed")
        // kapalı ise logine yönlendirir
      }else{
        navigate("/")
      }
    })
  },[])

  return (
    <>
      
        <Routes>
          <Route path="/" element={<Auth />}/>
          <Route path="/feed" element={<Feed />}/>
        </Routes>
    </>
  )
}

export default App;
