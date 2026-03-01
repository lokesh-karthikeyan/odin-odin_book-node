<script>
  import { UserCard } from '$lib/components';
  import { peopleApi } from '$lib/api';

  let { data } = $props();

  let users = $state(data.users ?? []);
  let token = $derived(data.token);
  let loadingIds = $state(new Set());

  async function handleUnfollow(followeeId) {
    if (loadingIds.has(followeeId)) return;
    loadingIds.add(followeeId);

    try {
      const result = await peopleApi.unfollowUser(fetch, token, followeeId);

      if (result.success) {
        users = users.filter((user) => user.id !== followeeId);
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      loadingIds.delete(followeeId);
    }
  }
</script>

<div class="user-list">
  {#each users as user (user.id)}
    <UserCard {user}>
      <button
        class="submit danger"
        onclick={() => handleUnfollow(user.id)}
        disabled={loadingIds.has(user.id)}
      >
        {loadingIds.has(user.id) ? '...' : 'Unfollow'}
      </button>
    </UserCard>
  {:else}
    <div class="empty-state">
      <h4>Not following anyone yet.</h4>
    </div>
  {/each}
</div>

<style>
  .user-list {
    display: grid;
    gap: 1em;
  }

  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
  }

  .submit.danger {
    background: color-mix(in srgb, crimson, white 20%);
  }

  .submit.danger:hover {
    background: crimson;
  }
</style>
