import type { ChannelType } from './types'

export const getLocalChannelIds = (channel_type: ChannelType) =>
	JSON.parse(localStorage.getItem(channel_type) || '[]') as number[]

export const subscribeLocalChannel = (channel_id: number, channel_type: ChannelType) => {
	if (getLocalChannelIds(channel_type).includes(channel_id)) return
	const channelIds = getLocalChannelIds(channel_type)
	channelIds.push(channel_id)
	localStorage.setItem(channel_type, JSON.stringify(channelIds))
	window.dispatchEvent(new Event('storage'))
}

export const unSubscribeLocalChannel = (channel_id: number, channel_type: ChannelType) => {
	let channelIds = getLocalChannelIds(channel_type)
	channelIds = channelIds.filter((_id) => _id !== channel_id)
	localStorage.setItem(channel_type, JSON.stringify(channelIds))
	window.dispatchEvent(new Event('storage'))
}

export const unSubscribeAllLocalChannels = (channel_type: ChannelType) => {
	localStorage.removeItem(channel_type)
	window.dispatchEvent(new Event('storage'))
}
