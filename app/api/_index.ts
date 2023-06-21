import type { ResponseProps } from '@/utils/types'

export const publicURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`
export const authURL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth`

// Fetcher
export const fetcher = async (key: string, init?: RequestInit, base = publicURL): Promise<ResponseProps<never>> => {
	const res = await fetch(`${base}/${key}`, {
		cache: 'no-store',
		...init,
	})
	if (!res.ok) {
		const error = (await res.json()) as ResponseProps<never>
		throw Error(error.message)
	}
	return res.json()
}

// Poster
export const poster = (key: string, body: object, base = publicURL): Promise<ResponseProps<never>> =>
	fetcher(key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, base)

// Putter
export const putter = (key: string, body: object, base = publicURL): Promise<ResponseProps<never>> =>
	fetcher(key, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, base)

// Deleter
export const deleter = (key: string, init?: RequestInit, base = publicURL): Promise<ResponseProps<never>> =>
	fetcher(key, { method: 'DELETE', ...init }, base)

/**
 * 由 Nextjs 的 Route Handler 做代理
 */
export const authFetcher = (key: string, init?: RequestInit) => fetcher(key, init, authURL)
export const authPoster = (key: string, body: object) => poster(key, body, authURL)
export const authPutter = (key: string, body: object) => putter(key, body, authURL)
export const authDeleter = (key: string, init?: RequestInit) => deleter(key, init, authURL)
