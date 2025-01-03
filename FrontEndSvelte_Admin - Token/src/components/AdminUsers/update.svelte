<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
  
    // ID người dùng từ URL
    let userID: string | undefined;
    $: userID = $page.params.id;
  
    // Dữ liệu người dùng
    let username: string = '';
    let password: string = '';
    let email: string = '';
    let fullName: string = '';
    let phone: string = '';
    let roleID: number | null = null;
    let status: boolean = true;
  
    // Danh sách vai trò
    let roleOptions: { ID: number; TenVaiTro: string }[] = [];
  
    // Lấy dữ liệu người dùng
    async function fetchUserData() {
      if (!userID) return;
  
      try {
        const response = await fetch(`http://localhost:3000/api/nguoidung/get-by-id/${userID}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const user = await response.json();
  
        username = user.TenDangNhap;
        email = user.Email;
        fullName = user.HoTen;
        phone = user.SoDienThoai;
        roleID = user.VaiTroID;
        status = user.TrangThai === 'HoatDong'; // Chuyển trạng thái thành boolean
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  
    // Lấy danh sách vai trò
    async function fetchRoleOptions() {
      try {
        const response = await fetch('http://localhost:3000/api/vaitro');
        if (!response.ok) throw new Error('Failed to fetch role options');
        roleOptions = await response.json();
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    }
  
    // Gửi dữ liệu cập nhật người dùng
    async function updateUser() {
      if (!userID) {
        alert('User ID is invalid!');
        return;
      }
  
      const payload = {
        TenDangNhap: username,
        MatKhau: password || null, // Nếu để trống, không cập nhật mật khẩu
        Email: email,
        HoTen: fullName,
        SoDienThoai: phone,
        VaiTroID: roleID,
        TrangThai: status ? 'HoatDong' : 'BiKhoa',
      };
  
      try {
        const response = await fetch(`http://localhost:3000/api/nguoidung/update/${userID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Error details:', errorDetails);
          alert('Failed to update user.');
        } else {
          alert('User updated successfully!');
          goto('/admin/users');
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  
    // Hủy và quay lại danh sách
    function cancelForm() {
      goto('/admin/users');
    }
  
    // Lấy dữ liệu khi mount
    onMount(() => {
      fetchUserData();
      fetchRoleOptions();
    });
  </script>
  
  <div class="content">
    <h1>Update User</h1>
    <form on:submit|preventDefault={updateUser} class="form-container">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          class="form-control"
          readonly
        />
      </div>
  
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="form-control"
          placeholder="Leave blank to keep current password"
          readonly
        />
      </div>
  
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          bind:value={email}
          class="form-control"
          required
        />
      </div>
  
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          bind:value={phone}
          class="form-control"
          required
        />
      </div>
  
      <div class="form-group">
        <label for="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          bind:value={fullName}
          class="form-control"
          required
        />
      </div>
  
      <div class="form-group">
        <label for="roleID">Role</label>
        <select
          id="roleID"
          bind:value={roleID}
          class="form-control"
          required
        >
          <option value="">Select Role</option>
          {#each roleOptions as role}
            <option value={role.ID} selected={roleID === role.ID}>{role.TenVaiTro}</option>
          {/each}
        </select>
      </div>
      
  
      <div class="form-group">
        <label for="status">Active Status</label>
        <input
          type="checkbox"
          id="status"
          bind:checked={status}
          class="form-check-input"
        />
      </div>
  
      <div class="form-actions">
        <button type="submit" class="btn btn-success">Save Changes</button>
        <button type="button" class="btn btn-secondary" on:click={cancelForm}>
          Cancel
        </button>
      </div>
    </form>
  </div>
  
  <style>
    .content {
      margin: 0 auto;
      max-width: 900px;
      padding: 30px;
      background-color: #f9f9f9;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
  
    h1 {
      text-align: center;
      font-size: 1.8rem;
      margin-bottom: 30px;
      color: #343a40;
    }
  
    .form-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
  
    .form-group {
      display: flex;
      flex-direction: column;
    }
  
    .form-group label {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 8px;
      color: #495057;
    }
  
    .form-control {
      height: 40px;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 1rem;
      border: 1px solid #ced4da;
      transition: border-color 0.3s ease;
    }
  
    .form-control:focus {
      border-color: #80bdff;
      outline: none;
      box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
    }
  
    .form-actions {
      grid-column: 1 / -1;
      display: flex;
      justify-content: flex-end;
      gap: 15px;
      margin-top: 20px;
    }
  
    button {
      padding: 10px 20px;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s ease;
    }
  
    button.btn-success {
      background-color: #28a745;
      color: white;
    }
  
    button.btn-success:hover {
      background-color: #218838;
    }
  
    button.btn-secondary {
      background-color: #6c757d;
      color: white;
    }
  
    button.btn-secondary:hover {
      background-color: #5a6268;
    }
  
    @media (max-width: 768px) {
      .form-container {
        grid-template-columns: 1fr;
      }
    }
  </style>
  