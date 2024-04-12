"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./page.module.css"
import Loader from "src/public/components/Loader"

import { TextField, Button } from "@mui/material"

import { getTime } from "src/public/utils/getTime"


const Component = ({params}) => {
  const {commercial, setSelectedDBId} = useData()
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
      setIsLoading(false)
    }
    fetchData()
  },[])


  const handleKeyDown = (event) => {
    if(event.key==="Enter")
      onSearchClick()
  }
  const onSearchClick = () => {

    const createArrayThatHasValue = (arr, value) => {
      const result = []
      for(let i = 0 ; i < arr.length; i++){
        for(let j = 0; j<arr[i].length; j++){
          if(arr[i][j]?.includes(value)) {
            if(arr[i][0]==="box value"){

              result.push({
                mode:"fromBoxDB",
                createdAt: arr[i][2],
                name: arr[i][1],
                type: arr[i][3],
                size: arr[i][5],
                id: i,
              })
            }
            else{
              result.push({
                mode: "fromDB",
                createdAt: arr[i][0],
                name: arr[i][1],
                content: arr[i][11],
                phoneNumber: arr[i][12],
                id: i
              })
            }
          }
        }
      }
      return result
    }
    const sortCreatedAtDesc = (arr) => {
      arr.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });
      return arr
    }

    if(values.commercial !== "" && values.commercial.length>=2) {
      setIsSearching(true)
      const INPUT = values.commercial
      // console.log(commercial)
      const result = commercial[params.type]?.map((item) => {
        if(item.title?.includes(INPUT) ||
          item.content?.includes(INPUT) ||
          item.phoneNumber?.includes(INPUT) ||
          item.companyValues?.companyName?.includes(INPUT)||
          item.companyValues?.name?.includes(INPUT)||
          item.companyValues?.phoneNumber?.includes(INPUT))
          return(item)
      }).filter(Boolean)
    
      
      setCommercialList([...result])
      setIsSearching(false)
    } else alert("검색은 3글자 이상부터여")
  }


  const onCommercialClick = (id) => {
    router.push(`/${params.type}/commercial/${id}`)
  }

  const onDBCommercialClick = (id) => {
    setSelectedDBId({
      type: params.type,
      id: id
    })
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <p style={{marginBottom:"20px"}}>광고가 나오지 않는다면 새로고침 하셔</p>
      <TextField
        label="검색"
        variant="standard"
        value={values.commercial}
        onChange={onValuesChange("commercial")}
        // multiline={false} rows={1} maxRows={1}
        size="small"
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="contained"
        onClick={onSearchClick}
      >
        검색
      </Button>


      <ul className={styles.list_container} style={{marginTop:"20px"}}>
        {commercialList.map((item, index) => {
          if(item.mode!=="fromDB" && item.mode!=="fromBoxDB")
          return(
            <li key={index} onClick={()=>onCommercialClick(item.id)}>
              <h4>{item.mode}</h4>
              <h1>{item.title}</h1>
              <h2>{item.content}</h2>
              <h3>{item.phoneNumber}</h3>
              <p>마지막 저장일: {getTime.YYYYMMDD(item.savedAt)}</p>
            </li>
          )
          else if(item.mode==="fromDB")
            return(
              <li key={index} onClick={()=>onDBCommercialClick(item.id)}>
              <h4>DB데이터</h4>
              <h1>광고주명: {item.name}</h1>
              <h2>{item.content?.substr(0,30)}</h2>
              <h3>{item.phoneNumber}</h3>
              <p>접수일자: {item.createdAt}</p>
            </li>
            )
          else if (item.mode==="fromBoxDB")
              return(
                <li key={index} onClick={()=>onDBCommercialClick(item.id)}>
                <h4>DB박스 데이터</h4>
                <h1>광고주명: {item.name}</h1>
                <h2>광고분류: {item.type}</h2>
                <h3>사이즈: {item.size}</h3>
                <p>접수일자: {item.createdAt}</p>
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