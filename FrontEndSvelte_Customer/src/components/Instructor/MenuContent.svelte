<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

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

  const userRole = localStorage.getItem('role'); 

  function getFormattedDate(): string {
    const now = new Date(); // Lấy giờ hiện tại

    // Sử dụng Intl.DateTimeFormat để định dạng ngày giờ
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, // Định dạng giờ 12h (AM/PM)
    };

    // Trả về ngày giờ đã được định dạng
    return new Intl.DateTimeFormat('en-US', options).format(now);
  }
</script>


<div class="container mt-5" style="width: 800px;">
  <!-- User Account Details Section -->
  <div>
    {#if userData}

    <div class="row text-center mb-4">
      <div class="col">
        <h2>User Account Details</h2>
        <p class="lead">Review and manage your account information below.</p>
      </div>
    </div>

    <!-- User Information -->
    <div class="row">
      <!-- User Name -->
      <div class="col-sm-6 col-lg-6 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Name</h5>
            <p class="card-text">{userData.HoTen}</p>
          </div>
        </div>
      </div>

      <!-- User Email -->
      <div class="col-sm-6 col-lg-6 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Email</h5>
            <p class="card-text">{userData.Email}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Information -->
    <div class="row">
      <!-- User Role -->
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Role</h5>
            <p class="card-text">{userRole}</p>
          </div>
        </div>
      </div>

      <!-- Last Login -->
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Last Login</h5>
            <p class="card-text">{getFormattedDate()}</p>
          </div>
        </div>
      </div>

      <!-- Account Status -->
      <div class="col-sm-6 col-lg-4 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Account Status</h5>
            <p class="card-text">Active</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="row">
      <!-- Update Profile -->
      <div class="col-sm-6 col-lg-6 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Update Profile</h5>
            <p class="card-text">Edit your personal information and preferences.</p>
            <a href="/user/update-profile" class="btn btn-primary">Update Profile</a>
          </div>
        </div>
      </div>

      <!-- View Activities -->
      <div class="col-sm-6 col-lg-6 mb-4">
        <div class="card h-100 shadow">
          <div class="card-body text-center">
            <h5 class="card-title">View Activities</h5>
            <p class="card-text">Check your recent activities and history.</p>
            <a href="/user/activities" class="btn btn-secondary">View Activities</a>
          </div>
        </div>
      </div>
    </div>
    {/if}
  </div>
</div>