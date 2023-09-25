import { useEffect, useState } from "react"
import TweetForm from "./TweetForm"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/config"
import Post from "./Post"

const Main = () => {
    const [tweets, setTweets] = useState(null);
    const tweetCol = collection(db, "tweets")

    useEffect(()=>{

        // abone olduğumuz tweetleri filtreleme - sıralama
        const queryOptions = query(tweetCol, orderBy("createAt", "desc"))

        onSnapshot(queryOptions, (snapshot)=>{
            // geçici olarak tweetleri tuttuğumuz dizi
            const tempTweets = [];
            // document' ları dönüp ihtiyacımız olan bilgilerini diziye aktarma
            snapshot.forEach((doc)=> tempTweets.push({...doc.data(), id: doc.id}))
            // tweetleri state e aktarma
            setTweets(tempTweets)
        })
    },[])

  return (
    <main className="main col-span-3 md:col-span-2 xl:col-span-1  border border-gray-800 overflow-y-auto">
        <header className="p-4 font-bold border-b-2 border-gray-800">
            Anasayfa
        </header>
        <TweetForm />

        {/* loading */}

        {!tweets && <p className="text-center mt-[200px]">Loading...</p>}

        {/* tweetleri listeleme */}
        {tweets?.map((tweet)=> (
        <Post key={tweet.id} tweet={tweet} />
        ))}

    </main>
  )
}

export default Main