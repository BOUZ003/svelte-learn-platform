<script lang="ts">

  import { page } from '$app/stores';

  import { onMount } from 'svelte';
	import { isAuthenticated } from '../../stores/authStore';
	import { goto } from '$app/navigation';
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

  let id: string | undefined;
  $: {
    id = $page.params.id; // Get ID from URL
  }

  let technologyData: any = {};

  // Fetch technology data
  async function fetchTechnologyData() {
    if (!id) return;

    try {
      const response = await fetch(`http://localhost:3000/api/loaicongnghe/get-by-id/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch technology data');
      }

      const data = await response.json();
      technologyData = data;

      // Update form values
      ten = technologyData.Ten;
      tieuDeSEO = technologyData.TieuDeSEO;
      moTa = technologyData.MoTa;
      metaKeyword = technologyData.MetaKeyword;
      metaDescription = technologyData.MetaDescription;
      parentID = technologyData.ParentID;
      thuTu = technologyData.ThuTu;
      trangThai = technologyData.TrangThai;
      hienThiTrangChu = technologyData.HienThiTrangChu;
    } catch (error) {
      console.error("Error fetching technology data:", error);
    }
  }

  // Fetch parent technologies
  async function fetchParentTechnologies() {
    try {
      const response = await fetch("http://localhost:3000/api/loaicongnghe/get-by-id-and-ten");
      if (!response.ok) {
        throw new Error("Failed to fetch parent technologies");
      }
      const data = await response.json();
      parentTechnologies = data;
    } catch (error) {
      console.error("Error fetching parent technologies:", error);
    }
  }

  onMount(() => {
    fetchTechnologyData();
    fetchParentTechnologies();
  });

  let ten: string = "";
  let thuTu: number = 1;
  let trangThai: boolean = true;
  let hienThiTrangChu: boolean = true;
  let tieuDeSEO: string = "";
  let moTa: string = "";
  let metaKeyword: string = "";
  let metaDescription: string = "";
  let parentID: number | null = null;
  let ngayTao: string = new Date().toISOString();
  let nguoiTao: string = "admin";
  let ngayCapNhat: string = new Date().toISOString();
  let nguoiCapNhat: string = "admin";

  interface ParentTechnology {
    ID: number;
    Ten: string;
  }
  let parentTechnologies: ParentTechnology[] = [];

  // Date formatting function
  const formatDate = (date: Date | string | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const updateTechnology = async () => {
  const numericId = Number(id); // Chuyển id thành số

  if (isNaN(numericId)) {
    console.error('Invalid ID: id must be a number');
    return;
  }

  const payload = {
    Ten: ten,
    TieuDeSEO: tieuDeSEO,
    MoTa: moTa,
    ParentID: parentID || null,
    ThuTu: thuTu,
    HienThiTrangChu: Boolean(hienThiTrangChu),  // Chuyển HienThiTrangChu sang boolean
    MetaKeyword: metaKeyword,
    MetaDescription: metaDescription,
    TrangThai: Boolean(trangThai),  // Chuyển TrangThai sang boolean
    NgayCapNhat: formatDate(ngayCapNhat || new Date()),
    NguoiCapNhat: nguoiCapNhat
  };

  console.log('Payload to update:', payload); // Log payload trước khi gửi

  try {
    const result = await fetch(`http://localhost:3000/api/loaicongnghe/update/${numericId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!result.ok) {
      const errorDetails = await result.json();
      console.error('Error details from server:', errorDetails); // Log chi tiết lỗi từ server
    } else {
      console.log('Technology updated successfully!');
      alert('Technology updated successfully!');
      goto("/loaicongnghe");
    }
  } catch (error) {
    console.error('Error when updating technology type:', error);
  }
};



  // Cancel and navigate back to the list page
  function cancelForm() {
    goto("/loaicongnghe");
  }

  // Generate SEO title
  function generateSeoTitle(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }

  // Update SEO title when name changes
  function onNameInputChange(value: string): void {
    ten = value;
    tieuDeSEO = generateSeoTitle(value);
  }

  // Handle parent technology selection change
  function handleParentIDChange() {
    console.log("Selected Parent ID:", parentID);
  }
