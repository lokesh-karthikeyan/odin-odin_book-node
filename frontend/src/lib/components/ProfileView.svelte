 <script>
  import ProfileStats from './ProfileStats.svelte';
  import Input from '$lib/components/Input.svelte';
  import { profileApi, peopleApi } from '$lib/api';
  import { invalidateAll } from '$app/navigation';
  import { getAvatarUrl } from '$lib/utils';
  import { LogOut } from 'lucide-svelte';
  import { enhance } from '$app/forms';

  let { profile, user, token } = $props();

  let fullName = $derived(profile?.fullName ?? '');
  let bio = $derived(profile?.bio ?? '');
  let pictureFile = $state(null);
  let previewUrl = $derived(profile?.picture ?? null);
  let isSubmitting = $state(false);

  const isOwnProfile = $derived(user?.id === profile.id);
  const avatarUrl = $derived(getAvatarUrl(profile));

  let isFollowing = $state(profile?.isFollowing ?? false);
  let isFollowLoading = $state(false);

  async function handleFollowToggle() {
    if (isFollowLoading) return;

    try {
      isFollowLoading = true;

      if (isFollowing) {
        await peopleApi.unfollowUser(fetch, token, profile.id);
        isFollowing = false;
        profile.counts.followers--;
      } else {
        await peopleApi.followUser(fetch, token, profile.id);
        isFollowing = true;
        profile.counts.followers++;
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      isFollowLoading = false;
    }
  }

  function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    pictureFile = file;

    previewUrl = URL.createObjectURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      isSubmitting = true;

      await profileApi.updateProfile(fetch, token, {
        fullName,
        bio,
        pictureFile
      });

      await invalidateAll();
      document.getElementById('edit-profile')?.hidePopover();
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="profile-container">
  <header class="profile-card">
    <div class="avatar-col">
      <img
        src={avatarUrl}
        alt={profile.fullName}
        class="profile-img"
      />
    </div>

    <div class="info-col">
      <div class="header-row">
        <h1>{profile.fullName}</h1>

        {#if isOwnProfile}
          <button class="edit-btn" popovertarget='edit-profile'>
            Edit Profile
          </button>
        {:else}
          <button
            class="submit"
            class:following={isFollowing}
            on:click={handleFollowToggle}
            disabled={isFollowLoading}
          >
            {#if isFollowLoading}
              Processing...
            {:else if isFollowing}
              Unfollow
            {:else}
              Follow
            {/if}
          </button>
        {/if}
      </div>

      <p class="bio">
        {profile.bio || "This user hasn't shared a bio yet."}
      </p>

      <ProfileStats userId={profile.id} counts={profile.counts} />
    </div>
  </header>

  <form action="?/logout" method="POST" use:enhance class='logout-form'>
    <button type='submit' class='logout-btn'>
      <LogOut size={20} />
    </button>
  </form>
</div>

<div
  popover="auto"
  id='edit-profile'
  class="popover-modal"
>
  <form
    class="modal-content"
    on:submit|preventDefault={handleSubmit}
  >
    <h2>Edit Profile</h2>

    <Input
      label="Full Name"
      name="fullName"
      bind:value={fullName}
      placeholder="Enter your full name"
    />

    <div class="field">
      <label for="bio">Bio</label>
      <textarea
        id="bio"
        rows="4"
        bind:value={bio}
        placeholder="Tell something about yourself..."
      />
    </div>

    <div class="field">
      <label for="picture">Profile Picture</label>
      <input
        id="picture"
        type="file"
        accept="image/*"
        on:change={(e) =>
          (pictureFile = e.target.files[0])
        }
      />
    </div>

    <div class="modal-actions">
      <button
        type="button"
        popovertarget='edit-profile'
        popovertargetaction="hide"
      >
        Cancel
      </button>

      <button type="submit">
        Save
      </button>
    </div>
  </form>
</div>

<style>
  .profile-card {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    background: color-mix(in srgb, var(--color-leather), white 50%);
    padding: 2rem;
    border-radius: 1rem;
    border: 1px solid var(--color-leather);
    justify-content: center;
  }

  .profile-img {
    width: 150px;
    height: 150px;
    border-radius: 1rem;
    object-fit: contain;
    border: 2px solid var(--color-gold);
  }

  .info-col {
    flex: 1;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .bio {
    color: var(--color-slate);
    line-height: 1.6;
  }

  .upload-link {
    background: none;
    border: none;
    color: var(--color-leather);
    font-size: 0.75rem;
    cursor: pointer;
    margin-top: 0.5rem;
    width: 100%;
    text-decoration: underline;
  }

  .popover-modal {
    border: none;
    padding: 0;
    background: transparent;
    width: 60%;
    margin: auto;
  }

  .popover-modal::backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
  }

  .modal-content {
    background: color-mix(in srgb, var(--color-leather), white 50%);
    padding: 2rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: solid 1px var(--color-leather);
  }

  .modal-content textarea {
    width: 100%;
    padding: 0.6rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .submit:not(.following) {
    background: color-mix(in srgb, var(--color-forest), white 20%);
  }

  .profile-container {
    anchor-name: --profile;
  }

  .logout-form {
    position: absolute;
    position-anchor: --profile;
    bottom: calc(anchor(bottom) + 1em);
    right: calc(anchor(right) + 1.5em);
  }
</style>
