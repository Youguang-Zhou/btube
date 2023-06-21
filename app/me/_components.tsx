import { ResponseProps } from '@/utils/types'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { fetcher } from '../api/_index'

export interface AvatarPorps {
	avatar_name: string
	avatar_url: string
}

export const ChangeAvatar = ({ onAvatarClicked }: { onAvatarClicked: (avatar: AvatarPorps) => void }) => {
	const [avatars, setAvatars] = useState<AvatarPorps[] | undefined>(undefined)

	useEffect(() => {
		fetcher('avatars').then((res: ResponseProps<AvatarPorps[]>) => {
			if (res.success && res.data) {
				setAvatars(res.data)
			}
		})
	}, [])

	return avatars ? (
		<div className="grid grid-cols-3 gap-4 p-4 border lg:grid-cols-4">
			{avatars.map((avatar, i) => (
				<Image
					key={i}
					className="hover:cursor-pointer"
					src={avatar.avatar_url}
					alt={avatar.avatar_name}
					width={300}
					height={300}
					onClick={() => onAvatarClicked(avatar)}
					draggable="false"
					unoptimized
				/>
			))}
		</div>
	) : (
		<></>
	)
}
