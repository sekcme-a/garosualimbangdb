"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./page.module.css"
import Loader from "src/public/components/Loader"

import { Button, TextField, Grid } from "@mui/material"
import { firestore as db } from "firebase/firebase"
import Image from "next/image"

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

  const [lastMagam, setLastMagam] = useState("")

  useEffect(()=>{
    const fetchData = async () => {
      const magamDoc = await db.collection("type").doc(params.type).collection("datas").doc("magam").get()
      const firestoreTimestamp = magamDoc.data().lastMagam.toDate()
      if(magamDoc.exists) setLastMagam(`${firestoreTimestamp.getFullYear()}.${(firestoreTimestamp.getMonth() + 1).toString().padStart(2, '0')}.${firestoreTimestamp.getDate().toString().padStart(2, '0')} ${firestoreTimestamp.getHours().toString().padStart(2, '0')}:${firestoreTimestamp.getMinutes().toString().padStart(2, '0')}`)
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
        .then( async () => {
          await db.collection("type").doc(params.type).collection("datas").doc('magam').set({
            lastMagam: new Date()
          })
          setLastMagam(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '.'))
          alert("마감되었습니다.")
        })
        .catch((error) => {
          console.error("Error updating documents:", error);
          alert("에러")
        });
    }
  }



  const onResetHistoryClick = async () => {

    if(confirm(`
    현 재의 편집을 초기화하셔서 생긴 손해엔
    민 사적인 책임을 지지 않으며,
    바 로 얘기해도 삭제된 내용은 복구되지 않기에
    보 수가 가능하지 않습니다.`)){
      const colRef = await db.collection(`${params.type}_history`).get()
      if(!colRef.empty){
        const batch = db.batch()
        colRef.forEach(doc => {
          batch.delete(doc.ref)
        })
        await batch.commit()
      }
      alert("초기화됬쪄")
    }
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <Grid container spacing={3}>
        {/* <Grid item xs={6} sm={2}>
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
        </Grid> */}


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
            onClick={()=> router.push(`/${params.type}/banner`)}
            sx={{ml:"15px"}}
          >
            배너 광고 편집
          </Button>
        </Grid>


        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={()=> router.push(`/${params.type}/newspaper`)}
            sx={{ml:"15px"}}
          >
            신문 완성본 입력
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
          <p>마지막 마감일: {lastMagam}</p>
        </Grid>

        <Grid item xs={6} sm={2}>
          <Button
            variant="contained"
            onClick={onResetHistoryClick}
            color="error"
            sx={{ml:"15px"}}
          >
            편집 기록 초기화
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Image
            style={{cursor:"pointer"}}
            src="/hyunsur.png"
            alt=""
            width={300}
            height={300}
            onClick={()=>{
              if(confirm("현서를 숭배하십니까?")){
                router.push(`/${params.type}/editHistory`)
              }else alert("꺼져그럼")
            }}
          />
        </Grid>


      </Grid>


    </div>
  )
}

export default Component