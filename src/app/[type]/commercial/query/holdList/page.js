"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./page.module.css"
import Loader from "src/public/components/Loader"

import { TextField, Button } from "@mui/material"

import { getTime } from "src/public/utils/getTime"
import { firestore as db } from "firebase/firebase"



const Component = ({params}) => {
  const {commercial} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [commercialList, setCommercialList] = useState([])
  const [selected, setSelected] = useState([])
  //*****for inputs
  const [values, setValues] = useState({
    commercial: ""
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  //for inputs*****

  useEffect(()=>{
    const fetchData = async () => {
      const data = await db.collection("type").doc(params.type).collection("commercials").where("mode","==","보류중").orderBy("holdAt", "desc").get()
      console.log(data.docs)
      const list = data.docs.map(doc => ({...doc.data(), id: doc.id}))
      setCommercialList(list)
      setIsLoading(false)
    }
    fetchData()
  },[])


  const handleKeyDown = (event) => {
    if(event.key==="Enter")
      onSearchClick()
  }
  const onSearchClick = () => {
    if(values.commercial !== "") {
      console.log(commercial)
      setIsSearching(true)
      const INPUT = values.commercial
      const result = commercial[params.type].map((item) => {
        if(item.title?.includes(INPUT) ||
          item.content?.includes(INPUT) ||
          item.phoneNumber?.includes(INPUT) ||
          item.companyValues?.companyName?.includes(INPUT)||
          item.companyValues?.name?.includes(INPUT)||
          item.companyValues?.phoneNumber?.includes(INPUT))
          return(item)
      }).filter(Boolean)
      console.log(result)
      setCommercialList(result)
      setIsSearching(false)
    }
  }


  const onCommercialClick = (id) => {
    router.push(`/${params.type}/commercial/${id}`)
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>


      <ul className={styles.list_container} style={{marginTop:"20px"}}>
        {commercialList.map((item, index) => {
          return(
            <li key={index} onClick={()=>onCommercialClick(item.id)}>
              <h4>{item.mode}</h4>
              <h1>{item.title}</h1>
              <h2>{item.content}</h2>
              <h3>{item.phoneNumber}</h3>
              <p>마지막 저장일: {getTime.YYYYMMDD(item.savedAt)}</p>
            </li>
          )
        })}

      </ul>
      <Button
        variant="contained"
        onClick={()=>router.back()}
      >
        뒤로가기
      </Button>
    </div>
  )
}

export default Component