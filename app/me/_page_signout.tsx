import { signOut } from 'next-auth/react'
import Link from 'next/link'

const SignOutPage = () => (
	<div className="flex flex-col justify-between h-full">
		<div className="hidden space-y-2 text-3xl font-bold lg:block">
			<span className="block">孤帆远影碧空尽，</span>
			<span className="block">唯见长江天际流。</span>
		</div>
		<div className="flex gap-4">
			<Link className="flex-1 hidden btn lg:inline-flex" href="/">
				返回首页
			</Link>
			<button className="flex-1 btn btn-neutral" onClick={() => signOut({ redirect: false, callbackUrl: '/' })}>
				退出登录
			</button>
		</div>
	</div>
)

export default SignOutPage
