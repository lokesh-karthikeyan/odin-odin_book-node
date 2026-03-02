<script>
  import { invalidateAll } from '$app/navigation';
  import { postsApi } from '$lib/api';
  import { timeAgo } from '$lib/utils';
  import { PUBLIC_API_URL } from '$env/static/public';

  let { post, token } = $props();

  async function toggleLike() {
    await postsApi.toggleLike(fetch, token, post.id, post.isLiked);
    const updatedPost = await postsApi.getPost(fetch, token, post.id);

    post = { ...updatedPost };
  }

  async function submitComment(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const content = form.content.value.trim();
    if (!content.trim()) return;

    await postsApi.addComment(fetch, token, post.id, content);
    form.reset();

    const updatedPost = await postsApi.getPost(fetch, token, post.id);
    post = { ...updatedPost };
  }
</script>

<div class="post-card">
  {#if post?.content}
    <p class="post-text">
      {post.content}
    </p>
  {/if}

  {#if post?.imageUrl}
    <div class="image-wrapper">
      <img
        src={`${PUBLIC_API_URL}${post.imageUrl}`}
        alt="Post image"
      />
    </div>
  {/if}

  <p class="meta">
    <i>
      Posted by {post?.author?.fullName}
      {post?.createdAt ? timeAgo(post.createdAt) : ''}
    </i>
  </p>

  <div class="stats">
    <button onclick={toggleLike} class:liked={post?.isLiked} class='like-btn'>
      {post?.isLiked ? '❤️' : '🤍'}
      {post?.likesCount ?? 0}
    </button>

    <button disabled class='comments-count'>💬 {post?.commentsCount ?? 0}</button>
  </div>

  {#if post?.comments?.length}
    <div class='comments-container'>
      {#each post.comments as comment (comment.id)}
        <div class="comment">
          <p>{comment.content}</p>
          <p class='commenter'>
            Commented By
            {comment.author.fullName}
            {timeAgo(comment.createdAt)}
          </p>
        </div>
      {/each}
    </div>
  {/if}

  <form onsubmit={submitComment} class='comment-form'>
    <textarea name="content" required placeholder='Add your comment here...'></textarea>
    <button type="submit">Post</button>
  </form>
</div>

<style>
  .post-card {
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    padding: 1rem;
    margin-block: 1.2em;
    border-radius: 8px;
  }

  .image-wrapper {
    width: 100%;
    max-width: 280px;
    aspect-ratio: 4 / 5;
    border-radius: 8px;
    margin: 0 auto;
  }

  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .post-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .meta {
    color: var(--color-slate);
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
    text-align: right;
  }

  .stats {
    margin-bottom: 0.75rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }

  .like-btn:not(.liked) {
    background: color-mix(in srgb, var(--color-forest), white 20%);

    &:hover {
      background: var(--color-forest);
    }
  }

  .comments-count {
    text-align: center;
    background: var(--color-sand);
    cursor: auto;
    color: var(--color-deep-ocean);
  }

  .comments-container {
    max-height: 350px;
    overflow-y: auto;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    border-radius: 0.5em;
  }

  .comment {
    border-bottom: 1px solid color-mix(in srgb, var(--bg-primary), black 20%);
    padding: 1em;
  }

  .commenter {
    color: var(--color-slate);
    text-align: right;
    font-style: italic;
    font-size: var(--text-sm);
  }

  .comment-form {
    display: grid;
    grid-template-columns: 2fr 0.5fr;
    gap: 1.5em;
    margin-top: 1em;
  }

  .comment-form button {
    align-self: end;
  }
</style>
