"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
// import styles from "../styles/component.module.css"
import Loader from "src/public/components/Loader"

import { Button, TextField } from "@mui/material"

//접수일자, 고객명, 종류, 상태, 광고비, 입금액, 미입금, 시작, 종료일자, 분류, 메모, 내용, 전화번호
const Import = () => {
  const {user} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  //*****for inputs
  const [values, setValues] = useState({
    data: "",
    importedData: "",
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

const onSubmitClick = () => {

}

function groupArray(arr, size) {
  const result = [];
  
  for (let i = 0; i < arr.length; i += size) {
    const group = arr.slice(i, i + size);
    
    const phoneNumber = group[1].split("]")

    const arr2 = group[0].split("\t").filter(val => val !== undefined && val !== null && val !== '')
    // console.log(arr2)
    const entry = [
      arr2[0],
      arr2[1],
      arr2[2],
      // "담당자": arr2[3],
      arr2[4],
      arr2[5],
      arr2[6],
      arr2[7],
      arr2[8],
      arr2[9],
      // "입금방법": arr2[10],
      arr2[10],
      // "청약서번호": arr2[11],
      arr2[12],
      group[1],
      phoneNumber[phoneNumber.length-1].replace(/\t/g, '')
    ];
    
    result.push(entry);
  }
  
  return result;
}

const groupArrayGarosuBox = (arr) => {
  console.log(arr)
  let isLength = true
  let result = []
  for (let i = 0; i<arr.length; i++){
    const arr2 = arr[i].split("\t") 
    result.push([
      "box value",
      arr2[1],//고객 1
      arr2[2],//접수일자 2
      arr2[3],//분류 3
      arr2[5],//횟수 4
      arr2[6],//사이즈 5
      arr2[7],//광고액 6
      arr2[8],//미수액 7
      arr2[13]//메모 8
    ])
  }
  return result
}

const onImportClick = ()=>{
  const DATA = values.data
  const SPLITEDDATA = DATA.split("\n")
  // const GROUPEDDATA = groupArray(SPLITEDDATA, 3)    //가로수 줄광고 형식
  const GROUPEDDATA = groupArrayGarosuBox(SPLITEDDATA)
  console.log(GROUPEDDATA)

  // handleValues("importedData", data)
}


  if(isLoading)
    return <Loader />
  
  return(
    <div >
      <TextField
        label="제목"
        variant="standard"
        value={values.data}
        onChange={onValuesChange("data")}
        // multiline={false} rows={1} maxRows={1}
        multiline
        size="small"
      />
      <Button
        variant="contained"
        onClick={onSubmitClick}
      >
        Submit
      </Button>

      <Button
        variant="contained"
        onClick={onImportClick}
      >
        Import
      </Button>
      <TextField
        label="제목"
        variant="standard"
        value={values.importedData}
        onChange={onValuesChange("importedData")}
        // multiline={false} rows={1} maxRows={1}
        multiline
        size="small"
      />
    </div>
  )
}

export default Import