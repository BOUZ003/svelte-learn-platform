<script lang="ts">
  import { goto } from '$app/navigation';
  import { logout } from '../../stores/authStore';

  // Hàm để quay lại trang trước
  function goBack() {
    window.history.back(); // Quay lại trang trước
  }

  // Hàm để đăng xuất
  function handleLogout() {
    logout();
    goto('/login');
  }

  // Hàm để liên hệ cấp quyền (ví dụ mở email client)
  function contactPermission() {
    // Ví dụ mở email client, thay đổi tùy theo yêu cầu cụ thể
    window.location.href = 'mailto:support@example.com?subject=Yêu Cầu Cấp Quyền Truy Cập';
  }
</script>

<section class="unauthorized-container d-flex flex-column justify-content-center align-items-center text-center">
  <div class="card p-5 shadow-sm">
    <h1 class="display-4 text-danger">403</h1>
    <h2 class="mb-4">Bạn Không Có Quyền Này</h2>
    <p class="mb-4">
      Bạn không có quyền thao tác với chức năng này. Vui lòng liên hệ với quản trị viên để được cấp quyền truy cập hoặc kiểm tra lại quyền hạn của bạn để tiếp tục thực hiện các hành động cần thiết.
    </p>
    <div class="d-flex justify-content-center">
      <button class="btn btn-primary me-3" on:click={goBack}>Quay Lại Trang Trước</button>
      <button class="btn btn-outline-danger me-3" on:click={handleLogout}>Đăng Xuất</button>
      <button class="btn btn-outline-info" on:click={contactPermission}>Liên Hệ Cấp Quyền</button> <!-- Nút mới -->
    </div>
  </div>
</section>

<svelte:head>
  <title>Không Có Quyền Này</title>
  <meta name="description" content="Unauthorized Access Page" />
</svelte:head>

<style>
  .unauthorized-container {
    height: 100vh;
    background-color: #f8f9fa;
  }
  .card {
    max-width: 600px;
    width: 100%;
  }
  h1 {
    font-size: 5rem;
  }
  h2 {
    font-size: 2rem;
  }
</style>
