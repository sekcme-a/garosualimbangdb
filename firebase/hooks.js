import { firestore as db, storage, auth } from "firebase/firebase"

export const firebaseHooks = {
  fetch_user_data_from_uid: (uid) => {
    return new Promise(async (resolve, reject)=> {
      try{
        const doc = await db.collection("user").doc(uid).get()
        resolve(doc.data())
      } catch (e) {
        reject(e)
      }
    })
  },
  add_user_data: (uid, data) => {
    return new Promise(async (resolve, reject)=> {
      try{
        const doc = await db.collection("user").doc(uid).set(data)
        resolve(doc.data())
      } catch (e) {
        reject(e)
      }
    })
  },
  //path="col1/doc1/col2/doc2/ to max of 5"
  fetch_data: (path) => {
    return new Promise(async (resolve, reject)=> {
      try{
        //undefined when no data
        const paths = path.split("/")
        let doc = undefined
        if(paths.length===2)
          doc = await db.collection(paths[0]).doc(paths[1]).get()
        else if(paths.length===4)
          doc = await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).get()
        else if(paths.length===6)
          doc = await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).get()
        else if(paths.length===8)
          doc =  await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).get()
        else if(paths.length===10)
          doc = await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).collection(paths[8]).doc(paths[9]).get()
        else
          resolve(false)
        if(!doc)
          resolve(undefined)
        resolve(doc.data())
      } catch (e) {
        reject(e)
      }
    })
  },
  //path="col1/doc1/col2/doc2/ to max of 5"
  set_data: (path, data) => {
    return new Promise(async (resolve, reject)=> {
      try{
        const paths = path.split("/")
        if(paths.length===2)
          await db.collection(paths[0]).doc(paths[1]).set(data)
        else if(paths.length===3)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc().set(data)
        else if(paths.length===4)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).set(data)
        else if(paths.length===5)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc().set(data)
        else if(paths.length===6)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).set(data)
        else if(paths.length===7)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc().set(data)
        else if(paths.length===8)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).set(data)
        else if(paths.length===9)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).collection(paths[8]).doc().set(data)
        else if(paths.length===10)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).collection(paths[8]).doc(paths[9]).set(data)
        else
          resolve(false)
        alert("성공적으로 저장되었습니다.")
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  },
  //path="col1/doc1/col2/doc2/ to max of 5"
  delete_data: (path, data) => {
    return new Promise(async (resolve, reject)=> {
      try{
        const paths = path.split("/")
        if(paths.length===2)
          await db.collection(paths[0]).doc(paths[1]).delete()
        else if(paths.length===4)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).delete()
        else if(paths.length===6)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).delete()
        else if(paths.length===8)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).delete()
        else if(paths.length===10)
          await db.collection(paths[0]).doc(paths[1]).collection(paths[2]).doc(paths[3]).collection(paths[4]).doc(paths[5]).collection(paths[6]).doc(paths[7]).collection(paths[8]).doc(paths[9]).delete()
        else
          resolve(false)
        alert("성공적으로 삭제되었습니다.")
        resolve(true)
      } catch (e) {
        reject(e)
      }
    })
  },
  /**이미지 storage에 업로드 후 url 반환 */
  upload_image_to_storage: (file, filePath)=>{
    return new Promise(async(resolve, reject) => {
      try{
        const fileRef = storage.ref().child(filePath)
        await fileRef.put(file)
        const url = await fileRef.getDownloadURL()
        resolve(url)
      } catch(e){
        reject(e.message)
      }
    })
  },

  delete_image_with_url_from_storage: (fileUrl)=>{
    return new Promise(async(resolve, reject) => {
      try{
        const fileRef = storage.refFromURL(fileUrl)
        await fileRef.delete()
        resolve(true)
      } catch(e){
        reject(e.message)
      }
    })
  },
  get_random_id: ()=>{
    return new Promise(async(resolve, reject) => {
      try{
        const randomId = db.collection("type").doc().id
        resolve(randomId)
      } catch(e){
        reject(e.message)
      }
    })
  },
  publish_commercial: (type, id) => {
    return new Promise(async(resolve, reject) => {
      try{
        const commercialDoc = await db.collection("type").doc(type).collection("commercials").doc(id).get()
        if(!commercialDoc.exists){
          alert("해당 광고가 존재하지 않습니다.")
          reject("해당 광고가 존재하지 않습니다.")
        } else if(commercialDoc.data().condition==="게제중"){
          alert("이미 게재중인 광고입니다.")
          reject("이미 게재중인 광고입니다.")
        }
        const batch = db.batch()
        batch.update(db.collection("type").doc(type).collection("commercials").doc(id), {condition: "게제중"})
        batch.set(db.collection("type").doc(type).collection("commercials").doc(id).collection("history").doc(),{
          createdAt: new Date(),
          type: "게재",
          info: "광고가 게재되었습니다.",
          data: commercialDoc.data()
        })
        await batch.commit()
        alert("정상적으로 게재되었습니다.")
        resolve()
      } catch(e){
        reject(e)
      }
    })
  },
  delete_commercial: (type,companyId, commercialId) => {
    return new Promise(async(resolve, reject) => {
      try{
        const batch = db.batch()
        batch.delete(db.collection("type").doc(type).collection("commercials").doc(commercialId))
        batch.delete(db.collection("/type").doc(type).collection("company").doc(companyId).collection("commercials").doc(commercialId))
        await batch.commit()
        alert("정상적으로 삭제되었습니다.")
        resolve()
      } catch(e){
        reject(e)
      }
    })
  },
  //prevRemain 원래의 remain값, deleteRemainValue: 삭제할 횟수
  delete_remain: (type, commercialId, prevRemain, deleteRemainValue) => {
    return new Promise(async(resolve, reject) => {
      try{
        const batch = db.batch()
        batch.update(db.collection("type").doc(type).collection("commercials").doc(commercialId), {remain: parseInt(prevRemain)-parseInt(deleteRemainValue)})
        batch.set(db.collection("type").doc(type).collection("commercials").doc(commercialId).collection("history").doc(),{
          createdAt: new Date(),
          type: "횟수 삭제",
          info: `남은 연재 횟수가 ${prevRemain}에서 ${deleteRemainValue}회 삭제되어 ${parseInt(prevRemain)-parseInt(deleteRemainValue)}회로 변경되었습니다.`,
        })
        await batch.commit()
        resolve()
      } catch(e){
        reject(e)
      }
    })
  },




  //not public===========================
  fetch_company_data: ()=>{
    return new Promise(async(resolve, reject) => {
      try{
        const garosuDoc = await db.collection("type").doc("garosu").collection("company").orderBy("createdAt","desc").get()
        const alimbangDoc = await db.collection("type").doc("alimbang").collection("company").orderBy("createdAt","desc").get()
        // const garosuDocMap = {};
        // garosuDoc.docs.forEach(doc => {
        //   garosuDocMap[doc.id] = doc.data();
        // });
        // const alimbangDocMap = {};
        // alimbangDoc.docs.forEach(doc => {
        //   alimbangDocMap[doc.id] = doc.data();
        // });
        const garosuList = garosuDoc.docs.map(doc=>({...doc.data(), id: doc.id}))
        const alimbangList = alimbangDoc.docs.map(doc=>({...doc.data(), id: doc.id}))
        resolve({garosu: garosuList, alimbang: alimbangList})
      } catch(e){
        reject(e.message)
      }
    })
  },
  fetch_commercial_data: ()=>{
    return new Promise(async(resolve, reject) => {
      try{
        const garosuDoc = await db.collection("type").doc("garosu").collection("commercials").orderBy("savedAt","desc").get()
        const alimbangDoc = await db.collection("type").doc("alimbang").collection("commercials").orderBy("savedAt","desc").get()
        const garosuList = garosuDoc.docs.map(doc=>({...doc.data(), id: doc.id}))
        const alimbangList = alimbangDoc.docs.map(doc=>({...doc.data(), id: doc.id}))
        resolve({garosu: garosuList, alimbang: alimbangList})
      } catch(e){
        reject(e.message)
      }
    })
  },


  //=======다시
  // fetch_company_with_id: (type, id) => {
  //   return new Promise(async (resolve, reject)=> {
  //     try{
  //       const doc1 = await db.collection("type").doc(type).collection("company").doc(id) => {

  //       }
  //     } catch (e) {
  //       reject(e)
  //     }
  //   })
  // },
  
}