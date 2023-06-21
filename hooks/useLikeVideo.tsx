import { authFetcher, authPoster, fetcher } from '@/app/api/_index'
import { encodeURLSearchParams } from '@/utils/functions'
import type { ResponseProps, SanLianProps } from '@/utils/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import useSWR from 'swr'

/**
 * From: https://github.com/delbaoliveira/website/blob/main/lib/usePostLikes.ts
 */
const useLikeVideo = (video_id: number) => {
	// 获取该视频所有点赞数
	const {
		data: {
			data: { likes: totalLikesData } = {
				likes: undefined,
			},
		} = {},
		mutate: mutateTotalLikes,
	} = useSWR<ResponseProps<SanLianProps>>(`videos/sanlian/${video_id}`, fetcher, { revalidateOnFocus: false })

	// 用户登录状态
	const { data: session } = useSession()

	// 如果用户登录，则获取当前用户点赞数
	const {
		data: {
			data: { likes: userLikesData } = {
				likes: undefined,
			},
		} = {},
		mutate: mutateUserLikes,
	} = useSWR<ResponseProps<SanLianProps>>(
		session ? ['likes', video_id] : null,
		() => authFetcher(`user/sanlian?${encodeURLSearchParams({ video_id })}`),
		{ dedupingInterval: 60 * 1000 }
	)

	// 一定时间内用户点击的点赞数
	const [batchedLikes, setBatchedLikes] = useState<number>(0)

	// 返回的UI，没有这个会导致undefined时UI跳动
	const [totalLikes, setTotalLikes] = useState<number | undefined>(undefined)
	const [userLikes, setUserLikes] = useState<number | undefined>(undefined)

	useEffect(() => {
		if (totalLikesData !== undefined) {
			setTotalLikes(totalLikesData)
		}
		if (userLikesData !== undefined) {
			setUserLikes(userLikesData)
		}
	}, [totalLikesData, userLikesData])

	const increment = () => {
		if (totalLikesData === undefined || userLikesData === undefined || userLikesData >= 10) return
		mutateTotalLikes(
			{
				data: {
					likes: totalLikesData + 1,
				},
				success: true,
				message: '',
			},
			false
		)
		mutateUserLikes(
			{
				data: {
					likes: userLikesData + 1,
				},
				success: true,
				message: '',
			},
			false
		)
		setBatchedLikes(userLikesData + 1)
	}

	useDebounce(
		() => {
			if (batchedLikes === 0) return
			mutateUserLikes(authPoster('user/sanlian', { video_id: video_id, count: batchedLikes }))
			setBatchedLikes(0)
		},
		1000,
		[batchedLikes]
	)

	return {
		totalLikes,
		userLikes,
		increment,
	}
}

export default useLikeVideo
