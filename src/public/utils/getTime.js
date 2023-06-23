export const getTime = {

  //YYYY/MM/DD
  YYYYMMDD: (timeStamp) => {
    return timeStamp.toDate().toLocaleDateString('ko-KR')
  }
}