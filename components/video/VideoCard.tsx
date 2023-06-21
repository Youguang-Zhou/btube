import { formatDuration, formatUnixTimestampsToDate } from '@/utils/functions'
import type { VideoProps } from '@/utils/types'
import moment from 'moment'
import 'moment/locale/zh-cn'
import Image from 'next/image'
import Link from 'next/link'
import type { MouseEvent } from 'react'
import VideoTitle from './VideoTitle'

interface VideoCardProps {
	video: VideoProps
	size?: 'small' | 'large'
	asCollection?: boolean
	showAuthorName?: boolean
	showExactDate?: boolean
}

const VideoCard = ({
	video: {
		video_info: { video_id, video_title, video_cover, creation_time, author_name, duration },
		video_collection,
	},
	size = 'large',
	asCollection = false,
	showAuthorName = false,
	showExactDate = false,
}: VideoCardProps) => (
	<Link
		className="relative z-0"
		href={`/watch?v=${video_id}`}
		target="_blank"
		rel="noopener noreferrer"
		prefetch={false} // 鼠标悬浮时是否需要预加载
		draggable="false"
	>
		<div className="flex flex-col h-full overflow-hidden transition-all border rounded-lg hover:shadow-lg">
			<div className="relative">
				<Image
					className="aspect-video"
					src={asCollection ? String(video_collection?.collection_cover) : video_cover}
					alt={asCollection ? String(video_collection?.collection_title) : video_title}
					width={400}
					height={225}
					draggable="false"
					unoptimized
				/>
				<span className="absolute bottom-0 right-0 px-1 m-1 text-sm text-white bg-black rounded lg:text-base bg-opacity-80">
					{formatDuration(asCollection ? video_collection?.collection_duration || 0 : duration)}
				</span>
			</div>
			<div
				className={`flex flex-col flex-1 gap-1 p-2 bg-white lg:gap-4 ${size === 'large' ? 'lg:p-4' : 'lg:p-3'}`}
			>
				<VideoTitle
					className={`flex-1 line-clamp-2 ${size === 'large' ? 'lg:text-xl' : ''}`}
					title={asCollection ? video_collection?.collection_title : video_title}
				/>
				<span className="space-x-1 text-xs text-gray-600">
					{showAuthorName && (
						<>
							<small
								className="hover:text-primary"
								onClick={(e: MouseEvent<HTMLElement>) => {
									e.preventDefault()
									window.open(`/channels/@${author_name}`)
								}}
							>
								{author_name}
							</small>
							<small>·</small>
						</>
					)}
					<small>
						{showExactDate
							? formatUnixTimestampsToDate(creation_time)
							: moment.unix(creation_time).fromNow()}
					</small>
				</span>
			</div>
		</div>
		{asCollection && (
			<>
				<div className="absolute w-full h-full bg-gray-300 rounded-lg -top-1 left-1 -z-10"></div>
				<div className="absolute w-full h-full bg-gray-200 rounded-lg -top-2 left-2 -z-20"></div>
			</>
		)}
	</Link>
)

const VideoCardSkeleton = ({ num = 12 }: { num?: number }) => (
	<div className="video-container">
		{[...Array(num).keys()].map((i) => (
			<div
				key={i}
				role="status"
				className="flex flex-col overflow-hidden border rounded-lg shadow-lg animate-pulse"
			>
				<div className="flex items-center justify-center bg-gray-200 aspect-video">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 640 512"
						className="w-12 h-12 text-gray-100"
					>
						<path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
					</svg>
				</div>
				<div className="flex flex-col flex-1 gap-1 p-2 lg:gap-4 lg:p-4">
					<div className="h-4 bg-gray-200 rounded-full"></div>
					<div className="h-4 bg-gray-200 rounded-full"></div>
					<div className="w-24 h-3 bg-gray-200 rounded-full"></div>
				</div>
				<span className="sr-only">Loading...</span>
			</div>
		))}
	</div>
)

export { VideoCard, VideoCardSkeleton }
