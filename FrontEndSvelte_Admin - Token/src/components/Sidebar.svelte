<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { slide } from "svelte/transition";

  let manageItemsOpen = false;
  let settingsOpen = false;
  let reportsOpen = false;
  let userManagementOpen = false;
  let isCollapsed = false;

  function toggleSubmenu(menu: string) {
  if (menu === "manageItems") {
    manageItemsOpen = !manageItemsOpen;
  } else if (menu === "settings") {
    settingsOpen = !settingsOpen;
  } else if (menu === "reports") {
    reportsOpen = !reportsOpen;
  } else if (menu === "userManagement") {
    userManagementOpen = !userManagementOpen;
  }
}


  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }
</script>

<!-- Import Font Awesome Icons -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
/>

<div class="sidebar bg-dark text-white p-4 {isCollapsed ? 'collapsed' : ''}">
  <button
    class="toggle-button"
    on:click={toggleSidebar}
    aria-label="Toggle sidebar"
  >
    <i class="fas fa-bars"></i>
  </button>
  {#if !isCollapsed}
    <h2 class="text-center mb-4" style="margin-top: -44px; margin-left: 30px;">
      Admin Panel
    </h2>
  {/if}
  <nav class="nav flex-column">
    <!-- Dashboard -->
    <a
      class="nav-link text-white mb-3 d-flex align-items-center"
      href="/#"
      aria-label="Dashboard"
    >
      <i class="fas fa-tachometer-alt me-2"></i>
      {#if !isCollapsed}<span>Dashboard</span>{/if}
    </a>

   <!-- 1. Technology -->
    <div class="nav-item">
      <a
        class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
        href="/"
        on:click={() => toggleSubmenu("manageItems")}
        aria-label="Manage Items"
      >
        <span>
          <i class="fas fa-box me-2"></i>
          {#if !isCollapsed}Technology{/if}
        </span>
        {#if !isCollapsed}
          <i
            class="fas fa-chevron-down"
            style:transform={`rotate(${manageItemsOpen ? 180 : 0}deg)`}
          ></i>
        {/if}
      </a>
      {#if manageItemsOpen && !isCollapsed}
        <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
          <a class="nav-link text-white mb-2" href="/loaicongnghe" aria-label="Loại công nghệ"
            >Technology type</a
          >
          <a class="nav-link text-white mb-2" href="/congnghe" aria-label="Công nghệ"
            >Technology</a
          >
          <a class="nav-link text-white mb-2" href="/noidungcongnghe" aria-label="Nội dung công nghệ"
            >Technology Content</a
          >
        </div>
      {/if}
    </div>

    <!-- Settings with Submenu -->
    <div class="nav-item">
      <a
        class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
        href="/"
        on:click={() => toggleSubmenu("settings")}
        aria-label="Settings"
      >
        <span>
          <i class="fas fa-cogs me-2"></i>
          {#if !isCollapsed}Settings{/if}
        </span>
        {#if !isCollapsed}
          <i
            class="fas fa-chevron-down"
            style:transform={`rotate(${settingsOpen ? 180 : 0}deg)`}
          ></i>
        {/if}
      </a>
      {#if settingsOpen && !isCollapsed}
        <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
          <a
            class="nav-link text-white mb-2"
            href="/"
            aria-label="Profile Settings">Profile Settings</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/"
            aria-label="Account Settings">Account Settings</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/"
            aria-label="Privacy Settings">Privacy Settings</a
          >
        </div>
      {/if}
    </div>

    <!-- Reports with Submenu -->
    <div class="nav-item">
      <a
        class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
        href="/"
        on:click={() => toggleSubmenu("reports")}
        aria-label="Reports"
      >
        <span>
          <i class="fas fa-chart-line me-2"></i>
          {#if !isCollapsed}Reports{/if}
        </span>
        {#if !isCollapsed}
          <i
            class="fas fa-chevron-down"
            style:transform={`rotate(${reportsOpen ? 180 : 0}deg)`}
          ></i>
        {/if}
      </a>
      {#if reportsOpen && !isCollapsed}
        <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
          <a class="nav-link text-white mb-2" href="/" aria-label="Sales Report"
            >Sales Report</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/"
            aria-label="User Activity">User Activity</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/"
            aria-label="Revenue Report">Revenue Report</a
          >
        </div>
      {/if}
    </div>

    <!-- User Management with Submenu -->
    <div class="nav-item">
      <a
        class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
        href="/"
        on:click={() => toggleSubmenu("userManagement")}
        aria-label="User Management"
      >
        <span>
          <i class="fas fa-users me-2"></i>
          {#if !isCollapsed}User Management{/if}
        </span>
        {#if !isCollapsed}
          <i
            class="fas fa-chevron-down"
            style:transform={`rotate(${userManagementOpen ? 180 : 0}deg)`}
          ></i>
        {/if}
      </a>
      {#if userManagementOpen && !isCollapsed}
        <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
          <a
            class="nav-link text-white mb-2"
            href="/admin/users"
            aria-label="Manage Users"
            >Manage Users</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/roles-permissions"
            aria-label="Roles and Permissions"
            >Roles & Permissions</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/activity-log"
            aria-label="User Activity Log"
            >User Activity Log</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/profile-management"
            aria-label="Profile Management"
            >Profile Management</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/authentication"
            aria-label="Authentication Management"
            >Authentication</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/groups"
            aria-label="Groups and Teams"
            >Groups/Teams</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/approval-requests"
            aria-label="Approval Requests"
            >Approval Requests</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/import-export"
            aria-label="Import Export Users"
            >Import/Export Users</a
          >
          <a
            class="nav-link text-white mb-2"
            href="/admin/notifications"
            aria-label="Notifications"
            >Notifications</a
          >
        </div>
      {/if}
    </div>
    
  </nav>
</div>

<style>
  .sidebar {
    background-color: #2c3e50;
    border-right: 1px solid #34495e;
    width: 250px;
    min-height: 100vh;
    overflow-y: auto;
    transition: width 0.3s ease;
    position: relative;
  }
  .collapsed {
    width: 85px; /* Chiều rộng khi thu gọn */
  }
  .toggle-button {
    position: relative;
    right: -3px;
    margin-bottom: 10px;
    background: none;
    border: none;
    color: #ecf0f1;
    font-size: 1.5rem;
    cursor: pointer;
    outline: none;
  }
  .sidebar h2 {
    font-size: 1.6rem;
    color: #ecf0f1;
  }
  .sidebar .nav-link {
    font-size: 1.1rem;
    padding: 12px 10px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;
    border-radius: 8px;
  }
  .sidebar .nav-link:hover {
    background-color: #34495e;
    color: #1abc9c;
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
</style>
