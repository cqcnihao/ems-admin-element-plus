//  成功信息
import {ElMessage} from "element-plus";

export function successMsg(msg){
    ElMessage.success(msg)
}

//  失败信息
export function errorMsg(msg){
    ElMessage.error(msg)
}

//  警告信息
export function waringMsg(msg){
    ElMessage.warning(msg)
}

//  提示信息
export function infoMsg(msg){
    ElMessage.info(msg)
}