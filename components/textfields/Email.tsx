import type { FieldError, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from './Input'

interface EmailProps extends UseControllerProps {
	className?: string
	disabled?: boolean
}

export const Email = ({ name, control, className, disabled }: EmailProps) => {
	const {
		field,
		formState: { errors },
	} = useController({
		name: name,
		control: control,
		defaultValue: '',
		rules: {
			required: '邮箱不能为空',
			pattern: {
				value: /^\S+@\S+\.\S+$/,
				message: '邮箱格式不对',
			},
		},
	})

	return (
		<Input
			className={className}
			label="邮箱"
			type="email"
			variant="standard"
			autoComplete="off"
			placeholder="用于找回密码"
			helperText={(errors?.[name] as FieldError | undefined)?.message}
			error={
				(errors?.[name] as FieldError | undefined)?.type === 'required' ||
				(errors?.[name] as FieldError | undefined)?.type === 'pattern'
			}
			{...field}
			onChange={(e) => field.onChange(e.target.value.trim().toLowerCase())}
			disabled={disabled}
		/>
	)
}
