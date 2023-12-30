import { layer } from "@layui/layui-vue"

export const successMsg = function(message: string, callback?: Function) {
    msg(message, { icon: 1 }, callback)
}

export const errorMsg = function(message: string, callback?: Function) {
    msg(message, { icon: 2 }, callback)
}

function msg(message: string, options?: any, callback?: Function) {
    if (callback) {
        layer.msg(message, options, callback())
    } else {
        layer.msg(message, options)
    }
}