<script lang="ts">
	import { onMount } from 'svelte';
	import { isAuthenticated,role } from '../stores/authStore';
	import { goto } from '$app/navigation';
	
	import Header from '../components/Header.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import MenuContent from '../components/MenuContent.svelte';
	import Footer from '../components/Footer.svelte';
	onMount(() => {
		if (typeof window !== 'undefined') {
      const unsubscribeAuth = isAuthenticated.subscribe(async (auth) => {
        if (!auth) {
          await goto('/login'); // Chuyển hướng đến trang login nếu chưa đăng nhập
        }
      });

      const unsubscribeRole = role.subscribe(async (userRole) => {
		if (userRole !== 'SuperAdmin' && userRole !== 'Admin' && userRole !== 'ContentManager') {
      		await goto('/unauthorized');
      		// return; // Dừng lại nếu không phải SuperAdmin hoặc ContentManager
    	}
      });

      return () => {
        unsubscribeAuth();
        unsubscribeRole();
      };
    }
  });
</script>

<section>
	<main class="d-flex flex-column min-vh-100">
		<Header/>
	  
		<div class="d-flex flex-grow-1">
		  <Sidebar/>

		  <MenuContent />
		</div>
		<Footer/>
	</main>
</section>

<svelte:head>
	<title>Admin Page</title>
	<meta name="description" content="Admin Page" />
</svelte:head>