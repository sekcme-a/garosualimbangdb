'use client'
import { Button, Grid, TextField } from "@mui/material";
import { firestore as db, storage } from "firebase/firebase"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

import DropperImage from "src/public/components/DropperImage"

import { v4 as uuidv4 } from 'uuid';

const Banner = ({params}) => {
  const router = useRouter()

  const[ banners, setBanners ] = useState([])

  const [newImg, setNewImg] = useState("")
  const [newUrl, setNewUrl] = useState("")

  const [isImageLoading, setIsImageLoading] = useState(false)

  const [randomId, setRandomId] = useState("")

  useEffect(()=> {

    const fetchData = async () => {
      setRandomId(uuidv4())
      const snapShot = await db.collection("type").doc(params.type).collection("banners").orderBy("savedAt", "desc").get()

      if(!snapShot.empty){
        const list = snapShot.docs.map(doc => ({...doc.data(), id: doc.id}))

        setBanners(list)
      }




    }

    fetchData()
  },[])


  const onNewSubmitClick = async () => {
    if(newImg==="")alert("이미지도 업로드 안하고 무슨 저장을 하겠냐는 것이느냐")
    if(confirm("현서님을 숭배하십니까?")){
      await db.collection("type").doc(params.type).collection("banners").doc(randomId).set({
        url: newUrl,
        imgUrl: newImg,
        savedAt: new Date()
      })
      alert("적용되었노라.")
      setNewImg("")
      setNewUrl("")
      router.refresh()
      location.reload()
      
    }else alert("그럼 배너 적용 안해줌.")
  } 
  const onSaveClick = async (index) => {
    await db.collection("type").doc(params.type).collection("banners").doc(banners[index].id).set({
      url: banners[index].url,
      imgUrl: banners[index].imgUrl,
      savedAt: new Date()
    })  
    alert("적용되었노라.")
  }
  const onDeleteClick = async (index) => {
    await db.collection("type").doc(params.type).collection("banners").doc(banners[index].id).delete()
    let list = banners
    list.splice(index, 1)
    setBanners([...list])
    alert("적용되었노라.")
  }

  const onImgChange = (url, index) => {
    let list = banners
    list[index] = {...list[index], imgUrl: url}
    setBanners([...list])
  }
  const onUrlChange = (val, index) => {
    let list = banners
    list[index] = {...list[index], url: val}
    setBanners([...list])
  }


  return(
    <>
      {/* <DropperImage imgUrl={values.logoUrl} setImgURL={(url)=>handleValues("logoUrl", url)} path={`${params.type}/logo/${companyId}`} setIsLoading={setIsImgLoading}/> */}
      <Grid container spacing={1}>
        {
          banners.map((item, index) => (

            <Grid item xs={12} key={index}>
              <Image
              width={300}height={300} style={{objectFit:"contain"}} src={item.imgUrl} alt="asdf"/>
              {isImageLoading && <p>이미지 업로드중...</p>}
            <DropperImage imgUrl={item.imgUrl} setImgURL={(url) => onImgChange(url, index)} path={`${params.type}/banners/${item.id}`} setIsLoading={setIsImageLoading} />
  
            <TextField
              label="클릭시 이동할 주소 (https://포함해서 입력"
              value={item.url}
              onChange={(e) => onUrlChange(e.target.value, index)}
              fullWidth
              sx={{mt: 2}}
            />
            <Button
              variant="contained"
              color="error"
              onClick={()=>onDeleteClick(index)}
            >삭제</Button>
            <Button
              variant="contained"
              onClick={()=>onSaveClick(index)}
            >저장</Button>
          </Grid>
          ))
        }


        <Grid item xs={12}>
        <Image
              width={300}height={300} style={{objectFit:"contain"}} src={newImg} alt="asdf"/>
              {isImageLoading && <p>이미지 업로드중...</p>}
        {isImageLoading && <p>이미지 업로드중...</p>}

          <DropperImage imgUrl={newImg} setImgURL={(url) => setNewImg(url)} path={`${params.type}/banners/${randomId}`} setIsLoading={setIsImageLoading} />

          <TextField
            label="클릭시 이동할 주소 (https://포함해서 입력"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            fullWidth
            sx={{mt: 2}}
          />
                <Button
        variant="contained"
        onClick={onNewSubmitClick}
        fullWidth
      >신규 추가</Button>
        </Grid>
      </Grid>


      
    </>
  )
}

export default Banner