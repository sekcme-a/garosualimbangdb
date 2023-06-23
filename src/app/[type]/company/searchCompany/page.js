"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./styles/page.module.css"
import Loader from "src/public/components/Loader"

import { TextField, Button } from "@mui/material"

import { getTime } from "src/public/utils/getTime"




const Component = ({params}) => {
  const {company} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [selected, setSelected] = useState([])
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
    if(values.company !== "") {
      setIsSearching(true)
      const INPUT = values.company
      const result = company[params.type].map((item) => {
        if(item.name.includes(INPUT) || item.companyName.includes(INPUT) || item.phoneNumber.includes(INPUT) )
          return(item)
      }).filter(Boolean)
      console.log(result)
      setCompanyList(result)
      setIsSearching(false)
    }
  }

  const onDeleteClick = () => {

  }

  const onCompanyClick = (id) => {
    router.push(`/${params.type}/company/${id}`)
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <TextField
        label="검색"
        variant="standard"
        value={values.company}
        onChange={onValuesChange("company")}
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
        {companyList.map((item, index) => {
          return(
            <li key={index} onClick={()=>onCompanyClick(item.id)}>
              <h1>{item.companyName}</h1>
              <h2>{item.name}</h2>
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