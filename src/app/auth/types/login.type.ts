export type Login = {
  username: string
  password: string
}

export type User = {
  username: string
  userId: string
}

export type Auth = {
  user: User
  accessToken: string
  employee: Employee
  locals: Local[]
}

type Employee = {
  firstName: string
}

export type Local = {
  localId: string
  localName: string
  localCode: string
}
