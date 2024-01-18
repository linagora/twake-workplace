import { z } from 'zod';
import validator from 'validator';

export const createUserSchema = z.object({
	nickName: z.string().regex(/^[a-zA-Z0-9._-]{3,20}$/, { message: 'Invalid nickname' }),
	firstName: z
		.string()
		.trim()
		.regex(/^[A-Za-z]|[A-Za-z][A-Za-zs]*[A-Za-z]$/, { message: 'Invalid Firstname' }),
	lastName: z
		.string()
		.trim()
		.regex(/^[A-Za-z]|[A-Za-z][A-Za-zs]*[A-Za-z]$/, { message: 'Invalid Lastname' }),
	password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/g, {
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
