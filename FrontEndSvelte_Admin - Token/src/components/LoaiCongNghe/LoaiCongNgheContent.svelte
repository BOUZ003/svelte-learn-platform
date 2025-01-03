<script lang="ts">
  import "bootstrap/dist/css/bootstrap.min.css";
  import { goto } from '$app/navigation';
  import type { LoaiCongNghe } from "../../types/loaiCongNghe";
  import { onMount } from 'svelte';
	import { isAuthenticated } from '../../stores/authStore';
  let data: LoaiCongNghe[] = [];
  let totalRows = 0;
  let totalPages = 0;
  let searchQuery = "";
  let currentPage = 1;
  let itemsPerPage = 10;
  let sortKey = "ID"; // Cột hiện tại để sắp xếp
  let sortOrder = "asc"; // Thứ tự sắp xếp: asc (tăng dần) hoặc desc (giảm dần)

  onMount(() => {
	  if (typeof window !== 'undefined') {
		const unsubscribe = isAuthenticated.subscribe(async (auth) => {
		  if (!auth) {
			await goto('/login'); // Chờ điều hướng hoàn tất
		  }
		});
		return unsubscribe; // Hủy subscription khi component bị hủy
	  }
	});

  let debounceTimeout: NodeJS.Timeout;

  // Track which modal is visible
  let showModal: string | null = null;

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
        `http://localhost:3000/api/loaicongnghe/search?${query}`
      );
      if (!response.ok) throw new Error("Failed to fetch data from API");

      const result = await response.json();
      data = result.data;
      totalRows = result.totalRows;
      totalPages = result.totalPages;
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  }

  $: {
    if (searchQuery === "") {
      currentPage = 1;
      fetchItems();
    }
  }

  function handleSearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      currentPage = 1;
      fetchItems();
    }, 300);
  }

  function goToPage(page: number): void {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      fetchItems();
    }
  }

  function toggleSort(key: keyof LoaiCongNghe) {
    if (sortKey === key) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc"; // Đổi thứ tự sắp xếp
    } else {
      sortKey = key;
      sortOrder = "asc"; // Mặc định là tăng dần
    }

    // Sắp xếp dữ liệu
    data.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA == null || valB == null) return 0;
      if (sortOrder === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    // Tạo bản sao mới để Svelte phát hiện thay đổi
    data = [...data];
  }

  function formatDate(dateString: string | null | undefined) {
  if (!dateString) return "-"; // Fallback for invalid date
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}

  function openModal(itemID: string) {
    showModal = itemID;
  }

  function closeModal() {
    showModal = null;
  }

  function addItem() {

  const userRole = localStorage.getItem('role');

  if (userRole === 'SuperAdmin' || userRole === 'Admin') {
    goto('/loaicongnghe/add');  
  } else {
    goto('/access-denied'); 
  }
}

  function editItem(itemId: string) {

  const userRole = localStorage.getItem('role'); 

  if (userRole === 'SuperAdmin' || userRole === 'Admin') {
    goto(`/loaicongnghe/update/${itemId}`); 
  } else {
    goto('/access-denied');  
  }
}

async function deleteItem(itemId: string) {
  const userRole = localStorage.getItem('role');

  if (userRole === 'SuperAdmin' || userRole === 'Admin') {
    if (confirm("Are you sure you want to delete this item?")) {
      await fetch(`http://localhost:3000/api/loaicongnghe/delete/${itemId}`, {
        method: 'DELETE',
      });
      fetchItems();
    }
  } else {
    goto('/access-denied');  
  }
}