</script>

<div class="content">
  <h1>Update Technology Type</h1>
  <form on:submit|preventDefault={updateTechnology} class="form-container">
    <div class="form-group">
      <label for="ten">Name</label>
      <input
        type="text"
        id="ten"
        bind:value={ten}
        class="form-control"
        on:input={(e) => {
          if (e.target) {
            onNameInputChange((e.target as HTMLInputElement).value);
          }
        }}
        required
      />
    </div>

    <div class="form-group">
      <label for="tieuDeSEO">SEO Title</label>
      <input
        type="text"
        id="tieuDeSEO"
        bind:value={tieuDeSEO}
        class="form-control"
        readonly
      />
    </div>

    <div class="form-group">
      <label for="parentID">Parent ID</label>
      <select
        id="parentID"
        bind:value={parentID}
        class="form-control"
        on:change={handleParentIDChange}
      >
        <option value={null}>None</option>
        {#each parentTechnologies as parent}
          <option value={parent.ID}>{parent.Ten}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="thuTu">Order</label>
      <input
        type="number"
        id="thuTu"
        bind:value={thuTu}
        class="form-control"
        required
      />
    </div>

    <div class="form-group">
      <label for="metaKeyword">Meta Keyword</label>
      <input
        type="text"
        id="metaKeyword"
        bind:value={metaKeyword}
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="moTa">Description</label>
      <textarea id="moTa" bind:value={moTa} class="form-control"></textarea>
    </div>

    <div class="form-group" style="margin-top: -30px;">
      <label for="metaDescription">Meta Description</label>
      <input
        type="text"
        id="metaDescription"
        bind:value={metaDescription}
        class="form-control"
      />
    </div>

    <div class="form-group horizontal-group">
      <div class="checkbox-item" style="margin-top: 5px; margin-left: -204px">
        <label for="trangThai">Status</label>
        <input type="checkbox" id="trangThai" bind:checked={trangThai} />
      </div>
      
        <div class="checkbox-item" style="margin-top: -65px; margin-left: 100px">
          <label for="hienThiTrangChu">Hiển thị trang chủ</label>
          <input
            type="checkbox"
            id="hienThiTrangChu"
            bind:checked={hienThiTrangChu}
          />
        </div>
      </div>
  
      <div class="form-actions">
        <button type="submit" class="btn btn-success">Update Technology</button>
        <button type="button" class="btn btn-secondary" on:click={cancelForm}
          >Cancel</button
        >
      </div>
    </form>
  </div>
  

<style>
  .content {
    margin: 0 auto;
    max-width: 800px;
    padding: 20px;
    background-color: #f9f9f9; /* Subtle background for contrast */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }

  .form-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Add spacing between fields */
    justify-content: space-between;
  }

  .form-group {
    flex: 1 1 48%;
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-weight: 600;
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
  }

  .form-control {
    height: 36px;
    font-size: 14px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }

  textarea.form-control {
    resize: vertical;
    height: 60px;
  }

  .horizontal-group {
    display: flex;
    gap: 40px; /* Space between the two checkbox items */
    align-items: center;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 5px; /* Space between checkbox and label */
  }

  .form-actions {
    flex: 1 1 100%;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  button {
    min-width: 120px;
    font-size: 14px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button.btn-success {
    background-color: #28a745;
    color: #fff;
  }

  button.btn-success:hover {
    background-color: #218838;
  }

  button.btn-secondary {
    background-color: #6c757d;
    color: #fff;
  }

  button.btn-secondary:hover {
    background-color: #5a6268;
  }

  /* Mobile Responsiveness */
  @media (max-width: 768px) {
    .form-group {
      flex: 1 1 100%; /* Full width for smaller screens */
    }

    .horizontal-group {
      flex-direction: column;
      gap: 10px;
    }

    .form-actions {
      justify-content: center; /* Center buttons on smaller screens */
    }
  }

  .form-control[readonly] {
    background-color: #f8f9fa; /* Light gray background */
    color: #6c757d; /* Muted text color */
    cursor: not-allowed; /* Change cursor to indicate non-editable */
  }
</style>
