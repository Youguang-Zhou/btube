import BlurBackground from '@/components/BlurBackground'
import DraggableChannelImage from '@/components/DraggableChannelImage'
import GradientBackground from '@/components/GradientBackground'
import { Tab, Tabs } from '@/components/Tabs'
import type { ChannelDetailProps } from '@/utils/types'
import { FilmIcon, HomeIcon } from '@heroicons/react/24/outline'
import { SubscribeButton, UserAllVideosTab, UserHomeTab } from './_components'

const UserChannelPage = ({ channel: { channel_id, channel_name, channel_image } }: { channel: ChannelDetailProps }) => {
	return (
		<>
			{/* ==================== Banner ==================== */}
			<BlurBackground backgroundImage={channel_image}>
				<GradientBackground>
					<div className="relative h-32 lg:h-48">
						<div className="absolute left-0 right-0 flex flex-col items-center gap-1 -bottom-1/2 lg:gap-4">
							<DraggableChannelImage
								channel_id={channel_id}
								is_user_channel={true}
								className="w-32 h-32 border rounded-full lg:w-48 lg:h-48 border-white/50"
								src={channel_image}
								alt={channel_name}
							/>
							<div className="relative flex items-center">
								<h1 className="text-lg font-semibold lg:text-2xl opacity-90">{channel_name}</h1>
								<div className="absolute flex ml-2 left-full w-max">
									<SubscribeButton channel_id={channel_id} channel_type="user-channels" />
								</div>
							</div>
						</div>
					</div>
				</GradientBackground>
			</BlurBackground>
			{/* ==================== User Channel Tabs ==================== */}
			<Tabs className="pt-16 main-container lg:pt-24 xl:px-32 2xl:px-80">
				<Tab label="个人主页" icon={<HomeIcon />} content={<UserHomeTab channel_name={channel_name} />} />
				<Tab label="投稿视频" icon={<FilmIcon />} content={<UserAllVideosTab channel_name={channel_name} />} />
			</Tabs>
		</>
	)
}

export default UserChannelPage
