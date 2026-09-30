import type {
  AdminUpdateUserBody,
  ChangePasswordBody,
  CreateNoteBody,
  CreatePostBody,
  CreateUserBody,
  InterestGroup,
  InterestQuery,
  ListQuery,
  Note,
  NoteQuery,
  Paginated,
  Post,
  UpdateNoteBody,
  UpdateProfileBody,
  User,
  UserPosts,
} from "./types";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: object;
  signal?: AbortSignal;
  // A 403 on an admin endpoint means the caller lost the role mid-session.
  admin?: boolean;
}

export type Requester = <T>(path: string, options?: RequestOptions) => Promise<T>;

export function createEndpoints(request: Requester) {
  return {
    notes: {
      list: (query: NoteQuery = {}) => request<Paginated<Note>>("/notes", { query }),
      listAll: (query: NoteQuery = {}) =>
        request<Paginated<Note>>("/notes/all", { query, admin: true }),
      get: (id: string) => request<Note>(`/notes/${id}`),
      create: (body: CreateNoteBody) => request<Note>("/notes", { method: "POST", body }),
      update: (id: string, body: UpdateNoteBody) =>
        request<Note>(`/notes/${id}`, { method: "PATCH", body }),
      remove: (id: string) => request<void>(`/notes/${id}`, { method: "DELETE" }),
    },
    users: {
      list: (query: ListQuery = {}) =>
        request<Paginated<User>>("/users", { query, admin: true }),
      get: (id: string) => request<User>(`/users/${id}`, { admin: true }),
      create: (body: CreateUserBody) =>
        request<User>("/users", { method: "POST", body, admin: true }),
      update: (id: string, body: AdminUpdateUserBody) =>
        request<User>(`/users/${id}`, { method: "PATCH", body, admin: true }),
      remove: (id: string) =>
        request<void>(`/users/${id}`, { method: "DELETE", admin: true }),
      interests: (query: InterestQuery = {}) =>
        request<Paginated<InterestGroup>>("/users/interests", { query, admin: true }),
      posts: (id: string, query: ListQuery = {}) =>
        request<UserPosts>(`/users/${id}/posts`, { query }),
    },
    profile: {
      get: () => request<User>("/profile"),
      update: (body: UpdateProfileBody) =>
        request<User>("/profile", { method: "PATCH", body }),
      changePassword: (body: ChangePasswordBody) =>
        request<void>("/profile/password", { method: "PATCH", body }),
    },
    posts: {
      create: (body: CreatePostBody) => request<Post>("/posts", { method: "POST", body }),
    },
  };
}
