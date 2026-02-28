<script>
  import { Home, Users, MessageSquare, UserCircle, Icon } from 'lucide-svelte';
  import { atSignCircle } from '@lucide/lab';
  import { page } from '$app/state';

  let { children } = $props();

  const menuItems = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'People', href: '/people', icon: Users },
    { name: 'Chat', href: '/conversations', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: UserCircle },
  ];
</script>

<div class='app-layout'>
  <nav class='nav-bar'>
    <div class='logo'>
      <div class='logo-icon'>
        <Icon iconNode={atSignCircle} size={24} />
      </div>
      <h4>Echo</h4>
    </div>

    <div class='menu-links'>
      {#each menuItems as item}
        {@const isActive = page.url.pathname.startsWith(item.href)}
        <a href={item.href} class='nav-link' class:active={isActive} data-sveltekit-preload-data="tap">
          <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
          <p class='link-text'>{item.name}</p>
        </a>
      {/each}
    </div>
  </nav>

  <main class='main-content'>
    {@render children()}
  </main>
</div>

<style>
  .app-layout {
    display: grid;
    grid-template-columns: 1fr 3fr;
    min-height: 100vh;
    background: var(--color-sand);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      padding-bottom: 70px;
    }
  }

  .nav-bar {
    background: var(--color-deep-ocean);
    color: var(--color-sand);
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    position: sticky;
    top: 0;
    height: 100vh;

    @media (max-width: 768px) {
      position: fixed;
      bottom: 0;
      top: auto;
      left: 0;
      width: 100%;
      height: 70px;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 0;
      border-top: 1px solid var(--color-slate);
      z-index: 3;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 2rem;
    font-weight: bolder;
    font-size: var(--text-xl);
    color: var(--color-cream);

    @media (max-width: 768px) {
      display: none;
    }
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    background: var(--color-gold);
    border-radius: 0.4em;
    color: var(--color-deep-ocean);
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .menu-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;

    @media (max-width: 768px) {
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
      height: auto;
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1rem;
    color: var(--color-sand);
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s ease;

    &:last-child {
      margin-top: auto;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--color-gold);
    }

    @media (max-width: 768px) {
      padding: 1em;

      &:last-child {
        margin-top: 0;
      }
    }
  }

  .nav-link.active {
    background-color: var(--color-gold);
    color: var(--color-deep-ocean);
    font-weight: bolder;
  }

  .link-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  .main-content {
    padding: 2em;
    overflow-y: auto;
    background: color-mix(in srgb, var(--bg-primary), black 3%);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

    @media (max-width: 768px) {
      padding: 1em;
    }
  }
</style>
