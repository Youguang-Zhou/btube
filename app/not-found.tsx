import Image from 'next/image'
import Link from 'next/link'

const NotFound = () => (
	<div className="flex flex-col items-center justify-center w-1/2 h-full gap-8 mx-auto">
		<Image src="/assets/not_found.png" alt="not_found" width={192} height={192} />
		<p className="text-lg">我超，页面...不见了！</p>
		<p className="text-lg">如果你看到了该页面，请联系管理员处理，谢谢！</p>
		<Link className="btn btn-ghost" href="/">
			返回首页
		</Link>
	</div>
)

export default NotFound
