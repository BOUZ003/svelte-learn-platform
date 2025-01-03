<script lang="ts">
  import { goto } from "$app/navigation";
  import { isAuthenticated } from '../../stores/authStore';
  import { onMount } from 'svelte';

  // Kiểm tra xác thực
  onMount(() => {
    if (typeof window !== 'undefined') {
      const unsubscribe = isAuthenticated.subscribe(async (auth) => {
        if (!auth) {
          await goto('/login');
        }
      });
      return unsubscribe;
    }
  });

  // Dữ liệu liên quan đến người dùng
  let tenDangNhap: string = "";
  let matKhau: string = "";
  let email: string = "";
  let hoTen: string = "";
  let soDienThoai: string = ""; // Thêm biến số điện thoại
  let vaiTroID: number | null = null; // Vai trò của người dùng
  let trangThai: boolean = true;
  let ngayDangKy: string = new Date().toISOString().slice(0, 16); // ISO format phù hợp với <input type="datetime-local">
  let vaiTroOptions: { ID: number; TenVaiTro: string }[] = []; // Danh sách vai trò

  // Lấy danh sách vai trò từ API
  async function fetchVaiTroOptions() {
    try {
      const response = await fetch("http://localhost:3000/api/vaitro");
      if (!response.ok) throw new Error("Failed to fetch roles");

      vaiTroOptions = await response.json();
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  // Gọi API khi component được mount
  onMount(fetchVaiTroOptions);

  // Gửi dữ liệu để thêm người dùng mới
  async function addNguoiDung() {
    const payload = {
      TenDangNhap: tenDangNhap,
      MatKhau: matKhau,
      Email: email,
      HoTen: hoTen,
      SoDienThoai: soDienThoai, // Thêm số điện thoại vào payload
      VaiTroID: vaiTroID,
      TrangThai: trangThai,
      NgayDangKy: ngayDangKy,
    };

    try {
      const response = await fetch("http://localhost:3000/api/nguoidung/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      alert("User added successfully!");
      goto("/admin/users"); // Quay lại danh sách người dùng
    } catch (error) {
      alert("User already exists...");
      console.error("Error adding user:", error);
    }
  }

  // Hủy và quay lại danh sách
  function cancelForm() {
    goto("/admin/users");
  }
</script>

<div class="content">
  <h1>Create New User</h1>
  <form on:submit|preventDefault={addNguoiDung} class="form-container">
    <!-- Tên đăng nhập -->
    <div class="form-group">
      <label for="tenDangNhap">Username</label>
      <input
        type="text"
        id="tenDangNhap"
        bind:value={tenDangNhap}
        class="form-control"
        required
      />
    </div>

    <!-- Mật khẩu -->
    <div class="form-group">
      <label for="matKhau">Password</label>
      <input
        type="text"
        id="matKhau"
        bind:value={matKhau}
        class="form-control"
        required
      />
    </div>

    <!-- Email -->
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

    <!-- Số điện thoại -->
    <div class="form-group">
      <label for="soDienThoai">Phone Number</label>
      <input
        type="tel"
        id="soDienThoai"
        bind:value={soDienThoai}
        class="form-control"
        required
      />
    </div>

    <!-- Họ và Tên -->
    <div class="form-group">
      <label for="hoTen">Full Name</label>
      <input
        type="text"
        id="hoTen"
        bind:value={hoTen}
        class="form-control"
        required
      />
    </div>

    <!-- Vai trò -->
    <div class="form-group">
      <label for="vaiTroID">Role</label>
      <select
        id="vaiTroID"
        bind:value={vaiTroID}
        class="form-control"
        required
      >
        <option value="">Select Role</option>
        {#each vaiTroOptions as role}
          <option value={role.ID}>{role.TenVaiTro}</option>
        {/each}
      </select>
    </div>

    <!-- Trạng thái -->
    <div class="form-group">
      <label for="trangThai">Active Status</label>
      <input
        type="checkbox"
        id="trangThai"
        bind:checked={trangThai}
        class="form-check-input"
      />
    </div>

    <!-- Nút hành động -->
    <div class="form-actions">
      <button type="submit" class="btn btn-success">Add User</button>
      <button type="button" class="btn btn-secondary" on:click={cancelForm}>
        Cancel
      </button>
    </div>
  </form>
</div>


<style>
.content {
  margin: 0 auto;
  max-width: 900px; /* Tăng chiều ngang */
  padding: 30px;
  background-color: #f4f4f4;
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
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 25px;
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

.form-check-input {
  width: 20px;
  height: 20px;
}

textarea.form-control {
  resize: vertical;
  height: 100px;
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
  .content {
    padding: 20px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-container {
    grid-template-columns: 1fr; /* Chuyển về cột đơn trên màn hình nhỏ */
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}


</style>