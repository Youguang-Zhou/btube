import { fetcher } from '@/app/api/_index'
import VideoTitle from '@/components/video/VideoTitle'
import { formatUnixTimestampsToDate, formatUnixTimestampsToDateTime } from '@/utils/functions'
import type { ResponseProps, VideoDetailProps } from '@/utils/types'
import { ClockIcon, LinkIcon } from '@heroicons/react/24/outline'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RightPanel from './_RightPanel'
import { CloseButton } from './_components'

interface VideoPlayPageProps {
	searchParams: { v: string }
}

const generateTitle = (video: VideoDetailProps | undefined) => {
	if (video) {
		let title = video.video_info.video_title
		if (video.video_collection?.collection_title) {
			title = `${video.video_collection.collection_title} —— ${title}`
		}
		return title
	} else {
		return undefined
	}
}

export const generateMetadata = async ({ searchParams: { v } }: VideoPlayPageProps): Promise<Metadata> => {
	const { data: video } = (await fetcher(`videos/${v}`)) as ResponseProps<VideoDetailProps>
	return {
		title: generateTitle(video),
	}
}

const VideoPlayPage = async ({ searchParams: { v } }: VideoPlayPageProps) => {
	const { data: video } = (await fetcher(`videos/${v}`)) as ResponseProps<VideoDetailProps>

	if (video === undefined) {
		return notFound()
	}

	const {
		video_info: { video_title, video_iframe_url, creation_time },
		author_info: { author_name, author_avatar },
	} = video

	return (
		<main className="flex flex-col gap-4 main-container lg:px-20 lg:py-4 lg:gap-8 lg:flex-row">
			{/* 左边栏 */}
			<section className="w-full lg:w-[70%]">
				<div className="flex flex-col bg-white border rounded-md">
					{/* 播放器 */}
					<iframe
						className="w-full aspect-video"
						title={video_title}
						src={video_iframe_url}
						autoFocus={false}
					/>
					{/* 播放页Container */}
					<div className="flex items-end gap-2 m-3">
						<div className="flex flex-col flex-1 gap-2">
							{/* 标题 */}
							<div className="flex gap-4">
								<Link
									className="hidden lg:block"
									href={`/channels/@${author_name}`}
									target="_blank"
									rel="noopener noreferrer"
									draggable="false"
								>
									<Image
										className="transition-all duration-75 rounded-md lg:w-16 lg:h-16 hover:border-2 hover:shadow-lg"
										src={author_avatar}
										alt={author_name}
										width={32}
										height={32}
										draggable="false"
									/>
								</Link>
								<div className="flex-1 space-y-1 lg:space-y-2">
									<VideoTitle
										className="font-semibold lg:font-normal md:text-xl lg:text-2xl"
										title={generateTitle(video)}
									/>
									<div className="flex items-center gap-2 text-xs text-gray-500 lg:gap-6">
										{[
											{
												icon: <ClockIcon className="w-4 h-4" />,
												content: (
													<span className="tabular-nums">
														<span className="hidden lg:block">
															{formatUnixTimestampsToDateTime(creation_time)}
														</span>
														<span className="block lg:hidden">
															{formatUnixTimestampsToDate(creation_time)}
														</span>
													</span>
												),
											},
											{
												icon: <LinkIcon className="w-4 h-4" />,
												content: (
													<span>
														<span className="hidden lg:block">转载视频，原地址见水印</span>
														<span className="block lg:hidden">转载视频</span>
													</span>
												),
											},
										].map(({ icon, content }, i) => (
											<div key={i} className="flex items-center gap-1">
												{icon}
												{content}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<CloseButton />
					</div>
				</div>
			</section>
			{/* 右边栏 */}
			<section className="w-full lg:w-[30%]">
				<RightPanel video={video} />
			</section>
		</main>
	)
}

export default VideoPlayPage
