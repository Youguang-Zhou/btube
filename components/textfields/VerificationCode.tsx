import type { FieldError, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from './Input'

export const VerificationCode = ({ name, control }: UseControllerProps) => {
	const {
		field,
		formState: { errors },
	} = useController({
		name: name,
		control: control,
		defaultValue: '',
		rules: { required: '邮箱验证码不能为空' },
	})

	return (
		<Input
			label="邮箱验证码"
			variant="standard"
			autoComplete="off"
			placeholder="若没收到，请检查你的垃圾邮件信箱"
			helperText={(errors?.[name] as FieldError | undefined)?.message}
			error={(errors?.[name] as FieldError | undefined)?.type === 'required'}
			{...field}
			onChange={(e) => field.onChange(e.target.value.trim())}
		/>
	)
}
