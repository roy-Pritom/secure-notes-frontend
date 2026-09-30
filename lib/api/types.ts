export type UserRole = "user" | "admin";
export type UserStatus = "active" | "suspended";
export type NoteColor =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";
export type PostStatus = "draft" | "published";
export type SortOrder = "asc" | "desc";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl: string | null;
  bio: string | null;
  roles: UserRole[];
  status: UserStatus;
  interests: string[];
  lastLoginAt: string | null;
  passwordChangedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  owner: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  color: NoteColor;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  excerpt: string;
  tags: string[];
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface AuthResponse {
  tokenType: "Bearer";
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface InterestGroup {
  interest: string;
  userCount: number;
  users: UserSummary[];
}

/** The author projection the $lookup emits — four fields, nothing more. */
export type PostAuthor = UserSummary;

/** A row from GET /users/:id/posts. The author lives on the envelope, not the row. */
export type AuthoredPost = Omit<Post, "author">;

/** Deliberately not Paginated<AuthoredPost>: the author sits beside the page. */
export interface UserPosts {
  author: PostAuthor;
  items: AuthoredPost[];
  meta: PaginationMeta;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  bio?: string;
  interests?: string[];
}

export interface CreateUserBody extends RegisterBody {
  roles?: UserRole[];
}

export type UpdateProfileBody = Partial<
  Pick<RegisterBody, "firstName" | "lastName" | "avatarUrl" | "bio" | "interests">
>;

export interface AdminUpdateUserBody extends UpdateProfileBody {
  roles?: UserRole[];
  status?: UserStatus;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  color?: NoteColor;
}

export type UpdateNoteBody = Partial<CreateNoteBody>;

export interface CreatePostBody {
  title: string;
  body: string;
  excerpt?: string;
  tags?: string[];
  status?: PostStatus;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  searchTerm?: string;
}

// No sortOrder: the backend accepts it here but always returns newest-first.
export type UserPostsQuery = Omit<ListQuery, "sortOrder">;

export interface NoteQuery extends ListQuery {
  tag?: string;
  archived?: boolean;
  pinned?: boolean;
}

export interface InterestQuery {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  interest?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
  avatarUrl: string | null;
}
