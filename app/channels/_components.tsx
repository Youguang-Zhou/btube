import BlurBackground from '@/components/BlurBackground'
import DraggableChannelImage from '@/components/DraggableChannelImage'
import { formatUnixTimestampsToDate } from '@/utils/functions'
import type { ChannelProps } from '@/utils/types'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'

export const ChannelCardContainer = ({ children, title }: { children: ReactNode; title: string }) => (
	<div className="space-y-4">
		<div className="main-container-title">{title}</div>
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
			{children}
		</div>
	</div>
)

export const ChannelCard = ({
	channel_id,
	channel_name,
	channel_image,
	channel_route,
	channel_date,
	is_user_channel,
}: ChannelProps) => {
	const [isHover, setIsHover] = useState(false)

	return (
		<Link
			onMouseEnter={() => setIsHover(true)}
			onMouseLeave={() => setIsHover(false)}
			href={is_user_channel ? `/channels/@${channel_name}` : `/channels/${channel_route}`}
			draggable="false"
			prefetch={false}
		>
			<div
				className={
					is_user_channel
						? 'overflow-hidden rounded-full'
						: 'overflow-hidden rounded-lg   hover:shadow hover:bg-white/25 transition-all flex flex-col gap-2 border h-full'
				}
			>
				<BlurBackground backgroundImage={channel_image}>
					<DraggableChannelImage
						channel_id={channel_id}
						is_user_channel={is_user_channel}
						className={`
                            ${isHover ? (is_user_channel ? 'rounded-full p-4' : 'rounded-lg p-1') : ''}
                            transition-all 
                        `}
						src={channel_image}
						alt={channel_name}
					/>
				</BlurBackground>
				{is_user_channel === false && (
					<>
						<div className="flex-1 mx-2 line-clamp-2" title={channel_name}>
							{channel_name}
						</div>
						<small className="mx-2 mb-2 text-gray-500">{formatUnixTimestampsToDate(channel_date)}</small>
					</>
				)}
			</div>
			{is_user_channel && (
				<span
					className={`
                        ${isHover ? 'text-primary italic' : ''}
                        w-full mt-4 text-center line-clamp-2
                    `}
					title={channel_name}
				>
					{channel_name}
				</span>
			)}
		</Link>
	)
}
