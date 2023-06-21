import { fetcher } from '@/app/api/_index'
import type { ChannelProps, ResponseProps } from '@/utils/types'
import useSWR from 'swr'

const useChannels = (): [ChannelProps[] | undefined, ChannelProps[] | undefined, boolean, Error | undefined] => {
	/**
	 * 通过API获取所有Channel
	 */
	const { data, isLoading, error } = useSWR<ResponseProps<ChannelProps[]>, Error>('channels', fetcher, {
		revalidateOnFocus: false,
	})

	const userChannels = data?.data?.filter((c) => c.is_user_channel === true)
	const publicChannels = data?.data?.filter((c) => c.is_user_channel === false)

	return [userChannels, publicChannels, isLoading, error]
}

export { useChannels }
