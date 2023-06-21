'use client'

import useLikeVideo from '@/hooks/useLikeVideo'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'

export const CloseButton = () => {
	const router = useRouter()
	return (
		<button
			className="btn btn-neutral btn-circle btn-xs lg:btn-sm"
			onClick={() => {
				// 尝试关闭当前页面
				window.close()
				// 如果关闭失败，则返回上一页
				router.back()
			}}
		>
			<XMarkIcon className="w-full h-full" />
		</button>
	)
}

export const LikeButton = ({ video_id, onLoad }: { video_id: number; onLoad: () => void }) => {
	const clickSound = '/assets/sounds/glug-click.mp3'
	const clickEndSound = '/assets/sounds/glug-clickend.mp3'

	const emojis = ['👍', '😃', '🌼', '😊', '🎉', '🥳', '🚀', '🤩', '🎆', '🥰']

	const { totalLikes, userLikes, increment } = useLikeVideo(video_id)
	const { data: session } = useSession()

	const [playbackRate, setPlaybackRate] = useState(1)
	const [playClick] = useSound(clickSound, { playbackRate })
	const [playClickEnd] = useSound(clickEndSound, { playbackRate: 3, volume: 0.5 })

	const [animatedEmojis, setAnimatedEmojis] = useState(userLikes ? [emojis[userLikes]] : [])

	useEffect(() => {
		// 切换视频时重置音量状态
		setPlaybackRate(1)
	}, [video_id])

	useEffect(() => {
		if (session === undefined) return
		if (session) {
			if (totalLikes !== undefined && userLikes !== undefined) {
				onLoad()
			}
		} else if (totalLikes !== undefined) {
			onLoad()
		}
	}, [session, totalLikes, userLikes, onLoad])

	const handleLikeBtnClicked = () => {
		if (session) {
			if (userLikes !== undefined && userLikes < 10) {
				increment()
				setPlaybackRate(playbackRate + 0.15)
				setAnimatedEmojis([...animatedEmojis, emojis[userLikes]])
				if (userLikes === 9) {
					playClickEnd()
				} else {
					playClick()
				}
			}
		} else {
			window.LoginModal.showModal()
		}
	}

	return (
		<div className="flex items-center gap-1">
			<div className="relative">
				{animatedEmojis.map((emoji, i) => (
					<span key={i} className="absolute animate-[emoji_0.75s_ease-out] w-full text-center opacity-0">
						{emoji}
					</span>
				))}
				<button
					className={`
						relative rounded-none bg-gray-300
						duration-300 ease-out transition-all
						hover:scale-[1.2]
						active:scale-100
						mask mask-heart
						w-8 h-8
						m-1 p-1
					`}
					onClick={handleLikeBtnClicked}
				>
					<span
						className="absolute inset-0 transition-transform bg-gradient-to-tl from-red-400 to-rose-400"
						style={{ transform: `translate(0%, ${userLikes ? 100 - userLikes * 10 : 100}%)` }}
					/>
				</button>
			</div>
			<span
				className={`
					${userLikes ? 'text-rose-500' : 'text-gray-500'}
					text-xl font-medium 
				`}
			>
				{totalLikes}
			</span>
		</div>
	)
}
