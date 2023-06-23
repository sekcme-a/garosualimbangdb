'use client'

import { useEffect, useState } from "react"
import styles from "../styles/idAndPassword.module.css"
import { useRouter } from "next/navigation";
import useData from "context/data";
import { auth } from "firebase/firebase";

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';




const IdAndPassword = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const {user, setUser} = useData()

  const [email, setEmail] = useState("")
  const onEmailChange = (e) => { setEmail(e.target.value) }

    //*****for inputs
    const [values, setValues] = useState({
      password: '',
      showPassword: false,
      error: ""
    });
    const onValuesChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value})
    }
    const [error, setError] = useState({
      type:"",
      message:""
    })
    const handleError = (type, message) => { setError({type: type, message: message})}
    //for inputs*****



  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onLoginClick()
    }
  }




  const onLoginClick = async() => {
      if (email && values.password) {
        let userCred
        let error
        try{
          userCred = await auth.signInWithEmailAndPassword(email, values.password)
        }catch(e){
          handleError("password",e.message)
          error = e.message
          console.log(e.message)
        }
        if (error==="The email address is badly formatted.") {
          handleError("email","유효하지 않은 이메일 입니다." );
          return;
        } else if (error === "There is no user record corresponding to this identifier. The user may have been deleted.") {
          handleError("password","이메일이나 비밀번호가 틀렸습니다.");
          return;
        } else if (error === "The password is invalid or the user does not have a password.") {
          handleError("password","이메일이나 비밀번호가 틀렸습니다." );
          return;
        } else if (error === "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.") {
          handleError("password","로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 해제되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다." );
          return;
        }
          else if (error) {
          console.log(error)
          return;
        }
        setUser(userCred.user ?? null);
        console.log(userCred.user)
        // router.push("/hallway");
        router.push("/")
      } else if(values.password) {
        handleError("email","이메일을 입력해주세요." );
      } else if(email) {
        handleError("password","비밀번호를 입력해주세요." );
      }
  }


  const onSignInClick = () => {
    router.push("/signin")
  }

  const onFindPasswordClick = () => {

  }



  return (
    <div className={styles.login_container} onKeyPress={handleOnKeyPress}>
      <TextField
        fullWidth
        id="outlined-helperText"
        label="이메일"
        value={email}
        size="small"
        margin="normal"
        onChange={onEmailChange}
        error={error.type==="email"}
        helperText={error.type!=="email" ? "" : error.message}
      />


      <FormControl variant="outlined" style={customStyle.password}>
        <InputLabel htmlFor="outlined-adornment-password" size="small" >비밀번호</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          size="small"
          
          onChange={onValuesChange('password')}
          error={error.type==="password"}
          endAdornment={
            <InputAdornment position="end" >
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {error.type === "password" && <FormHelperText id="component-error-text" error={error.type==="password"}>{error.message}</FormHelperText>}
      </FormControl>



      <Button variant="outlined" style={customStyle.button} onClick={onLoginClick}>로그인</Button>

    <div className={styles.find_password_container}>
        <p onClick={onFindPasswordClick}>비밀번호 찾기</p>
        <p onClick={onSignInClick}>회원가입</p>
      </div>
    </div>
  )
}

const customStyle = {
  password: {
    marginTop:"15px",
    width:"100%"
  },
  button:{
    marginTop:"20px",
    width:"100%",
    marginBottom:"10px"
  }
}

export default IdAndPassword
