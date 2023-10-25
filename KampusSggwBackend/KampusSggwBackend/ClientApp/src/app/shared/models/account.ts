export interface CurrentAccountToken {
  accessToken: string;
  refreshToken: string;
}

interface Token {
  value: string;
  expiresIn: string;
}

export interface CurrentAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface LoginResult {
  hasError?: boolean;
  errorMessage?: string;
  accessToken?: string;
  refreshToken?: string;
}
