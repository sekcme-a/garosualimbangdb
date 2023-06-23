"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "../styles/DateOfToday.module.css"
import Loader from "src/public/components/Loader"
import { Dialog, TextField, Button } from "@mui/material"


const DateOfToday = () => {
  const {schedule,todayDate,setTodayDate} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  //*****for inputs
  const [values, setValues] = useState({
    date: ""
  })
  const onValuesChange = (prop) => (event) => {
      setValues({...values, [prop]: event.target.value})
  }
  const handleValues = (type, value) => {
    setValues({...values, [type]: value})
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****

  useEffect(()=>{
    const fetchData = async () => {
      if(!todayDate){
        setIsDialogOpen(true)
      }
      setIsLoading(false)
    }
    fetchData()
  },[])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const onDialogClose = () => {setIsDialogOpen(false)}
  
  const onSubmitClick = () => {
    if(!isDateFormatValid(values.date)){
      alert("올바르지 않은 형식입니다.\nYYYY.MM.DD형식으로 작성해주세요.")
    } else if(!schedule.garosu || schedule.garosu.length<=1 || !schedule.alimbang || schedule.alimbang.length<=1){
      alert("등록한 회차 날짜가 없거나 적습니다. ")
      router.push("/setting")
    } else if(!schedule.garosu.includes(values.date)){
      alert("등록된 회차가 아닙니다.")
    } else {
      localStorage.setItem("todayDate", values.date)
      setTodayDate(values.date)
      alert("마감일이 등록되었습니다.")
      setIsDialogOpen(false)
    }
  }
  function isDateFormatValid(inputDate) {
    var regex = /^\d{4}\.\d{2}\.\d{2}$/;
    return regex.test(inputDate);
  }
  

  if(isLoading)
    return <Loader />
  
  return(
    <>
      <div className={styles.main_container}>
        <h1>마감일자 : {todayDate}</h1>
        <Button
          variant="text"
          onClick={()=>setIsDialogOpen(true)}
          sx={{p:"0"}}
          size="small"
        >
          변경
        </Button>
      </div>


      <Dialog
          onClose={onDialogClose}
          open={isDialogOpen}
        >
          <div className={styles.dialog_container}>
            <h1>{`마감일을 입력해주세요.(YYYY.MM.DD)`}</h1>
            <TextField
              label="마감일"
              variant="standard"
              error={error.type==="type"}
              helperText={error.type!=="type" ? "예) 2001.09.13" : error.message}
              value={values.date}
              onChange={onValuesChange("date")}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              onClick={onSubmitClick}
            >
              적용
            </Button>
          </div>
        </Dialog>
    </>
  )
}

export default DateOfToday