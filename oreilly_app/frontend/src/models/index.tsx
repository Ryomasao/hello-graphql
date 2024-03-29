export type User = {
  githubLogin: string
  name?: string
  avatar?: string
  postedPhotos: any[]
  inPhotos: any[]
}

export type AuthenticatedUser = Pick<User, "avatar" | "githubLogin" | "name">

export type Photo = {
  id: string
  name: string
  url: string
}