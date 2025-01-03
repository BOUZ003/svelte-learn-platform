<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // ID quyền từ URL
  let quyenID: string | undefined;
  $: quyenID = $page.params.id;

  let tenQuyen: string = "";
  let moTa: string = "";
  let capDo: 'HeThong' | 'KhoaHoc' = 'HeThong';

  // Lấy dữ liệu quyền
  async function fetchQuyenData() {
    if (!quyenID) return;

    try {
      const response = await fetch(`http://localhost:3000/api/quyen/get-by-id/${quyenID}`);
      if (!response.ok) throw new Error('Failed to fetch permission data');
      const quyen = await response.json();

      tenQuyen = quyen.TenQuyen;
      moTa = quyen.MoTa;
      capDo = quyen.CapDo;
    } catch (error) {
      console.error('Error fetching permission data:', error);
    }
  }

  async function updateQuyen() {
    if (!quyenID) {
      alert('Permission ID is invalid!');
      return;
    }

    const payload = {
      TenQuyen: tenQuyen,
      MoTa: moTa,
      CapDo: capDo,
    };

    try {
      const response = await fetch(`http://localhost:3000/api/quyen/update/${quyenID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        alert('Failed to update permission.');
      } else {
        alert('Permission updated successfully!');
        goto('/admin/roles-permissions');
      }
    } catch (error) {
      console.error('Error updating permission:', error);
    }
  }

  function cancelForm() {
    goto('/admin/roles-permissions');
  }

  onMount(() => {
    fetchQuyenData();
  });
</script>

<div class="content">
  <h1>Update Permission</h1>
  <form on:submit|preventDefault={updateQuyen} class="form-container">
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

    <div class="form-group">
      <label for="capDo">Level</label>
      <select id="capDo" bind:value={capDo} class="form-control" required>
        <option value="HeThong">Hệ thống</option>
        <option value="KhoaHoc">Khóa học</option>
      </select>
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
    margin: 50px auto;
    max-width: 900px;
    padding: 30px;
    height: 420px;
    background-color: #ffffff;
    border-radius: 15px; 
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
    margin-bottom: 20px;
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
    transform: scale(1.05);
  }

  button.btn-info {
    background-color: #17a2b8;
    color: white;
  }

  button.btn-info:hover {
    background-color: #138496;
    transform: scale(1.05);
  }

  button.btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  button.btn-secondary:hover {
    background-color: #5a6268;
    transform: scale(1.05);
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
      width: 100%;
    }
  }
</style>
