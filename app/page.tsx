'use client'

import InfiniteScroll from '@/components/InfiniteScroll'
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard'
import usePageSize from '@/hooks/usePageSize'
import { useInfiniteVideos } from '@/hooks/useVideos'

const HomePage = () => {
	const pageSize = usePageSize()
	const [videoPages, isLoading, hasMore, loadMore] = useInfiniteVideos(undefined, undefined, 1, pageSize)

	return (
		<main className="main-container">
			<div className="main-container-title">今日推荐</div>
			<hr className="mt-2 mb-4 lg:mb-6" />
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

export default HomePage
