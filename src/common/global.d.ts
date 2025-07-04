namespace Express {
  type User = Omit<import('src/users/entities/user.entity').User, 'password'>;
}
