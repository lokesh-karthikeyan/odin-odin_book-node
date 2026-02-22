import bcrypt from 'bcrypt';
import { findUserByEmail, createUserWithProfile } from './auth.repository.js';

async function signup(fastify, payload) {
  const { fullName, email, password } = payload;

  const existing = await findUserByEmail(fastify.db, email);
  if (existing) throw new Error('User already exists');

  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await createUserWithProfile(fastify.db, {
    fullName,
    email,
    password: hashedPassword,
  });

  return user;
}

async function login(fastify, payload) {
  const { email, password } = payload;

  const user = await findUserByEmail(fastify.db, email);
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  return user;
}

export {
  signup,
  login,
}
