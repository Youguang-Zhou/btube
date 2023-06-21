'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

const GlobalError = ({ error }: { error: Error }) => {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html>
			<body>
				<div className="flex flex-col items-center justify-center w-1/2 h-full gap-8 mx-auto">
					<Image src="/assets/not_found.png" alt="not_found" width={192} height={192} />
					<p className="text-lg">恭喜你（🤠）！找到了我们（🤡）的bug...</p>
					<p className="text-lg">如果你看到了该页面，请联系管理员处理，谢谢！</p>
					<Link className="btn btn-ghost" href="/">
						返回首页
					</Link>
				</div>
			</body>
		</html>
	)
}

export default GlobalError
