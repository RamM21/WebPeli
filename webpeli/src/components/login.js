import { useState } from "react"
import { useNavigate } from "react-router-dom"
import style from './login.module.css'
import {AwsClient} from 'aws4fetch'
import { useAlert } from "react-alert"


export default function Login(props) {

    const alert = useAlert()
    const navigate = useNavigate()
    const[show,setShow]=useState(false)
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const aws = new AwsClient({
        accessKeyId:process.env.REACT_APP_KEY_ACCESS,
        secretAccessKey:process.env.REACT_APP_KEY_PERMISSION,
        service:process.env.REACT_APP_SERVICE,
        region:process.env.REACT_APP_REGION
    })
    
    async function login(){
        if(email.length>0 && password.length>0){
            var body = {"email":email,"password":password}
            body = JSON.stringify(body)
            var response = await aws.fetch(process.env.REACT_APP_LOGIN,{method:"post",body:body})
            response = await response.json()
            if(response.successful===true){
                alert.success("Login successful redirecting to mainpage")
                setTimeout(()=>{
                    sessionStorage.setItem("userId",response.userId)
                    sessionStorage.setItem("userName",response.userName)
                    props.login(true)
                    navigate('/')
                },2000)
            }else{
                alert.error("Wrong password or email try again")
            }
        }else{
            alert.info("Input both email and password then try again")
        }
    }


    return(
        <div className={style.background}>
            <div className={style.box}>
                <div>
                    <h4 className={style.topText}>Login</h4>
                </div>
                <div>
                    <div className={style.inputText}>Email</div>
                    <input className={style.input} type="text" onChange={(event)=>setEmail(event.target.value)}/>
                </div>
                <div>
                    <div className={style.inputText}>Password</div>
                    <div style={{display:"flex"}}>
                        {show ? <input className={style.passwordInput} type="text" onChange={(event)=>setPassword(event.target.value)}/>:<input className={style.passwordInput} type="password" onChange={(event)=>setPassword(event.target.value)}/>}
                        <button onMouseDown={()=>setShow(true)} onMouseUp={()=>setShow(false)}>show</button>
                    </div>
                </div>
                <button className={style.loginButton} onClick={()=>login()}>Login</button>
            </div>
        </div>
    )

}