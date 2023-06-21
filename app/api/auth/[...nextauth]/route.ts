import { poster } from '@/app/api/_index'
import type { ResponseProps, UserProps } from '@/utils/types'
import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30天
		encode: ({ secret, token }) => jwt.sign(token as JWT, secret, { algorithm: 'HS256' }) as string,
		decode: ({ secret, token }) => jwt.verify(token as string, secret, { algorithms: ['HS256'] }) as JWT,
	},
	providers: [
		CredentialsProvider({
			credentials: {},
			authorize: async (credentials) => {
				const res = (await poster('login', { ...credentials })) as ResponseProps<UserProps>
				if (res.success && res.data) {
					// 登录成功
					const { user_id, user_name, user_avatar } = res.data
					return {
						id: user_id.toString(), // NextAuth.js的session数据默认id为字符串
						name: user_name,
						image: user_avatar,
					}
				} else {
					// 登录失败或用户未注册
					throw Error(res.message)
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, trigger, session }) {
			if (trigger === 'update') {
				// session can be any arbitrary object, remember to validate it!
				if (session.name) {
					token.name = session.name
				}
				if (session.picture) {
					token.picture = session.picture
				}
			}
			return token
		},
		session: ({ session, token }) => {
			return { ...session, user: { ...session.user, id: Number(token.sub) } }
		},
	},
})

export { handler as GET, handler as POST }
