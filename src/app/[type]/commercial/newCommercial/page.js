"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "../styles/newCommercial.module.css"
import Loader from "src/public/components/Loader"

import { Grid, TextField,Button, FormControl, InputLabel, Select, MenuItem, Dialog, CircularProgress } from "@mui/material"


import { getTime } from "src/public/utils/getTime"
import { DockBottom } from "mdi-material-ui"
import Image from "next/image"
import DropperImage from "src/public/components/DropperImage"
import { firestore as db } from "firebase/firebase"

const Page = ({params}) => {
  const {company, schedule, todayDate, locationTypes, commercialTypes, reloadCommercialData} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [inputedCompany, setInputedCompany] = useState("")
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [commercialId, setCommercialId] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  //열기, 닫기
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isConditionOpen, setIsConditionOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)


  const [priceInput, setPriceInput] = useState("")
  const [priceInfoInput, setPriceInfoInput] = useState("")
  const [deleteNumInput, setDeleteNumInput] = useState("")
  //초기 저장 후 금액 입력가능(update를 사용하기때문)
  const [hasSaved, setHasSaved] = useState(false)

  const [mode, setMode] = useState("job")


  const [companyValues, setCompanyValues] = useState({
    name:"",
    companyName:"",
    phoneNumber:"",
    memo:""
  })
  //*****for inputs
  const [values, setValues] = useState({
    companyValues: {
      name:"",
      companyName:"",
      phoneNumber:"",
      memo:""
    },
    schedule: "",
    paidHistory: [],
    publishHistory: [],
    unpaid:0,
    remain:0,
    info: [
      {title: '경력', content:'경력무관'},
      {title: '연령', content:'무관'},
      {title: '경력', content:'무관'},
      {title: '모집직종', content:''},
      {title: '고용형태', content:''},
      {title: '모집인원', content:''},
      {title: '우대조건', content:''},
      {title: '근무지', content:''},
    ],
    condition: [
      {title: '급여', content:''},
      {title: '근무요일', content:''},
      {title: '근무시간', content:''},
    ],
    contact: [
      {title: '담당자', content:''},
      {title: '연락처', content:''},
      {title: 'FAX', content:''},
      {title: '홈페이지', content:''},
      {title: '접수방법', content:''},
    ],
    imgUrl:"",
    commercialType: "생산/기술",
    locationType: "안산1",
    newsType: "줄",
    level: "일반 구인",
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
      const tempId = await firebaseHooks.get_random_id()
      setCommercialId(tempId)
      setIsLoading(false)
    }
    fetchData()
  },[])

  useEffect(()=>{

    if(values.commercialType==="자동차"){
      setMode("car")
    } else{
      setMode("job")
    }
  },[values])

  // useEffect(()=>{
  //   const fetchData = async () => {
  //     const data = await firebaseHooks.fetch_data(`type/${params.type}/company/${values.companyId}`)
  //     if(data)
  //       setCompanyValues(data)
  //     else
  //       alert("없는 업체입니다.")
  //   }
  //   if(values.companyId)
  //     fetchData()
  // },[values.companyId])


  const onSelectCompanyClick = () => {
    setIsDialogOpen(true)
  }

  const handleKeyDown = (event) => {
    if(event.key==="Enter")
      onSearchClick()
  }

  const onSearchClick = () => {
    if(values.company !== "") {
      const INPUT = inputedCompany
      console.log(company.garosu)
      const result = company[params.type].map((item) => {
        if(item.name.includes(INPUT) || item.companyName.includes(INPUT) || item.phoneNumber.includes(INPUT) )
          return(item)
      }).filter(Boolean)
      console.log(result)
      setCompanyList(result)

    }
  }
  const onCompanyClick =async (id) => {
    const data = await firebaseHooks.fetch_data(`type/${params.type}/company/${id}`)
    if(data){
      setValues({...values, companyId: id, companyValues: {...data}})
      setCompanyValues({...data})
    }
    else
      alert("없는 업체입니다.")
    setIsDialogOpen(false)
  }


  const onPlusClick = async() => {
    const unpaid = parseInt(values.unpaid)+parseInt(priceInput)
    console.log(values.unpaid)
    console.log(unpaid)
    handleValues("paidHistory", [...values.paidHistory, {createdAt: new Date(), value: `+${priceInput}`, info: priceInfoInput, unpaid: unpaid}])
    handleValues("unpaid", unpaid)
    await db.collection("/type").doc(type).collection("commercials").doc(commercialId).update({
      unpaid: unpaid,
      paidHistory: [...values.paidHistory, {createdAt: new Date(), value: priceInput, info: priceInfoInput, unpaid: unpaid}]
    })
    setPriceInput("")
    setPriceInfoInput("")
    alert("금액이 추가되었습니다.")
  }
  const onMinusClick = async () => {
    const unpaid = parseInt(values.unpaid)-parseInt(priceInput)
    console.log(values.unpaid)
    console.log(unpaid)
    handleValues("paidHistory", [...values.paidHistory, {createdAt: new Date(), value: `-${priceInput}`, info: priceInfoInput, unpaid: unpaid}])
    handleValues("unpaid", unpaid)
    await db.collection("/type").doc(type).collection("commercials").doc(commercialId).update({
      unpaid: unpaid,
      paidHistory: [...values.paidHistory, {createdAt: new Date(), value: priceInput, info: priceInfoInput, unpaid: unpaid}]
    })
    setPriceInput("")
    setPriceInfoInput("")
    alert("입금처리 되었습니다.")
  }


  //마감 횟수 차감
  const onDeleteNumClick = async() => {
    if(values.remain<deleteNumInput){
      alert("차감 횟수가 남은 마감횟수보다 큽니다.")
      return;
    }
    if(confirm("마감 횟수를 임의로 차감하시겠습니까?")){
      await firebaseHooks.delete_remain(type, commercialId, values.remain, deleteNumInput)
      handleValues("remain", parseInt(values.remain)-parseInt(deleteNumInput))
      setDeleteNumInput("")
      alert("연재 횟수가 차감되었습니다.")
    }
  }

  //게재 종료일 구하기
  const getEndDate = () => {
    if(values.remain && todayDate && schedule){
      const index = findIndex(todayDate)
      if(index===-1){
        alert("오늘 날짜를 찾을 수 없습니다.")
        return "알수없음"
      }else if(schedule[params.type].length<=index+values.remain) {
        alert("등록된 회차가 너무 적습니다. 회차를 더 등록해주세요.")
        return "알수없음"
      }else{
        // console.log(index+values.remain)
        return schedule[params.type][parseInt(index+values.remain)]
      }
    }
  }


  function findIndex(value) {
    for (let i = 0; i < schedule[params.type]?.length; i++) {
      if (schedule[params.type][i] === value) {
        return i; // Adding 1 to the index to get the result as 1-based instead of 0-based
      }
    }
    return -1; // Return -1 if the value is not found in the array
  }



  //광고 저장
  const onSubmitClick= async() => {
    setIsSaving(true)
    await firebaseHooks.set_data(`type/${params.type}/commercials/${commercialId}`, {
      ...values,
      savedAt: new Date()
    })
    await reloadCommercialData()
    setIsSaving(false)
    setHasSaved(true)
    alert("성공적으로 저장되었습니다.")
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
            value={companyValues.companyName}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="광고주 명"
            variant="standard"
            value={companyValues.name}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="업체 전화번호"
            variant="standard"
            value={companyValues.phoneNumber}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} width="100%">
          <TextField
            label="업체 메모"
            variant="standard"
            value={companyValues.memo}
            size="small"
            fullWidth
            multiline
            maxRows={3}
          />
        </Grid>

      </Grid>

      <p style={{marginTop:"30px", fontSize:"17px", fontWeight:"bold"}}>업체 로고</p>
        {values.companyValues.logoUrl &&
          <div style={{maxWidth:"100px", height:"100px", position:"relative"}}>
            <Image
              src={values.companyValues.logoUrl}
              alt="로고"
              style={{ objectFit: 'contain' }}
              fill
            />
          </div>
        }
      
      <Button
        variant="contained"
        onClick={onSelectCompanyClick}
        sx={{mt:"10px"}}
      >
        광고주 선택
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={3} >
          <FormControl sx={{mt:"12px", mr:"15px", minWidth:"170px"}} fullWidth>
            <InputLabel id="simple-select-label">광고 분류</InputLabel>
            <Select
              value={values.commercialType}
              label="광고 분류"
              onChange={onValuesChange("commercialType")}
            >
              {commercialTypes[params.type]?.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>


        <Grid item xs={12} sm={3} >
          <FormControl sx={{mt:"12px", mr:"15px", minWidth:"170px"}} fullWidth>
            <InputLabel id="simple-select-label">지역 분류</InputLabel>
            <Select
              value={values.locationType}
              label="광고 분류"
              onChange={onValuesChange("locationType")}
            >
              {locationTypes[params.type]?.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>


        <Grid item xs={12} sm={3}>

          <FormControl sx={{mt:"12px", mr:"15px", minWidth:"170px"}} fullWidth>
            <InputLabel id="simple-select-label">신문용 광고 종류</InputLabel>
            <Select
              value={values.newsType}
              label="신문용 광고 종료"
              onChange={onValuesChange("newsType")}
            >
                <MenuItem value={"줄"}>줄</MenuItem>
                <MenuItem value={"찬스"}>찬스</MenuItem>
                <MenuItem value={"박스"}>박스</MenuItem>
                <MenuItem value={"박스+줄"}>박스+줄</MenuItem>
                <MenuItem value={"줄사이광고"}>줄사이광고</MenuItem>
            </Select>
          </FormControl>
        </Grid>


        <Grid item xs={12} sm={3}>
          <FormControl sx={{mt:"12px", mr:"15px", minWidth:"170px"}} fullWidth>
            <InputLabel id="simple-select-label">웹사이트 광고 등급</InputLabel>
            <Select
              value={values.level}
              label="웹사이트 광고 등급"
              onChange={onValuesChange("level")}
            >
                <MenuItem value={"일반 구인"}>일반 구인</MenuItem>
                <MenuItem value={"스페셜 구인"}>스페셜 구인</MenuItem>
                <MenuItem value={"프리미엄 구인"}>프리미엄 구인</MenuItem>
                <MenuItem value={"프리미엄+ 구인"}>프리미엄+ 구인</MenuItem>
                <MenuItem value={"긴급 구인"}>긴급 구인</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="제목"
            fullWidth
            variant="standard"
            value={values.title}
            onChange={onValuesChange("title")}
            // multiline={false} rows={1} maxRows={1}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="광고내용"
            fullWidth
            variant="standard"
            value={values.content}
            onChange={onValuesChange("content")}
            multiline
            rows={5}
            maxRows={5}
            // multiline={false} rows={1} maxRows={1}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="광고 메모"
            fullWidth
            variant="standard"
            value={values.memo}
            onChange={onValuesChange("memo")}
            multiline
            rows={1}
            maxRows={5}
            // multiline={false} rows={1} maxRows={1}
            size="small"
          />
        </Grid>


        <div className={styles.img_container}>
          <h1>광고 이미지</h1>
          {isImgLoading && <CircularProgress />}
          {values.commercialUrl &&
          <a href={values.commercialUrl} download={values.title} target="_blank">
            <div style={{maxWidth:"100px", height:"100px", position:"relative"}} >
              <Image
                src={values.commercialUrl}
                alt="로고"
                style={{ objectFit: 'contain' }}
                fill
              />
            </div>
            </a>
          }
          <DropperImage imgUrl={values.commercialUrl} setImgURL={(url)=>handleValues("commercialUrl", url)} path={`${params.type}/commercial/${commercialId}`} setIsLoading={setIsImgLoading}/>

        </div>


      {/* 금액 */}
      <div className={styles.company_container1}>
        <h1>금액</h1>
        <div>
          <div className={styles.bank_container}>
            <li>
              <h6 style={{width:"100px", textAlign:"center", borderRight:"2px solid black"}}>변동액</h6>
              <h6 style={{width:"200px", textAlign:"center", borderRight:"2px solid black"}}>내용</h6>
              <h6 style={{width:"100px", textAlign:"center"}}>미수금액</h6>
            </li>
            {values.paidHistory.map((item, index) => {
              return(
                <li key={index}>
                  <h6 style={{width:"100px", textAlign:"center"}}>{item.value}</h6>
                  <h6 style={{width:"200px", textAlign:"center",}}>{item.info}</h6>
                  <h6 style={{width:"100px", textAlign:"right", fontWeight:"bold"}}>{item.unpaid}</h6>
                </li>
              )
            })}
          </div>
        </div>
        <div style={{marginLeft:"10px"}}>
          <TextField
            label="금액"
            variant="standard"
            value={priceInput}
            onChange={(e)=>{
              if(!isNaN(e.target.value))
                setPriceInput(e.target.value)
              else
                alert("숫자만 입력가능혀")
            }}
            size="small"
            sx={{mr:"10px"}}
          />
          <TextField
            label="설명"
            variant="standard"
            value={priceInfoInput}
            onChange={(e)=>setPriceInfoInput(e.target.value)}
            sx={{mr:"10px", width:"250px", mb:"10px"}}
            size="small"
          />
          <Button
            variant="contained"
            onClick={onPlusClick}
            sx={{
              mr:"10px",
              bgcolor:"rgb(0,180,0)",
              '&:hover':{
                bgcolor:"rgb(0,140,0)"
              }
            }}
            disabled={!hasSaved}
          >
            금액 더하기+
          </Button>
          <Button
            variant="contained"
            onClick={onMinusClick}
            sx={{
              bgcolor:"rgb(222,0,0)",
              '&:hover':{
                bgcolor:"rgb(170,0,0)"
              }
            }}
            disabled={!hasSaved}
          >
            {`금액 빼기(입금됨) -`}
          </Button>
        </div>
      </div>



      {/* 연재정보 */}
      <div className={styles.company_container}>
        <h1>연재정보</h1>
        <TextField
          label="잔여 횟수"
          variant="standard"
          error={error.type==="remain"}
          helperText={error.type==="remain" && error.message}
          value={values.remain}
          onChange={(e)=>{handleValues("remain", e.target.value)}}
          size="small"
          sx={{mr:"15px"}}
        />
        <p style={{minWidth:"150px"}}>게재종료일: {getEndDate()}</p>
        <div className={styles.input_container}>
          <TextField
            label="차감할 횟수"
            variant="standard"
            value={deleteNumInput}
            onChange={(e)=>setDeleteNumInput(e.target.value)}
            size="small"
            sx={{mb:"10px"}}
          />
          <Button
            variant="contained"
            onClick={onDeleteNumClick}
            size="small"
            sx={{mr:"5px"}}
            disabled={!hasSaved}
          >
            횟수 차감
          </Button>
        </div>
      </div>

        {/* 메인내용 */}
        <Grid item xs={12}>
          <h1 style={{fontSize:"18px", fontWeight:"bold", marginTop:"10px"}}>메인내용</h1>
        </Grid>
        {mode==="job" ? 
          <>
            <Grid item xs={12} sm={3}>
              <TextField
                label="급여"
                fullWidth
                variant="standard"
                value={values.salary}
                onChange={onValuesChange("salary")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="요일"
                fullWidth
                variant="standard"
                value={values.date}
                onChange={onValuesChange("date")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="시간"
                fullWidth
                variant="standard"
                value={values.time}
                onChange={onValuesChange("time")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="지역"
                fullWidth
                variant="standard"
                value={values.location}
                onChange={onValuesChange("location")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
          </>
          : mode==="car" ? 
          <>
            <Grid item xs={12} sm={3}>
              <TextField
                label="연식"
                fullWidth
                variant="standard"
                value={values.salary}
                onChange={onValuesChange("salary")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="주행거리"
                fullWidth
                variant="standard"
                value={values.date}
                onChange={onValuesChange("date")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="차종"
                fullWidth
                variant="standard"
                value={values.time}
                onChange={onValuesChange("time")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="매매가"
                fullWidth
                variant="standard"
                value={values.location}
                onChange={onValuesChange("location")}
                // multiline={false} rows={1} maxRows={1}
                size="small"
              />
            </Grid>
          </>
          : 
          <>
          </>
        }
      </Grid>


      <Grid container spacing={3} sx={{mt:"10px"}}>
        <Grid item xs={12}>
          <h1 style={{fontSize:"18px", fontWeight:"bold", marginTop:"10px", cursor:"pointer"}} onClick={()=>setIsInfoOpen(!isInfoOpen)}>{isInfoOpen ? "모집내용 v":"모집내용 ^"}</h1>
        </Grid>
        {
          isInfoOpen && values.info.map((item, index)=>{
            return(
              <>
                <Grid item xs={4} sm={4} key={index}>
                  <TextField
                    label="제목"
                    fullWidth
                    variant="standard"
                    value={item.title}
                    onChange={(e)=>{
                      let temp = values.info
                      temp[index].title=e.target.value
                      setValues({...values, info: temp })
                    }}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label="내용"
                    fullWidth
                    variant="standard"
                    value={item.content}
                    onChange={(e)=>{
                      let temp = values.info
                      temp[index].content=e.target.value
                      setValues({...values, info: temp })
                    }}
                    multiline
                    maxRows={4}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
              </>
            )
          })
        }
        {isInfoOpen &&  
          <Button
            variant="contained"
            onClick={()=>{
              let temp = values.info
              temp.push({title:"", content:""})
              setValues({...values, info: temp})
            }}
            sx={{mt:"15px", ml:"30px"}}
          > 
            추가 +
          </Button>
        }
      </Grid>



      <Grid container spacing={3} sx={{mt:"10px"}}>
        <Grid item xs={12}>
          <h1 style={{fontSize:"18px", fontWeight:"bold", marginTop:"10px", cursor:"pointer"}} onClick={()=>setIsConditionOpen(!isConditionOpen)}>{isConditionOpen ? "근무조건 v":"근무조건 ^"}</h1>
        </Grid>
        {
          isConditionOpen && values.condition.map((item, index)=>{
            return(
              <>
                <Grid item xs={4} sm={4} key={index}>
                  <TextField
                    label="제목"
                    fullWidth
                    variant="standard"
                    value={item.title}
                    onChange={(e)=>{
                      let temp = values.condition
                      temp[index].title=e.target.value
                      setValues({...values, condition: temp })
                    }}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label="내용"
                    fullWidth
                    variant="standard"
                    value={item.content}
                    onChange={(e)=>{
                      let temp = values.condition
                      temp[index].content=e.target.value
                      setValues({...values, condition: temp })
                    }}
                    multiline
                    maxRows={4}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
              </>
            )
          })
        }
        {isConditionOpen && 
          <Button
            variant="contained"
            onClick={()=>{
              let temp = values.condition
              temp.push({title:"", content:""})
              setValues({...values, condition: temp})
            }}
            sx={{mt:"15px", ml:"30px"}}
          > 
            추가 +
          </Button>
        }
      </Grid>



      <Grid container spacing={3} sx={{mt:"10px"}}>
        <Grid item xs={12}>
          <h1 style={{fontSize:"18px", fontWeight:"bold", marginTop:"10px", cursor:"pointer"}} onClick={()=>setIsContactOpen(!isContactOpen)}>{isContactOpen ? "담당자 정보 및 접수방법 v":"담당자 정보 및 접수방법 ^"}</h1>
        </Grid>
        {
          isContactOpen && values.contact.map((item, index)=>{
            return(
              <>
                <Grid item xs={4} sm={4} key={index}>
                  <TextField
                    label="제목"
                    fullWidth
                    variant="standard"
                    value={item.title}
                    onChange={(e)=>{
                      let temp = values.contact
                      temp[index].title=e.target.value
                      setValues({...values, contact: temp })
                    }}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    label="내용"
                    fullWidth
                    variant="standard"
                    value={item.content}
                    onChange={(e)=>{
                      let temp = values.contact
                      temp[index].content=e.target.value
                      setValues({...values, contact: temp })
                    }}
                    multiline
                    maxRows={4}
                    // multiline={false} rows={1} maxRows={1}
                    size="small"
                  />
                </Grid>
              </>
            )
          })
        }
        {isContactOpen && 
          <Button
            variant="contained"
            onClick={()=>{
              let temp = values.contact
              temp.push({title:"", content:""})
              setValues({...values, contact: temp})
            }}
            sx={{mt:"15px", ml:"30px"}}
          > 
            추가 +
          </Button>
        }
        <Grid item  xs={12}>
          <Button
            variant="contained"
            onClick={onSubmitClick}
            disabled={isSaving}
          >
            광고 저장
          </Button>
          <Button
            variant="contained"
            onClick={()=>router.push(`${params.type}/commercial/${commercialId}`)}
            disabled={!hasSaved}
            sx={{ml:"20px"}}
          >
            해당 광고로 이동
          </Button>
        </Grid>
      </Grid>




      <Dialog
        onClose={()=>setIsDialogOpen(false)}
        open={isDialogOpen}
      >
        <div className={styles.dialog_container}>
          <TextField
            label="검색"
            variant="standard"
            value={inputedCompany}
            onChange={(e)=>setInputedCompany(e.target.value)}
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
        </div>
      </Dialog>

    </div>
  )
}

export default Page