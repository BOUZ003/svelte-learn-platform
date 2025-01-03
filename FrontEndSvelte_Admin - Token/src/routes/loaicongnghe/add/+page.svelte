
<script lang="ts">
	import Header from '../../../components/Header.svelte';
	import Sidebar from '../../../components/Sidebar.svelte';
	import Add from '../../../components/LoaiCongNghe/add.svelte';
	import Footer from '../../../components/Footer.svelte';

</script>

<section>
	<main class="d-flex flex-column min-vh-100">
		<Header/>
	  
		<div class="d-flex flex-grow-1">
		  <Sidebar/>

		  <Add />
		</div>
		<Footer/>
	</main>
</section>

<svelte:head>
	<title>Admin Page</title>
	<meta name="description" content="Admin Page" />
</svelte:head>