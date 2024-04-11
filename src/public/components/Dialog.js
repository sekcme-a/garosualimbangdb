"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "../styles/Dialog.module.css"
import Loader from "src/public/components/Loader"

import { TextField } from "@mui/material"

const Dialog = () => {
  const {user, selectedDBId, setSelectedDBId} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isHide, setIsHide] = useState(false)

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(false)
    }
    fetchData()
  },[])

  useEffect(()=>{
    setIsHide(false)
  },[selectedDBId])


  if(isLoading)
    return <Loader />
  
  if(selectedDBId && selectedDBId.id)
  return(
<></>
    // <div className={styles.parent_container}>
    // <div className={styles.main_container}>
    //   <div className={styles.button_container}>
    //     <div className={styles.button}  onClick={()=>setIsHide(!isHide)}>
    //       {isHide ? "보이기":"숨기기"}
    //     </div>
    //     <div className={styles.button2} onClick={()=>setSelectedDBId(null)}>
    //       x
    //     </div>  
    //   </div>
    //   {!isHide && selectedDBId.type==="garosu" && GAROSUDATA[selectedDBId.id][0]==="box value" ? 
    //   <>
    //     <TextField
    //       label="고객"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][1]}
    //       size="small"
    //     />
    //     <TextField
    //       label="접수일자"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][2]}
    //       size="small"
    //     />
    //     <TextField
    //       label="분류"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][3]}
    //       size="small"
    //     />
    //     <TextField
    //       label="횟수"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][4]}
    //       size="small"
    //     />
    //     <TextField
    //       label="사이즈"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][5]}
    //       size="small"
    //     />
    //     <TextField
    //       label="광고액"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][6]}
    //       size="small"
    //     />
    //     <TextField
    //       label="미수액"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][7]}
    //       size="small"
    //     />
    //     <TextField
    //       label="메모"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][8]}
    //       size="small"
    //     />
    //   </>
    //   : !isHide && 
    //   <>
    //     <TextField
    //       label="광고주명"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][1]}
    //       size="small"
    //     />
    //     <TextField
    //       label="종류"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][2]}
    //       size="small"
    //     />
    //     <TextField
    //       label="상태"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][3]}
    //       size="small"
    //     />
    //     <TextField
    //       label="광고비/입금액/미입금"
    //       variant="standard"
    //       value={`${GAROSUDATA[selectedDBId.id][4]}/${GAROSUDATA[selectedDBId.id][5]}/${GAROSUDATA[selectedDBId.id][6]}`}
    //       size="small"
    //     />
    //     <TextField
    //       label="종료일자"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][8]}
    //       size="small"
    //     />
    //     <TextField
    //       label="분류"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][9]}
    //       size="small"
    //     />
    //     {GAROSUDATA[selectedDBId.id][10] && <TextField
    //       label="메모"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][10]}
    //       size="small"
    //     />}
    //     <TextField
    //       label="내용"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][11]}
    //       size="small"
    //       multiline
    //       maxRows={6}
    //     />
    //     <TextField
    //       label="전화번호"
    //       variant="standard"
    //       value={GAROSUDATA[selectedDBId.id][12]}
    //       size="small"
    //     />
    //   </>
    //   }
    // </div>
  )
}

export default Dialog