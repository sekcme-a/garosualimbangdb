'use client'

import { useEffect, useState } from "react"


import { firestore as db, storage } from "firebase/firebase"

import DropperImage from "src/public/components/DropperImage"


import { v4 as uuidv4 } from 'uuid';
import { Button, Grid, TextField } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { firebaseHooks } from "firebase/hooks";

const Newspaper = ({params}) => {

  const [news, setNews] = useState([])
  const [imgUrl, setImgUrl] = useState("")
  const [newsFileUrl, setNewsFileUrl] = useState("")
  const [randomUid, setRandomUid] = useState()

  const [date, setDate] = useState(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace('.', '년 ').replace('.', '월 ').replace('.', '일'))

  const [isFileLoading, setIsFileLoading] = useState(false)

  useEffect(()=> {

    const fetchData = async () => {
      const randomDoc = await db.collection("type").doc(params.type).collection("newspapers").doc().get()
      setRandomUid(randomDoc.id)

      const snapShot = await db.collection("type").doc(params.type).collection("newspapers").orderBy("createdAt", "desc").get()
      if(!snapShot.empty){
        const list = snapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
        setNews([...list])
      }
    }

    fetchData()
  },[])


  const onSubmitClick = async () => {


    if(confirm("현서님을 숭배하십니까?")){
      await db.collection("type").doc(params.type).collection("newspapers").doc(randomUid).set({
        date: date,
        thumbnailUrl: imgUrl,
        newsUrl: newsFileUrl,
        createdAt: new Date()
      })
     

      setNews(prev => [{
        date: date,
        thumbnailUrl: imgUrl,
        newsUrl: newsFileUrl,
        createdAt: new Date(),
        id: randomUid
      }, ...prev])

      setDate(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace('.', '년 ').replace('.', '월 ').replace('.', '일'))
      setImgUrl("")
      setNewsFileUrl("")

      const randomDoc = await db.collection("type").doc(params.type).collection("newspapers").doc().get()
      setRandomUid(randomDoc.id)

      alert("현서님께서 코딩도 모르는 미천한 것을 대신해 신문을 홈페이지에 올렸도다, 찬양하거라.")

    }else {
      alert("미천한 것, 저리 꺼지거라.")
    }
  }


  const onDeleteClick = async (id, newsUrl, thumbnailUrl) => {


    if(confirm("해당 신문을 진짜 삭제할꺼나? 삭제하면 미천한 너를 위해 복구할 생각은 1도 없다.(실제로 복구 못함)")){
      await db.collection("type").doc(params.type).collection("newspapers").doc(id).delete()
      await firebaseHooks.delete_image_with_url_from_storage(newsUrl)
      await firebaseHooks.delete_image_with_url_from_storage(thumbnailUrl)
      const list = news.filter(item => item.id!==id)
      setNews([...list])
    } else alert("에휴 쪽보쉑")
  }

  return(
    <>
      <p>12개 보다 많아지면 자동으로 1개씩 삭제됨. 혹시 잘못올리거나 했을 경우 삭제를 통해 삭제.</p>


      <h1 style={{marginTop:"20px"}}>신문 pdf 올리기:</h1>
      <DropperImage imgUrl={newsFileUrl} setImgURL={(url)=>setNewsFileUrl(url)} path={`${params.type}/newspaper/${randomUid}`} setIsLoading={setIsFileLoading}/>
      <h1 style={{marginTop:"20px"}}>신문 썸네일 올리기:</h1>
      <DropperImage imgUrl={imgUrl} setImgURL={(url)=>setImgUrl(url)} path={`${params.type}/newspaper/${randomUid}_thumbnail`} setIsLoading={setIsFileLoading}/>
      <TextField
        sx={{mt: 2, mb:2}}
        label="날짜 (임의로 변경 가능)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Button
      variant="contained"
      fullWidth
      sx={{mb:2}}
      onClick={onSubmitClick}
      disabled={isFileLoading}

      >{isFileLoading ? "파일 업로드 중..":"추가"}</Button>

      <div style={{width:"100%", height:'3px',backgroundColor:"black", marginBottom:"30px"}} />

      <Grid container spacing={2} sx={{mb: 10}}>
      {news.map((item, index) => (
        <Grid item key={index} xs={12} sm={6} md={3}>
          <Link href={item.newsUrl} target="_blank">
            <Image alt={item.date}
              src={item.thumbnailUrl}
              width={300}
              height={500}
            />
          </Link>
          <p>{item.date}</p>
          <Button
            color="error"
            variant="contained"
            fullWidth
            onClick={()=>onDeleteClick(item.id, item.newsUrl, item.thumbnailUrl)}
          >삭제</Button>
        </Grid>

      ))}
      </Grid>
    </>
  )
}

export default Newspaper