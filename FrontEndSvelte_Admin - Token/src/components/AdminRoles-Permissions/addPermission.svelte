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

  let tenQuyen: string = "";
  let moTaQuyen: string = "";
  let capDo: string = "HeThong"; // Mặc định CapDo là 'HeThong'

  // Hàm thêm quyền
  async function addQuyen() {
    if (!tenQuyen.trim() || !moTaQuyen.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const payload = {
      TenQuyen: tenQuyen,
      MoTa: moTaQuyen,
      CapDo: capDo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/quyen/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      alert("Permission created successfully!");
      goto("/admin/roles-permissions"); // Chuyển trang sau khi tạo quyền thành công
    } catch (error) {
      alert("Error creating permission...");
      console.error("Error adding permission:", error);
    }
  }

  // Hàm lưu và thêm quyền mới
  async function saveAndAddAnotherQuyen() {
    if (!tenQuyen.trim() || !moTaQuyen.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const payload = {
      TenQuyen: tenQuyen,
      MoTa: moTaQuyen,
      CapDo: capDo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/quyen/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      alert("Permission created successfully!");
      
      // Reset các trường đầu vào để người dùng tạo quyền mới
      tenQuyen = "";
      moTaQuyen = "";
    } catch (error) {
      alert("Error creating permission...");
      console.error("Error adding permission:", error);
    }
  }

  // Hủy và quay lại danh sách quyền
  function cancelForm() {
    goto("/admin/roles-permissions");
  }
</script>

  
<div class="content">
  <h1>Create New Permission</h1>
  <form on:submit|preventDefault={addQuyen} class="form-container">
    <div class="form-group">
      <label for="tenQuyen">Permission Name</label>
      <input
        type="text"
        id="tenQuyen"
        bind:value={tenQuyen}
        class="form-control"
        placeholder="Enter permission name"
        required
      />
    </div>

    <div class="form-group">
      <label for="moTaQuyen">Description</label>
      <input
        type="text"
        id="moTaQuyen"
        bind:value={moTaQuyen}
        class="form-control"
        placeholder="Enter description"
        required
      />
    </div>

    <div class="form-group">
      <label for="capDo">Level</label>
      <select id="capDo" bind:value={capDo} class="form-control">
        <option value="HeThong">Hệ Thống</option>
        <option value="KhoaHoc">Khóa Học</option>
      </select>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-success">Create Permission</button>
      <button type="button" class="btn btn-primary" on:click={saveAndAddAnotherQuyen}>Save and Add Another</button>
      <button type="button" class="btn btn-secondary" on:click={cancelForm}>Cancel</button>
    </div>
  </form>
</div>

  
  <style>
    .content {
    margin: 50px auto;
    max-width: 900px;
    padding: 30px;
    height: 350px;
    background-color: #ffffff;
    border-radius: 15px; /* Tăng độ bo góc */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  h1 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 20px;
    color: #343a40;
  }
  
  .form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 10px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px; /* Thêm khoảng cách dưới mỗi trường nhập */
  }
  
  .form-group label {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: #495057;
  }
  
  .form-control {
    height: 45px;
    padding: 10px;
    border-radius: 8px;
    font-size: 1.1rem;
    border: 1px solid #ced4da;
    background-color: #f8f9fa;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
    background-color: #ffffff;
  }
  
  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-start;
    gap: 15px;
    margin-top: 25px;
  }
  
  button {
    padding: 10px 25px;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  button.btn-success {
    background-color: #28a745;
    color: white;
  }
  
  button.btn-success:hover {
    background-color: #218838;
    transform: scale(1.05); /* Hiệu ứng nhấn */
  }
  
  button.btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  button.btn-primary:hover {
    background-color: #0056b3;
    transform: scale(1.05); /* Hiệu ứng nhấn */
  }
  
  button.btn-info {
    background-color: #17a2b8;
    color: white;
  }
  
  button.btn-info:hover {
    background-color: #138496;
    transform: scale(1.05); /* Hiệu ứng nhấn */
  }
  
  button.btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  button.btn-secondary:hover {
    background-color: #5a6268;
    transform: scale(1.05); /* Hiệu ứng nhấn */
  }
  
  @media (max-width: 768px) {
    .content {
      padding: 20px;
    }
  
    h1 {
      font-size: 1.7rem;
    }
  
    .form-container {
      grid-template-columns: 1fr;
    }
  
    .form-actions {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
  
    button {
      width: 100%; /* Đảm bảo nút full-width trên thiết bị di động */
    }
  }
  
  
  </style>
  