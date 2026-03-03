<script>
  import PostCard from './PostCard.svelte';
  let { posts = [], token } = $props();
</script>

<div class='post-container'>
  {#if posts?.length}
    {#each posts as post (post.id)}
      <PostCard {post} token={token}/>
    {/each}
  {:else}
    <h2 class='empty-post'>No posts found.</h2>
  {/if}
</div>

<style>
  .post-container {
    margin-block: 1em;
  }

  .empty-post {
    padding: 1em 0.2em;
  }
</style>
