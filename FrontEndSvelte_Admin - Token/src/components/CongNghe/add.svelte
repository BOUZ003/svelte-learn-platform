<script lang="ts">
  import { goto } from "$app/navigation";
  import { isAuthenticated } from '../../stores/authStore';
  import { onMount } from "svelte";

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

  let ten: string = "";
  let tieuDe: string = ""; 
  let moTa: string | null = ""; 
  let loaiCongNgheID: number | null = null; 
  let icon: string | null = null; 
  let logo: string | null = null; 
  let phienBan: string = ""; 
  let stt: number | null = 1; 
  let tags: string | null = ""; 
  let hienThiTrangChu: boolean = true; 
  let hienThiHot: boolean = false; 
  let metaKeyword: string | null = "";
  let metaDescription: string | null = "";
  let trangThai: boolean = true; // Default value for TrangThai
  let ngayTao: string = new Date().toISOString(); 
  let nguoiTao: string = "admin"; 
  let ngayCapNhat: string | null = new Date().toISOString(); 
  let nguoiCapNhat: string | null = "admin"; 

  interface ParentTechnology {
    ID: number;
    Ten: string;
  }
  let parentTechnologies: ParentTechnology[] = [];

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
    fetchParentTechnologies();
  });

  const formatDate = (date: Date | string | null): string | null => {
    if (!date) return null;
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  const addCongNghe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token không tồn tại");
      return;
    }

    const payload = {
      Ten: ten,
      TieuDe: tieuDe,
      MoTa: moTa,
      LoaiCongNgheID: loaiCongNgheID,
      Icon: icon,
      Logo: logo,
      PhienBan: phienBan,
      STT: stt,
      Tags: tags,
      HienThiTrangChu: hienThiTrangChu,
      HienThiHot: hienThiHot,
      MetaKeyword: metaKeyword,
      MetaDescription: metaDescription,
      TrangThai: trangThai,
      NgayTao: formatDate(ngayTao || new Date()),
      NguoiTao: nguoiTao,
      NgayCapNhat: formatDate(ngayCapNhat || new Date()),
      NguoiCapNhat: nguoiCapNhat,
    };

    console.log('Sending payload:', payload);

    try {
      const response = await fetch('http://localhost:3000/api/congnghe/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
      }

      const result = await response.json();
      console.log('Add technology result:', result);
      alert('Technology added successfully');
      goto("/congnghe"); // Redirect after successful addition
    } catch (error) {
      console.error('Error when adding technology:', error);
    }
  };

  function cancelForm() {
    goto("/congnghe"); // Redirect to the list page or wherever you want
  }

  function generateSeoTitle(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }

  function onNameInputChange(value: string): void {
    ten = value;
    tieuDe = generateSeoTitle(value);
  }

  function handleParentIDChange() {
    console.log("Selected Parent ID:", loaiCongNgheID);
  }
</script>

<div class="content">
  <h1>Create New Technology</h1>
  <form on:submit|preventDefault={addCongNghe} class="form-container">
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
      <label for="tieuDe">SEO Title</label>
      <input
        type="text"
        id="tieuDe"
        bind:value={tieuDe}
        class="form-control"
        readonly
      />
    </div>

    <div class="form-group">
      <label for="loaiCongNgheID">Parent Technology</label>
      <select
        id="loaiCongNgheID"
        bind:value={loaiCongNgheID}
        class="form-control"
        on:change={handleParentIDChange}
        required
      >
        <option value={null}>None</option>
        {#each parentTechnologies as parent}
          <option value={parent.ID}>{parent.Ten}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="phienBan">Version</label>
      <input
        type="text"
        id="phienBan"
        bind:value={phienBan}
        class="form-control"
        required
      />
    </div>

    <div class="form-group">
      <label for="tags">Tags</label>
      <input
        type="text"
        id="tags"
        bind:value={tags}
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="icon">Icon</label>
      <input
        type="text"
        id="icon"
        bind:value={icon}
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="logo">Logo</label>
      <input
        type="text"
        id="logo"
        bind:value={logo}
        class="form-control"
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
      <label for="metaDescription">Meta Description</label>
      <input
        type="text"
        id="metaDescription"
        bind:value={metaDescription}
        class="form-control"
      />
    </div>

    <div class="form-group">
      <label for="moTa">Description</label>
      <textarea id="moTa" bind:value={moTa} class="form-control"></textarea>
    </div>

    <div class="form-group horizontal-group">
      <div class="checkbox-item">
        <label for="hienThiTrangChu">Display on Homepage</label>
        <input type="checkbox" id="hienThiTrangChu" bind:checked={hienThiTrangChu} />
      </div>
      <div class="checkbox-item">
        <label for="hienThiHot">Show Hot</label>
        <input type="checkbox" id="hienThiHot" bind:checked={hienThiHot} />
      </div>
      <div class="checkbox-item">
        <label for="trangThai">Status</label>
        <input type="checkbox" id="trangThai" bind:checked={trangThai} />
      </div>
    </div>

    <div class="form-group">
      <button type="submit" class="btn btn-primary">Save</button>
      <button type="button" on:click={cancelForm} class="btn btn-secondary">Cancel</button>
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

  button {
    min-width: 120px;
    font-size: 14px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
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

  }

  .form-control[readonly] {
    background-color: #f8f9fa; /* Light gray background */
    color: #6c757d; /* Muted text color */
    cursor: not-allowed; /* Change cursor to indicate non-editable */
  }
</style>