'use client'

import { useChannels } from '@/hooks/useChannels'
import { ChannelCard, ChannelCardContainer } from './_components'

const ChannelPage = () => {
	const [userChannels, publicChannels] = useChannels()

	return (
		<main className="space-y-12 main-container">
			<ChannelCardContainer title="游戏频道 🎮">
				{publicChannels?.map((c, i) => (
					<ChannelCard key={i} {...c} />
				))}
			</ChannelCardContainer>
			<ChannelCardContainer title="推荐UP主 🤖️">
				{userChannels?.map((c, i) => (
					<ChannelCard key={i} {...c} />
				))}
			</ChannelCardContainer>
		</main>
	)
}

export default ChannelPage
