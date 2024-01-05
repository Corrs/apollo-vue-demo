import { layer } from "@layui/layui-vue"

export const successMsg = function(message: string, callback?: Function) {
    msg(message, { icon: 1 }, callback)
}

export const errorMsg = function(message: string, callback?: Function) {
    msg(message, { icon: 2 }, callback)
}

export const warnMsg = function(message: string, callback?: Function) {
    msg(message, { icon: 3 }, callback)
}

function msg(message: string, options?: any, callback?: Function) {
    if (callback) {
        layer.msg(message, options, callback())
    } else {
        layer.msg(message, options)
    }
}

export const confirm = function(message: string, confirmCallback: (p?:any) => Promise<boolean> | boolean,  title: string='提示') {
    layer.confirm(message, {
        title,
        btn: [
            {
                text: '确定',
                callback: (id: any) => {
                    if (confirmCallback) {
                        const ret = confirmCallback()
                        if (ret instanceof Promise) {
                            ret.then(r => {
                                if (r) {
                                    layer.close(id)
                                }
                            })
                        } else if (typeof ret === 'boolean' && ret) {
                            layer.close(id)
                        }
                    }
                }
            },
            {
                text: '取消',
                callback: (id: any) => {
                    layer.close(id)
                }
            }
        ]
    })
}