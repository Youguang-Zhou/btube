import moment from 'moment'
import type { ChannelProps } from './types'

// 关闭侧边栏
export const closeSidebar = () => {
	const drawer = document.getElementById('sidebar-drawer') as HTMLInputElement
	drawer.checked = false
}

// 格式化 Unix 时间戳
export const formatUnixTimestampsToDate = (unixTimestamps: number) =>
	moment.unix(unixTimestamps).utcOffset(480).format('YYYY-MM-DD')

// 格式化 Unix 时间戳（包括时间）
export const formatUnixTimestampsToDateTime = (unixTimestamps: number) =>
	moment.unix(unixTimestamps).utcOffset(480).format('YYYY-MM-DD HH:mm:ss')

// 格式化 duration（单位是秒）
export const formatDuration = (duration: number): string => {
	const time = moment.utc(duration * 1000)
	return time.hour() == 0 ? time.format('mm:ss') : time.format('HH:mm:ss')
}

// 编码URL参数，去除 undefined 或 null 参数
export const encodeURLSearchParams = (params: Record<string, string | number | undefined>) => {
	let str = ''
	for (const key in params) {
		if (params[key] !== undefined && params[key] !== null) {
			if (str !== '') {
				str += '&'
			}
			str += `${key}=${params[key]}`
		}
	}
	return new URLSearchParams(str).toString()
}

// 根据频道创建时间排序
export const sort = (channels: ChannelProps[]) => channels.sort((a, b) => b.channel_date - a.channel_date)
