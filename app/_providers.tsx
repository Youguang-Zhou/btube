'use client'

import { authDeleter, authFetcher, authPoster, fetcher } from '@/app/api/_index'
import { encodeURLSearchParams, sort } from '@/utils/functions'
import {
	getLocalChannelIds,
	subscribeLocalChannel,
	unSubscribeAllLocalChannels,
	unSubscribeLocalChannel,
} from '@/utils/localStorage'
import type { ChannelProps, ChannelType, ResponseProps } from '@/utils/types'
import type { AlertColor } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'
import { SessionProvider, useSession } from 'next-auth/react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useEffect, useState } from 'react'

/**
 * NextAuth.js
 */
export const NextAuthProvider = ({ children }: { children: ReactNode }) => (
	<SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>
)

/**
 * 全局提示
 */
interface AlertProps {
	severity: AlertColor
	message: string
}

interface AlertContextProps {
	Alerter: ReactNode
	setAlert: Dispatch<SetStateAction<AlertProps | undefined>>
}

export const AlertContext = createContext<AlertContextProps>({
	Alerter: undefined,
	setAlert: () => undefined,
})

export const AlertProvider = ({ children }: { children: ReactNode }) => {
	const [alert, setAlert] = useState<AlertProps | undefined>(undefined)
	const [Alerter, setAlerter] = useState<ReactNode | undefined>(undefined)

	useEffect(() => {
		if (alert) {
			setAlerter(
				<Snackbar
					className="mt-12"
					open={alert !== undefined}
					autoHideDuration={3000}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					onClose={() => setAlert(undefined)}
				>
					<Alert severity={alert.severity}>{alert.message}</Alert>
				</Snackbar>
			)
		}
		return () => setAlerter(undefined)
	}, [alert])

	return (
		<AlertContext.Provider value={{ Alerter, setAlert }}>
			{children}
			{alert && Alerter}
		</AlertContext.Provider>
	)
}

/**
 * 用户关注的频道
 */
interface SubscriptionContextProps {
	userChannels: ChannelProps[] | undefined
	publicChannels: ChannelProps[] | undefined
	setUserChannels: Dispatch<SetStateAction<ChannelProps[] | undefined>>
	setPublicChannels: Dispatch<SetStateAction<ChannelProps[] | undefined>>
	subscribe: (channel_id: number, channel_type?: ChannelType) => void
	unSubscribe: (channel_id: number, channel_type?: ChannelType) => void
	unSubscribeAll: (channel_type: ChannelType) => void
}

export const SubscriptionContext = createContext<SubscriptionContextProps>({
	userChannels: undefined,
	publicChannels: undefined,
	setUserChannels: () => undefined,
	setPublicChannels: () => undefined,
	subscribe: () => undefined,
	unSubscribe: () => undefined,
	unSubscribeAll: () => undefined,
})

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
	const [userChannels, setUserChannels] = useState<ChannelProps[] | undefined>(undefined)
	const [publicChannels, setPublicChannels] = useState<ChannelProps[] | undefined>(undefined)

	const { data: session } = useSession()

	const subscribe = (channel_id: number, channel_type?: ChannelType) => {
		if (
			userChannels?.find((c) => c.channel_id === channel_id) ||
			publicChannels?.find((c) => c.channel_id === channel_id)
		) {
			// 如果该频道已存在，不执行任何操作
			return
		}
		if (session === null && channel_type) {
			subscribeLocalChannel(channel_id, channel_type)
		} else if (session) {
			authPoster('subscription', { channel_id: channel_id }).then((res: ResponseProps<ChannelProps>) => {
				if (res.success && res.data) {
					const channel = res.data
					if (channel.is_user_channel === true && userChannels) {
						setUserChannels(sort([...userChannels, channel]))
					}
					if (channel.is_user_channel === false && publicChannels) {
						setPublicChannels(sort([...publicChannels, channel]))
					}
				}
			})
		}
	}

	const unSubscribe = (channel_id: number, channel_type?: ChannelType) => {
		if (userChannels === undefined || publicChannels === undefined) return
		if (session === null && channel_type) {
			unSubscribeLocalChannel(channel_id, channel_type)
		} else if (session) {
			authDeleter(`subscription?${encodeURLSearchParams({ channel_id: channel_id })}`).then((res) => {
				if (res.success) {
					if (userChannels.find((c) => c.channel_id === channel_id)) {
						setUserChannels(userChannels.filter((c) => c.channel_id !== channel_id))
					}
					if (publicChannels.find((c) => c.channel_id === channel_id)) {
						setPublicChannels(publicChannels.filter((c) => c.channel_id !== channel_id))
					}
				}
			})
		}
	}

	const unSubscribeAll = (channel_type: ChannelType) => {
		if (userChannels === undefined || publicChannels === undefined) return
		if (session === null) {
			unSubscribeAllLocalChannels(channel_type)
		} else {
			const channel_ids =
				channel_type === 'user-channels'
					? userChannels.map((c) => c.channel_id)
					: publicChannels.map((c) => c.channel_id)
			authDeleter(`subscription?${encodeURLSearchParams({ channel_id: JSON.stringify(channel_ids) })}`).then(
				(res) => {
					if (res.success) {
						if (channel_type === 'user-channels') {
							setUserChannels([])
						}
						if (channel_type === 'public-channels') {
							setPublicChannels([])
						}
					}
				}
			)
		}
	}

	useEffect(() => {
		if (session === undefined) return
		let handleLocalStorageChanged: () => void

		fetcher('channels').then(async (res: ResponseProps<ChannelProps[]>) => {
			if (res.success === false || res.data === undefined) return
			const all = res.data
			if (session === null) {
				/**
				 * 通过LocalStorage获取本地Channel
				 */
				handleLocalStorageChanged = () => {
					setUserChannels(all.filter((c) => getLocalChannelIds('user-channels').includes(c.channel_id)))
					setPublicChannels(all.filter((c) => getLocalChannelIds('public-channels').includes(c.channel_id)))
				}
				handleLocalStorageChanged()
				window.addEventListener('storage', handleLocalStorageChanged)
			} else {
				/**
				 * 获取用户保存的Channel
				 */
				const _res = (await authFetcher('subscription')) as ResponseProps<number[]>
				setUserChannels(all.filter((c) => c.is_user_channel === true && _res.data?.includes(c.channel_id)))
				setPublicChannels(all.filter((c) => c.is_user_channel === false && _res.data?.includes(c.channel_id)))
			}
		})
		return () => window.removeEventListener('storage', handleLocalStorageChanged)
	}, [session, setPublicChannels, setUserChannels])

	return (
		<SubscriptionContext.Provider
			value={{
				userChannels,
				publicChannels,
				setUserChannels,
				setPublicChannels,
				subscribe,
				unSubscribe,
				unSubscribeAll,
			}}
		>
			{children}
		</SubscriptionContext.Provider>
	)
}
