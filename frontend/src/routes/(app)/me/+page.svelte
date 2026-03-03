<script>
  import ProfileView from '$lib/components/ProfileView.svelte';
  import PostList from '$lib/components/PostList.svelte';
  let { data } = $props();
</script>

<ProfileView profile={data.profile} user={data.user} token={data.token}>
</ProfileView>

<PostList posts={data.posts} token={data.token} />
