"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
// import styles from "../styles/component.module.css"
import Loader from "src/public/components/Loader"
import Schedule from "./components/Schedule"
import CommercialType from "./components/CommercialType"
import LocationType from "./components/LocationType"

const Setting = () => {
  const {user} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(false)
    }
    fetchData()
  },[])

  // if(isLoading)
  //   return <Loader />
  
  return(
    <div>
      <Schedule />
      <CommercialType />
      <LocationType />
    </div>
  )
}

export default Setting