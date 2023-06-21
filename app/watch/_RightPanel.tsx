'use client'

import type { VideoDetailProps } from '@/utils/types'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LikeButton } from './_components'

const RightPanel = ({
	video: {
		video_info: { video_id, video_description },
		video_collection,
	},
}: {
	video: VideoDetailProps
}) => {
	const descPanelRef = useRef<HTMLInputElement>(null)
	const [likeBtnLoaded, setLikeBtnLoaded] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		if (descPanelRef.current && likeBtnLoaded !== undefined) {
			// 数据都全部准备好后再展开
			descPanelRef.current.checked = true
		}
	}, [video_id, likeBtnLoaded])

	return (
		<div className="w-full bg-white shadow join join-vertical">
			<div className="collapse collapse-arrow join-item">
				<input ref={descPanelRef} type="radio" name="right-panel" />
				<div className="text-xl font-medium collapse-title">简介</div>
				<div className="collapse-content">
					{video_description ? (
						<p className="text-sm">{video_description}</p>
					) : (
						<small className="italic text-gray-500">本视频暂无简介......(´･_･`)</small>
					)}
					{/* 三连按钮 */}
					<div className="flex items-center mt-4">
						<LikeButton video_id={video_id} onLoad={() => setLikeBtnLoaded(true)} />
					</div>
				</div>
			</div>
			{video_collection?.collection_videos && (
				<div className="border-t collapse collapse-arrow join-item border-base-300">
					<input type="radio" name="right-panel" />
					<div className="flex items-center gap-1 collapse-title">
						<span className="text-xl font-medium">合集</span>
						<small className="text-gray-500">
							{`(${video_collection.collection_videos.findIndex((p) => p.video_id === video_id) + 1}/${
								video_collection.collection_videos.length
							})`}
						</small>
					</div>
					<div className="collapse-content">
						<ul className="overflow-scroll max-h-[300px] lg:max-h-[500px]">
							{video_collection.collection_videos.map((p, i) => (
								<Link
									key={i}
									className={`
                                        ${p.video_id === video_id ? 'text-primary font-bold' : 'text-gray-500'}
                                        hover:bg-primary hover:bg-opacity-10 hover:rounded-xl
                                        p-2 space-x-6 lg:space-x-8
                                        flex transition-all
                                    `}
									href={`/watch?v=${p.video_id}`}
									prefetch={false}
								>
									<div className="w-5 tabular-nums">{`P${i + 1}`}</div>
									<div>{p.video_title}</div>
								</Link>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	)
}

export default RightPanel
