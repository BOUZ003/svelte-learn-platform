<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  // ID vai trò từ URL
  let roleID: string | undefined;
  $: roleID = $page.params.id;

  let tenVaiTro: string = "";
  let moTa: string = "";
  let permissions: {
    QuyenID: number;
    TenQuyen: string;
    HasPermission: number;
  }[] = [];
  let selectedPermissions: number[] = []; // Mảng lưu các quyền được chọn

  // Lấy dữ liệu vai trò và quyền của vai trò
  async function fetchRoleData() {
    if (!roleID) return;

    try {
      // Lấy thông tin vai trò
      const roleResponse = await fetch(
        `http://localhost:3000/api/vaitro/get-by-id/${roleID}`
      );
      if (!roleResponse.ok) throw new Error("Failed to fetch role data");
      const role = await roleResponse.json();

      console.log("Role data:", role); // Kiểm tra dữ liệu vai trò
      tenVaiTro = role.TenVaiTro;
      moTa = role.MoTa;

      // Lấy danh sách quyền của vai trò
      const permissionResponse = await fetch(
        `http://localhost:3000/api/vaitro/get-prermissions-for-role/${roleID}`
      );
      if (!permissionResponse.ok)
        throw new Error("Failed to fetch permissions");
      const permissionsData = await permissionResponse.json();

      console.log("Permissions data:", permissionsData); // Kiểm tra dữ liệu quyền

      // Cập nhật danh sách quyền
      permissions = permissionsData.permissions || [];

      // Cập nhật selectedPermissions để phản ánh quyền của vai trò (HasPermission = 1)
      selectedPermissions = permissions
        .filter((permission) => permission.HasPermission === 1)
        .map((permission) => permission.QuyenID);
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  }

  // Cập nhật vai trò và quyền
  async function updateRole() {
    const userRole = localStorage.getItem("role");
    if (userRole === "SuperAdmin") {
      if (!roleID) {
        alert("Role ID is invalid!");
        return;
      }

      const payload = {
        VaiTroID: roleID,
        QuyenIDs: selectedPermissions,
      };

      console.log("Selected permissions:", selectedPermissions);

      try {
        const response = await fetch(
          `http://localhost:3000/api/vaitro/update-permissions/${roleID}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        // if (!response.ok) {
        //   const errorDetails = await response.json();
        //   console.error("Error details:", errorDetails);
        //   alert("Failed to update role.");
        // } else {
        alert("Role updated successfully!");
        goto("/admin/roles-permissions");
        // }
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }else {
        goto("/access-denied");
    }
  }

  // Hủy và quay lại danh sách vai trò
  function cancelForm() {
    goto("/admin/roles-permissions");
  }

  onMount(() => {
    fetchRoleData();
  });

  function formatText(input: string): string {
    return input
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  }
</script>

<div class="content">
  <h1>Role Permission</h1>
  <form on:submit|preventDefault={updateRole} class="form-container">
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

    <div class="form-group">
      <label for="permissions">Permissions</label>
      <div class="permissions-list">
        {#each permissions as permission}
          <div class="permission-item">
            <input
              type="checkbox"
              id={`permission-${permission.QuyenID}`}
              value={permission.QuyenID}
              bind:group={selectedPermissions}
              checked={selectedPermissions.includes(permission.QuyenID)}
            />
            <label for={`permission-${permission.QuyenID}`}
              >{formatText(permission.TenQuyen)}</label
            >
          </div>
        {/each}
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-success">Save Changes</button>
      <button type="button" class="btn btn-info">Add Permissions</button>
      <button type="button" class="btn btn-secondary" on:click={cancelForm}
        >Cancel</button
      >
    </div>
  </form>
</div>

<style>
  /* Container chính */
  .content {
    width: 2000px;
    margin: 50px auto;
    max-width: 900px;
    padding: 40px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
  }

  h1 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
  }

  /* Form container */
  .form-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
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

  /* Input field: giới hạn chiều rộng cho input "Name" */
  .form-control {
    height: 45px;
    padding: 12px;
    border-radius: 10px;
    font-size: 1.1rem;
    border: 1px solid #ced4da;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
    max-width: 100%; /* Giới hạn chiều rộng */
  }

  .form-control:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 6px rgba(0, 123, 255, 0.5);
  }

  /* Quyền (permissions) */
  .permissions-list {
    display: flex;
    flex-wrap: wrap; /* Cho phép các item xuống dòng */
    gap: 10px;
    /* margin-top: 15px; */
  }

  .permission-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background-color: #f1f1f1;
    border-radius: 8px;
    transition: all 0.3s ease;
    width: 48%; /* Mỗi item chiếm khoảng 48% không gian của container để tạo 2 cột */
  }

  .permission-item:hover {
    background-color: #e2e2e2;
    cursor: pointer;
  }

  .permission-item input {
    width: 16px; /* Giảm kích thước của checkbox */
    height: 16px;
    transition: all 0.2s ease;
  }

  .permission-item input:checked {
    background-color: #28a745;
  }

  .permission-item label {
    margin-top: 10px;
    font-size: 1rem; /* Giảm kích thước chữ label để cân đối */
    color: #495057;
    font-weight: 700;
    /* margin-left: 8px; */
  }

  /* Responsive Design for smaller screens */
  @media (max-width: 768px) {
    .permission-item {
      width: 100%; /* Chuyển sang một cột trên màn hình nhỏ */
    }
  }

  /* Action buttons */
  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
    margin-top: 30px;
  }

  button {
    padding: 12px 25px;
    font-size: 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
  }

  button:hover {
    opacity: 0.8;
  }

  button.btn-success {
    background-color: #28a745;
    color: white;
  }

  button.btn-info {
    background-color: #17a2b8;
    color: white;
  }

  button.btn-secondary {
    background-color: #6c757d;
    color: white;
  }

  /* Responsive Design: Chuyển sang 1 cột khi màn hình nhỏ */
  @media (max-width: 2068px) {
    .form-container {
      grid-template-columns: 1fr; /* Chuyển sang 1 cột */
    }

    .permissions-list {
      grid-template-columns: 1fr; /* Chuyển sang 1 cột */
    }
  }
</style>
