import React,{useState,useEffect} from 'react'
import {BiDotsVerticalRounded} from 'react-icons/bi'
import {BsTriangleFill,BsThreeDotsVertical} from 'react-icons/bs'
import {FaCameraRetro} from 'react-icons/fa'
import {GrFormClose} from 'react-icons/gr'
import {AiOutlineClose} from 'react-icons/ai'
import {GrGallery} from 'react-icons/gr'
import {ImHappy} from 'react-icons/im'
import ModalImage from "react-modal-image";
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useSelector,useDispatch } from 'react-redux';
import { getDatabase, ref, set,push,onValue, remove } from "firebase/database";
import { getStorage, ref as iref, uploadBytes,getDownloadURL } from "firebase/storage";
import moment from 'moment/moment'
import { AudioRecorder } from 'react-audio-voice-recorder';
import EmojiPicker from 'emoji-picker-react';
import { useRef } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { chatUserInfo } from '../slices/chatSlice';




const Chat = () => {
  const db = getDatabase();
  const storage = getStorage();
  let dispatch=useDispatch()
  let [msg,setMsg]=useState('')
  let [Chatimgsend,setChatimgsend]=useState(null)
  let [msgerr,setMsgerr]=useState('')
  let [msgList,setMsgList]=useState([])
  let [GroupmsgList,setGroupMsgList]=useState([])
  let [GroupAcceptList,setGroupAcceptList]=useState([])
  let data=useSelector((state)=>state.userLoginInfo.userInfo)
  let chatData=useSelector((state)=>state.chatUserInfo.chatInfo)
  let [cameraShow,setCameraShow]=useState(false)
  let [ImgSendModal,setImgSendModal]=useState(false)
  let [emojiShow,setEmojiShow]=useState(false)
  let [msgSettingModal,setmsgSettingModal]=useState(false)
  let [msgFrwdModal,setmsgFrwdModal]=useState(false)
  let [frwdMsg,setFrwdMsg]=useState(false)
  let [frwdimg,setFrwdImg]=useState(false)
  let [audiourl,setAudioUrl]=useState('')
  let [id,setId]=useState('')
  let [msgInfo,setMsgInfo]=useState('')
  let [blob,setBlob]=useState('')
  let emojiRef=useRef()
  let [friendList,setFriendList]=useState([])
  function handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    console.log(dataUri);
  }

  function handleTakePhotoAnimationDone (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
  }

  function handleCameraError (error) {
    console.log('handleCameraError', error);
  }

  function handleCameraStart (stream) {
    console.log('handleCameraStart');
  }

  function handleCameraStop () {
    console.log('handleCameraStop');
  }

  let handleMsg=(e)=>{
    setMsg(e.target.value)
  }
  let handleMsgSubmit=()=>{
    if(!msg){
      setMsgerr('Plase write Someting or Send photo and Vedio')
    }
    if(chatData.status=='single'){
      set(push(ref(db, 'singlemsg/')), {
        whosendid:data.uid,
        whosendname:data.displayName,
        whoreciveid:chatData.id,
        whorecivename:chatData.name,
        msg:msg,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
      }).then(()=>{
        setMsg('')
      })
    }
    
    else{
      console.log('ami Group msg')
      set(push(ref(db, 'groupmsg/')), {
        whosendid:data.uid,
        whosendname:data.displayName,
        whoreciveid:chatData.id,
        whorecivename:chatData.name,
        adminid:chatData.adminid,
        msg:msg,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
      }).then(()=>{
        setMsg('')
      })
    }
  }

  useEffect(()=>{
    const starCountRef = ref(db, 'singlemsg/' );
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      let activearr=[]
      snapshot.forEach((item)=>{
        if(item.val().whosendid==data.uid && item.val().whoreciveid ==chatData.id||item.val().whoreciveid==data.uid && item.val().whosendid==chatData.id){
          arr.push({...item.val(),id:item.key})
          
        }
      })
      setMsgList(arr)
    });

  },[chatData.id])
  
