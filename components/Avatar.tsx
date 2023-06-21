import { useSession } from 'next-auth/react'
import Image from 'next/image'
import type { HTMLProps } from 'react'

const Avatar = ({ className, src }: HTMLProps<HTMLElement>) => {
	const { data: session } = useSession()

	return (
		<Image
			className={`rounded-full ${className || ''}`}
			src={src || session?.user.image || '/assets/avatar_default.png'}
			alt={session?.user.name || 'user_avatar'}
			width={300}
			height={300}
			draggable="false"
			priority
		/>
	)
}

export default Avatar
