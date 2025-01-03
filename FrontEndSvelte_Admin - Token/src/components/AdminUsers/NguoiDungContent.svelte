<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import { goto } from "$app/navigation";
  import type { NguoiDung } from "../../types/nguoiDung";
  import { onMount } from "svelte";
  import { isAuthenticated } from "../../stores/authStore";

  let data: NguoiDung[] = [];
  let totalRows = 0;
  let totalPages = 0;
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 10;

  let sortKey = "ID";
  let sortOrder = "asc";

  let debounceTimeout: NodeJS.Timeout;
  let showModal: number | null = null;

  // Kiểm tra xác thực
  onMount(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = isAuthenticated.subscribe(async (auth) => {
        if (!auth) {
          await goto("/login");
        }
      });
      return unsubscribe;
    }
  });

  // Lấy danh sách người dùng
  async function fetchItems() {
    const query = new URLSearchParams({
      searchKeyword: searchQuery,
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      sortKey: sortKey,
      sortOrder: sortOrder,
    });

    try {
      const response = await fetch(
        `http://localhost:3000/api/nguoidung/search?${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch data from API");

      const result = await response.json();
      data = result.data; // Gán dữ liệu người dùng từ API
      totalRows = result.totalRows;
      totalPages = result.totalPages;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Sắp xếp dữ liệu
  function toggleSort(key: keyof NguoiDung) {
    if (sortKey === key) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortKey = key;
      sortOrder = "asc";
    }
    fetchItems();
  }

  // Tìm kiếm với debounce
  function handleSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      currentPage = 1;
      fetchItems();
    }, 300);
  }

  // Chuyển trang
  function goToPage(page: number): void {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchItems();
    }
  }

  // Chuyển đến trang thêm
  function addItem() {
    const userRole = localStorage.getItem("role");

    if (userRole === "SuperAdmin") {
      goto("/admin/users/add");
    } else {
      goto("/access-denied");
    }
  }

  // Chuyển đến trang chỉnh sửa
  function editItem(itemId: number) {
    const userRole = localStorage.getItem("role");

    if (userRole === "SuperAdmin") {
      goto(`/admin/users/update/${itemId}`);
    } else {
      goto("/access-denied");
    }
  }

  // Xóa người dùng
  async function deleteItem(itemId: number) {
    const userRole = localStorage.getItem("role");

    if (userRole === "SuperAdmin") {
      if (confirm("Are you sure you want to delete this user?")) {
        try {
          await fetch(`http://localhost:3000/api/nguoidung/delete/${itemId}`, {
            method: "DELETE",
          });
          fetchItems();
          location.reload();
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    } else {
      goto("/access-denied");
    }
  }

  // Mở và đóng modal
  function openModal(itemID: number) {
    showModal = itemID;
  }

  function closeModal() {
    showModal = null;
  }

  // Định dạng ngày
  function formatDate(dateString: string | null | undefined) {
    if (!dateString) return "-";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", options).format(date);
  }

  onMount(fetchItems);

  let selectedItems = new Set<number>(); // Set lưu trữ các ID đã chọn
  function checkAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked; // Kiểm tra trạng thái của checkbox "Select All"

    // Duyệt qua tất cả các checkbox và cập nhật trạng thái
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:not(#selectAll)'
    ); // Lấy tất cả checkbox, loại trừ checkbox "Select All"

    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = isChecked; // Cập nhật trạng thái của checkbox
      const row = checkbox.closest("tr"); // Lấy hàng <tr> chứa checkbox
      const itemId = parseInt(
        row?.querySelectorAll("td")[1]?.textContent || "0"
      ); // Lấy ID từ cột thứ hai (index 1)

      if (isChecked) {
        selectedItems.add(itemId); // Thêm ID vào danh sách đã chọn
      } else {
        selectedItems.delete(itemId); // Xóa ID khỏi danh sách đã chọn
      }
    });

    // Log tất cả ID đã chọn vào console
    console.log(`Selected IDs: ${Array.from(selectedItems).join(", ")}`);
  }

  function toggleItemSelection(itemId: number, isChecked: boolean) {
    if (isChecked) {
      selectedItems.add(itemId); // Thêm ID vào danh sách đã chọn
    } else {
      selectedItems.delete(itemId); // Xóa ID khỏi danh sách đã chọn
    }

    // Log tất cả ID đã chọn vào console
    // console.log(`Selected IDs: ${Array.from(selectedItems).join(', ')}`);
  }

  async function deleteSelectedItems() {
    
    const userRole = localStorage.getItem("role");
    
    if (userRole === "SuperAdmin") {
      if (selectedItems.size === 0) {
        alert("No items selected.");
        return;
      }
      if (confirm("Are you sure you want to delete the selected items?")) {
        const idsToDelete = Array.from(selectedItems); // Lấy danh sách ID đã chọn
        try {
          // Gửi yêu cầu xóa các mục đã chọn
          await fetch(`http://localhost:3000/api/nguoidung/delete`, {
            method: "DELETE",
            body: JSON.stringify({ ids: idsToDelete }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          // Sau khi xóa, tải lại danh sách
          fetchItems();
          location.reload();
          // Reset danh sách đã chọn và hủy chọn tất cả checkbox
          selectedItems.clear(); // Xóa danh sách các mục đã chọn
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          checkboxes.forEach((checkbox: HTMLInputElement) => {
            checkbox.checked = false; // Đặt tất cả checkbox về trạng thái chưa chọn
          });

          alert("Selected items have been deleted successfully!");
        } catch (error) {
          console.error("Error deleting items:", error);
        }
      } else {
        goto("/access-denied");
      }
    }else {
        goto("/access-denied");
      }
  }

  function viewPermissions(userId: number) {
    console.log(`Viewing permissions for user ID: ${userId}`);
    // Điều hướng đến trang quyền (nếu cần)
    goto(`/nguoidung/permissions/${userId}`);

    // Hoặc, hiển thị modal chi tiết quyền tại đây
    // Ví dụ: fetch quyền của người dùng từ API và hiển thị modal
  }
  function shortenEmail(email: string): string {
    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email; // Nếu không có @ thì trả về email gốc
    return email.slice(0, atIndex + 1) + "..."; // Hiển thị từ đầu đến @, phần sau thay bằng ...
  }
</script>

<div class="content flex-grow-1 p-4">
  <header class="d-flex justify-content-between align-items-center mb-4">
    <h1 style="font-size: 1.25rem;">User Management</h1>
    <button
      class="btn btn-success me-2"
      style="margin-left: 53%;"
      on:click={addItem}
    >
      Add New Item
    </button>
    <button class="btn btn-danger" on:click={deleteSelectedItems}>
      Delete Selected
    </button>
  </header>

  <div class="d-flex justify-content-between align-items-center my-3">
    <div class="input-group w-50">
      <input
        type="text"
        class="form-control"
        placeholder="Search..."
        bind:value={searchQuery}
        on:input={handleSearch}
      />
    </div>
    <div>
      <button
        class="btn btn-outline-secondary mx-1"
        on:click={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>Page {currentPage} / {totalPages}</span>
      <button
        class="btn btn-outline-secondary mx-1"
        on:click={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>

  <table class="table table-hover table-bordered shadow-sm">
    <thead class="table-light">
      <tr>
        <th>
          <input type="checkbox" id="selectAll" on:click={checkAll} />
        </th>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Status</th>
        <!-- <th>Date</th> -->
        <th>Detail</th>
        <th>Actions</th>
      </tr>
    </thead>
    {#if data.length > 0}
      <tbody>
        {#each data as item}
          <tr>
            <td>
              <input
                type="checkbox"
                on:change={(event) =>
                  toggleItemSelection(
                    item.ID,
                    (event.target as HTMLInputElement).checked
                  )}
              />
            </td>
            <td>{item.ID}</td>
            <td>{item.TenDangNhap}</td>
            <td>{shortenEmail(item.Email)}</td>
            <td>{item.SoDienThoai}</td>
            <td>{item.VaiTro}</td>
            <td>
              {#if item.TrangThai === "HoatDong"}
                <span class="badge bg-success">Active</span>
              {:else if item.TrangThai === "BiKhoa"}
                <span class="badge bg-danger">Locked</span>
              {:else if item.TrangThai === "TamNgung"}
                <span class="badge bg-warning">Suspended</span>
              {:else}
                <span class="badge bg-secondary">Unknown</span>
              {/if}
            </td>
            <td>
              <button
                class="btn btn-info btn-sm"
                on:click={() => openModal(item.ID)}
                style="color: white;"
              >
                View
              </button>
              <button
                class="btn btn-primary btn-sm mx-1"
                on:click={() => viewPermissions(item.ID)}
                style="color: white;"
              >
                Permissions
              </button>
            </td>
            <td>
              <button
                class="btn btn-warning btn-sm mx-1"
                on:click={() => editItem(item.ID)}
                style="color: white;"
              >
                Edit
              </button>
              <button
                class="btn btn-danger btn-sm mx-1"
                on:click={() => deleteItem(item.ID)}
                style="color: white;"
              >
                Delete
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    {:else}
      <tbody>
        <tr>
          <td colspan="8" class="text-center">No data available</td>
        </tr>
      </tbody>
    {/if}
    {#if showModal !== null}
      <div
        class="modal fade show"
        style="display: block; background: rgba(0, 0, 0, 0.5);"
        tabindex="-1"
        aria-labelledby={`detailModalLabel${showModal}`}
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5
                class="modal-title"
                id={`detailModalLabel${showModal}`}
                style="margin-left: 220px;"
              >
                User Details
              </h5>
              <button
                type="button"
                class="btn-close"
                on:click={closeModal}
                aria-label="Close">×</button
              >
            </div>
            <div class="modal-body">
              {#if data.find((item) => item.ID === showModal)}
                <!-- Row thông tin cơ bản -->
                <div class="info-row">
                  <p>
                    <strong>ID:</strong>
                    {data.find((item) => item.ID === showModal)?.ID}
                  </p>
                  <p>
                    <strong style="margin-left: -90px;">Username:</strong>
                    {data.find((item) => item.ID === showModal)?.TenDangNhap}
                  </p>
                  <p>
                    <strong style="margin-left: -90px;">Email:</strong>
                    {data.find((item) => item.ID === showModal)?.Email}
                  </p>
                  <p>
                    <strong>Phone:</strong>
                    {data.find((item) => item.ID === showModal)?.SoDienThoai}
                  </p>
                </div>

                <!-- Row cho thông tin vai trò và trạng thái -->
                <div class="info-row">
                  <p>
                    <strong>Role:</strong>
                    {data.find((item) => item.ID === showModal)?.VaiTro}
                  </p>
                  <p>
                    <strong style="margin-left: -90px;">Status:</strong>
                    {#if data.find((item) => item.ID === showModal)?.TrangThai === "HoatDong"}
                      <span class="badge bg-success">Active</span>
                    {:else if data.find((item) => item.ID === showModal)?.TrangThai === "BiKhoa"}
                      <span class="badge bg-danger">Locked</span>
                    {:else if data.find((item) => item.ID === showModal)?.TrangThai === "TamNgung"}
                      <span class="badge bg-warning">Suspended</span>
                    {:else}
                      <span class="badge bg-secondary">Unknown</span>
                    {/if}
                  </p>
                </div>

                <!-- Row cho ngày đăng ký -->
                <div class="info-row">
                  <p>
                    <strong>Registration Date:</strong>
                    {formatDate(
                      data.find((item) => item.ID === showModal)?.NgayDangKy
                    )}
                  </p>
                </div>
              {/if}
            </div>

            <div class="modal-footer">
              <!-- Thêm các nút chức năng -->
              <button
                type="button"
                class="btn btn-secondary"
                style="background-color: #6c757d; color: white;"
              >
                Archive
              </button>
              <button
                on:click={() => editItem(showModal)}
                type="button"
                class="btn btn-warning"
                style="background-color: #ffc107; color: black;"
              >
                Edit
              </button>
              <button
                on:click={() => deleteItem(showModal)}
                type="button"
                class="btn btn-danger"
                style="background-color: #dc3545; color: white;"
              >
                Delete
              </button>
              <button
                type="button"
                class="btn btn-info"
                style="background-color: #17a2b8; color: white;"
              >
                Duplicate
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                style="background-color: #343a40; color: white;"
              >
                View Logs
              </button>
              <button
                type="button"
                class="btn btn-success"
                style="background-color: #28a745; color: white;"
              >
                Add Notes
              </button>
              <!-- Nút In và Xuất file -->
              <button
                type="button"
                class="btn btn-primary"
                style="background-color: #007bff; color: white;"
              >
                Print
              </button>
              <button
                type="button"
                class="btn btn-success"
                style="background-color: #20c997; color: white;"
              >
                Export
              </button>
              <button
                type="button"
                class="btn btn-light"
                style="background-color: #f8f9fa; color: black;"
                on:click={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </table>
</div>

<style>
  .table th,
  .table td {
    text-align: center;
    vertical-align: middle;
  }

  .d-flex {
    display: flex;
  }
  .flex-grow-1 {
    flex-grow: 1;
  }
  .content {
    background-color: #f8f9fa;
    padding: 2rem;
  }
  .table thead th,
  .table tbody td {
    font-weight: 500;
    font-size: 0.9rem;
    text-align: center;
    vertical-align: middle;
  }
  .table-hover tbody tr:hover {
    background-color: #e9ecef;
  }
  .btn-outline-secondary {
    color: #495057;
    border-color: #ced4da;
  }
  .btn-outline-secondary:hover {
    background-color: #6c757d;
    color: #ffffff;
  }

  .table thead th {
    background-color: rgb(145, 235, 233);
  }

  .modal-dialog {
    max-width: 800px;
    margin: 1.75rem auto;
  }

  .modal-header h5 {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin: 0 auto;
  }

  .modal-body {
    font-size: 1rem;
    color: #333;
  }

  .info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 10px;
  }

  .info-row p {
    margin: 0;
    flex: 1; /* Tự động giãn đều */
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
  }

  .modal-footer {
    text-align: center;
  }

  /* Style cho checkbox đồng nhất */
  input[type="checkbox"] {
    width: 18px; /* Đặt kích thước đồng nhất cho tất cả checkbox */
    height: 18px; /* Đặt kích thước đồng nhất cho tất cả checkbox */
    margin: 0; /* Loại bỏ khoảng cách mặc định */
    accent-color: #007bff; /* Màu sắc của checkbox khi chọn */
    vertical-align: middle; /* Căn chỉnh checkbox với các phần tử bên cạnh */
  }

  /* Style cho checkbox khi di chuột vào */
  input[type="checkbox"]:hover {
    cursor: pointer; /* Đổi con trỏ khi di chuột vào checkbox */
  }

  /* Style cho checkbox trong bảng */
  .table input[type="checkbox"] {
    margin: 0; /* Loại bỏ khoảng cách mặc định của checkbox */
    display: block; /* Hiển thị checkbox như block để dễ căn chỉnh */
    margin-left: auto;
    margin-right: auto;
  }
</style>
