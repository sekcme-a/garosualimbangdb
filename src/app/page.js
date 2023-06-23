"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "src/public/styles/Home.module.css"
import Loader from "src/public/components/Loader"
import { firestore as db } from "firebase/firebase"
import { Button,Dialog, TextField } from "@mui/material"

import _, { filter } from "lodash";

import DropperImage from "src/public/components/DropperImage"
import Image from "next/image"

const Home = () => {
  const {user, userData, type, company, setCompany} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [YYYYMMDDHHMMSS, setYYYYMMDDHHMMSS] = useState("")
  const onDialogClose = () => {setIsDialogOpen(false); setSelectedIndex("")}
  const [filteredCompany, setFilteredCompany] = useState([])
  const [searchInput, setSearchInput] = useState("")
  
  const [selectedIndex, setSelectedIndex] = useState("")

  //*****for inputs
  const [values, setValues] = useState({
    name: "",
    logoUrl:"",
    phone: ""
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
      if(user===null)
        router.push("/login")
      setYYYYMMDDHHMMSS(getCurrentDateTime())
      console.log(company)
      setFilteredCompany(company[type])
      console.log(company[type])
      setIsLoading(false)
    }
    fetchData()
  },[user, type])

  useEffect(()=>{
    const filteredData = company[type]?.map(data=>{
      if(data.name.includes(searchInput) || data.phone.includes(searchInput))
        return data
    }).filter(Boolean)
    setFilteredCompany(filteredData)
  },[searchInput, company])


  //reload company
  const reloadCompany = async() => {
    const companyData = await firebaseHooks.fetch_company_data()
    setCompany(companyData)
  }


  //output: YYYYMMDDHHMMSS
  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  

  const onNewButtonClick = async() => {
    if(values.name!=="" && values.phone!==""){
      await firebaseHooks.set_data(`type/${type}/company`, {
        ...values,
        createdAt: new Date()
      })
      setValues({
        name: "",
        logoUrl:"",
        phone: ""
      })
      setYYYYMMDDHHMMSS(getCurrentDateTime())
      reloadCompany()
      setIsDialogOpen(false)
      alert("성공적으로 추가되었습니다.")
      
    }else
      alert("모든 빈칸을 채워주세요.")
  }

  const onEditButtonClick = async () => {
    if(values.name!=="" && values.phone!==""){
      await firebaseHooks.set_data(`type/${type}/company/${company[type][selectedIndex].id}`, {
        ...values,
        createdAt: new Date()
      })
      setYYYYMMDDHHMMSS(getCurrentDateTime())
      reloadCompany()
      alert("성공적으로 변경되었습니다.")
    }else
      alert("모든 빈칸을 채워주세요.")
  }

  const onDeleteButtonClick = async () => {
    if(confirm("정말로 삭제하시겠습니까?")){
      if(company[type][selectedIndex].logoUrl!=="")
        await firebaseHooks.delete_image_with_url_from_storage(company[type][selectedIndex].logoUrl)
      await firebaseHooks.delete_data(`type/${type}/company/${company[type][selectedIndex].id}`)
      setValues({
        name: "",
        logoUrl:"",
        phone: ""
      })
      setYYYYMMDDHHMMSS(getCurrentDateTime())
      reloadCompany()
      setSelectedIndex("")
      setIsDialogOpen(false)  
      alert("성공적으로 삭제되었습니다.")
    }
  }

  const onOpenButtonClick = () => {
    router.push(`/company/${company[type][selectedIndex].id}`)
  }

  // const renderCompanyDocs = () => {
  //   const docs = company[type];
  
  //   return Object.entries(docs).map(([docId, docData]) => (
  //     <div key={docId}>
  //       {docData.name}
  //       {docData.phone}
  //     </div>
  //   ));
  // };

  const onItemClick = (index) => {
    setValues({
      ...company[type][index]
    })
    setSelectedIndex(index)
    setIsDialogOpen(true)
  }

  if(isLoading)
    return <Loader />
  
  if(false)
  return(
    <>
      <div className={styles.main_container}>
        <div className={styles.buttons_container}>
          <Button
            variant="contained"
            onClick={()=>{setIsDialogOpen(true); setValues({name:"", logoUrl:"", phone:""});}}
          >
            새 업체 등록
          </Button>
        </div>

        <TextField
          sx={{mt:"20px"}}
          label="검색 내용"
          variant="standard"
          value={searchInput}
          onChange={(e)=>setSearchInput(e.target.value)}
          // multiline={false} rows={1} maxRows={1}
          size="small"
        />
        {/* <>{renderCompanyDocs()}</> */}
        <ul className={styles.list_container}>
          {filteredCompany?.map((item, index) => (
            <li key={item.id} onClick={()=>onItemClick(index)}>
              <h1>{item.name}</h1>
              <h2>{item.phone}</h2>
            </li>
          ))}
        </ul>

        <Dialog
          onClose={onDialogClose}
          open={isDialogOpen}
        >
          <div className={styles.dialog_container}>
            {selectedIndex==="" ? 
              <h1>새 업체 등록</h1>
            :
              <h1>{company[type][selectedIndex]?.name} | Tel.{company[type][selectedIndex]?.phone}</h1>
            }
            <TextField
              label="업체명"
              variant="standard"
              value={values.name}
              onChange={onValuesChange("name")}
              size="small"
              fullWidth
              sx={{mt:"10px"}}
            />

            <p>업체 로고</p>
            {values.logoUrl &&
              <div style={{minWidth:"100px", height:"100px", position:"relative"}}>
                <Image
                  src={values.logoUrl}
                  alt="로고"
                  style={{ objectFit: 'contain' }}
                  fill
                />
              </div>
            }
            <DropperImage imgUrl={values.logoUrl} setImgURL={(url)=>handleValues("logoUrl", url)} path={`${type}/logo/${YYYYMMDDHHMMSS}`}/>

            <TextField
              label="업체 전화번호"
              variant="standard"
              value={values.phone}
              onChange={onValuesChange("phone")}
              size="small"
              fullWidth
              sx={{mt:"10px"}}
            />
            <Button
              variant="contained"
              onClick={onNewButtonClick}
              size="small"
              sx={{mt:'15px'}}
              fullWidth
              disabled={selectedIndex!==""}
            >
              신규등록
            </Button>
            <Button
              variant="contained"
              onClick={onOpenButtonClick}
              size="small"
              sx={{mt:'5px', bgcolor:"rgb(0,10,0)",
                '&:hover': {
                  backgroundColor: 'rgb(0, 40, 0)',
                },
              }}
              fullWidth
              disabled={selectedIndex===""}
            >
              광고보기
            </Button>
            <Button
              variant="contained"
              onClick={onEditButtonClick}
              size="small"
              sx={{mt:'5px'}}
              fullWidth
              disabled={selectedIndex===""}
            >
              변경
            </Button>
            <Button
              variant="contained"
              onClick={onDeleteButtonClick}
              size="small"
              sx={{mt:'5px', bgcolor:"rgb(210,0,0)",
                '&:hover': {
                  backgroundColor: 'rgb(170, 0, 0)',
                },
              }}
              fullWidth
              disabled={selectedIndex===""}
            >
              삭제
            </Button>
          </div>
        </Dialog>
      </div>
    </>
  )
}

export default Home
