<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { onMount } from 'svelte';
  import { isAuthenticated, logout, username } from '../stores/authStore';
  import { goto } from '$app/navigation';

  onMount(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = isAuthenticated.subscribe(async (auth) => {
        if (!auth) {
          await goto('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
        }
      });
      return unsubscribe; // Hủy subscription khi component bị hủy
    }
  });

  // Xử lý logout
  function handleLogout() {
    logout();
    goto('/login'); // Chuyển hướng về trang login sau khi logout
  }
  function goToProfile() {
    const userRole = localStorage.getItem('userId'); 

    // Assuming you want to route to different profiles based on userRole
    if (userRole) {
        goto(`/admin-profile/${userRole}`);
    } else {
        console.error('User role not found');
    }
}

</script>

<header class="header bg-light shadow-sm p-3 d-flex justify-content-between align-items-center">
  <div class="brand d-flex align-items-center">
    <img src="../../src/images/DevUTEHY.png" alt="Logo" class="logo me-2" style="width: 60px; height: 60px;">
    <h1 class="h5 mb-0">Admin Dashboard</h1>
  </div>

  <nav class="nav">
    <a href="/" class="nav-link text-dark mx-2">Home</a>
    <a href="/about" class="nav-link text-dark mx-2">Manage Items</a>
    <a href="/congnghe" class="nav-link text-dark mx-2">Reports</a>
    <a href="#" class="nav-link text-dark mx-2">Settings</a>
  </nav>

  <div class="user-profile d-flex align-items-center">
    <button type="button" class="profile-icon-btn" on:click={goToProfile} aria-label="Go to profile">
      <i class="fas fa-user-circle profile-icon"></i>
    </button>
    <span class="me-2">Hello, {$username}</span>
    <button class="btn btn-outline-primary btn-sm" on:click={handleLogout}>Logout</button>
  </div>
</header>

<style>
  .header {
    width: 100%;
    background-color: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
  }
  .logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
  .nav-link {
    font-weight: 500;
    text-decoration: none;
    color: #495057;
  }
  .nav-link:hover {
    color: #0d6efd;
  }

  .profile-icon-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
  }

  .profile-icon {
    font-size: 1.5rem;
    color: #007bff;
  }

  .profile-icon-btn:hover .profile-icon {
    color: #0056b3; /* Darker shade on hover */
    cursor: pointer;
  }
</style>
