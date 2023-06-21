import { fetcher } from '@/app/api/_index'
import { encodeURLSearchParams } from '@/utils/functions'
import type { GetVideosResponseProps, ResponseProps, VideoProps } from '@/utils/types'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

const useVideos = (
	channel_id?: number,
	author_name?: string,
	page_num = 1,
	page_size = 12,
	return_collapsed_videos = 1, // 是否在返回视频时折叠同一个 collection_id
	return_collection_videos = 0 // 是否返回合集所属视频
): [VideoProps[] | undefined, number | undefined, boolean | undefined] => {
	const [videos, setVideos] = useState<VideoProps[] | undefined>(undefined)
	const [totalCounts, setTotalCounts] = useState<number | undefined>(undefined)

	const { data, isLoading } = useSWR<ResponseProps<GetVideosResponseProps>, Error>(
		`videos?${encodeURLSearchParams({
			channel_id,
			author_name,
			page_num: page_num,
			page_size,
			return_collapsed_videos,
			return_collection_videos,
		})}`,
		fetcher
	)

	useEffect(() => {
		if (data?.success && data.data) {
			setVideos(data.data.videos)
			setTotalCounts(data.data.total_counts)
		}
	}, [data])

	return [videos, totalCounts, isLoading]
}

const useInfiniteVideos = (
	channel_id?: number,
	author_name?: string,
	page_num = 1,
	page_size = 12,
	return_collapsed_videos = 1, // 是否在返回视频时折叠同一个 collection_id
	return_collection_videos = 0 // 是否返回合集所属视频
): [Array<VideoProps[]> | undefined, boolean | undefined, boolean | undefined, () => void] => {
	const [videoPages, setVideoPages] = useState<Array<VideoProps[]> | undefined>(undefined)
	const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined)
	const [hasMore, setHasMore] = useState<boolean | undefined>(undefined)

	const {
		data,
		size,
		setSize,
		isLoading: isSWRLoading,
		isValidating: isSWRValidating,
	} = useSWRInfinite<ResponseProps<GetVideosResponseProps>, Error>(
		(pageIndex) =>
			`videos?${encodeURLSearchParams({
				channel_id,
				author_name,
				page_num: pageIndex + 1,
				page_size,
				return_collapsed_videos,
				return_collection_videos,
			})}`,
		fetcher,
		{
			initialSize: page_num,
			revalidateOnFocus: false,
			revalidateOnMount: false,
			revalidateFirstPage: false,
		}
	)

	useEffect(() => {
		// 重置pageNum，不然会有小bug
		setSize(1)
	}, [setSize])

	useEffect(() => {
		if (data) {
			setVideoPages(data.map((res) => res.data?.videos || []))
			setHasMore(data.pop()?.data?.videos.length !== 0)
		}
	}, [data])

	useEffect(() => {
		setIsLoading(isSWRLoading || isSWRValidating)
	}, [isSWRLoading, isSWRValidating])

	const loadMore = () => setSize(size + 1)

	return [videoPages, isLoading, hasMore, loadMore]
}

export { useVideos, useInfiniteVideos }
