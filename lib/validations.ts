import { z } from "zod";

const ID = /^[a-f0-9]{24}$/i;
export const isObjectId = (value: string) => ID.test(value);

export const NOTE_COLORS = ["default", "red", "orange", "yellow", "green", "blue", "purple"] as const;
export const USER_ROLES = ["user", "admin"] as const;
export const USER_STATUSES = ["active", "suspended"] as const;
export const POST_STATUSES = ["published", "draft"] as const;

export const passwordSchema = z
  .string()
  .min(12, "At least 12 characters")
  .max(72, "At most 72 characters")
  .regex(/[a-z]/, "Needs a lowercase letter")
  .regex(/[A-Z]/, "Needs an uppercase letter")
  .regex(/[0-9]/, "Needs a digit")
  .regex(/[^A-Za-z0-9]/, "Needs a symbol");

const email = z.string().trim().max(254).pipe(z.email("Enter a valid email"));
const name = (label: string) => z.string().trim().min(1, `${label} is required`).max(80);

const uniqueList = (item: z.ZodString, max: number, label: string) =>
  z
    .array(item)
    .max(max, `At most ${max} ${label}`)
    .refine((list) => new Set(list).size === list.length, `Duplicate ${label}`);

const avatarUrl = z.union([
  z.literal(""),
  z.url({ protocol: /^https?$/, error: "Must be an http(s) URL" }).max(512),
]);

export const tagsSchema = uniqueList(z.string().trim().min(1).max(30), 10, "tags");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

const profileFields = {
  firstName: name("First name"),
  lastName: name("Last name"),
  avatarUrl,
  bio: z.string().max(500, "At most 500 characters"),
  interests: uniqueList(z.string().trim().min(1).max(40), 20, "interests"),
};

export const registerSchema = z.object({ email, password: passwordSchema, ...profileFields });

export const profileSchema = z.object(profileFields);

export const createUserSchema = registerSchema.extend({
  roles: z.array(z.enum(USER_ROLES)).min(1, "Pick at least one role"),
});

export const adminUserSchema = profileSchema.extend({
  roles: z.array(z.enum(USER_ROLES)).min(1, "Pick at least one role"),
  status: z.enum(USER_STATUSES),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    path: ["newPassword"],
    message: "Must differ from the current password",
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const noteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  content: z.string().trim().min(1, "Content is required").max(20_000),
  tags: tagsSchema,
  isPinned: z.boolean(),
  isArchived: z.boolean(),
  color: z.enum(NOTE_COLORS),
});

export const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  body: z.string().trim().min(1, "Body is required").max(10_000),
  excerpt: z.string().trim().max(300, "At most 300 characters"),
  tags: tagsSchema,
  status: z.enum(POST_STATUSES),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type CreateUserValues = z.infer<typeof createUserSchema>;
export type AdminUserValues = z.infer<typeof adminUserSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type NoteValues = z.infer<typeof noteSchema>;
export type PostValues = z.infer<typeof postSchema>;
