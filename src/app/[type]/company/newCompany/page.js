"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./styles/page.module.css"
import Loader from "src/public/components/Loader"
import { Button, CircularProgress, Grid, TextField } from "@mui/material"

import Image from "next/image"
import DropperImage from "src/public/components/DropperImage"

const Page = ({params}) => {
  const {company, setCompany} = useData()
  const router = useRouter()
  const [companyId, setCompanyId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isImgLoading, setIsImgLoading] = useState(false)

  //*****for inputs
  const [values, setValues] = useState({
    companyName: "",
    name: "",
    phoneNumber:"",
    memo:"",
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****



  useEffect(()=>{
    const fetchData = async () => {
      const randomId = await firebaseHooks.get_random_id()
      setCompanyId(randomId)
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onSubmitButtonClick = async() => {
    if(company[params.type].some((el) => el.companyName===values.companyName)){
      if(!confirm("이미 같은 업체명이 있습니다. 그래도 등록하시겠습니까?"))
        return;
    }
    if(company[params.type].some((el) => el.name===values.name)){
      if(!confirm("이미 같은 광고주 명이 있습니다. 그래도 등록하시겠습니까?"))
        return;
    }
    if(company[params.type].some((el) => el.phoneNumber===values.phoneNumber)){
      if(!confirm("이미 같은 전화번호가 있습니다. 그래도 등록하시겠습니가?"))
        return;
    }
    await firebaseHooks.set_data(`type/${params.type}/company/${companyId}`, {
      ...values,
      savedAt: new Date(),
      createdAt: new Date(),
    })
    const companyData = await firebaseHooks.fetch_company_data()
    setCompany(companyData)
    router.back()
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="업체명"
            variant="standard"
            value={values.companyName}
            onChange={onValuesChange("companyName")}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="광고주 명"
            variant="standard"
            value={values.name}
            onChange={onValuesChange("name")}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="업체 전화번호"
            variant="standard"
            value={values.phoneNumber}
            onChange={onValuesChange("phoneNumber")}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} width="100%">
          <TextField
            label="업체 메모"
            variant="standard"
            value={values.memo}
            onChange={onValuesChange("memo")}
            size="small"
            fullWidth
            multiline
            maxRows={12}
          />
        </Grid>

      </Grid>


      <p style={{marginTop:"30px", fontSize:"17px", fontWeight:"bold"}}>업체 로고</p>
      {isImgLoading && <CircularProgress />}
      {values.logoUrl &&
        <div style={{maxWidth:"100px", height:"100px", position:"relative"}}>
          <Image
            src={values.logoUrl}
            alt="로고"
            style={{ objectFit: 'contain' }}
            fill
          />
        </div>
      }
      <DropperImage imgUrl={values.logoUrl} setImgURL={(url)=>handleValues("logoUrl", url)} path={`${params.type}/logo/${companyId}`} setIsLoading={setIsImgLoading}/>


      <Button
        variant="contained"
        onClick={onSubmitButtonClick}
        sx={{mt:"15px"}}
        disabled={isImgLoading}
      >
        신규 저장
      </Button>
      <Button
        variant="contained"
        onClick={()=>router.back()}
        sx={{mt:"15px", ml:"15px"}}
      >
        뒤로가기
      </Button>
    </div>
  )
}

export default Page