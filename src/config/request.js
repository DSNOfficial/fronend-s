import axios from "axios";
import { Config, logout, setAccessToken, setRefreshToken } from "./helper";
import { message } from "antd";

export const request = async (url="", method="get", data={},new_token) => {
    var param_get = "";
    if(method === "get" && Object.keys(data).length > 0){
        //convert object url query ?txt_search=com&status=1&brand=a&group=b
        Object.keys(data).map((key,i)=>{
            param_get += (i == 0 ? "?" : "&")+key+"="+data[key]
        })
    }
    var headers = {'Content-Type': 'application/json'}
    if(data instanceof FormData){ // check if param data is FormData
        headers = {  'Content-Type': 'multipart/form-data'}
    }
    var access_token = localStorage.getItem("access_token")
    if(new_token){
        access_token = new_token
    }
    return axios({
        url : Config.base_url + url + param_get, 
        method : method,
        data : data,
        headers : {
            ...headers, 
            Authorization  : "Bearer "+access_token
        }
    }).then(res=>{
        return res.data;
    }).catch(error=>{
        console.log("err:",error)
        var status = error.response?.status
        if(status == 404){
            message.error(error.message+"")
        }else if(status == 500){
            message.error(error.message+"")
        
        }else if(status == 401){
            if(error?.response?.data?.error?.name == "TokenExpiredError"){
                console.log("Expired token need to refresh new")
                return refreshToken(url,method,data)
            }else if(error?.response?.data?.error?.name){
                logout();
                return;
            }else{
                message.error("You don't have permission to access this method")
            }
        }else if(status == 409){ // Handle duplication error
            message.error("Duplicate data found. Please check your input.")
        }
        return false;
    })
}

export const refreshToken = (url,method,data) => {
    const refresh_token = localStorage.getItem("refresh_token")
    return axios({
        url: Config.base_url + "refresh_token",
        method:"post",
        data:{
            "refresh_token" :refresh_token
        }
    }).then(res=>{
        // restore new (access_token and refresh_token)
        setAccessToken(res.data.access_token)
        setRefreshToken(res.data.refesh_token)
        var new_token = res.data.access_token
        return request(url,method,data,new_token)
    }).catch(error=>{
        message.error("refresh fail")
        logout()
        return false
    })
}