'use client'

import { SubscriptionContext } from '@/app/_providers'
import InfiniteScroll from '@/components/InfiniteScroll'
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard'
import VideoTitle from '@/components/video/VideoTitle'
import useDesktop from '@/hooks/useDesktop'
import usePageSize from '@/hooks/usePageSize'
import { useInfiniteVideos, useVideos } from '@/hooks/useVideos'
import { formatUnixTimestampsToDate } from '@/utils/functions'
import type { ChannelType, CollectionProps, VideoProps } from '@/utils/types'
import {
	ChevronDoubleUpIcon,
	EllipsisVerticalIcon,
	HeartIcon as HeartOutlineIcon,
	PlayCircleIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Pagination } from '@mui/material'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'

export const SubscribeButton = ({ channel_id, channel_type }: { channel_id: number; channel_type: ChannelType }) => {
	const { userChannels, publicChannels, subscribe, unSubscribe } = useContext(SubscriptionContext)
	const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		if (userChannels !== undefined && publicChannels !== undefined) {
			if (
				userChannels.find((ch) => ch.channel_id === channel_id) ||
				publicChannels.find((ch) => ch.channel_id === channel_id)
			) {
				setIsSubscribed(true)
			} else {
				setIsSubscribed(false)
			}
		}
	}, [channel_id, userChannels, publicChannels])

	const handleBtnClicked = () => {
		if (isSubscribed) {
			unSubscribe(channel_id, channel_type)
		} else {
			subscribe(channel_id, channel_type)
		}
	}

	return (
		<>
			{isSubscribed !== undefined && (
				<button
					className={`
						btn btn-neutral btn-circle btn-xs lg:btn-sm transition-none
						${isSubscribed ? 'border-none bg-transparent hover:bg-transparent' : ''}
					`}
					onClick={handleBtnClicked}
				>
					{isSubscribed ? (
						<HeartSolidIcon className="w-6 h-6 text-red-500/90" />
					) : (
						<HeartOutlineIcon className="w-6 h-6 p-[0.1rem]" />
					)}
				</button>
			)}
		</>
	)
}

export const ChannelInfiniteVideos = ({ channel_id }: { channel_id: number }) => {
	const pageSize = usePageSize()
	const [videoPages, isLoading, hasMore, loadMore] = useInfiniteVideos(channel_id, undefined, 1, pageSize)

	return (
		<main className="main-container">
			{videoPages && hasMore !== undefined && isLoading !== undefined ? (
				<InfiniteScroll hasMore={hasMore} isLoading={isLoading} loadMore={loadMore}>
					<div className="video-container">
						{videoPages.map((videos) =>
							videos.map((v, i) => (
								<VideoCard
									key={i}
									video={v}
									asCollection={v.video_collection !== undefined}
									showAuthorName
								/>
							))
						)}
					</div>
				</InfiniteScroll>
			) : (
				<VideoCardSkeleton num={pageSize} />
			)}
		</main>
	)
}

