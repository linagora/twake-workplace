import { z } from 'zod';
import validator from 'validator';
import { validatePassword } from '$utils/password';
import { validateNickName } from '$utils/username';

const createUserSchema = z.object({
	nickName: z.string().refine((val) => validateNickName(val)),
	firstName: z.string().trim().min(1),
	lastName: z.string().trim().min(1),
	password: z.string().refine((val) => validatePassword(val), {
		message:
			'Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number'
	}),
	phone: z.string().refine(validator.isMobilePhone, { message: 'Invalid mobile phone' })
});

export const createUserFormSchema = createUserSchema
	.extend({
		confirmPassword: z.string(),
		accepted: z.boolean().refine((val) => val, {
			message: 'You must accept the User Agreement and Personal Data Usage terms'
		})
	})
	.partial();

export const fullCreateUserFormSchema = createUserFormSchema.refine(
	(data) => data.password === data.confirmPassword,
	{
		message: 'Passwords must match!',
		path: ['confirmPassword']
	}
);
