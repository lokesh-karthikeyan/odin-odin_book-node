<script>
  import PostCard from './PostCard.svelte';
  let { posts = [], token } = $props();
</script>

{#if posts?.length}
  {#each posts as post (post.id)}
    <PostCard {post} token={token}/>
  {/each}
{:else}
  <p>No posts found.</p>
{/if}
