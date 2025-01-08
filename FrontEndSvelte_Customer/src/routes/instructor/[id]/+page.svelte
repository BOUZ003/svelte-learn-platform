<script lang="ts">
	import Header from '../../../components/Header.svelte';
	import Sidebar from '../../../components/Instructor/Sidebar.svelte';
	import MenuContent from '../../../components/Instructor/MenuContent.svelte';
	
</script>

<section>
	<div class="container-fuild" style="margin-left: -0.3px;">

		<Header/>
		<div class="d-flex flex-grow-1">
			<Sidebar/>
			<MenuContent/>
		</div>

	</div>
</section>

<svelte:head>
	<title>Customer Page</title>
	<meta name="description" content="Customer Page" />
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
	 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
    crossorigin="anonymous"></script>
</svelte:head>