<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // ID người dùng từ URL
  let userID: string | undefined;
  $: userID = $page.params.id;

  let tenVaiTro: string = "";
  let moTa: string = "";

  // Lấy dữ liệu người dùng
  async function fetchUserData() {
    if (!userID) return;

    try {
      const response = await fetch(`http://localhost:3000/api/vaitro/get-by-id/${userID}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const user = await response.json();

      tenVaiTro = user.TenVaiTro;
      moTa = user.MoTa;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  async function updateUser() {
    if (!userID) {
      alert('User ID is invalid!');
      return;
    }

    const payload = {
      TenVaiTro: tenVaiTro,
      MoTa: moTa,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/vaitro/update/${userID}`, {
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
        goto('/admin/roles-permissions');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  function cancelForm() {
    goto('/admin/roles-permissions');
  }

  onMount(() => {
    fetchUserData();
  });
</script>

<div class="content">
  <h1>Update Role</h1>
  <form on:submit|preventDefault={updateUser} class="form-container">
    <div class="form-group">
      <label for="tenVaiTro">Name</label>
      <input
        type="text"
        id="tenVaiTro"
        bind:value={tenVaiTro}
        class="form-control"
        placeholder="Enter role name"
        required
      />
    </div>

    <div class="form-group">
      <label for="moTa">Description</label>
      <input
        type="text"
        id="moTa"
        bind:value={moTa}
        class="form-control"
        placeholder="Enter description"
        required
      />
    </div>
    <div class="form-actions">
      <button type="submit" class="btn btn-success">Save Changes</button>
      <button type="button" class="btn btn-info">Add Permissions</button>
      <button type="button" class="btn btn-secondary" on:click={cancelForm}>
        Cancel
      </button>
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

button.btn {
  background-color: #007bff;
  color: white;
}



:global(button.btn-primary:hover) {
  background-color: #0056b3; 
  transform: scale(1.05); 
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
