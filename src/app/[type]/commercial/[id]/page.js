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
  const {company, schedule, todayDate, locationTypes, commercialTypes} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [companyList, setCompanyList] = useState([])
  const [inputedCompany, setInputedCompany] = useState("")
  const [isImgLoading, setIsImgLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [prevContent, setPrevContent] = useState("")
  const [prevPhone, setPrevPhone] = useState("")

  const [companyValues, setCompanyValues] = useState({
    name:"",
    companyName:"",
    phoneNumber:"",
    memo:""
  })

  //열기, 닫기
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isConditionOpen, setIsConditionOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isPublishHistoryOpen, setIsPublishHistoryOpen] = useState(false)


  const [priceInput, setPriceInput] = useState("")
  const [priceInfoInput, setPriceInfoInput] = useState("")
  const [deleteNumInput, setDeleteNumInput] = useState("")
  //초기 저장 후 금액 입력가능(update를 사용하기때문)
  const [hasSaved, setHasSaved] = useState(false)

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
    remain:"",
    commercialType: "기술/생산직",
    locationType: "고잔1,2동",
    newsType: "줄",
    level: "일반 구인",
    info: [
      {title: '경력', content:''},
      {title: '연령', content:''},
      {title: '경력', content:''},
      {title: '모집직종', content:''},
      {title: '고용형태', content:''},
      {title: '모집인원', content:''},
      {title: '우대조건', content:''},
      {title: '근무지', content:''},
    ],
    condition: [
      {title: '급여', content:''},
      {title: '모집분야', content:''},
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
    type:"구인"
  })

  const onValuesChange = (prop) => (event) => {
    const jobTypes = ['기술/생산직','사무/경리','전문직','홍보','영업직','서비스직','운전직','배달직','현장직','아르바이트/기타구인','요리음식업','유흥서비스업']
    const houseTypes = ['아파트임대','아파트매매','빌라임대','빌라매매','주택매매','주택임대','상가매매','상가임대','공장매매','공장임대','창고매매','창고임대','기타매매','기타임대']
    const carTypes = ['현대','기아','르노코리아','쌍용','쉐보래(대우)','기타']

    setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
    if(prop==="commercialType"){
      if(jobTypes.includes(event.target.value))
        handleValues("type", "구인")
      else if(houseTypes.includes(event.target.value))
        handleValues("type", "부동산")
      else
        handleValues("type", "중고차")
    }
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
      const commercialData = await firebaseHooks.fetch_data(`type/${params.type}/commercials/${params.id}`)
      if(commercialData){
        setValues(commercialData)
        setCompanyValues(commercialData.companyValues)
        setPrevContent(commercialData.content)
        setPrevPhone(commercialData.contact[1].content)
      }
      else{
        alert("없는 광고입니다.")
        router.back()
      }
      // const companyData = await firebaseHooks.fetch_company_data_with_id(commercialData.companyId, params.type)
      // if(companyData){
      //   setCompanyValues(companyData)
      //   console.log(companyData)
      // }else{
      //   alert("없거나 삭제된 업체입니다. 업체를 다시 선택해주세요.")
      // }
      setIsLoading(false)
    }
    fetchData()
  },[])

  // useEffect(()=>{
  //   const fetchData = async () => {
  //     const data = await firebaseHooks.fetch_data(`type/${params.type}/company/${values.companyId}`)
      
  //     if(data)
  //       setCompanyValues(data)
  //     else
  //       alert("없는 광고주입니다.")

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
      const result = company[params.type].map((item) => {
        if(item.name.includes(INPUT) || item.companyName.includes(INPUT) || item.phoneNumber.includes(INPUT) )
          return(item)
      }).filter(Boolean)
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
    await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
      unpaid: unpaid,
      paidHistory: [...values.paidHistory, {createdAt: new Date(), value: priceInput, info: priceInfoInput, unpaid: unpaid}]
    })
    setPriceInput("")
    setPriceInfoInput("")
    alert("금액이 추가되었습니다.")
  }
  const onMinusClick = async () => {
    const unpaid = parseInt(values.unpaid)-parseInt(priceInput)
    if(unpaid<0){
      alert("미수금액은 마이너스가 될 수 없습니다.")
      return;
    }
    handleValues("paidHistory", [...values.paidHistory, {createdAt: new Date(), value: `-${priceInput}`, info: priceInfoInput, unpaid: unpaid}])
    handleValues("unpaid", unpaid)
    await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
      unpaid: unpaid,
      paidHistory: [...values.paidHistory, {createdAt: new Date(), value: priceInput, info: priceInfoInput, unpaid: unpaid}]
    })
    setPriceInput("")
    setPriceInfoInput("")
    alert("입금처리 되었습니다.")
  }


  //마감 횟수 차감
  const onDeleteNumClick = async() => {
    if(parseInt(values.remain)<parseInt(deleteNumInput)){
      alert("차감 횟수가 남은 마감횟수보다 큽니다.")
      return;
    }
    if(confirm("마감 횟수를 임의로 차감하시겠습니까?")){
      await firebaseHooks.delete_remain(params.type, params.id, values.remain, deleteNumInput)
      handleValues("remain", parseInt(values.remain)-parseInt(deleteNumInput))

      const newHistory = values.publishHistory
      newHistory.push(`${todayDate}일 에 잔여횟수 ${deleteNumInput}이 임의 차감되어 ${parseInt(values.remain)-parseInt(deleteNumInput)}회 남았습니다.`)
      await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
        publishHistory: newHistory,
      })
      
      
      
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
      }else if(schedule[params.type].length<=index+parseInt(values.remain)) {
        alert("등록된 회차가 너무 적습니다. 회차를 더 등록해주세요.")
        return "알수없음"
      }else{
        // console.log(index+values.remain)
        return schedule[params.type][index+parseInt(values.remain)]
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



  const handleEditorHistory = async (type) => {
    let editorInfo = ""
    if(values.content !== prevContent){
      editorInfo +="[내용수정] "
    }
    if(values.contact[1].content !== prevPhone){
      editorInfo += "[전번수정] "
    }

    let log = {
      title: values.title,
      content: values.content,
      phone: values.contact[1].content,
      newsType: values.newsType
    }
    if(type==="submit"){
      if(values.mode==="게재중"){
        if(editorInfo==="") return;
        log={
          ...log,
          info: editorInfo,
          text: "광고 수정"
        }
      }else return;
    } else if(type==='publish'){
      log={
        ...log,
        info: editorInfo,
        text: `광고 게재됨. (전 상태:${values.mode}  )`
      }
    } else if (type==="hold"){
      log={
        ...log,
        text: `광고 보류됨. (전 상태:${values.mode}  )`
      }
    } else if (type==="unpublish"){
      log={
        ...log,
        text:`광고 게재취소됨. (전 상태:${values.mode}  )`
      }
    }

    await db.collection(`${params.type}_history`).doc().set({
      ...log,
      createdAt: new Date(),
      commercialId: params.id,
      checked:false,
    })
  }



  //광고 저장
  const onSubmitClick= async() => {
    setIsSaving(true)


    const newHistory = values.publishHistory
    if(values.content !== prevContent){
      //내용이 바꼈다면 기록에 저장.
      newHistory.push(`${todayDate}일에 광고내용이 수정되었습니다. 전 광고 내용: ${prevContent}`)
    }
    await firebaseHooks.set_data(`type/${params.type}/commercials/${params.id}`, {
      ...values,
      publishHistory: newHistory,
      companyValues: companyValues,
      remain: parseInt(values.remain),
      savedAt: new Date()
    })
    await handleEditorHistory("submit")
    setIsSaving(false)
    setHasSaved(true)
  }


  //광고 게재
  const onPublishClick = async() => {
    if(values.title?.includes("-복사본")){
      if(!confirm("해당 광고의 제목에 '복사본' 이 있습니다. 그래도 게재하시겠습니까?"))
        return
    }
    if(values.remain<=0 || values.remain==="")
      alert("잔여 횟수를 입력해주세요.")
    else if(confirm("해당 광고를 게재하시겠습니까?")){
      const newHistory = values.publishHistory
      newHistory.push(`${todayDate}일 부터 잔여횟수 ${values.remain}회 게재시작되었습니다.`)
      await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
        ...values,
        companyValues: companyValues,
        remain: parseInt(values.remain),
        publishHistory: newHistory,
        mode: "게재중",
        publishedAt: new Date()
      })
      
      setValues({...values, publishHistory: newHistory, mode: "게재중"})
      await handleEditorHistory("publish")
      alert("성공적으로 게재되었습니다.")
    }
  }

  //광고 보류
  const onHoldClick = async () => {
    if(confirm("해당 광고를 보류하시겠습니까?")){
      const newHistory = values.publishHistory
      newHistory.push(`${todayDate}일 부터 보류되었습니다.`)
      await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
        ...values,
        companyValues: companyValues,
        remain: parseInt(values.remain),
        publishHistory: newHistory,
        mode: "보류중",
        holdAt: new Date()
      })
      setValues({...values, publishHistory: newHistory, mode: "보류중"})
      await handleEditorHistory("hold")
      alert("성공적으로 보류되었습니다.")
    }
  }

  //광고 게재중지
  const onUnpublishClick = async () => {
    if(confirm("해당 광고를 게재중지하시겠습니까?")){
      const newHistory = values.publishHistory
      newHistory.push(`${todayDate}일 부터 게재중지되었습니다.`)
      await db.collection("type").doc(params.type).collection("commercials").doc(params.id).update({
        ...values,
        companyValues: companyValues,
        remain: parseInt(values.remain),
        publishHistory: newHistory,
        mode: "게재중지",
        unpublishedAt: new Date()
      })
      setValues({...values, publishHistory: newHistory, mode: "게재중지"})
      await handleEditorHistory("unpublish")
      alert("성공적으로 게재중지되었습니다.")
    }
  }

  //광고 복사
  const onCopyClick = async () => {
    if(confirm("해당 광고를 복사하시겠습니까?")){
      const randomId = await firebaseHooks.get_random_id()
      await db.collection("type").doc(params.type).collection("commercials").doc(randomId).set({
        ...values,
        companyValues: companyValues,
        title: `${values.title}-복사본`,
        mode:"",
        savedAt: new Date(),
        paidHistory: [],
        publishHistory: [`${todayDate} 에 복사되었습니다.`],
        remain: "",
        unpaid:"0"
      })
      if(confirm("해당 광고의 복사본으로 이동하시겠습니까?"))
        router.push(`${params.type}/commercial/${randomId}`)
    }
  }


  const onDeleteClick = async () => {
    if(values.mode==='게재중'){
      alert("게재중이 광고는 삭제할수 없답니다? 게재중지 시키고 삭제하시지말입니다?")
      return
    }
    if(confirm("나를 진짜 삭제할꺼야? 흐규")){
      await db.collection("type").doc(params.type).collection("commercials").doc(params.id).delete()
      alert("삭제되었습니다.")
      router.back()
    }
  }



  if(isLoading)
    return <Loader />
  
  return(
    <div className={styles.main_container}>

      <h1 style={{fontWeight:"bold", fontSize:"20px"}}>상태: {values.mode}</h1>
           <Grid container spacing={3}>
        
        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="업체명"
            variant="standard"
            value={companyValues?.companyName}
            onChange={(e) => setCompanyValues(prev => ({...prev, companyName: e.target.value }))}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="광고주 명"
            variant="standard"
            value={companyValues?.name}
            onChange={(e) => setCompanyValues(prev => ({...prev, companyName: e.target.value }))}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={4} width="100%">
          <TextField
            label="업체 전화번호"
            variant="standard"
            value={companyValues?.phoneNumber}
            onChange={(e) => setCompanyValues(prev => ({...prev, phoneNumber: e.target.value }))}
            size="small"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} width="100%">
          <TextField
            label="업체 메모"
            variant="standard"
            value={companyValues?.memo}
            onChange={(e) => setCompanyValues(prev => ({...prev, memo: e.target.value }))}
            size="small"
            fullWidth
            multiline
            maxRows={3}
          />
        </Grid>

      </Grid>

      <p style={{marginTop:"30px", fontSize:"17px", fontWeight:"bold"}}>업체 로고</p>
        {values.companyValues?.logoUrl &&
          <div style={{maxWidth:"100px", height:"100px", position:"relative"}}>
            <Image
              src={values.companyValues?.logoUrl}
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
                <MenuItem value={"강조줄"}>강조줄</MenuItem>
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
                <MenuItem value={"일반 구인"}>{`일반 구인 (줄)`}</MenuItem>
                <MenuItem value={"일반+ 구인"}>{`일반+ 구인 (찬스)`}</MenuItem>
                <MenuItem value={"스페셜 구인"}>{`스페셜 구인 (박스 1*5)`}</MenuItem>
                <MenuItem value={"스페셜+ 구인"}>{`스페셜+ 구인 (박스 2*5이상)`}</MenuItem>
                <MenuItem value={"프리미엄 구인"}>{`프리미엄 구인 (1면,빽면)`}</MenuItem>
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
        <Grid item xs={12} sm={12}>
          <h1
          style={{fontWeight:"bold", fontSize:"18px", cursor:"pointer"}}
          onClick={()=>setIsPublishHistoryOpen(!isPublishHistoryOpen)}>
              {isPublishHistoryOpen ? "게재 기록 v" : "게재 기록 ^"}
          </h1>
          {isPublishHistoryOpen && 
            <ul >
              {values.publishHistory.map((item, index) => (
                <li key={index} style={{padding: '5px 0', borderBottom:"1px solid rgb(200,200,200)"}}>
                  {item}
                </li>
              ))}
            </ul>
          }
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
          <DropperImage imgUrl={values.commercialUrl} setImgURL={(url)=>handleValues("commercialUrl", url)} path={`${params.type}/commercial/${params.id}`} setIsLoading={setIsImgLoading}/>

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
          >
            횟수 차감
          </Button>
        </div>
      </div>

        {/* 메인내용 */}
        <Grid item xs={12}>
          <h1 style={{fontSize:"18px", fontWeight:"bold", marginTop:"10px"}}>메인내용</h1>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            label={values.type==="구인" ? "급여" : values.type==="중고차" ? "매매가":"매매/임대가"}
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
            label={values.type==="구인" ? "모집분야" : values.type==="중고차" ? "연식":"유형"}
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
            label={values.type==="구인" ? "시간" : values.type==="중고차" ? "차종":"지역"}
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
            label={values.type==="구인" ? "지역" : values.type==="중고차" ? "주행거리":"기타"}
            fullWidth
            variant="standard"
            value={values.location}
            onChange={onValuesChange("location")}
            // multiline={false} rows={1} maxRows={1}
            size="small"
          />
        </Grid>
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
            onClick={onPublishClick}
            color="success"
            disabled={isSaving||values.mode==="게재중"}
            sx={{ml:"20px"}}
          >
            광고 게재
          </Button>
          <Button
            variant="contained"
            onClick={onHoldClick}
            disabled={isSaving||values.mode==="보류중"}
            sx={{ml:"20px"}}
            color="secondary"
          >
            광고 보류
          </Button>
          <Button
            variant="contained"
            onClick={onUnpublishClick}
            disabled={isSaving||values.mode==="게재중지"}
            color="error"
            sx={{ml:"20px"}}
          >
            게재중지
          </Button>

          <Button
            variant="contained"
            onClick={onCopyClick}
            disabled={isSaving}
            color="info"
            sx={{ml:"20px"}}
          >
            해당 광고 복사
          </Button>

          <Button
            variant="contained"
            onClick={onDeleteClick}
            disabled={isSaving}
            color="error"
            sx={{ml:"20px"}}
          >
            광고 삭제
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