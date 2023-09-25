import { toast } from "react-toastify";
import {auth, db, storage} from "../firebase/config"
import {BsCardImage} from "react-icons/bs"
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

const TweetForm = () => {
    // kolleksiyonu referans almak için
    const tweetsCol = collection(db, "tweets");

    // resmi storage yükler ve url'ini döndürür
    const uploadImage = async (image)=>{
        // gönderilen dosyayı kontrol etme
        if(!image){
            return null;
        }
        
        const storageRef = ref(storage, `${new Date().getTime()}${image.name}`);
        
        //resmi ayarladığımız konuma yükleme
        const url = await uploadBytes(storageRef, image)
        // yükeleme bitince url al 
        .then((res)=> getDownloadURL(res.ref))
        .catch(()=> toast.error("Resmi yüklerken bir hata oluştu!"))
        // fonksiyonun çağırıldığı yere url gönderme
        return url;
        
    }
    
    
    // form gönderilmesi
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const textContent = e.target[0].value
        const imageContent = e.target[1].files[0]

        // resmi stroge a yükleyip url'ini alma
        const url = await uploadImage(imageContent);

        if(!textContent){
            toast.info("Tweet içeriği ekleyin!")
            return;
        }

        // tweet'i kolleksiyona ekleme
        await addDoc(tweetsCol, {
            textContent,
            imageContent: url,
            createAt: serverTimestamp(),
            user:{
                id: auth.currentUser.uid,
                name: auth.currentUser.displayName,
                photo: auth.currentUser.photoURL,
            },
            likes: [],
        })

        // inputları sfırlarma
        e.target[0].value = ""
        e.target[1].value = null
    };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-b-2 border-b-gray-800">
        <img 
        className="rounded-full h-[50px]" 
        src={auth.currentUser?.photoURL} alt="" 
        />

        <div className="w-full">
            <input 
            type="text" 
            placeholder="Neler oluyor?"
            className="w-full bg-transparent my-2 outline-none placeholder:text-lg"
            />

            <div className="flex h-[45px] items-center justify-between">
                <div className="hover:bg-gray-800 transition p-4 cursor-pointer rounded-full">
                    <label htmlFor="picture">
                    <BsCardImage />
                    </label>
                    <input className="hidden" id="picture" type="file"></input>
                </div>

                <button className="bg-blue-600 px-4 py-2 rounded-full transition hover:bg-blue-500">Tweetle</button>
            </div>
        </div>
    </form>
  )
}

export default TweetForm