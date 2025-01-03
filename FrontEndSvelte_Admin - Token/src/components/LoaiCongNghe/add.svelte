<script lang="ts">
    import { goto } from "$app/navigation";
	  import { isAuthenticated } from '../../stores/authStore';
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
    let thuTu: number = 1;
    let trangThai: boolean = true;
    let hienThiTrangChu: boolean = true; // Default display on homepage
    let tieuDeSEO: string = "";
    let moTa: string = "";
    let metaKeyword: string = "";
    let metaDescription: string = "";
    let parentID: number | null = null; // Parent ID
    let ngayTao: string = new Date().toISOString(); // Current date and time
    let nguoiTao: string = "admin"; // Username or creator
    let ngayCapNhat: string = new Date().toISOString(); // Current date and time
    let nguoiCapNhat: string = "admin"; // Username or last updater
  
    import { onMount } from "svelte"; // Import onMount to call API when component mounts
  
    interface ParentTechnology {
      ID: number;
      Ten: string;
    }
    let parentTechnologies: ParentTechnology[] = [];
    async function fetchParentTechnologies() {
      try {
        const response = await fetch(
          "http://localhost:3000/api/loaicongnghe/get-by-id-and-ten"
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch parent technologies");
        }
  
        // Parse the response and assign it to the parentTechnologies array
        const data = await response.json();
        parentTechnologies = data; // This will now be typed correctly
      } catch (error) {
        console.error("Error fetching parent technologies:", error);
      }
    }
  
    // Call fetch function when the component mounts
    onMount(() => {
      fetchParentTechnologies();
    });
  
    const formatDate = (date: Date | string | null): string | null => {
  if (!date) return null; // If no date is provided, return null

  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

const addLoaiCongNghe = async () => {
  const token = localStorage.getItem("token");  // Lấy token từ localStorage
  if (!token) {
    console.error("Token không tồn tại");
    return;
  }

  const payload = {
    Ten: ten,
    TieuDeSEO: tieuDeSEO,
    MoTa: moTa,
    ParentID: parentID || null,
    ThuTu: thuTu,
    HienThiTrangChu: hienThiTrangChu,
    MetaKeyword: metaKeyword,
    MetaDescription: metaDescription,
    TrangThai: trangThai,
    NgayTao: formatDate(ngayTao || new Date()),  // Format NgayTao date
    NguoiTao: nguoiTao,
    NgayCapNhat: formatDate(ngayCapNhat || new Date()), // Format NgayCapNhat date
    NguoiCapNhat: nguoiCapNhat
  };

  console.log('Sending payload:', payload);

  try {
    const response = await fetch('http://localhost:3000/api/loaicongnghe/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Thêm Authorization header với token
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from server:', errorData);
      throw new Error(`HTTP error! status: ${response.status}, ${errorData.error}`);
    }

    const result = await response.json();
    console.log('Add technology type result:', result);
    alert('Technology type added successfully');
    goto("/loaicongnghe");  // Điều hướng sau khi thêm thành công
  } catch (error) {
    console.error('Error when adding technology type:', error);
  }
};





  
    // Function to reset form and go back to the list page
    function cancelForm() {
      goto("/loaicongnghe"); // Redirect to the list page or wherever you want
    }
  
    function generateSeoTitle(value: string): string {
      return value
        .trim() // Remove leading and trailing spaces
        .toLowerCase() // Convert to lowercase
        .normalize("NFD") // Normalize to decompose combined characters (e.g., `á` → `a` + accent)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-"); // Replace spaces with dashes
    }
  
    // Watch for changes in "ten" and generate the SEO title
    function onNameInputChange(value: string): void {
      ten = value; // Update the "Name" value
      tieuDeSEO = generateSeoTitle(value); // Generate and update the SEO title
    }
  
    //----------------------------------------------
    function handleParentIDChange() {
      console.log("Selected Parent ID:", parentID);
    }
    //----------------------------------------------
  </script>
  
  <div class="content">
    <h1>Create New Technology Type</h1>
    <form on:submit|preventDefault={addLoaiCongNghe} class="form-container">
      <div class="form-group">
          <label for="ten">Name</label>
          <input
            type="text"
            id="ten"
            bind:value={ten}
            class="form-control"
            on:input={(e) => {
              if (e.target) { // Kiểm tra e.target có null hay không
                onNameInputChange((e.target as HTMLInputElement).value); // Cụ thể là HTMLInputElement
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
          <label for="trangThai">Trạng thái</label>
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
        <button type="submit" class="btn btn-success">Add Technology</button>
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
