<script>
  const props = $props();
</script>

<div class="stats-bar">
  <a href={`/users/${props.userId}/following`} class="stat">
    <span class="val">
      {props.counts?.following ?? 0}
    </span>
    Following
  </a>

  <a href={`/users/${props.userId}/followers`} class="stat">
    <span class="val">
      {props.counts?.followers ?? 0}
    </span>
    Followers
  </a>
</div>

<style>
  .stats-bar {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.5rem;
    border-top: 1px solid var(--color-leather);
    padding-top: 1rem;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  .stat {
    text-decoration: none;
    color: var(--color-slate);
    font-size: 0.9rem;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
  }

  .stat {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
  }

  .stat:hover {
    color: var(--color-terracotta);
  }

  .val {
    font-weight: bold;
    color: var(--color-deep-ocean);
  }
</style>
