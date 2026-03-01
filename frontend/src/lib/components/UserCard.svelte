<script>
  import { getAvatarUrl } from '$lib/utils';
  let { user, children } = $props();

  const avatarUrl = $derived(getAvatarUrl(user));
</script>

<div class='user-card'>
  <div class="user-info">
    <a href="/profile/{user.id}" class="profile-link">
      <img src={avatarUrl} alt={user.fullName} class="avatar" />
    </a>
    <header class="details">
      <a href="/profile/{user.id}" class="name-link">
        <h3 class='name'>{user.fullName}</h3>
      </a>
    </header>
  </div>

  <div class="action-slot">
    {@render children?.()}
  </div>
</div>

<style>
  .user-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: color-mix(in srgb, var(--color-leather), white 50%);
    border-radius: 0.5em;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-link, .name-link {
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 0.5em;
    border: 1px solid var(--color-gold);
    object-fit: contain;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  .name {
    color: var(--color-deep-ocean);
    margin: 0;
    transition: color 0.2s;
  }

  .name-link:hover .name {
    color: var(--color-terracotta);
    text-decoration: underline;
  }

  .action-slot {
    display: flex;
    align-items: center;
  }
</style>
