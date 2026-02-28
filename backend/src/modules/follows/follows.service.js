import * as repo from './follows.repository.js';
import { AppError } from '../../core/utils/AppError.js';

async function follow({ db }, { followerId, followeeId }) {
  if (followerId === followeeId) throw AppError.conflict('You cannot follow yourself');

  return repo.followUser(db, { followerId, followeeId });
}

async function unfollow({ db }, { followerId, followeeId }) {
  return repo.unfollowUser(db, { followerId, followeeId });
}

async function followers({ db }, userId) {
  return repo.getFollowers(db, userId);
}

async function following({ db }, userId) {
  return repo.getFollowing(db, userId);
}

export {
  follow,
  unfollow,
  followers,
  following,
}
