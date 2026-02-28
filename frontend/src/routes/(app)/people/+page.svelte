<script>
  import { UserCard } from '$lib/components';
  import { peopleApi } from '$lib/api';

  let { data } = $props();

  let users      = $derived(data.users);
  let loadingIds = $state(new Set());

  const token    = $derived(data.token);

  async function handleFollow(followeeId) {
    if (loadingIds.has(followeeId)) return;
    loadingIds.add(followeeId);

    try {
      const result = await peopleApi.followUser(fetch, token, followeeId);
      if (result.success) {
        users = users.filter((user) => user.id !== followeeId);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Network error following user:", error);
    } finally {
      loadingIds.delete(followeeId);
    }
  }
</script>

<div class='home-container'>
  <div class="user-list">
    {#each users as user (user.id)}
      <UserCard {user}>
        <button
          class="submit"
          onclick={() => handleFollow(user.id)}
          disabled={loadingIds.has(user.id)}
        >
          {loadingIds.has(user.id) ? '...' : 'Follow'}
        </button>
      </UserCard>
    {:else}
      <div class="empty-state">
        <h4>No new people to follow right now!</h4>
      </div>
    {/each}
  </div>
</div>

<style>
  .home-container {
    height: 100%;
  }

  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--color-slate);
    background: var(--color-cream);
    width: 100%;
    border-radius: 0.5em;
    border: groove 0.1em var(--color-eggplant);
  }

  .user-list:has(.empty-state) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .user-list {
    display: grid;
    gap: 1em;
  }

  .submit {
    background: color-mix(in srgb, var(--color-forest), white 20%);

    &:hover {
      background: var(--color-forest);
    }
  }
</style>
