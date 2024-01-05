import * as dayjs from 'dayjs'
import * as isLeapYear from 'dayjs/plugin/isLeapYear' // 导入插件
import 'dayjs/locale/zh-cn' // 导入本地化语言

dayjs.extend(isLeapYear) // 使用插件
dayjs.locale('zh-cn') // 使用本地化语言

export const now = () => dayjs();

/**
 * 获取格式化后的时间字符串
 * @param date 必须是dayjs实例
 * @param fmt  格式
 */
export const dateStr = function(date:any, fmt:string='YYYY-MM-DD HH:mm:ss') {
    if(date && date.isValid()) {
        return date.format(fmt)
    }
    console.log('无效的dayjs实例')
    return ''
}

export const nowStr = function(fmt:string='YYYY-MM-DD HH:mm:ss') {
    return dayjs().format(fmt)
}