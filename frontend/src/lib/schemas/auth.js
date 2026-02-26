import z from "zod";

const loginSchema = z.object({
  email: z.string()
    .nonempty('Email is required')
    .email('Invalid email format'),
  password: z.string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  fullName: z.string()
    .nonempty('Full name is required')
    .max(50, 'Name is too long'),
  confirmPassword: z.string()
    .nonempty('Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export {
  loginSchema,
  registerSchema,
}
