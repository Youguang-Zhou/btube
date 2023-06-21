import BlurBackground from '@/components/BlurBackground'
import DraggableChannelImage from '@/components/DraggableChannelImage'
import GradientBackground from '@/components/GradientBackground'
import type { ChannelDetailProps } from '@/utils/types'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { ChannelInfiniteVideos, SubscribeButton } from './_components'

const PublicChannelPage = ({
	channel: { channel_id, channel_name, channel_image, channel_description, channel_notes },
}: {
	channel: ChannelDetailProps
}) => (
	<>
		{/* ==================== Banner ==================== */}
		<BlurBackground backgroundImage={channel_image}>
			<GradientBackground>
				<div className="flex h-32 gap-4 p-4 lg:h-48 lg:gap-8 lg:px-14 lg:py-6 text-white/90">
					<DraggableChannelImage
						className="w-24 h-24 lg:w-36 lg:h-36"
						channel_id={channel_id}
						is_user_channel={false}
						src={channel_image}
						alt={channel_name}
					/>
					<div className="flex-1 space-y-2 lg:space-y-4">
						<div className="flex items-center gap-1 lg:gap-2">
							<h1 className="text-xl font-bold lg:text-5xl">{channel_name}</h1>
							<SubscribeButton channel_id={channel_id} channel_type="public-channels" />
						</div>
						{channel_notes.map(({ note_name, note_link }, i) => (
							<a
								key={i}
								href={note_link}
								className="flex items-center gap-1 text-xs w-fit lg:text-sm hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								<PhotoIcon className="w-4 h-4" />
								<span>{note_name}</span>
							</a>
						))}
					</div>
					<div className="self-end hidden italic xl:block">{channel_description}</div>
				</div>
			</GradientBackground>
		</BlurBackground>
		{/* ==================== Channel Videos ==================== */}
		<ChannelInfiniteVideos channel_id={channel_id} />
	</>
)

export default PublicChannelPage
