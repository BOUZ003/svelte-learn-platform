<script lang="ts">
  import { goto } from '$app/navigation';
  import { logout } from '../stores/authStore';
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Import `page` store to access the URL
  
  let userData: any = {
    HoTen: '',
    NgaySinh: '',
    GioiTinh: '',
    QuocTich: '',
    DanToc: '',
    TonGiao: '',
    QueQuan: '',
    MaSoBaoHiem: '',
    SoTaiKhoan: '',
    TenNganHang: '',
    TheCanCuoc: '',
    NgayCap: '',
    NoiCap: '',
    DTHoRieng: '',
    DTCaNhan: '',
    Email: '',
    TinhThanhPhoThuongTru: '',
    DiaChiBaoTin: '',
    LinkFacebook: '',
    AnhThe: 'https://via.placeholder.com/100', // Set default avatar image
    AnhCMND: '',
  };

  let loading = true;
  let isEditing = false;
  let isModalOpen = false; // To control the modal visibility
  let newAvatar: File | null = null; // To hold the new avatar file

  function goHome() {
    goto('/login');
  }

  function handleLogout() {
    logout();
    goto('/login');
  }

  async function getUserData() {
    const userId = $page.params.id;  // Extract user ID from the URL params
    if (!userId) {
      console.error('Không có ID người dùng trong URL');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/thongtinnguoidung/get-by-id/${userId}`);
      if (response.ok) {
        const data = await response.json();
        userData = data;
      } else {
        console.error('Lỗi khi lấy dữ liệu từ API:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi kết nối đến API:', error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    getUserData();
  });

  function saveUserData() {
    console.log('Lưu dữ liệu:', userData);
  }

  function toggleEdit() {
    isEditing = !isEditing;
  }

  function openModal() {
    isModalOpen = true; // Open modal when avatar is clicked
  }

  function closeModal() {
    isModalOpen = false; // Close modal
  }

  function handleAvatarChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      newAvatar = target.files[0];
      const reader = new FileReader();
      reader.onload = function () {
        if (reader.result) {
          userData.AnhThe = reader.result as string;
        }
      };
      reader.readAsDataURL(newAvatar);
    }
  }
</script>

<!-- The rest of your Svelte component -->



<section class="profile-container d-flex flex-column justify-content-center align-items-center">
  <div class="card p-5 shadow-sm profile-card">
    <div class="profile-header text-center mb-4">
      <!-- Avatar -->
      <!-- <img src={userData.AnhThe} alt="Avatar" class="profile-avatar" on:click={openModal}> -->
      <h1 class="display-4 text-primary" style="font-size: 30px;">Thông Tin Cá Nhân</h1>
    </div>

    <!-- Hiển thị thông tin người dùng -->
    {#if userData}
      <div class="user-info mt-4">
        <h3 class="mb-3" style="font-size: 20px;">Thông tin người dùng:</h3>

        <!-- Các trường thông tin -->
        <div class="info-item">
          <strong>Họ và tên:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.HoTen} class="form-control" />
          {:else}
            <span>{userData.HoTen}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Ngày sinh:</strong>
          {#if isEditing}
            <input type="date" bind:value={userData.NgaySinh} class="form-control" />
          {:else}
            <span>{userData.NgaySinh.split('T')[0]}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Giới tính:</strong>
          {#if isEditing}
            <select bind:value={userData.GioiTinh} class="form-control">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          {:else}
            <span>{userData.GioiTinh}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Quốc tịch:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.QuocTich} class="form-control" />
          {:else}
            <span>{userData.QuocTich}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Dân tộc:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.DanToc} class="form-control" />
          {:else}
            <span>{userData.DanToc}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Tôn giáo:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.TonGiao} class="form-control" />
          {:else}
            <span>{userData.TonGiao}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Địa chỉ:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.QueQuan} class="form-control" />
          {:else}
            <span>{userData.QueQuan}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Mã số bảo hiểm:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.MaSoBaoHiem} class="form-control" />
          {:else}
            <span>{userData.MaSoBaoHiem}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Số tài khoản:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.SoTaiKhoan} class="form-control" />
          {:else}
            <span>{userData.SoTaiKhoan}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Tên ngân hàng:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.TenNganHang} class="form-control" />
          {:else}
            <span>{userData.TenNganHang}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>CMND/CCCD:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.TheCanCuoc} class="form-control" />
          {:else}
            <span>{userData.TheCanCuoc}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Ngày cấp:</strong>
          {#if isEditing}
            <input type="date" bind:value={userData.NgayCap} class="form-control" />
          {:else}
            <span>{userData.NgayCap.split('T')[0]}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Nơi cấp:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.NoiCap} class="form-control" />
          {:else}
            <span>{userData.NoiCap}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Điện thoại:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.DTHoRieng} class="form-control" />
          {:else}
            <span>{userData.DTHoRieng}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Email:</strong>
          {#if isEditing}
            <input type="email" bind:value={userData.Email} class="form-control" />
          {:else}
            <span>{userData.Email}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Địa chỉ thường trú:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.TinhThanhPhoThuongTru} class="form-control" />
          {:else}
            <span>{userData.TinhThanhPhoThuongTru}</span>
          {/if}
        </div>

        <div class="info-item">
          <strong>Địa chỉ bưu điện:</strong>
          {#if isEditing}
            <input type="text" bind:value={userData.DiaChiBaoTin} class="form-control" />
          {:else}
            <span>{userData.DiaChiBaoTin}</span>
          {/if}
        </div>
      </div>
    {:else if loading}
      <p>Đang tải dữ liệu...</p>
    {:else}
      <p>Không tìm thấy thông tin người dùng.</p>
    {/if}

    <div class="d-flex justify-content-center mt-4">
      {#if isEditing}
        <button class="btn btn-success me-3" on:click={saveUserData}>Lưu Thông Tin</button>
      {/if}
      <button class="btn btn-outline-secondary me-3" on:click={toggleEdit}>
        {isEditing ? 'Hủy Chỉnh Sửa' : 'Chỉnh Sửa'}
      </button>
      <button class="btn btn-outline-primary" on:click={goHome}>Quay Lại Trang Chủ</button>
      <button class="btn btn-outline-danger" on:click={handleLogout}>Đăng Xuất</button>
    </div>
  </div>
</section>

<!-- Modal for Avatar Change -->
{#if isModalOpen}
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Chọn ảnh đại diện mới</h2>
      <input type="file" accept="image/*" on:change={handleAvatarChange} />
      <div class="modal-actions">
        <button on:click={closeModal} class="btn btn-outline-secondary">Đóng</button>
        <button on:click={saveUserData} class="btn btn-success">Lưu</button>
      </div>
    </div>
  </div>
{/if}

<svelte:head>
  <title>Thông Tin Cá Nhân</title>
  <meta name="description" content="Trang thông tin cá nhân của người dùng" />
</svelte:head>

<style>
  .profile-container {
    margin-top: 20px;
    min-height: 100vh;
    background-color: #f4f7fb;
  }

  .profile-card {
    margin-left: 10%;
    max-width: 900px;
    width: 100%;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* padding: 40px; */
  }

  .profile-header {
    margin-bottom: 30px;
  }

  /* .profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    cursor: pointer;
  } */

  h1 {
    font-size: 2.5rem;
    color: #007bff;
    font-weight: bold;
  }

  .user-info {
    background-color: #f9f9f9;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .info-item {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: #333;
  }

  .info-item strong {
    color: #555;
  }

  .form-control {
    width: 100%;
    padding: 10px 15px;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-top: 8px;
  }

  .btn {
    width: 190px;
    height: 40px;
    font-size: 1.1rem;
    border-radius: 8px;
  }

  .btn:hover {
    background-color: #007bff;
    color: #fff;
  }

  .btn-outline-primary {
    border: 2px solid #007bff;
    color: #007bff;
  }

  .btn-outline-danger {
    border: 2px solid #dc3545;
    color: #dc3545;
    margin-left: 2.5%;
  }

  .btn-outline-secondary {
    border: 2px solid #6c757d;
    color: #6c757d;
  }

  .btn-outline-primary:hover {
    background-color: #007bff;
    color: #fff;
  }

  .btn-outline-danger:hover {
    background-color: #dc3545;
    color: #fff;
  }

  .btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #fff;
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
  }

  .modal-actions {
    margin-top: 20px;
  }

  .modal-actions .btn {
    margin: 0 10px;
  }
</style>
