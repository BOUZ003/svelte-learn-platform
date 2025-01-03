<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { slide } from "svelte/transition";

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
<!-- {#if !isCollapsed}
  <h2 class="text-center mb-4" style="margin-top: 0px; margin-left: 30px;">
    User Account
  </h2>
{/if} -->
<nav class="nav flex-column">
  <!-- User Details -->
  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("userDetails")}
      aria-label="User Details"
    >
      <span>
        <i class="fas fa-user me-2"></i>
        {#if !isCollapsed}Dashboard{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${userDetailsOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if userDetailsOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <p class="text-white mb-2">Name: John Doe</p>
        <!-- <p class="text-white mb-2">Email: john.doe@example.com</p> -->
        <p class="text-white mb-2">Role: Administrator</p>
        <!-- <p class="text-white mb-2">Last Login: December 17, 2024, 8:45 PM</p> -->
        <p class="text-white mb-2">Account Status: Active</p>
      </div>
    {/if}
  </div>

  <!-- Settings -->
  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("settings")}
      aria-label="Settings"
    >
      <span>
        <i class="fas fa-cogs me-2"></i>
        {#if !isCollapsed}My Learning{/if}
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
          href="/profile-settings"
          aria-label="Profile Settings"
          >Profile Settings</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/account-settings"
          aria-label="Account Settings"
          >Account Settings</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/privacy-settings"
          aria-label="Privacy Settings"
          >Privacy Settings</a
        >
      </div>
    {/if}
  </div>

  <!-- Activity Log -->
  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("activity")}
      aria-label="Activity Log"
    >
      <span>
        <i class="fas fa-list-alt me-2"></i>
        {#if !isCollapsed}Practice{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${activityOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if activityOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <a
          class="nav-link text-white mb-2"
          href="/recent-activities"
          aria-label="Recent Activities"
          >Recent Activities</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/login-history"
          aria-label="Login History"
          >Login History</a
        >
      </div>
    {/if}
  </div>

  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("activity")}
      aria-label="Activity Log"
    >
      <span>
        <i class="fas fa-list-alt me-2"></i>
        {#if !isCollapsed}Exams{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${activityOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if activityOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <a
          class="nav-link text-white mb-2"
          href="/recent-activities"
          aria-label="Recent Activities"
          >Recent Activities</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/login-history"
          aria-label="Login History"
          >Login History</a
        >
      </div>
    {/if}
  </div>

  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("activity")}
      aria-label="Activity Log"
    >
      <span>
        <i class="fas fa-list-alt me-2"></i>
        {#if !isCollapsed}Interview Practice{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${activityOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if activityOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <a
          class="nav-link text-white mb-2"
          href="/recent-activities"
          aria-label="Recent Activities"
          >Recent Activities</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/login-history"
          aria-label="Login History"
          >Login History</a
        >
      </div>
    {/if}
  </div>

  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("activity")}
      aria-label="Activity Log"
    >
      <span>
        <i class="fas fa-list-alt me-2"></i>
        {#if !isCollapsed}For Teachers{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${activityOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if activityOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <a
          class="nav-link text-white mb-2"
          href="/recent-activities"
          aria-label="Recent Activities"
          >Recent Activities</a
        >
        <a
          class="nav-link text-white mb-2"
          href="/login-history"
          aria-label="Login History"
          >Login History</a
        >
      </div>
    {/if}
  </div>

  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("userDetails")}
      aria-label="User Details"
    >
      <span>
        <i class="fas fa-user me-2"></i>
        {#if !isCollapsed}Dashboard{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${userDetailsOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if userDetailsOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <p class="text-white mb-2">Name: John Doe</p>
        <!-- <p class="text-white mb-2">Email: john.doe@example.com</p> -->
        <p class="text-white mb-2">Role: Administrator</p>
        <!-- <p class="text-white mb-2">Last Login: December 17, 2024, 8:45 PM</p> -->
        <p class="text-white mb-2">Account Status: Active</p>
      </div>
    {/if}
  </div>

  <div class="nav-item">
    <a
      class="nav-link text-white mb-3 d-flex align-items-center justify-content-between"
      href="javascript:void(0)"
      on:click={() => toggleSubmenu("userDetails")}
      aria-label="User Details"
    >
      <span>
        <i class="fas fa-user me-2"></i>
        {#if !isCollapsed}Dashboard{/if}
      </span>
      {#if !isCollapsed}
        <i
          class="fas fa-chevron-down"
          style:transform={`rotate(${userDetailsOpen ? 180 : 0}deg)`}
        ></i>
      {/if}
    </a>
    {#if userDetailsOpen && !isCollapsed}
      <div class="submenu ms-4" transition:slide={{ duration: 500 }}>
        <p class="text-white mb-2">Name: John Doe</p>
        <!-- <p class="text-white mb-2">Email: john.doe@example.com</p> -->
        <p class="text-white mb-2">Role: Administrator</p>
        <!-- <p class="text-white mb-2">Last Login: December 17, 2024, 8:45 PM</p> -->
        <p class="text-white mb-2">Account Status: Active</p>
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
  overflow-y: hidden;
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
  transition: background-color 0.2s ease, color 0.2s ease;
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
