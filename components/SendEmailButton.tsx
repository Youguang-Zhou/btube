import { poster } from '@/app/api/_index'
import { useEffect, useState } from 'react'

interface SendEmailButtonProps {
	triggerValidation: () => Promise<boolean>
	getEmail: () => string
	onSuccess: () => void
	onError: (error: Error) => void
}

const SendEmailButton = ({ triggerValidation, getEmail, onSuccess, onError }: SendEmailButtonProps) => {
	const [isSending, setIsSending] = useState<boolean>(false)
	const [shouldDisableBtn, setShouldDisableBtn] = useState<boolean>(false)
	const [timeCounter, setTimeCounter] = useState<number | undefined>(undefined)

	// 发送验证码邮件时间间隔
	useEffect(() => {
		let _id_interval: NodeJS.Timer | undefined
		let _id_timeout: NodeJS.Timeout | undefined
		if (shouldDisableBtn) {
			const timeout = 30 * 1000 // 30秒
			const targetTime = Date.now() + timeout
			// 设置发送验证码邮件按钮的倒计时
			_id_interval = setInterval(() => {
				setTimeCounter(new Date(targetTime - Date.now()).getSeconds())
			}, 1000)
			// 倒计时结束后重置对应状态
			_id_timeout = setTimeout(() => {
				setShouldDisableBtn(false)
				setTimeCounter(undefined)
			}, timeout)
		}
		return () => {
			clearInterval(_id_interval)
			clearTimeout(_id_timeout)
		}
	}, [shouldDisableBtn])

	// 当发送验证码邮件按钮点击时
	const handleBtnClicked = async () => {
		// 验证邮箱是否合法
		const isValid = await triggerValidation()
		if (isValid === false) {
			return
		}
		// 合法之后发送验证码邮件
		setIsSending(true)
		// 等待API请求
		try {
			const res = await poster('email', { email: getEmail() })
			if (res.success) {
				// 若成功，则设置发送按钮的冷静期
				setShouldDisableBtn(true)
				onSuccess()
			} else {
				throw Error(res.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				setShouldDisableBtn(false)
				onError(error)
			}
		}
		// 设置状态为：发送完毕
		setIsSending(false)
	}

	return (
		<button
			type="button"
			className="btn btn-neutral btn-md"
			onClick={handleBtnClicked}
			disabled={isSending || shouldDisableBtn}
		>
			{isSending && <span className="text-white loading loading-spinner loading-xs" />}
			{shouldDisableBtn && timeCounter ? (
				<span className="tabular-nums">{timeCounter}秒后重新发送</span>
			) : (
				<span>发送验证码</span>
			)}
		</button>
	)
}

export default SendEmailButton
