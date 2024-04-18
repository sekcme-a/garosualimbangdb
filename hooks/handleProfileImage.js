import React from 'react';
import imageCompression from 'browser-image-compression';
import { firebaseHooks } from 'firebase/hooks';

/**이미지가 maxMB보다 크다면 압축 진행 후 storage에 저장

 */
export const handleProfileImage = async (img, path,maxMB) => {
  const options = {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  const checkIsImage = (imgName) => {
    const pathpoint = imgName.lastIndexOf('.')
    const filepoint = imgName.substring(pathpoint+1,imgName.length)
    const filetype = filepoint.toLowerCase();
    if (filetype == 'jpg' || filetype == 'png' || filetype == 'git' || filetype == 'jpeg' || filetype == 'bmp') {
      return true;
    }
    else {
      // alert("이미지 파일만 선택할 수 있습니다.\n (.jpg .gif .png .jpeg .bmp)")
      return false;
    }
  }

  const checkIsImageSize = (img) => {
    const maxSize = maxMB * 1024 * 1024; //1MB
    console.log(img)
    console.log(maxSize)
    if (img > maxSize) {
      return false;
    }
    else
      return true
  }


  return new Promise(async function (resolve, reject) {
    let image = img
    try {
      // if(type==="event"){
        if (img) {
          if (checkIsImage(img.name)) {
            console.log(img.name)
            if (!checkIsImageSize(img.size)) 
              image = await imageCompression(img, options)
            const url = await firebaseHooks.upload_image_to_storage(image, path)
            resolve(url)
          } else {
            console.log(image, path)
            const url = await firebaseHooks.upload_image_to_storage(image, path)
            resolve(url)
          }
        }
      // }else {
      //   console.log(img.length)
      //   if(img.length>100000*maxMB)
      //     image = await imageCompression(img, options)
      //   const url = await firebaseHooks.upload_image_to_storage(image, path)
      // }
    } catch (e) {
      reject(e)
    }

  })
}