export const UnfoldedCollectionCard = ({
	collection: { collection_title, collection_cover, collection_videos, collection_description },
	total,
}: {
	collection: CollectionProps
	total: number
}) => {
	const [showEverything, setShowEverything] = useState(false)
	const [isHoverLeftPanel, setIsHoverLeftPanel] = useState(false)

	return (
		<div className="relative z-0">
			<div className={`bg-white flex border rounded-xl min-h-[340px] ${showEverything ? '' : 'divide-x'}`}>
				<div
					className={`w-1/3 relative flex ${showEverything ? 'items-start' : 'items-center'} justify-center`}
				>
					<div
						className={`${
							showEverything
								? 'static w-[100%] h-[100%] border-l-0 rounded-r-none'
								: `absolute w-[90%] h-[90%] hover:w-[110%] hover:h-[110%]
												shadow hover:shadow-2xl`
						}
							flex border rounded-xl overflow-hidden
							ease-in-out duration-300 transition-all
						`}
						onMouseEnter={() => setIsHoverLeftPanel(true)}
						onMouseLeave={() => setIsHoverLeftPanel(false)}
					>
						<div className="flex flex-col w-full h-full bg-white">
							<div className="relative">
								<Image
									className="w-full aspect-video"
									src={collection_cover}
									alt={collection_title}
									width={320}
									height={180}
								/>
								<Link
									className="absolute top-0 left-0 flex items-center justify-center w-full h-full gap-1 text-white transition-opacity duration-300 opacity-0 hover:opacity-100 bg-black/70"
									href={`/watch?v=${collection_videos[0].video_id}`}
									target="_blank"
									rel="noopener noreferrer"
									prefetch={false}
								>
									<PlayCircleIcon className="w-6 h-6" />
									<span>播放全部</span>
								</Link>
							</div>
							<div className={`flex flex-col ${showEverything ? '' : 'flex-1'} gap-1 p-4`}>
								<div className={`flex justify-between ${isHoverLeftPanel ? '' : 'flex-1'} gap-4`}>
									<VideoTitle className="text-lg font-bold line-clamp-2" title={collection_title} />
									<span className="italic">{total}p</span>
								</div>
								{(isHoverLeftPanel || showEverything) && (
									<p
										className={`
											${isHoverLeftPanel && showEverything === false ? 'line-clamp-3' : ''} 
											${showEverything ? '' : 'hover:text-primary hover:cursor-pointer'}
											flex-1 text-sm mb-2
										`}
										onClick={() => setShowEverything(true)}
									>
										{collection_description}
									</p>
								)}
								<div>
									<small className="block text-xs tabular-nums text-black/70">
										创建时间：
										{formatUnixTimestampsToDate(collection_videos[total - 1].creation_time)}
									</small>
									<small className="block text-xs tabular-nums text-black/70">
										更新时间：
										{formatUnixTimestampsToDate(collection_videos[0].creation_time)}
									</small>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`w-2/3 px-6 my-6 ${total > 8 ? 'pr-0' : ''}`}>
					<div className="flex h-full">
						<div className="grid grid-cols-4 gap-4 h-fit">
							{collection_videos.slice(0, showEverything ? undefined : 8).map((v, i) => (
								<Link
									key={i}
									className="flex flex-col gap-2 hover:text-primary"
									href={`/watch?v=${v.video_id}`}
									target="_blank"
									rel="noopener noreferrer"
									prefetch={false}
								>
									<Image
										className="rounded aspect-video"
										src={v.video_cover}
										alt={v.video_title}
										width={160}
										height={90}
									/>
									<div className="flex flex-col flex-1 gap-2">
										<VideoTitle className="flex-1 text-sm line-clamp-2" title={v.video_title} />
										<small className="text-xs text-gray-500">
											{moment.unix(v.creation_time).fromNow()}
										</small>
									</div>
								</Link>
							))}
						</div>
						{total > 8 && (
							<button
								className="mx-2 transition-all rounded-full hover:bg-primary/10 hover:text-primary"
								onClick={() => setShowEverything(!showEverything)}
							>
								{showEverything ? (
									<ChevronDoubleUpIcon className="w-6 h-6" />
								) : (
									<EllipsisVerticalIcon className="w-6 h-6" />
								)}
							</button>
						)}
					</div>
				</div>
			</div>
			<div className="absolute w-full h-full bg-gray-300 rounded-xl -top-1 left-1 -z-10"></div>
			<div className="absolute w-full h-full bg-gray-200 rounded-xl -top-2 left-2 -z-20"></div>
		</div>
	)
}

/**
 * 个人主页
 */
export const UserHomeTab = ({ channel_name }: { channel_name: string }) => {
	const [videos] = useVideos(undefined, channel_name, 1, 100, 1, 1)

	const [singleVideos, setSingleVideos] = useState<VideoProps[] | undefined>(undefined)
	const [collectionVideos, setCollectionVideos] = useState<VideoProps[] | undefined>(undefined)

	useEffect(() => {
		if (videos) {
			setSingleVideos(videos.filter((v) => v.video_collection === undefined))
			setCollectionVideos(videos.filter((v) => v.video_collection !== undefined))
		}
	}, [videos])

	return (
		<div className="space-y-8">
			{singleVideos && singleVideos.length > 0 && (
				<>
					<div className="mb-2 text-2xl font-medium">投稿视频</div>
					<div className="video-container">
						{singleVideos.map((v, i) => (
							<VideoCard key={i} video={v} size="small" />
						))}
					</div>
				</>
			)}
			{collectionVideos && collectionVideos.length > 0 && (
				<>
					<div className="mb-4 text-2xl font-medium lg:mb-5">合集视频</div>
					{/* 桌面端 */}
					<div className="hidden space-y-8 lg:block">
						{collectionVideos.map(
							({ video_collection }, i) =>
								video_collection && (
									<UnfoldedCollectionCard
										key={i}
										collection={video_collection}
										total={video_collection.collection_videos.length}
									/>
								)
						)}
					</div>
					{/* 移动端 */}
					<div className="grid lg:hidden video-container">
						{collectionVideos.map((v, i) => (
							<VideoCard video={v} key={i} asCollection />
						))}
					</div>
				</>
			)}
		</div>
	)
}

/**
 * 投稿视频
 */
export const UserAllVideosTab = ({ channel_name }: { channel_name: string }) => {
	const [pageNum, setPageNum] = useState(1)
	const pageSize = usePageSize()

	const [videos, totalCounts, isLoading] = useVideos(undefined, channel_name, pageNum, pageSize, 0, 0)
	const isDesktop = useDesktop()

	return isLoading ? (
		<VideoCardSkeleton num={pageSize} />
	) : (
		<div className="flex flex-col items-center gap-4 lg:gap-8">
			<div className="video-container">
				{videos?.map((v, i) => (
					<VideoCard key={i} video={v} size="small" showExactDate />
				))}
			</div>
			{totalCounts && pageSize && Math.ceil(totalCounts / pageSize) !== 1 && (
				<Pagination
					size={isDesktop ? 'large' : 'small'}
					count={Math.ceil(totalCounts / pageSize)}
					page={pageNum}
					onChange={(_, num) => setPageNum(num)}
					showFirstButton
					showLastButton
					boundaryCount={isDesktop ? 3 : 1}
				/>
			)}
		</div>
	)
}
