import { fetcher } from '@/app/api/_index'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export const handler = async (req: NextRequest) => {
	try {
		// 获取token
		const token = await getToken({ req, raw: true })
		// req.url 例如： http://localhost:3000/api/auth/subscription
		// 截取最后一段转发至 http://localhost:9001/api/subscription
		const key = req.url.split('api/auth/').pop() as string
		// 构造请求
		const init: RequestInit = {
			method: req.method,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
		if (req.method === 'POST' || req.method === 'PUT') {
			init.headers = {
				...init.headers,
				'Content-Type': 'application/json',
			}
			init.body = JSON.stringify(await req.json())
		}
		// 发送请求
		const res = await fetcher(key, init)
		// 检查返回值
		if (res.success) {
			// 成功
			return NextResponse.json(res)
		} else {
			// 其他错误
			throw Error(res.message)
		}
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ success: false, message: error.message }, { status: 500 })
		}
	}
}
