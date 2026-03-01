<script>
  import ProfileView from '$lib/components/ProfileView.svelte';
  let { data } = $props();
</script>

<ProfileView profile={data.profile} user={data.user}>
</ProfileView>
