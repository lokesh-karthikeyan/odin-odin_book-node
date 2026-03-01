<script>
  import { UserCard } from '$lib/components';

  let { data } = $props();
  let users = $derived(data.users ?? []);
</script>

<div class="user-list">
  {#each users as user (user.id)}
    <UserCard {user} />
  {:else}
    <div class="empty-state">
      <h4>No followers yet.</h4>
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
</style>
