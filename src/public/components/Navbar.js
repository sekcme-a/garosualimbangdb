'use client'

import styles from "src/public/styles/navbar.module.css"
import { Button } from "@mui/material"

import useData from "context/data"
import { useRouter, usePathname} from 'next/navigation'
import Router from "next/router"
import { auth } from "firebase/firebase"

const Navbar = () => {
  const {type, setType} = useData()
  const router = useRouter()
  const pathname = usePathname()

  const onGarosuClick = () => {
    router.push("/garosu")
  }

  const onAlimBangClick = () => {
    router.push("/alimbang")
  }

  const onSettingClick = () => {
    router.push("/setting")
  }

  const onLogoutClick = async () => {
    await auth.signOut()
    router.push("/")
  }

  return(
    <div className={styles.main_container}>
      <div onClick={onGarosuClick}
        className={pathname.includes("garosu") ? `${styles.button} ${styles.garosu} ${styles.selected}` : `${styles.button} ${styles.garosu}`}>
          가로수
      </div>
      <div onClick={onAlimBangClick}
        className={pathname.includes("alimbang")  ? `${styles.button} ${styles.alimbang} ${styles.selected}` : `${styles.button} ${styles.alimbang}`}>
          알림방
      </div>
      <div onClick={onSettingClick}
        className={pathname.includes("setting") ? `${styles.button} ${styles.setting} ${styles.selected}` : `${styles.button} ${styles.setting}`}>
          설정
      </div>
      <div onClick={onLogoutClick}
        className={`${styles.button} ${styles.logout}`}>
          로그아웃
      </div>
    </div>
  )
}

export default Navbar