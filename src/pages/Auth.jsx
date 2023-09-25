import { useEffect, useState } from "react"
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithRedirect,
    signInWithPopup,
} from "firebase/auth"
import { auth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = () => {
    // aktif kullanıcı varsa ana sayfaya yönlendir
    // useEffect(()=>{
    //     if(auth.currentUser){
    //         navigate("/feed")
    //     }
    // },[])

    const [singUp, setSingUp] = useState(false);
    const [isError, setIsError] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // form gönderme
    const handleSubmit= (e)=>{
        e.preventDefault();
        // form değerlerine erişme
        const mail = e.target[0].value
        setEmail(mail)
        const pass = e.target[1].value

        if(singUp){
            // hesap oluştur
            createUserWithEmailAndPassword(auth, mail, pass)
            .then(()=>{ 
                navigate("/feed")
                toast.success("Hesabınız Oluşturuldu!")
            })
            .catch((err)=>{
                console.dir(err)
                toast.error(`Üzgünüz bir hata oluştu: ${err.code}`)
            })
        }else{
            // giriş yap
            signInWithEmailAndPassword(auth, mail, pass)
            .then(()=>{
                navigate("/feed")
                toast.success("Hesabınıza giriş yapıldı")
            })
            .catch((err)=>{

                // giriş bilgileri yanlış ise hata olduğunu state aktar
                if(err.code === 'auth/invalid-login-credentials'){
                    setIsError(true)
                }
                toast.error(`Üzgünüz bir hata oluştu: ${err.code}`)
            })
        }
    }

    // şifre sıfırlama
    const handlePassReset= ()=>{
        sendPasswordResetEmail(auth, email)
        .then(()=>toast.info("Mailinize sıfırlama e-postası gönderildi!"))
    }


    // google ile giriş yap
    const handleGoogle = ()=>{
        signInWithPopup(auth, googleProvider)
        .then(()=> {
            navigate("/feed")
            toast.success("Google ile hesaba giriş yaptınız!")
        })
        .catch((err)=>{

        })
    }
 
  return (
    <section className="h-screen bg-zinc-800 grid place-items-center">
        <div className="bg-black text-white flex flex-col gap-10 py-16 px-32 rounded-lg">
            <div className="flex justify-center">
                <img className="w-[90px] h-[60px]" src="/x-logo.webp"/>
            </div>

            <h1 className="text-center font-bold text-xl">Twitter'a Griş Yap!</h1>

            <div onClick={handleGoogle} className="flex items-center bg-white py-2 px-10 rounded-full cursor-pointer gap-3 hover:bg-gray-300">
                <img className="w-[20px]" src="/google.png"/>
                <span className=" text-black">Google İle {singUp ? "kayıt ol" : "giriş yap"}</span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label>Email</label>
                <input className="text-black rounded p-2 mt-1 shadow-lg focus:shadow-[#2e2d2d]" type="imail" 
                />
                <label>Password</label>
                <input className="text-black rounded p-2 mt-1 shadow-lg focus:shadow-[#2e2d2d]" type="password" 
                />

                <button className="bg-white text-black  mt-10 rounded-full p-2 font-bold transition hover:bg-gray-300">
                    {singUp ? "Kayıt Ol" : "Giriş Yap"}
                </button>

                <p className="mt-5">
                    <span className="text-gray-500">
                        {singUp ? "Hesabınız Var Mı?" : "Hesabınız Yok Mu?"}
                    </span>
                    <span onClick={()=>setSingUp(!singUp)} className="cursor-pointer text-blue-500">
                        {singUp ? "Giriş Yap" : "Kayıt Ol"}
                    </span>
                </p>
                {/* hata varsa */}
                {
                    isError && !singUp && <p onClick={handlePassReset} className="text-red-500 cursor-pointer">Şifrenizi mi unuttunuz?</p>
                }
            </form>

        </div>
    </section>
  )
}

export default Auth