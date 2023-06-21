import type { HTMLProps } from 'react'

const VideoTitle = ({ title, ...props }: HTMLProps<HTMLDivElement>) => (
	<div {...props} title={title}>
		<h1 className={title?.startsWith('【') ? 'indent-[-0.6rem]' : ''}>{title}</h1>
	</div>
)

export default VideoTitle
