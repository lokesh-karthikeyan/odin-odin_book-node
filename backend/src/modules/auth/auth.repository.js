import { users, profiles } from '../../core/db/schema/index.js';

async function findUserByEmail(db, email) {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  });
}

async function createUserWithProfile(db, { fullName, email, password }) {
  return db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values({ fullName, email, password }).returning();

    await tx.insert(profiles).values({
      userId: user.id,
      bio: '',
      picture: null
    });

    return user;
  })
}

export {
  findUserByEmail,
  createUserWithProfile,
}
