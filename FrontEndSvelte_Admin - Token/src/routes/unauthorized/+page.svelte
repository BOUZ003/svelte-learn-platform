<script lang="ts">
  import { goto } from '$app/navigation';
  import { logout } from '../../stores/authStore';

  // Hàm để quay lại trang chủ
  function goHome() {
    goto('/login');
  }

  // Hàm để đăng xuất
  function handleLogout() {
    logout();
    goto('/login');
  }
</script>

<section class="unauthorized-container d-flex flex-column justify-content-center align-items-center text-center">
  <div class="card p-5 shadow-sm">
    <h1 class="display-4 text-danger">403</h1>
    <h2 class="mb-4">Không Có Quyền Truy Cập</h2>
    <p class="mb-4">
      Bạn không có quyền truy cập vào trang này. Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với quản trị viên.
    </p>
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary me-3" on:click={goHome}>Quay Lại Trang Chủ</button>
      <button class="btn btn-outline-danger" on:click={handleLogout}>Đăng Xuất</button>
    </div>
  </div>
</section>

<svelte:head>
  <title>Không Có Quyền Truy Cập</title>
  <meta name="description" content="Unauthorized Access Page" />
</svelte:head>

<style>
  .unauthorized-container {
    height: 100vh;
    background-color: #f8f9fa;
  }
  .card {
    max-width: 500px;
    width: 100%;
  }
  h1 {
    font-size: 5rem;
  }
  h2 {
    font-size: 2rem;
  }
</style>