// Giả sử bạn đã có một mảng data và selectedItems để theo dõi các mục đã chọn
let selectedItems = new Set<number>(); // Set lưu trữ các ID đã chọn

  function checkAll(event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked; // Kiểm tra trạng thái của checkbox "Select All"
  
  // Duyệt qua tất cả các checkbox và cập nhật trạng thái
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:not(#selectAll)'); // Lấy tất cả checkbox, loại trừ checkbox "Select All"

  checkboxes.forEach((checkbox: HTMLInputElement) => {
    checkbox.checked = isChecked; // Cập nhật trạng thái của checkbox
    const row = checkbox.closest('tr'); // Lấy hàng <tr> chứa checkbox
    const itemId = parseInt(row?.querySelectorAll('td')[1]?.textContent || '0'); // Lấy ID từ cột thứ hai (index 1)

    if (isChecked) {
      selectedItems.add(itemId); // Thêm ID vào danh sách đã chọn
    } else {
      selectedItems.delete(itemId); // Xóa ID khỏi danh sách đã chọn
    }
  });

  // Log tất cả ID đã chọn vào console
  console.log(`Selected IDs: ${Array.from(selectedItems).join(', ')}`);
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
  const userRole = localStorage.getItem('role');

  if (userRole === 'SuperAdmin' || userRole === 'Admin') {
    if (selectedItems.size === 0) {
    alert("No items selected.");
    return;
  }

  if (confirm("Are you sure you want to delete the selected items?")) {
    const idsToDelete = Array.from(selectedItems);
    try {
      // Gửi yêu cầu xóa các mục đã chọn
      await fetch(`http://localhost:3000/api/loaicongnghe/delete`, {
        method: 'DELETE',
        body: JSON.stringify({ ids: idsToDelete }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Sau khi xóa, tải lại danh sách
      fetchItems();
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  }
  } else {
    goto('/access-denied');  
  }
}


</script>

<!-- Main Content -->
<div class="content flex-grow-1 p-4">
  <header class="d-flex justify-content-between align-items-center mb-4">
    <h1 style="font-size: 1.25rem;">Technology type management</h1>
    <div>
      <button class="btn btn-success me-2" on:click={addItem}>
        Add New Item
      </button>
      <button class="btn btn-danger" on:click={deleteSelectedItems}>
        Delete Selected
      </button>

    </div>
  </header>

  <!-- Search and Pagination -->
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

  <!-- Item List -->
  <table class="table table-hover table-bordered shadow-sm">
    <thead class="table-light">
      <tr>
        <th>
          <input type="checkbox" id="selectAll" on:click={checkAll} />
        </th>
        <th>
          ID
          <button
            class="btn btn-sm btn-outline-secondary ms-2"
            on:click={() => toggleSort("ID")}
            style="border:none"
          >
            {#if sortKey === "ID"}
              {#if sortOrder === "asc"}↑{:else}↓{/if}
            {:else}
              {#if sortOrder === ""}↑{:else}↓{/if}
            {/if}
          </button>
        </th>
        <th>
          Name
          <button
            class="btn btn-sm btn-outline-secondary ms-2"
            on:click={() => toggleSort("Ten")}
            style="border:none"
          >
            {#if sortKey === "Ten"}
              {#if sortOrder === "asc"}↑{:else}↓{/if}
            {:else}
              {#if sortOrder === ""}↑{:else}↓{/if}
            {/if}
          </button>
        </th>
        <th>Created Date</th>
        <th>Creator</th>
        <th>Updated Date</th>
        <th>Updater</th>
        <th>Detail</th>
        <th>Actions</th>
      </tr>
    </thead>
    {#if data.length > 0}
      <tbody>
        {#each data as item}
          <tr>
            <td>
              <input type="checkbox" on:change={event => toggleItemSelection(item.ID, (event.target as HTMLInputElement).checked)} />
            </td>
            <td>{item.ID}</td>
            <td>{item.Ten}</td>
            <td>{formatDate(item.NgayTao)}</td>
            <td>{item.NguoiTao}</td>
            <td>{formatDate(item.NgayCapNhat)}</td>
            <td>{item.NguoiCapNhat}</td>
            <td>
              <button
                class="btn btn-info btn-sm"
                on:click={() => openModal(item.ID)}
                style='color: white;'
              >
                View
              </button>
            </td>
            <td>
              <button
                class="btn btn-warning btn-sm mx-1"
                on:click={() => editItem(item.ID)} 
                style='color: white;'
              >
                Edit
              </button>
              <button
                class="btn btn-danger btn-sm mx-1"
                on:click={() => deleteItem(item.ID)}
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
          <td colspan="9" class="text-center">No data available</td>
        </tr>
      </tbody>
    {/if}
  </table>
  

  <!-- Modal Template -->
  {#if showModal}
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
        <h5 class="modal-title" id={`detailModalLabel${showModal}`} style="margin-left: 220px;">
          Technology Type - Details
        </h5>
        <button
          type="button"
          class="btn-close"
          on:click={closeModal}
          aria-label="Close"
        >×</button>
      </div>
      <div class="modal-body">
        {#if data.find((item) => item.ID === showModal)}
        <!-- Row cho các thông tin ngắn -->
        <div class="info-row">
          <p><strong>ID:</strong> {data.find((item) => item.ID === showModal)?.ID}</p>
          <p><strong>Name:</strong> {data.find((item) => item.ID === showModal)?.Ten}</p>
          <p><strong>Order:</strong> {data.find((item) => item.ID === showModal)?.ThuTu}</p>
          <p><strong>Status:</strong> {data.find((item) => item.ID === showModal)?.TrangThai ? "Active" : "Inactive"}</p>
        </div>

        <!-- Row cho các thông tin dài -->
        <p><strong>Title SEO:</strong> {data.find((item) => item.ID === showModal)?.TieuDeSEO}</p>
        <p><strong>Description:</strong> {data.find((item) => item.ID === showModal)?.MoTa}</p>
        <p><strong>Meta Keyword:</strong> {data.find((item) => item.ID === showModal)?.MetaKeyword}</p>
        <p><strong>Meta Description:</strong> {data.find((item) => item.ID === showModal)?.MetaDescription}</p>

        <!-- Row cho ngày tháng và người tạo -->
        <div class="info-row">
          <p> 
            <strong>Created:</strong> {formatDate(data.find((item) => item.ID === showModal)?.NgayTao)} by {data.find((item) => item.ID === showModal)?.NguoiTao}
          </p>
          <p>
            <strong>Updated:</strong> {formatDate(data.find((item) => item.ID === showModal)?.NgayCapNhat)} by {data.find((item) => item.ID === showModal)?.NguoiCapNhat}
          </p>
        </div>

        <!-- Row cho các thông tin khác -->
        <p><strong>Parent ID:</strong> {data.find((item) => item.ID === showModal)?.ParentID}</p>
        <p>
          <strong>Show on homepage:</strong>{" "}
          {data.find((item) => item.ID === showModal)?.HienThiTrangChu ? "Yes" : "No"}
        </p>
        {/if}
      </div>
      <div class="modal-footer">
        <!-- Thêm các nút chức năng -->
        <button type="button" class="btn btn-secondary" style="background-color: #6c757d; color: white;">
          Archive
        </button>
        <button on:click={editItem} type="button" class="btn btn-warning" style="background-color: #ffc107; color: black;">
          Edit
        </button>
        <button on:click={deleteItem} type="button" class="btn btn-danger" style="background-color: #dc3545; color: white;">
          Delete
        </button>
        <button type="button" class="btn btn-info" style="background-color: #17a2b8; color: white;">
          Duplicate
        </button>
        <button type="button" class="btn btn-secondary" style="background-color: #343a40; color: white;">
          View Logs
        </button>
        <button type="button" class="btn btn-success" style="background-color: #28a745; color: white;">
          Add Notes
        </button>
        <!-- Nút In và Xuất file -->
        <button type="button" class="btn btn-primary" style="background-color: #007bff; color: white;">
          Print
        </button>
        <button type="button" class="btn btn-success" style="background-color: #20c997; color: white;">
          Export
        </button>
        <button type="button" class="btn btn-light" style="background-color: #f8f9fa; color: black;" on:click={closeModal}>
          Close
        </button>
        
      </div>
    </div>
  </div>
</div>
{/if}

</div>

<style>
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
  width: 18px;  /* Đặt kích thước đồng nhất cho tất cả checkbox */
  height: 18px; /* Đặt kích thước đồng nhất cho tất cả checkbox */
  margin: 0;    /* Loại bỏ khoảng cách mặc định */
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