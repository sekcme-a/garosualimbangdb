"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./page.module.css"
import Loader from "src/public/components/Loader"

import { Button, TextField, Grid } from "@mui/material"
import { firestore as db } from "firebase/firebase"

const Component = ({params}) => {
  const {user} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  //*****for inputs
  const [values, setValues] = useState({
    company: ""
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
      setIsLoading(false)
    }
    fetchData()
  },[])

  const onNewCompanyClick = () => {
    router.push(`/${params.type}/company/newCompany`)
  }

  async function updateDocuments() {
    const querySnapshot = await db.collection("type").doc(params.type).collection("commercials").where("mode", "==", "게재중").get();
    
    querySnapshot.docs.forEach(async (doc) => {
      await db.collection("type").doc(params.type).collection("commercials").doc(doc.id).update({
        remain: doc.data().remain - 1
      });
    });
  }
  

  const onMagamClick = async() => {
    if(confirm("마감하시겠습니까? 현재 게재중인 광고의 횟수가 1회씩 차감됩니다.")){
      // Call the async function
      updateDocuments()
        .then(() => {
          alert("마감되었습니다.")
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          alert("에러")
        });
    }
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={onNewCompanyClick}
          >
            새 광고주 등록
          </Button>
        </Grid>

        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/company/searchCompany`)}
            sx={{ml:"15px"}}
          >
            광고주 검색
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/newCommercial`)}
            sx={{ml:"15px"}}
          >
            새 광고 등록
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/query/searchCommercial`)}
            sx={{ml:"15px"}}
          >
            광고 검색
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/query/unpaidList`)}
            sx={{ml:"15px"}}
          >
            미수금 광고 확인
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/query/holdList`)}
            sx={{ml:"15px"}}
          >
            보류중 광고 확인
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/query/remainEnded`)}
            sx={{ml:"15px"}}
          >
            횟수 소진한 연재중 광고 확인
          </Button>
        </Grid>

        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/commercial/query/date`)}
            sx={{ml:"15px"}}
          >
            기간 검색
          </Button>
        </Grid>

        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={onMagamClick}
            color="error"
            sx={{ml:"15px"}}
          >
            횟수 마감
          </Button>
        </Grid>



      </Grid>


    </div>
  )
}

export default Component