"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "./page.module.css"
import Loader from "src/public/components/Loader"

import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material"

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
    startDate: "",
    endDate: "",
    type:"게재일자기준"
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
      // const data = await db.collection("type").doc(params.type).collection("commercials").where("mode","==","보류중").orderBy("holdAt", "desc").get()
      // console.log(data.docs)
      // const list = data.docs.map(doc => ({...doc.data(), id: doc.id}))
      // setCommercialList(list)
      setIsLoading(false)
    }
    fetchData()
  },[])


  const handleKeyDown = (event) => {
    if(event.key==="Enter")
      onSearchClick()
  }
  const onSearchClick = () => {
    const startTimestamp = new Date(`${values.startDate} 00:00:00`)
    const endTimestamp = new Date(`${values.endDate} 23:59:59`)
    if(values.type==="게재일자기준")
     db
      .collection("type")
      .doc(params.type)
      .collection("commercials")
      .where("publishedAt", ">=", startTimestamp)
      .where("publishedAt", "<=", endTimestamp)
      .orderBy("publishedAt", "desc")
      .get()
      .then((querySnapshot) => {
        const results = [];
        console.log(querySnapshot.docs)
        querySnapshot.forEach((doc) => {
          const data = {...doc.data(), id: doc.id};
          results.push(data);
        });
        console.log("Query results: ", results);
        setCommercialList(results)
      })
      .catch((error) => {
        console.log("Error getting Firestore data: ", error);
        return [];
      });
    
    else if (values.type==="연재종료일자기준")
      db
      .collection("type")
      .doc(params.type)
      .collection("commercials")
      .where("unpublishedAt", ">=", startTimestamp)
      .where("unpublishedAt", "<=", endTimestamp)
      .orderBy("unpublishedAt", "desc")
      .get()
      .then((querySnapshot) => {
        const results = [];
        console.log(querySnapshot.docs)
        querySnapshot.forEach((doc) => {
          const data = {...doc.data(), id: doc.id};
          results.push(data);
        });
        console.log("Query results: ", results);
        setCommercialList(results)
      })
      .catch((error) => {
        console.log("Error getting Firestore data: ", error);
        return [];
      });

    else if (values.type==="저장된일자기준")
      db
      .collection("type")
      .doc(params.type)
      .collection("commercials")
      .where("savedAt", ">=", startTimestamp)
      .where("savedAt", "<=", endTimestamp)
      .orderBy("savedAt", "desc")
      .get()
      .then((querySnapshot) => {
        const results = [];
        console.log(querySnapshot.docs)
        querySnapshot.forEach((doc) => {
          const data = {...doc.data(), id: doc.id};
          results.push(data);
        });
        console.log("Query results: ", results);
        setCommercialList(results)
      })
      .catch((error) => {
        console.log("Error getting Firestore data: ", error);
        return [];
      });
  }



  const onCommercialClick = (id) => {
    router.push(`/${params.type}/commercial/${id}`)
  }

  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>
      <div className={styles.input_container}>
        <TextField
          label="시작일자"
          variant="standard"
          value={values.startDate}
          onChange={onValuesChange("startDate")}
          size="small"
          placeholder="2023.09.13"
        />
        <h1>~</h1>
        <TextField
          label="종료일자"
          variant="standard"
          value={values.endDate}
          onChange={onValuesChange("endDate")}
          size="small"
          placeholder="2023.09.13"
        />

        <FormControl sx={{ml:"15px"}}>
          <InputLabel id="simple-select-label">종류</InputLabel>
          <Select
            value={values.type}
            label="종류"
            onChange={onValuesChange("type")}
          >
            <MenuItem value="게재일자기준">게재일자 기준</MenuItem>
            <MenuItem value="연재종료일자기준">연재종료 일자 기준</MenuItem>
            <MenuItem value="저장된일자기준">저장된 일자 기준</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{ml:"15px"}}
          variant="contained"
          onClick={onSearchClick}
        >
          검색
        </Button>
      </div>


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