"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "../styles/CommercialType.module.css"
import Loader from "src/public/components/Loader"

import { TextField, Button } from "@mui/material"

const LocationType = () => {
  const {user, locationTypes, setLocationTypes} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

    //*****for inputs
    const [values, setValues] = useState({
      garosu: "",
      alimbang:""
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
    const fetchData = async () => {
      if(locationTypes){
        const locationGarosuToString = locationTypes.garosu?.join("//")
        const locationAlimbangToString = locationTypes.alimbang?.join("//")
        handleValues("garosu", locationGarosuToString)
        handleValues("alimbang", locationAlimbangToString)
      }
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onSubmitButtonClick = async () => {
    setIsSubmitting(true)
    try{
      const result = await firebaseHooks.set_data("type/garosu/settings/locationTypes",{data: values.garosu.split("//")})
      const result2 = await firebaseHooks.set_data("type/alimbang/settings/locationTypes",{data: values.alimbang.split("//")})
      setLocationTypes({garosu:values.garosu.split("//"), alimbang: values.alimbang.split("//") })
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
      <h1>가로수 지역분류{` (//로 구분)`}</h1>
      <TextField
        label="가로수 지역 분류"
        variant="standard"
        // error={error.type==="schedule"}
        // helperText={error.type!=="schedule" ? "제목을작성해주세요" : error.message}
        value={values.garosu}
        onChange={onValuesChange("garosu")}
        multiline={true} maxRows={10}
        size="small"
        fullWidth
      />
      <TextField
        sx={{mt:"20px"}}
        label="알림방 지역 분류"
        variant="standard"
        // error={error.type==="schedule"}
        // helperText={error.type!=="schedule" ? "제목을작성해주세요" : error.message}
        value={values.alimbang}
        onChange={onValuesChange("alimbang")}
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

export default LocationType