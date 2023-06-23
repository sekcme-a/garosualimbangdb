"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "../styles/Schedule.module.css"
import Loader from "src/public/components/Loader"
import { Button, TextField } from "@mui/material"

const Schedule = () => {
  const {user, schedule, setSchedule} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  useEffect(()=>{
    const fetchData = async () => {
      if(user===null)
        router.push("/login")
      setIsLoading(false)
    }
    fetchData()
  },[user])

  //*****for inputs
  const [values, setValues] = useState({
    scheduleGarosu: "",
    scheduleAlimbang:""
  })
  const onValuesChange = (prop) => (event) => {
      setValues({...values, [prop]: event.target.value})
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }));
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****


  useEffect(()=>{
    console.log(schedule)
    const fetchData = async () => {
      if(schedule){
        const scheduleGarosuToString = schedule.garosu?.join("//")
        const scheduleAlimbangToString = schedule.alimbang?.join("//")
        handleValues("scheduleGarosu", scheduleGarosuToString)
        handleValues("scheduleAlimbang", scheduleAlimbangToString)
      }
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onSubmitButtonClick = async() => {
    setIsSubmitting(true)

    function checkString(pattern, inputString) {
      const regex = new RegExp(pattern);
      return regex.test(inputString);
    }

    // Define the pattern for the string
    var pattern = /^(\d{4}\.\d{2}\.\d{2}\/\/)+\d{4}\.\d{2}\.\d{2}$/;
    if(!checkString(pattern, values.scheduleGarosu)){
      alert("가로수의 입력 형식이 잘못되었습니다. 다시 확인해주세요.")
      setIsSubmitting(false)
      return;
    }
    if(!checkString(pattern, values.scheduleAlimbang)){
      alert("알림방의 입력 형식이 잘못되었습니다. 다시 확인해주세요.")
      setIsSubmitting(false)
      return;
    }

    try{
      const result = await firebaseHooks.set_data("type/garosu/settings/schedule",{data: values.scheduleGarosu.split("//")})
      const result2 = await firebaseHooks.set_data("type/alimbang/settings/schedule",{data: values.scheduleAlimbang.split("//")})
      setSchedule({garosu:values.scheduleGarosu.split("//"), alimbang: values.scheduleAlimbang.split("//") })
      alert("성공적으로 적용되었습니다.")
    }catch(e){
      console.log(e)
    }
    setIsSubmitting(false)
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <p>회차 날짜를 2023.09.13//2023.09.14//2023.09.15 형식으로 적어주세요.</p>
      <TextField
        label="가로수 날짜"
        variant="standard"
        // error={error.type==="schedule"}
        // helperText={error.type!=="schedule" ? "제목을작성해주세요" : error.message}
        value={values.scheduleGarosu}
        onChange={onValuesChange("scheduleGarosu")}
        multiline={true} maxRows={10}
        size="small"
        fullWidth
      />
      <TextField
        sx={{mt:"20px"}}
        label="알림방 날짜"
        variant="standard"
        // error={error.type==="schedule"}
        // helperText={error.type!=="schedule" ? "제목을작성해주세요" : error.message}
        value={values.scheduleAlimbang}
        onChange={onValuesChange("scheduleAlimbang")}
        multiline={true} maxRows={10}
        size="small"
        fullWidth
      />
      <Button
        sx={{mt:"10px"}}
        variant="contained"
        // startIcon={<DeleteIcon />}
        // endIcon={<DeleteIcon />}
        onClick={onSubmitButtonClick}
        disabled={isSubmitting}
      >
        적용
      </Button>
    </div>
  )
}

export default Schedule