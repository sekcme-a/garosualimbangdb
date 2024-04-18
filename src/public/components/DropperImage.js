// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import styles from "../styles/dropperImage.module.css"

import { handleProfileImage } from "hooks/handleProfileImage"
import useData from 'context/data'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

/**
  <DropperImage setImgURL={} path={`content/${teamId}/${fileId}`} imgURL={} />
 */

const FileUploaderRestrictions = ({setImgURL, path, imgURL, setIsLoading}) => {
  // ** State
  const [files, setFiles] = useState()
  const [fileListData,setFileListData] = useState([])


  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 8,
    maxSize: 20000000,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    },
    onDropRejected: () => {
      toast.error('20MB이하의 이미지를 최대 1개 업로드할 수 있습니다.', {
        duration: 2000
      })
    }
  })

  useEffect(() => {
    const fetchURL = async () => {
      if (files !== undefined) {
        setIsLoading(true)
        setFileListData([...files])
        const photoURL = await handleProfileImage(files[0], path, 1)
        setImgURL(photoURL)
        setIsLoading(false)
      }  
    }
    fetchURL()
  }, [files])
  
  useEffect(() => {
    if (imgURL) {
      setFileListData([{url: imgURL}])
    }
  }, [imgURL])
  

  const renderFilePreview = file => {
    if (file.type === undefined) {
      console.log(file.url)
      return <img width={32} height={32} alt={file.name} src={file.url} />
    }else if (file.type.startsWith('image')) {
      return <img width={32} height={32} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <FileDocumentOutline />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = fileListData
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFileListData([...filtered])
  }

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

  const fileList = fileListData.map((file, index) => {
    return (
    <ListItem key={index}>
      <div className='file-details' style={{display: "flex", width:"100%", alignItems:"center"}}>
          <div className='file-preview' style={{ }}>{renderFilePreview(file)}</div>
        <div style={{marginLeft:"10px", width: "100%"}}>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {/* {Math.round(file.size / 100) / 10 > 1000
              ? {(Math.round(file.size / 100) / 10000).toFixed(1)} mb
              : {(Math.round(file.size / 100) / 10).toFixed(1)} kb} */}
            {file.size!==undefined && formatBytes(file.size,1)}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Close fontSize='small' />
      </IconButton>
    </ListItem>    )
  })

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        console.log(Object.assign(blob))
        setFiles([Object.assign(blob)]);
        break; // Assuming you only want to handle one image at a time
      }
    }
  };




  return (
    <div className={styles.image_container} style={{flexWrap:"wrap"}}>
      {/* <div className={styles.title_container}>
        <h1>썸네일 업로드</h1> */}
        <div onPaste={handlePaste}style={{width:"100px", height:"100px", border:"1px solid black"}}/>
        <div {...getRootProps({ className: 'dropzone' })}>
          <div className={styles.dropzone_container}>
            <input {...getInputProps()} />
            <h1>이곳으로 이미지 드래그 혹은 </h1><Button >파일 업로드</Button>
          </div>
        </div>
      {/* </div> */}
      {fileListData.length > 0 && <List>{fileList}</List>}
    </div>
  )
}

export default FileUploaderRestrictions
