import type { ImageProps } from 'next/image'
import Image from 'next/image'

interface DraggableChannelImageProps extends ImageProps {
	channel_id: number
	is_user_channel: boolean
}

const DraggableChannelImage = ({ channel_id, is_user_channel, alt, ...props }: DraggableChannelImageProps) => (
	<Image
		id={`${is_user_channel ? 'user-channels' : 'public-channels'}_${channel_id}`}
		alt={alt}
		width={600}
		height={600}
		unoptimized
		{...props}
	/>
)

export default DraggableChannelImage
