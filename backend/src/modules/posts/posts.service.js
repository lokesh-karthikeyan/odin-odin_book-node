export const postsService = (repo) => ({
  createPost(userId, body) {
    return repo.create({
      authorId: userId,
      content: body.content,
      imageUrl: body.imageUrl || null,
    });
  },

  getFeed(userId) {
    return repo.getFeed(userId);
  },

  likePost(userId, postId) {
    return repo.addLike(userId, postId);
  },

  unlikePost(userId, postId) {
    return repo.removeLike(userId, postId);
  },

  commentPost(userId, postId, content) {
    return repo.addComment({
      authorId: userId,
      postId,
      content,
    });
  },
});
