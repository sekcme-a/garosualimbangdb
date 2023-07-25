'use client'

import { createContext, useState, useEffect,  useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { firebaseHooks } from "firebase/hooks";
import Loader from "src/public/components/Loader";
import { useRouter } from "next/navigation";

const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState("garosu") //I'm
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)

  const [schedule, setSchedule] = useState(null) //편집일

  const [todayDate, setTodayDate] = useState(null) //마감일

  const [company, setCompany] = useState(null)
  const [commercial, setCommercial] = useState(null)

  const [commercialTypes, setCommercialTypes] = useState([]) //광고 분류
  const [locationTypes, setLocationTypes] = useState([])//지역 분류

  const [selectedDBId, setSelectedDBId] = useState(null)

  const router = useRouter()


  useEffect(()=>{
    const fetchData = async () => {
      console.log("fetching data")
      try{
      const scheduleGarosu = await firebaseHooks.fetch_data("type/garosu/settings/schedule")
      const scheduleAlimbang = await firebaseHooks.fetch_data("type/alimbang/settings/schedule")
      if(scheduleGarosu!==undefined && scheduleGarosu.data.length>=1)
        setSchedule(prevSchedule => ({...prevSchedule, garosu: scheduleGarosu.data}))
      else{
        alert("가로수 편집일을 작성해주세요.")
        router.push("/setting")
      }
      if(scheduleAlimbang!==undefined && scheduleAlimbang.data.length>=1)
        setSchedule(prevSchedule => ({...prevSchedule, alimbang: scheduleAlimbang.data}))
      else{
        alert("알림방 편집일을 작성해주세요.")
        router.push("/setting")
      }

      const td = localStorage.getItem("todayDate")
      setTodayDate(td)

      const companyData = await firebaseHooks.fetch_company_data()
      setCompany(companyData)

      const commercialData = await firebaseHooks.fetch_commercial_data()
      setCommercial(commercialData)
      
      const garosuCommercialType = await firebaseHooks.fetch_data("type/garosu/settings/commercialTypes")
      const alimbangCommercialType = await firebaseHooks.fetch_data("type/alimbang/settings/commercialTypes")
      const garosuLocationType = await firebaseHooks.fetch_data("type/garosu/settings/locationTypes")
      const alimbangLocationType = await firebaseHooks.fetch_data("type/alimbang/settings/locationTypes")
      if(garosuCommercialType && garosuCommercialType.data)
        setCommercialTypes(prev => ({...prev, garosu: garosuCommercialType.data}))
      if(alimbangCommercialType && alimbangCommercialType.data)
        setCommercialTypes(prev => ({...prev, alimbang: alimbangCommercialType.data}))
      if(garosuLocationType && garosuLocationType.data)
        setLocationTypes(prev => ({...prev, garosu: garosuLocationType.data}))
      if(alimbangLocationType && alimbangLocationType.data)
        setLocationTypes(prev => ({...prev, alimbang: alimbangLocationType.data}))
      console.log(commercialTypes, locationTypes)
      setIsLoading(false)
    }catch(e){
      console.log(error)
    }
    }
    fetchData()
  },[])

  const reloadCommercialData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const commercialData = await firebaseHooks.fetch_commercial_data();
        setCommercial(commercialData);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
  

  const value = {
    type,
    setType,
    user,
    setUser,
    userData, setUserData,
    schedule, setSchedule,
    todayDate,setTodayDate,
    company, setCompany,
    commercial, setCommercial,
    commercialTypes, setCommercialTypes,
    locationTypes, setLocationTypes,
    selectedDBId, setSelectedDBId,
    reloadCommercialData
  }

  if(isLoading)
    return <Loader />

  return <dataContext.Provider value={value} {...props} />
}
