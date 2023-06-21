import { fetcher } from '@/app/api/_index'
import type { ChannelDetailProps, ResponseProps } from '@/utils/types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicChannelPage from './_PublicChannelPage'
import UserChannelPage from './_UserChannelPage'

export const generateMetadata = async ({
	params: { channel_route },
}: {
	params: { channel_route: string }
}): Promise<Metadata> => {
	const { data: channel } = (await fetcher(`channels/${channel_route}`)) as ResponseProps<ChannelDetailProps>
	return {
		title: channel?.channel_name,
	}
}

const ChannelDetailPage = async ({ params: { channel_route } }: { params: { channel_route: string } }) => {
	const { data: channel } = (await fetcher(`channels/${channel_route}`)) as ResponseProps<ChannelDetailProps>

	if (channel === undefined) {
		return notFound()
	}

	return channel.is_user_channel ? <UserChannelPage channel={channel} /> : <PublicChannelPage channel={channel} />
}

export default ChannelDetailPage
