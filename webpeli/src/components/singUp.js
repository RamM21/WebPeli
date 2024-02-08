import { useState } from "react"
import { useNavigate } from "react-router-dom"
import style from './singup.module.css'
import axios from 'axios'
import { useAlert } from "react-alert"

export default function SingUp() {

    const alert = useAlert()
    const navigate = useNavigate()
    const[showPassword,setShowPassword]=useState(false)
    const[showConfirmPassword,setShowConfirmPassword]=useState(false)
    const[email,setEmail]=useState("")
    const[userName,setUserName]=useState("")
    const[password,setPassword]=useState("")
    const[confirmPassword,setConfirmPassword]=useState("")

    function signUp(){
        if(email.length>0 && userName.length>0 && password.length>0 && confirmPassword.length>0){
            if(password===confirmPassword){
                axios.post('',{"email":email,"userName":userName,"password":password})
                .then(Response=>{
                    if(Response.data.successful===true){
                        alert.success("Sign Up successful redirecting to Login")
                        setTimeout(()=>{
                            navigate('/login')
                        },2000)
                    }else{
                        alert.error("something went wrong try again")
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            }else{
                alert.info("Password did not match with Confirm Password try again")
            }
        }else{
            alert.info("Fill in all boxes and try again")
        }
    }

    return(
        <div className={style.box}>
            <h4 className={style.topText}>SignUp</h4>
            <div>
                <div className={style.inputText}>Email</div>
                <input className={style.input} onChange={(event)=>setEmail(event.target.value)}/>
            </div>
            <div>
                <div className={style.inputText}>User Name</div>
                <input className={style.input} onChange={(event)=>setUserName(event.target.value)}/>
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
            <button className={style.signUpButton} onClick={()=>signUp()}>Sign Up</button>
        </div>
    )

}