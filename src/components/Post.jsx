import {BiDotsHorizontalRounded, BiMessageRounded, BiShareAlt} from "react-icons/bi"
import {AiOutlineHeart} from "react-icons/ai"
import {FaRetweet} from "react-icons/fa"
import { auth, db } from "../firebase/config"
import moment from "moment/moment"
import "moment/locale/tr"
import { toast } from "react-toastify"
import { deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { useEffect, useState } from "react"
import {FcLike} from "react-icons/fc"

const Post = ({ tweet}) => {

  const [isLiked, setIsLiked] = useState(false);

  // firebasedeki timeStamp değerini tarihe çevirme
  const date = tweet.createAt?.toDate() 

  const timeAgo = moment(date).fromNow()

  // aktif kullanıcı tweete like attı mı kontrolü
  useEffect(()=>{
    const found = tweet.likes.find((userId)=> userId === auth.currentUser.uid)
    setIsLiked(found)
  },[tweet])


  // tweet siler
  const handleDelete = async ()=>{
    const answer = confirm("Tweet'i silmek isiyor musunuz?")

    if(answer){
      // silmek istediğimiz doc'un referansını alma
      const ref = doc(db, "tweets", tweet.id)
      // doc'i silme
      await deleteDoc(ref)

      toast.error("Tweet siliniyor!")
    }
  }



  // tweeti likeler
  const handleLike = async ()=>{
    const ref = doc(db, "tweets", tweet.id)
    // doc'ta güncelleme
    await updateDoc(ref,{
      // likelanınca diziye kullanıcıyı ekler
      // like geri alınca diziden kullanıcıyı çıkarır
      likes: isLiked ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid),
    })
  }


  return (
    <div className="flex gap-3 p-3 border-b-[0.5px] border-gray-800">
        <img className="w-12 h-12 rounded-full" src={tweet.user?.photo}/>

        <div className="w-full">

          {/* kullanıcı bilgisi */}
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <p className="font-bold">{tweet.user.name}</p>
              <p className="text-gray-400">@{tweet.user.name.toLowerCase()}</p>
              <p className="text-gray-400">{timeAgo}</p>
            </div>
            {tweet.user.id === auth.currentUser.uid && <BiDotsHorizontalRounded onClick={handleDelete} className="cursor-pointer"/>}
          </div>

          {/* tweet içeriği */}
          <div className="my-3">
            <p>{tweet.textContent}</p>
            {tweet.imageContent && <img className="rounded-lg mt-3" src={tweet.imageContent}/>}
          </div>

          {/* tweet butonları alanı */}
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-full cursor-pointer transition hover:bg-gray-700">
            <BiMessageRounded />
            </div>
            <div className="p-2 rounded-full cursor-pointer transition hover:bg-gray-700">
            <FaRetweet />
            </div>
            <div onClick={handleLike} className="flex items-center gap-1 p-2 rounded-full cursor-pointer transition hover:bg-gray-700">
            {isLiked ? <FcLike /> : <AiOutlineHeart />}
            <span>{tweet.likes.length}</span>
            </div>
            <div className="p-2 rounded-full cursor-pointer transition hover:bg-gray-700">
            <BiShareAlt />
            </div>
          </div>
        </div>
    </div>
  )
}

export default Post;