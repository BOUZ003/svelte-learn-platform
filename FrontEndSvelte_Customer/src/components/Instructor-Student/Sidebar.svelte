<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import { slide } from "svelte/transition";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from '$app/navigation';

  let userData: any = {
    HoTen: "",
    NgaySinh: "",
    GioiTinh: "",
    QuocTich: "",
    DanToc: "",
    TonGiao: "",
    QueQuan: "",
    MaSoBaoHiem: "",
    SoTaiKhoan: "",
    TenNganHang: "",
    TheCanCuoc: "",
    NgayCap: "",
    NoiCap: "",
    DTHoRieng: "",
    DTCaNhan: "",
    Email: "",
    TinhThanhPhoThuongTru: "",
    DiaChiBaoTin: "",
    LinkFacebook: "",
    AnhThe: "https://via.placeholder.com/100", // Set default avatar image
    AnhCMND: "",
  };
  let loading = true;

  let userDetailsOpen = false;
  let settingsOpen = false;
  let activityOpen = false;
  let isCollapsed = false;

  function toggleSubmenu(menu: string) {
    if (menu === "userDetails") {
      userDetailsOpen = !userDetailsOpen;
    } else if (menu === "settings") {
      settingsOpen = !settingsOpen;
    } else if (menu === "activity") {
      activityOpen = !activityOpen;
    }
  }

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }

  async function getUserData() {
    const userId = $page.params.id; // Extract user ID from the URL params
    if (!userId) {
      console.error("Không có ID người dùng trong URL");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/thongtinnguoidung/get-by-id/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        userData = data;
      } else {
        console.error("Lỗi khi lấy dữ liệu từ API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến API:", error);
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    getUserData();
  });

  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  
  function redirectToDashboard() {
    goto(`/instructor/${userId}`); 
  }

  function redirectToInstuctorCourse() {
    goto(`/instructor-course`); 
  }

  function redirectToInstuctorStudent() {
    goto(`/instructor-student`); 
  }

  function redirectToInstuctorAssignment() {
    goto(`/instructor-assignment`); 
  }

  function redirectToInstuctorAnalytics() {
    goto(`/instructor-analytics`); 
  }
</script>

<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>

<div class="sidebar bg-white text-dark {isCollapsed ? 'collapsed' : ''}">
  <button
    class="toggle-button"
    on:click={toggleSidebar}
    aria-label="Toggle sidebar"
  >
    <i class="fas fa-bars"></i>
  </button>
  <nav class="nav flex-column">
    <div class="nav-item">
      <a
        class="nav-link text-dark mb-1 d-flex align-items-center justify-content-between"
        href="javascript:void(0)"
        on:click={redirectToDashboard}
        aria-label="Settings"
      >
        <i class="fa-solid fa-clock me-2"></i>
        <span>
          {#if !isCollapsed}Dashboard{/if}
        </span>
        {#if !isCollapsed}
          <i></i>
        {/if}
      </a>
    </div>
    <div class="nav-item">
      <a
        class="nav-link text-dark mb-1 d-flex align-items-center justify-content-between"
        href="javascript:void(0)"
        on:click={redirectToInstuctorCourse}
        aria-label="Settings"
      >
        <i class="fa-solid fa-book me-2"></i>
        <span>
          {#if !isCollapsed}Course{/if}
        </span>
        {#if !isCollapsed}
          <i></i>
        {/if}
      </a>
    </div>    
    <div class="nav-item">
      <a
        class="nav-link text-dark mb-1 d-flex align-items-center justify-content-between"
        href="javascript:void(0)"
        on:click={redirectToInstuctorStudent}
        aria-label="Settings"
        style="border-left: 3px solid #0ddd0d;"
      >
        <i class="fa-solid fa-graduation-cap" style="color: #0ddd0d;"></i>
        <span style="color: #0ddd0d;">
          {#if !isCollapsed}Student{/if}
        </span>
        {#if !isCollapsed}
          <i></i>
        {/if}
      </a>
    </div>    
    <div class="nav-item">
      <a
        class="nav-link text-dark mb-1 d-flex align-items-center justify-content-between"
        href="javascript:void(0)"
        on:click={redirectToInstuctorAssignment}
        aria-label="Settings"
      >
        <i class="fa-solid fa-folder-open"></i>
        <span>
          {#if !isCollapsed}Assignment{/if}
        </span>
        {#if !isCollapsed}
          <i></i>
        {/if}
      </a>
    </div>  
    <div class="nav-item">
      <a
        class="nav-link text-dark mb-1 d-flex align-items-center justify-content-between"
        href="javascript:void(0)"
        on:click={redirectToInstuctorAnalytics}
        aria-label="Settings"
      >
        <i class="fa-solid fa-chart-line"></i>
        <span>
          {#if !isCollapsed}Analytics{/if}
        </span>
        {#if !isCollapsed}
          <i></i>
        {/if}
      </a>
    </div>  
  </nav>
</div>

<style>
  .sidebar {
    margin-top: 30px;
    background-color: #2c3e50;
    border-right: 1px solid #34495e;
    width: 283px;
    min-height: 100vh;
    overflow-y: auto;
    transition: width 0.3s ease;
    position: relative;
  }
  .collapsed {
    width: 85px;
  }
  .toggle-button {
    margin-top: 30px;
    position: relative;
    right: -3px;
    margin-bottom: 10px;
    background: none;
    border: none;
    color: #2ad855;
    font-size: 1.5rem;
    cursor: pointer;
    outline: none;
  }
  .sidebar .nav-link {
    font-size: 1.1rem;
    /* padding: 12px 10px; */
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
    /* border-radius: 8px; */
  }
  .sidebar .nav-link:hover {
    /* background-color: #34495e; */
    color: #0ddd0d;
  }
  .sidebar .nav-link i {
    font-size: 1rem;
  }
  .submenu .nav-link {
    font-size: 1rem;
    padding-left: 10px;
    transition: all 0.3s ease;
  }
  .submenu .nav-link:hover {
    background-color: #3a5062;
  }
  .nav-item .fa-chevron-down {
    transition: transform 0.3s ease;
  }
  .nav-link span {
    font-size: 15px;
  }
  /* Thêm hiệu ứng gạch chân cho span khi hover vào nav-link */
  .sidebar .nav-link:hover span {
    text-decoration: underline;
    text-underline-offset: 4px; /* Adjust the offset if needed */
    display: flex; /* Ensures alignment */
  }

  /* Đảm bảo rằng khi hover, thẻ span có gạch chân nhưng không ảnh hưởng đến các phần tử khác */
  .sidebar .nav-link span {
    transition: text-decoration 0.3s ease;
  }
</style>
