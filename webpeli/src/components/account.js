import { useState } from "react"
import style from './account.module.css'
import axios from 'axios'
import { useAlert } from "react-alert"

export default function Account(){

    const alert = useAlert()
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[confirmPassword,setConfirmPassword]=useState("")
    const[userName,setUserName]=useState("")
    const[showPassword,setShowPassword]=useState(false)
    const[showConfirmPassword,setShowConfirmPassword]=useState(false)

    function submit(){
        if(password.length>0 || confirmPassword.length>0){
            if(password===confirmPassword){
                axios('',{"userId":sessionStorage.getItem("userId"),"email":email,"password":password,"userName":userName})
                .then(Response=>{
                    if(Response.data.successful===true){
                        alert.success("Changes made successfully")
                    }else{
                        alert.error("Something went wrong try again")
                    }
                })
                .catch(err=>{
                    console.log(err)
                    alert.error("Something went wrong try again")
                })
            }else{
                alert.info("Password did not match with Confirm Password try again")
            }
        }else{
            axios('',{"userId":sessionStorage.getItem("userId"),"email":email,"password":password,"userName":userName})
                .then(Response=>{
                    if(Response.data.successful===true){
                        alert.success("Changes made successfully")
                    }else{
                        alert.error("Something went wrong try again")
                    }
                })
                .catch(err=>{
                    console.log(err)
                    alert.error("Something went wrong try again")
                })
        }
    }


    return(
        <div className={style.background}>
            <div className={style.box}>
                <div>
                    <h4 className={style.topText}>Account Information Change</h4>
                </div>
                <div>
                    <div className={style.inputText}>Email</div>
                    <input className={style.input} type="text" onChange={(event)=>setEmail(event.target.value)}/>
                </div>
                <div>
                    <div className={style.inputText}>UserName</div>
                    <input className={style.input} type="text" onChange={(event)=>setUserName(event.target.value)}/>
                </div>
                <div>
                    <div className={style.inputText}>Password</div>
                    <div style={{display:"flex"}}>
                        {showPassword ? <input className={style.input} type="text" onChange={(event)=>setPassword(event.target.value)}/>:<input className={style.input} type="password" onChange={(event)=>setPassword(event.target.value)}/>}
                        <button className={style.showButton} onMouseDown={()=>setShowPassword(true)} onMouseUp={()=>setShowPassword(false)}>show</button>
                    </div>
                </div>
                <div>
                    <div className={style.inputText}>Confirm Password</div>
                    <div style={{display:"flex"}}>
                        {showConfirmPassword ? <input className={style.input} type="text" onChange={(event)=>setConfirmPassword(event.target.value)}/>:<input className={style.input} type="password" onChange={(event)=>setConfirmPassword(event.target.value)}/>}
                        <button className={style.showButton} onMouseDown={()=>setShowConfirmPassword(true)} onMouseUp={()=>setShowConfirmPassword(false)}>show</button>
                    </div>
                </div>
                <button className={style.submitButton} onClick={()=>submit()}>Submit</button>
            </div>
        </div>
    )
}