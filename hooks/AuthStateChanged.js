'use client'

import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/navigation";
import { firebaseHooks } from "firebase/hooks";


export default function AuthStateChanged({ children }) {
    const {setUser, setUserData} = useData()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
  
  useEffect(() => {
    auth.onAuthStateChanged(async(user) => {
      setUser(user);
      // console.log(user)
      //로그인시
      if (user !== null ) {
        const userData = await firebaseHooks.fetch_user_data_from_uid(user.uid)
        if(!userData){
          await firebaseHooks.add_user_data(user.uid, {
            displayName : user.displayName ? user.displayName : `User${user.uid.substr(1,5)}`,
            roles: "user",
            realName: user.displayName ? user.displayName : `User${user.uid.substr(1,5)}`,
            phoneNumber: user.phoneNumber,
            phoneVerified: false,
            email: user.email,
            emailVerified: user.emailVerified,
            providerId: user.providerData[0].providerId,
          })
        } else{
          setUserData(userData)
        }
        setIsLoading(false)
      } else{
        //로그아웃시
        setUser(null)
        setUserData(null)
        setIsLoading(false)
      }
    })
    // const fetchData = async = () => {

    // }
    // fetchData()
  }, []);

  if(isLoading)return <></>

  return children;
}