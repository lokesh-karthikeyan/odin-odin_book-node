<script>
  import CreatePost from '$lib/components/CreatePost.svelte';
  import PostList from '$lib/components/PostList.svelte';
  let { data } = $props();

  let posts = $state(data.posts);

  function handleNewPost(newPost) {
    posts = [newPost, ...posts];
  }
</script>

<CreatePost onPostCreated={handleNewPost} token={data.token} />
<PostList {posts} token={data.token} />
