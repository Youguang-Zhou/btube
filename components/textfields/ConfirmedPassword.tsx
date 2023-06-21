import type { FieldError, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { Input } from './Input'

interface ConfirmedPasswordProps extends UseControllerProps {
	onValidateEqual: (value: string) => boolean
}

export const ConfirmedPassword = ({ name, control, onValidateEqual }: ConfirmedPasswordProps) => {
	const {
		field,
		formState: { errors },
	} = useController({
		name: name,
		control: control,
		defaultValue: '',
		rules: {
			required: '密码不能为空',
			validate: {
				equal: (value) => onValidateEqual(value) || '与楼上密码不匹配',
			},
		},
	})

	return (
		<Input
			label="确认密码"
			type="password"
			variant="standard"
			autoComplete="off"
			placeholder="需要与楼上的密码一致"
			helperText={(errors?.[name] as FieldError | undefined)?.message}
			error={
				(errors?.[name] as FieldError | undefined)?.type === 'required' ||
				(errors?.[name] as FieldError | undefined)?.type === 'equal'
			}
			{...field}
			onChange={(e) => field.onChange(e.target.value.trim())}
		/>
	)
}
