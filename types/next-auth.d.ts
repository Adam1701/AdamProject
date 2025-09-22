import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & {
      role?: 'ADMIN' | 'SELLER' | 'CLIENT'
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    role: 'ADMIN' | 'SELLER' | 'CLIENT'
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role?: 'ADMIN' | 'SELLER' | 'CLIENT'
  }
}

export {}


