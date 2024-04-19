'use client'

import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"


import { firestore as db } from "firebase/firebase"

const Money = ({params}) => {
  const [input, setInput] = useState("")
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [asdf, setAsdf] = useState(0)

  const [money, setMoney] = useState(0)

  
  const onSearchClick = async () => {
    setIsLoading(true)
    setAsdf(1)
    setMoney(0)
    let result = []
    let money = 0
    await Promise.all(
      input.split("//")?.map(async (YYYYMM) => {
        const snap = await db.collection("type").doc(params.type).collection("money").where("YYYYMM","==",YYYYMM).get()
        if(!snap.empty){
          const asdf = snap.docs.map((doc) =>{
            money += parseInt(doc.data().earned)
            return {...doc.data()}
          })
          result = [...result, ...asdf]
        }
      })
    )

    setTimeout(()=> {
      setAsdf(prev => prev+1)
    },1000)
    setTimeout(()=> {
      setAsdf(prev => prev+1)
    },2000)
    setTimeout(()=> {
      setAsdf(prev => prev+1)
      setMoney(money)
    },3000)
    setTimeout(()=> {
      setIsLoading(false)
      setList([...result])
      setAsdf(0)
    },5000)

    

  }

  return(
    <>
      <TextField
        label="년월 입력, //로 구분 예)202403//202404//202405"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
      />
      <Button
        onClick={onSearchClick}
        fullWidth
        variant="contained"
        sx={{mt:3}}
      >검색</Button>

      {asdf>=1 && asdf<=4 && <div style={{marginTop:"30px", position:"fixed", top: 0, left: 0, display:'flex', justifyContent:"center", alignItems:"center", width: "100vw", height:"100vh"}}>
        {asdf === 1 && <h1 style={{fontSize:"30vw"}}>검색된</h1>}
        {asdf === 2 && <h1 style={{fontSize:"30vw"}}>총 수익은</h1>}
        {asdf === 3 && <h1 style={{fontSize:"30vw"}}>바로!!!</h1>}
        {asdf === 4 && <h1 style={{fontSize:"15vw"}}>{money}원</h1>}
      </div>}

      <Grid container spacing={1} sx={{mt:5}}>
        {money!==0 && <p style={{fontWeight:"bold", marginBottom:"10px"}}>총 {money}원을 버셨습니다. 이정도 벌었으면 현서에게 용돈을 주는 것을 고려해보지 아니할수가 없지 않은 부분입니다.</p>}
      {list.map((item, index) => {
        return(
          <Grid item xs={12} key={index} style={{display:"flex", justifyContent:"space-between", padding: "10px", borderRadius:"5px", border:"1px solid black"}}>
            <p style={{marginRight:"5px"}}>{item.title}</p>
            <p style={{marginRight:"5px"}}>{item.content.substr(0,20)}</p>
            <p style={{marginRight:"5px", fontWeight:"bold"}}>{item.earned}원</p>
            <p>{new Date(item.createdAt.toDate()).toISOString().split('T')[0].replace(/-/g, '/')}</p>
          </Grid>
        )
      })}
      </Grid>
    </>
  )
}

export default Money