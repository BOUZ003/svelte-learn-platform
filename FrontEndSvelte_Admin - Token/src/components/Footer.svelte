<script>
    import 'bootstrap/dist/css/bootstrap.min.css';

    import { onMount } from 'svelte';
	import { isAuthenticated } from '../stores/authStore';
	import { goto } from '$app/navigation';
	onMount(() => {
	  if (typeof window !== 'undefined') {
		const unsubscribe = isAuthenticated.subscribe(async (auth) => {
		  if (!auth) {
			await goto('/login'); // Chờ điều hướng hoàn tất
		  }
		});
		return unsubscribe; // Hủy subscription khi component bị hủy
	  }
	});
</script>

<footer
  class="footer bg-light p-3 mt-4 shadow-sm d-flex justify-content-between align-items-center"
>
  <div class="footer-brand d-flex align-items-center">
    <span>&copy; 2024 Admin Dashboard</span>
  </div>

  <div class="footer-links">
    <a href="#" class="footer-link text-dark mx-2">Privacy Policy</a>
    <a href="#" class="footer-link text-dark mx-2">Terms of Service</a>
    <a href="#" class="footer-link text-dark mx-2">Contact Us</a>
  </div>

  <div class="user-message">
    <span id="footer-message">DevUTEHY - Vũ Văn Trường (FE-BE) - 125214 - 12521037 - phone: 0385.666.387</span>
  </div>
</footer>

<style>
  .footer {
    width: 100%;
    background-color: #f8f9fa;
    border-top: 1px solid #dee2e6;
    font-size: 0.9em;
  }
  .footer-link {
    font-weight: 500;
    text-decoration: none;
    color: #495057;
  }
  .footer-link:hover {
    color: #0d6efd;
  }
</style>
