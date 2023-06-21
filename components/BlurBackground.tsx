import type { ReactNode } from 'react'

const BlurBackground = ({ children, backgroundImage }: { children: ReactNode; backgroundImage: string }) => (
	<div className="bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
		<div className="backdrop-blur">{children}</div>
	</div>
)

export default BlurBackground
