import Link from 'next/link'

const SecurityPage = () => (
	<div className="lg:space-y-4">
		<div className="hidden text-xl font-semibold text-black/80 lg:block">▶️ 我的密码 🔑</div>
		<Link
			className="btn btn-outline hover:bg-white hover:text-black btn-block"
			href="/forget-password"
			target="_blank"
			rel="noopener noreferrer"
		>
			修改我的密码
		</Link>
	</div>
)

export default SecurityPage