//group msg 
  useEffect(()=>{
    const starCountRef = ref(db, 'groupmsg/' );
    onValue(starCountRef, (snapshot) => {
      let arr=[]
      snapshot.forEach((item)=>{
          arr.push({...item.val(),id:item.key})
      })
      setGroupMsgList(arr)
    });

  },[chatData.id])

//group accept 
useEffect(()=>{
  const starCountRef = ref(db, 'groupAccept/' );
  onValue(starCountRef, (snapshot) => {
    let arr=[]
    snapshot.forEach((item)=>{
        arr.push(item.val().groupid+item.val().joinrequestid)
    })
    setGroupAcceptList(arr)
  });

},[])

  let handleImgsendModal=()=>{
    setImgSendModal(true)
  }
  let handleImgSendInfo=(e)=>{
    const storageRef = iref(storage, e.target.files[0].name);
    uploadBytes(storageRef, e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then((downloadURL) => {
        setChatimgsend(downloadURL)
      });
    });
  }

  let handleImgUpload=()=>{
    if(chatData.status=='single')
    {

      set(push(ref(db, 'singlemsg/')), {
                whosendid:data.uid,
                whosendname:data.displayName,
                whoreciveid:chatData.id,
                whorecivename:chatData.name,
                img:Chatimgsend,
                date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
              }).then(()=>{
                setImgSendModal(false)
              })
    }else{
      set(push(ref(db, 'groupmsg/')), {
        whosendid:data.uid,
        whosendname:data.displayName,
        whoreciveid:chatData.id,
        whorecivename:chatData.name,
        img:Chatimgsend,
        date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
      }).then(()=>{
        setImgSendModal(false)
      })

    }
  }
    const addAudioElement = (blob) => {
      const url = URL.createObjectURL(blob);
      setAudioUrl(url)
      setBlob(blob)
    };
    let handleAudioUpload=()=>{
      const storageRef = iref(storage, audiourl);
      uploadBytes(storageRef, blob).then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          if(chatData.status=='single'){

            set(push(ref(db, 'singlemsg/')), {
              whosendid:data.uid,
              whosendname:data.displayName,
              whoreciveid:chatData.id,
              whorecivename:chatData.name,
              audio:downloadURL,
              date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
            }).then(()=>{
              setAudioUrl('')
            })
          }else{
            
            set(push(ref(db, 'groupmsg/')), {
              whosendid:data.uid,
              whosendname:data.displayName,
              whoreciveid:chatData.id,
              whorecivename:chatData.name,
              audio:downloadURL,
              date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`,
            }).then(()=>{
              setAudioUrl('')
            })
          }
        });
      });
    }

    let handleEmoji=(emoji)=>{
      setMsg(msg+emoji.emoji)
    }

    useEffect(()=>{
      document.addEventListener('click',(e)=>{
        if(emojiRef.current.contains(e.target)){
          setEmojiShow(true)
        }else{
          setEmojiShow(false)
        }
      })
    })

    let handlekeypress=(e)=>{
      console.log(e.key)
      if(e.key=='Enter'){
        if(!msg){
          setMsgerr('Plase write Someting or Send photo and Vedio')
        }
        if(chatData.status=='single'){
          set(push(ref(db, 'singlemsg/')), {
            whosendid:data.uid,
            whosendname:data.displayName,
            whoreciveid:chatData.id,
            whorecivename:chatData.name,
            msg:msg,
            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
          }).then(()=>{
            setMsg('')
          })
        }
        
        else{
          console.log('ami Group msg')
          set(push(ref(db, 'groupmsg/')), {
            whosendid:data.uid,
            whosendname:data.displayName,
            whoreciveid:chatData.id,
            whorecivename:chatData.name,
            adminid:chatData.adminid,
            msg:msg,
            date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
          }).then(()=>{
            setMsg('')
          })
        }
      }
    }

    useEffect(()=>{
      const friendRef = ref(db, 'friend/');
      onValue(friendRef, (snapshot) => {
        let arr=[]
        snapshot.forEach((item)=>{
          if(item.val().senderid==data.uid||item.val().reciverid==data.uid){
  
            arr.push({...item.val(),id:item.key})
          }
        })
        setFriendList(arr)
      });
    },[])

    let handlemsgSettingModal=(item)=>{
      setmsgSettingModal(true)
      setMsgInfo(item)
      setId(item.id)
      console.log(item)
      if(item.msg){
        setFrwdMsg(item.msg)
      }else{
        setFrwdImg(item.img)
      }

    }
    let handlemsgCloseModal=()=>{
      setmsgSettingModal(false)
      setmsgFrwdModal(false)
    }
    let handlemsgDelete=()=>{
      if(data.uid==msgInfo.whosendid){
        remove(ref(db, 'singlemsg/'+id)).then(()=>{
         setmsgSettingModal(false)
        })

      }

    }
    let handleMsgFrwdSend=()=>{
    
      if(frwdMsg){
        set(push(ref(db, 'singlemsg/')), {
          whosendid:data.uid,
          whosendname:data.displayName,
          whoreciveid:chatData.id,
          whorecivename:chatData.name,
          msg:frwdMsg,
          frwd:'forward Message',
          date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
        }).then(()=>{
          setmsgSettingModal(false)
          setmsgFrwdModal(false)
        })

      }else {
        set(push(ref(db, 'singlemsg/')), {
          whosendid:data.uid,
          whosendname:data.displayName,
          whoreciveid:chatData.id,
          whorecivename:chatData.name,
          img:frwdimg,
          frwd:'forward Message',
          date:`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} ${new Date().getHours()} ${new Date().getMinutes()}`
        }).then(()=>{
          setmsgSettingModal(false)
          setmsgFrwdModal(false)
        })
      }
    }

    let handleFriendInfo=(item)=>{
      if(data.uid==item.senderid){
        dispatch(chatUserInfo({
          name:item.recivername,id:item.reciverid,status:'single',img:item.reciverimg,
        }))
      }else{
        dispatch(chatUserInfo({
          name:item.sendername,id:item.senderid,status:'single',img:item.senderimg,
        }))
      }
    }
  return (
    <div className='py-8 px-14 shadow-2xl	 w-full  rounded-2xl'>
        <div className='flex gap-x-6 items-center '>
        {/* img  */}
        <div className='w-[90px] h-[90px] shadow-md rounded-full relative '>
          {chatData.img
          ?
            <div className='w-full h-full overflow-hidden rounded-full'>
            <img src={chatData.img} />
            </div>
            :
            <div className='w-full h-full overflow-hidden rounded-full'>
            <img src='images/profile.png' />
            </div>
            }
            <div className='w-[15px] h-[15px] bg-green-500 rounded-full  absolute bottom-[5px] right-[5px] shadow-md'>
                
            </div>
        </div>
        {/* img end */}
        <div>
            <h2 className='font-ub font-semibold text-2xl text-black'>{chatData.name}</h2>
            <p className='font-ub text-md text-black'>Online </p>
        </div>
        {/* icon */}
        <div className='ml-auto'>
            <BiDotsVerticalRounded className='text-2xl mr-auto text-primary'/>
        </div>
        {/* icon end */}
       
        </div>
        <div className='w-full h-1 border-b border-solid border-[#CFCFCF]  pt-6'/>
    {/* msg option start  */}
    <ScrollToBottom  className='w-full overflow-y-scroll h-[450px]'>
            {chatData.status=='single'
            ?
            msgList.map((item)=>(
            item.whoreciveid==data.uid
            ?
            item.msg?
           ( <div>
            <div className='mt-7 ml-5 inline-block  relative'>
            {item.frwd&&
              <h1 className='absolute   top-[-22px] left-0 text-sm font-ub  '>{item.frwd}</h1>
              }
              <div className='py-3 px-12 bg-[#21b6af]  rounded-lg text-ub text-xl font-semibold text-white'>
                <h2>{item.msg}</h2>
              </div>
              <BsThreeDotsVertical onClick={()=>handlemsgSettingModal(item)} className='absolute top-5 right-0 text-white text-xl'/>
              <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-2px] left-[-13px]'/>

              </div>
              <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
             
            </div>)
            :item.img ?
            (<div>
      <div className='mt-7 ml-5 inline-block  relative'>
      {item.frwd&&
              <h1 className='absolute  top-[-22px] left-0 text-sm font-ub  '>{item.frwd}</h1>
              }
      <div className='py-3 px-3 bg-[#21b6af] rounded-lg text-ub text-xl font-semibold text-white w-80 '>
      <BsThreeDotsVertical onClick={()=>handlemsgSettingModal(item)} className='absolute top-2/4 right-[-2px] text-white text-xl'/>
          <ModalImage
              small={item.img}
              large={item.img}
            />
        </div>
        <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-1.5px] left-[-13px]'/>
        </div>
        <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>)
            :
            (<div>
              <div className='mt-7 ml-5 inline-block  relative'>
              <div className='py-3 px-3 bg-[#21b6af] rounded-lg text-ub text-xl font-semibold text-white w-80 '>
                  <audio src={item.audio} controls></audio>
                </div>
                <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-1.5px] left-[-13px]'/>
                </div>
                <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>)
            :
            item.msg?
            (<div className='text-right'>
             
            <div className='mt-7 mr-5  inline-block  relative'>
            {item.frwd&&
              <h1 className='absolute top-[-22px] left-0 text-sm font-ub  '>{item.frwd}</h1>
              }
              <div className='py-3 px-12 bg-primary  rounded-lg text-ub text-xl font-semibold text-white'>
                <h2>{item.msg}</h2>
              </div>
              <BsThreeDotsVertical onClick={()=>handlemsgSettingModal(item)} className='absolute top-5 left-0 text-white text-xl z-50'/>
 
              <BsTriangleFill className='text-primary text-3xl absolute bottom-[-2px] right-[-12px]'/>
              </div>
              <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>)
            : item.img?
            (<div className='text-right'>
            <div className='mt-7 mr-5  inline-block  relative'>
            {item.frwd&&
              <h1 className='absolute top-[-22px] left-0 text-sm font-ub  '>{item.frwd}</h1>
              }
              <div className='py-3 px-3 bg-primary  rounded-lg text-ub text-xl font-semibold text-white w-80 '>
              <BsThreeDotsVertical onClick={()=>handlemsgSettingModal(item)} className='absolute top-2/4 left-[-4px] text-white text-xl'/>
              <ModalImage
                small={item.img}
                large={item.img}
              />
              </div>
              <BsTriangleFill className='text-primary text-3xl absolute bottom-[-1.5px] right-[-12px]'/>
              </div>
              <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>)
            :
            (<div className='text-right'>
            <div className='mt-7 mr-5  inline-block  relative'>
              <div className='py-3 px-3 bg-primary  rounded-lg text-ub text-xl font-semibold text-white w-80  '>
              <audio controls src={item.audio}></audio>
              </div>
              <BsTriangleFill className='text-primary text-3xl absolute bottom-[-1.5px] right-[-12px]'/>
              </div>
              <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
            </div>)
            ))

            :
            data.uid==chatData.adminid||GroupAcceptList.includes(chatData.id+data.uid)?
            GroupmsgList.map((item)=>(
              item.whosendid==data.uid
              ?
              item.whoreciveid==chatData.id&&(
              item.msg?
              (<div className='text-right'>
              <div className='mt-7 mr-5  inline-block  relative'>
                <div className='py-3 px-12 bg-primary  rounded-lg text-ub text-xl font-semibold text-white'>
                  <h2>{item.msg}</h2>
                </div>
                <BsTriangleFill className='text-primary text-3xl absolute bottom-[-2px] right-[-12px]'/>
                <BsThreeDotsVertical className='absolute top-5 right-0 text-white text-xl'/>
                </div>
                <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>)
              :item.img?
              (<div className='text-right'>
              <div className='mt-7 mr-5  inline-block  relative'>
                <div className='py-3 px-3 bg-primary  rounded-lg text-ub text-xl font-semibold text-white w-80 '>
                <ModalImage
                  small={item.img}
                  large={item.img}
                />
                </div>
                <BsTriangleFill className='text-primary text-3xl absolute bottom-[-1.5px] right-[-12px]'/>
                </div>
                <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>)
              :
              (<div className='text-right'>
              <div className='mt-7 mr-5  inline-block  relative'>
                <div className='py-3 px-3 bg-primary  rounded-lg text-ub text-xl font-semibold text-white w-80  '>
                <audio controls src={item.audio}></audio>
                </div>
                <BsTriangleFill className='text-primary text-3xl absolute bottom-[-1.5px] right-[-12px]'/>
                </div>
                <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>)
              )
              : item.whoreciveid==chatData.id&&(
              item.msg?
             ( <div>
              <div className='mt-7 ml-5 inline-block  relative'>
                <div className='py-3 px-12 bg-[#21b6af]  rounded-lg text-ub text-xl font-semibold text-black'>
                  <h2>{item.msg}</h2>
                </div>
                <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-2px] left-[-13px]'/>
                </div>
                <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
              </div>)
              :item.img?
              (<div>
                <div className='mt-7 ml-5 inline-block  relative'>
                <div className='py-3 px-3 bg-[#21b6af] rounded-lg text-ub text-xl font-semibold text-white w-80 '>
                    <ModalImage
                        small={item.img}
                        large={item.img}
                      />
                  </div>
                  <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-1.5px] left-[-13px]'/>
                  </div>
                  <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                      </div>)
                :
                (<div>
                  <div className='mt-7 ml-5 inline-block  relative'>
                  <div className='py-3 px-3 bg-[#21b6af] rounded-lg text-ub text-xl font-semibold text-white w-80 '>
                      <audio src={item.audio} controls></audio>
                    </div>
                    <BsTriangleFill className='text-[#21b6af] text-3xl absolute bottom-[-1.5px] left-[-13px]'/>
                    </div>
                    <p className='font-ub text-xm font-normal mt-1 text-[#BFBFBF]'>{moment(item.date, "YYYYMMDD hh:mm").fromNow()}</p>
                  </div>)
              
             
            
              )))
            :
            <h1>you are  not a member in this group</h1>
            }

{ msgSettingModal&&
    <div className='w-full h-full z-50 bg-[rgba(0,0,0,.5)] absolute top-0 left-0 flex justify-center items-center'>
      <AiOutlineClose onClick={handlemsgCloseModal} className='text-2xl absolute top-5 right-5 text-red-500'/>
      <div className='w-2/4 p-5 bg-white rounded-lg flex justify-center items-center gap-x-5'>
   <div>
    {data.uid==msgInfo.whosendid&&
   <button onClick={handlemsgDelete} className='bg-red-500 px-5 py-2 rounded-md font-ub text-xl text-white '>Delete</button>
    }
    <button onClick={()=>setmsgFrwdModal(!msgFrwdModal)} className='bg-primary px-5 py-2 rounded-md font-ub text-xl text-white ml-5'>Forward</button>
    {msgFrwdModal&&
    <div>
      <div className='mt-5 relative h-[300px] shadow-lg	w-full overflow-y-scroll p-5	'>
    <BsThreeDotsVertical className='absolute top-2 right-3 text-xl'/>
    <h2 className='font-poppins font-semibold text-xl mb-4'>Friend List </h2>
    {friendList.map((item)=>(
      <div onClick={()=>handleFriendInfo(item)}  className='flex  w-full items-center gap-x-4  py-3.5 border-b '>
        {item.senderid==data.uid
        ?
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full '>
        <img src={item.reciverimg} alt="" />
      </div>
        :
        <div className='w-[70px] h-[70px] overflow-hidden rounded-full '>
        <img src={item.senderimg} alt="" />
      </div>
        }
    
      <div className='w-[50%]'>
      {data.uid==item.senderid
      ?
      <h2 className='font-poppins font-semibold text-xl'>{item.recivername}</h2>
      :
      <h2 className='font-poppins font-semibold text-xl'>{item.sendername}</h2>
      }
      <h2 className='font-poppins font-normal text-sm'>Hi Guys, Wassup!</h2>
      </div>
        <div  >
        <button onClick={handleMsgFrwdSend}  className='font-poppins font-semibold text-xl bg-primary p-2 text-white rounded-br-xl ml-5 drop-shadow-md	'>Send</button>
        </div>
     
    </div>
    ))}

    </div>
    </div>
    }
   </div>
   
      </div>
    </div>

    }
    </ScrollToBottom>
    <div className='border-b border-[#BFBFBF] mt-8 mb-9'/>
    {ImgSendModal
    ?
    <div className='absolute top-0 left-0 bg-primary w-full h-full z-50 flex justify-center items-center'>
      <div className='w-2/4 p-5 bg-white rounded-bl-2xl'>
        <h2 className='font-ub text-2xl text-black font-bold mb-5 '>Send Your Image </h2>
        {Chatimgsend &&
        <div className='w-96 h-96 mb-5 mx-auto '>
          <img className='w-full h-full ' src={Chatimgsend}/>
        </div>
        }
        <input onChange={handleImgSendInfo} className='text-xl mb-5 block' type='file'/>
        <button onClick={handleImgUpload} className='bg-primary p-3 rounded-bl-lg text-black font-ub text-lg'>Send </button>
        <button onClick={()=>setImgSendModal(false)} className='bg-red-500 p-3 rounded-bl-lg text-black font-ub text-lg ml-3'>Cancel </button>
      </div>
    </div>
    :
    
    <div className='flex justify-between'>
      <div className='w-[85%] relative'>
       
        {!audiourl&&
      <input onChange={handleMsg} onKeyUp={handlekeypress}  className='w-[75%] py-4 bg-[#F1F1F1] rounded-lg px-3' value={msg}/>
        }
      {!audiourl && msgerr && 
            <p className='font-ub text-xs text-white bg-red-600 w-full p-2 rounded-xs mt-2'>{msgerr}</p>
      }
      {!audiourl &&
      <>
       <FaCameraRetro onClick={()=>setCameraShow(!cameraShow)} className='text-xl absolute top-4 right-4'/>
      <label >
      <GrGallery onClick={handleImgsendModal} className='text-xl absolute top-4 right-12'/>
      <AudioRecorder className='absolute top-0 left-10 text-xl' onRecordingComplete={addAudioElement} />
      <div ref={emojiRef}>
        <ImHappy ref={emojiRef} onClick={()=>setEmojiShow(!emojiShow)} className='text-xl absolute top-4 right-28'/>
       {emojiShow && 
      <div className='absolute bottom-24  left-0 z-50'>
      <EmojiPicker   onEmojiClick={(emoji)=>handleEmoji(emoji)} />
      </div>
      }
       </div>
     
      </label>
      </>
     
      }
       {audiourl&&
      <div className='flex absolute top-[-30px] right-[-100px]'>
        <audio className='' controls src={audiourl}/>
        <button onClick={handleAudioUpload} className='bg-primary p-2 text-white font-ub font-semibold rounded-md'>Send audio</button>
        <button onClick={()=>setAudioUrl('')} className='bg-red-500 p-2 text-white font-ub font-semibold rounded-md ml-2'>Delete audio</button>
      </div>
      }
      
    
      </div>
      {cameraShow &&
          <div className='absolute top-0 left-0 w-full h-screen bg-[rgba(0,0,0,.8)] z-50 flex justify-center items-center'>
            <Camera
              onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
              onTakePhotoAnimationDone = { (dataUri) => { handleTakePhotoAnimationDone(dataUri); } }
              onCameraError = { (error) => { handleCameraError(error); } }
              idealFacingMode = {FACING_MODES.ENVIRONMENT}
              idealResolution = {{width: 640, height: 480}}
              imageType = {IMAGE_TYPES.JPG}
              imageCompression = {0.97}
              isMaxResolution = {true}
              isImageMirror = {false}
              isSilentMode = {false}
              isDisplayStartCameraError = {true}
              isFullscreen = {false}
              sizeFactor = {1}
              onCameraStart = { (stream) => { handleCameraStart(stream); } }
              onCameraStop = { () => { handleCameraStop(); } }
            />
            <GrFormClose onClick={()=>setCameraShow(false)} className='absolute top-1/2 left-10 text-3xl bg-red-500 text-white'/>
          </div>
      }
      {!audiourl &&
      <button onClick={handleMsgSubmit} className='bg-primary p-4 text-white font-ub font-semibold rounded-md'>Submit</button>
    }
    </div>
    
    
    }

    {/* msg option end  */}

  
    </div>
  )
}

export default Chat