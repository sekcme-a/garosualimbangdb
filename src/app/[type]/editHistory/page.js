'use client'

import { Button } from "@mui/material"
import { firestore as db } from "firebase/firebase"
import { useState,useEffect } from "react"

import Link from "next/link"

import DropperImage from "src/public/components/DropperImage"

const EditHistory = ({params}) => {

  const [page, setPage] = useState(0)
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isImgLoading, setIsImgLoading] = useState(false)


  const fetchData = async () => {
    const snapShot = await db.collection(`${params.type}_history`).orderBy("createdAt", "asc").get()
    if(!snapShot.empty){
      const list = snapShot.docs.map(item => ({...item.data(), id: item.id}))
      setHistory([...list])
      setTimeout(()=> {
        setIsLoading(false)
      },1000)
      return list
    }
    setTimeout(()=> {
      setIsLoading(false)
    },1000)
  }

  useEffect(()=> {

    fetchData()

  },[])


  const onCheckClick = async (checked) => {

    await db.collection(`${params.type}_history`).doc(history[page].id).update({checked: !checked})

    const list = history.map((item, index) => {
      if(index===page){
        return({...item, checked:!checked})
      }else return({...item})
    })

    setHistory([...list])

  }

  const onNextClick = async () => {
    if(isImgLoading){
      alert("이미지 로딩중이라고 했지 않았느냐")
      return
    }
    if(history.length-1 < page+1){
      alert("불러온 광고 중 마지막 광고다. 더 수정사항이 있나 찾아보겠노라.(확인을 눌러라 닝겐)")

      const newHis = await fetchData()

      if(newHis.length > history.length) setPage(prev => prev+1)
      else alert("아직 추가된 광고가 없군.")
      
    }else {
      setPage(prev => prev+1)
    }


  }


  const handleImg = (url) => {
    let list = history
    list[page] = {...list[page], commercialUrl: url}
  }

  if(isLoading){
    return(
      <div style={{fontSize:"40px"}}>데이터를 받아오고 있으니 기다리거라..</div>
    )
  }
  return(
    <div>

      <p style={{fontSize:"30px", fontWeight:"bold"}}>
        {history[page].checked && <strong style={{color:"green"}}>{"✧･ﾟʚ(*´꒳`*)ɞ ✧･ﾟ"}</strong>}
        {history[page].text}
      </p>
      <p style={{fontSize:"25px", marginTop:"10px"}}>{history[page].info}</p>

      <p style={{fontSize:"25px", marginTop:"10px"}}>광고 타입: {history[page].newsType}</p>
      <p style={{marginTop:"30px"}}>광고 제목: <strong style={{fontSize:"25px"}}>{history[page].title}</strong></p>
      <p style={{marginTop:"15px"}}>광고 내용: <strong style={{fontSize:"23px"}}>{history[page].content}</strong></p>
      <p style={{marginTop:"15px"}}>광고 전번: <strong style={{fontSize:"23px"}}>{history[page].phone}</strong></p>

     
      <Link href={`/${params.type}/commercial/${history[page].commercialId}`} target="_blank">
        <p style={{cursor:"pointer", marginTop:"20px"}}>해당 광고 보기</p>
      </Link>

      <div style={{marginTop:"20px", fontSize:"20px", cursor:"pointer"}} onClick={()=>onCheckClick(history[page].checked)}>
        {history[page].checked ? "체크취소" : "체크하기"}
      </div>
      {console.log(history[page].commercialId)}
      <DropperImage imgUrl={history[page].commercialUrl} setImgURL={(url)=>handleImg(url)} path={`${params.type}/commercial/${history[page].commercialId}`} setIsLoading={setIsImgLoading}/>
      {isImgLoading && <p>이미지 로딩중이니 기다리거라..</p>}
      <div style={{marginTop:"30px", display:"flex", justifyContent:"space-between"}}>
        {page!==0 && <div onClick={()=>setPage(prev => prev-1)} style={{cursor:"pointer", fontSize:"20px"}}>{`< 이전광고`}</div>}
        <div onClick={onNextClick}  style={{cursor:"pointer", fontSize:"20px"}}>{`다음광고 >`}</div>
      </div>
    </div>
  )
}

export default EditHistory