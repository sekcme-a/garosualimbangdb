'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { firestore as db, auth } from "firebase/firebase";
import ReactHtmlParser from "react-html-parser";
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ChevronLeft from 'mdi-material-ui/ChevronLeft';
import styles from "../styles/signInWithEmail.module.css";
import useData from "context/data";
import Image from "next/image";

const SignIn = () => {
  const { user, setUser } = useData();
  const [isDataInfo, setIsDataInfo] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
    userName: "",
    verification: "",
    checked: false,
    error: ""
  });

  const LinkStyled = styled('a')(({ theme }) => ({
    display: 'flex',
    fontSize: '0.875rem',
    alignItems: 'center',
    textDecoration: 'none',
    justifyContent: 'center',
    color: theme.palette.primary.main
  }));

  useEffect(() => {
    setError("");
    setIsLoading(false);
  }, []);

  const onCheckboxChange = (e) => {
    setValues({ ...values, checked: e.target.checked });
  };

  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onBackToSignInClick = () => {
    setIsDataInfo(false);
  };

  const onSignInClick = () => {
    if (!values.email) {
      setError("이메일 주소를 입력해주세요.");
      return;
    }
    if (!values.password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("재확인 비밀번호가 다릅니다.");
      return;
    }
    createUserWithEmailAndPassword(values.email, values.password);
  };

  const createUserWithEmailAndPassword = async (email, password) => {
    if (email && password) {
      try {
        const userCred = await auth.createUserWithEmailAndPassword(email, password);
        setUser(user ?? null);
        if (userCred.user) {
          router.push("/");
        }
      } catch (e) {
        console.log(e.message);
        if (e.message === "The email address is badly formatted.") {
          setError("유효하지 않은 이메일 입니다.");
        } else if (e.message === "Password should be at least 6 characters") {
          setError("비밀번호는 최소 6자리 이상이여야합니다.");
        } else if (e.message === "The email address is already in use by another account.") {
          setError("이미 등록된 이메일 주소입니다.");
        } else if (e.message) {
          setError(e.message);
        }
      }
    } else {
      setError("이메일와 비밀번호는 빈칸일 수 없습니다.");
    }
  };

  return (
    <>
      <div className={styles.title_container}>
        <h3 className={styles.warning}>!실제 사용하고 있는 이메일을 입력해주세요.</h3>
        <h3 className={styles.warning}>(비밀번호 찾기 시 메일 발송)</h3>
      </div>

      <TextField
        fullWidth
        id="outlined-helperText"
        label="이메일"
        value={values.email}
        helperText={["이메일 주소를 입력해주세요.", "이미 등록된 이메일 주소입니다.", "유효하지 않은 이메일 입니다."].includes(error) ? error : "비밀번호 찾기 시 해당 이메일로 메세지가 전송됩니다."}
        error={["이메일 주소를 입력해주세요.", "이미 등록된 이메일 주소입니다.", "유효하지 않은 이메일 입니다."].includes(error)}
        size="small"
        margin="normal"
        onChange={onValuesChange("email")}
        style={customStyle.email}
      />

      <FormControl variant="outlined" size="small" sx={{ width: "100%" }}>
        <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={onValuesChange('password')}
          error={error === "비밀번호를 입력해주세요." || error === "비밀번호는 최소 6자리 이상이여야합니다."}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {(error === "비밀번호를 입력해주세요." || error === "비밀번호는 최소 6자리 이상이여야합니다.") && <FormHelperText id="component-error-text" error>{error}</FormHelperText>}
      </FormControl>

      <FormControl variant="outlined" size="small" sx={{ width: "100%", mt: "18px" }}>
        <InputLabel htmlFor="outlined-adornment-password" style={{ backgroundColor: "white", paddingRight: "10px" }}>비밀번호 재확인</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showConfirmPassword ? 'text' : 'password'}
          value={values.confirmPassword}
          style={{ paddingTop: 0, paddingBottom: 0 }}
          onChange={onValuesChange('confirmPassword')}
          error={error === "재확인 비밀번호가 다릅니다."}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownConfirmPassword}
                edge="end"
              >
                {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {error === "재확인 비밀번호가 다릅니다." && <FormHelperText id="component-error-text" error>{error}</FormHelperText>}
      </FormControl>

      <div className={styles.signIn_button} onClick={onSignInClick}>
        회원가입
      </div>
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", mt: 3 }}>
        <Link passHref href='/'>
          <LinkStyled>
            <ChevronLeft />
            <span>Back to login</span>
          </LinkStyled>
        </Link>
      </Typography>
    </>
  );
};

const customStyle = {
  email: {
    marginTop: '18px'
  }
};

export default SignIn;
