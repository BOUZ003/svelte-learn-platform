<script lang="ts">
    // // Wait for the DOM content to be fully loaded
    // document.addEventListener("DOMContentLoaded", () => {
    //   const productCourses = document.querySelectorAll(".Product-Course");
  
    //   // Loop through all Product-Course elements
    //   productCourses.forEach(course => {
    //     const courseImage = course.querySelector(".course-image") as HTMLImageElement | null;
    //     if (!courseImage) return; // If there is no image in this course, skip it
  
    //     // Handle mouseover event
    //     course.addEventListener("mouseover", () => {
    //       courseImage.src = "../../../src/image/imageCoursePages/CC-BackEnd-NodeJS.png";
    //     });
  
    //     // Handle mouseout event
    //     course.addEventListener("mouseout", () => {
    //       courseImage.src = "../../../src/image/imageCoursePages/BackEnd-NodeJS.png";
    //     });
    //   });
    // });

    import { onMount } from 'svelte';
    interface Product {
    ID: number;
    TenKhoaHoc: string;
    MoTa: string;
    NgayBatDau: string;
    NgayKetThuc: string;
    GiaGoc: number;
    GiaSauGiam: number | null;
    MucGiam: number | null;
    AnhDaiDien: string;
    TrangThai: string;
  }
  let currentPage = 1;
  let totalPages = 0;
  let products: Product[] = [];
  const itemsPerPage = 8; // Số sản phẩm trên mỗi trang

  // Fetch data from the API when the component is mounted
  async function fetchProducts() {
    const searchKeyword = ''; // Tìm kiếm theo từ khóa, nếu cần
    const response = await fetch(`http://localhost:3000/api/khoahoc/search?searchKeyword=${searchKeyword}&page=${currentPage}&limit=${itemsPerPage}`);
    
    if (response.ok) {
      const data = await response.json();
      products = data.data;
      totalPages = data.totalPages;
    } else {
      console.error('Failed to fetch data');
    }
  }

  // Call fetchProducts when the component mounts
  onMount(() => {
    fetchProducts();
  });

  // Go to the next page
  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      fetchProducts(); // Fetch data for the new page
    }
  }

  // Go to the previous page
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      fetchProducts(); // Fetch data for the new page
    }
  }

  function formatCurrency(value: string | number): string {
  // Chuyển giá trị thành số nguyên nếu đầu vào là chuỗi
  const number = Math.round(Number(value));

  // Định dạng thành chuỗi có dấu chấm phân cách hàng nghìn
  const formatted = number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Loại bỏ ký hiệu "₫" và thay bằng "đ"
  return formatted.replace("₫", "đ");
}

function AddCart(id: number) {
  // Hiển thị thông báo ID sản phẩm (khóa học)
  // alert(`Product ID: ${id}`);

  // Lấy userId từ localStorage (localStorage.getItem trả về kiểu string hoặc null)
  let userId = localStorage.getItem('userId');

  // Kiểm tra nếu không có userId
  if (!userId) {
    alert("User not logged in!");
    return;
  }

  // Chuyển userId sang kiểu number (nếu cần thiết)
  const userIdNumber = Number(userId);

  // Kiểm tra xem có chuyển đổi thành công hay không
  if (isNaN(userIdNumber)) {
    alert("Invalid user ID!");
    return;
  }

  // alert(`User ID: ${userIdNumber}`);

  // Gửi request POST đến backend để thêm khóa học vào giỏ hàng
  fetch('http://localhost:3000/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NguoiDungID: userIdNumber, // Truyền userId đã chuyển sang kiểu number
      KhoaHocID: id,             // Truyền productId vào body
    }),
  })
  .then(response => response.json())
  .then((data: { message?: string, error?: string }) => {
    if (data.message) {
      alert(data.message); // Nếu API trả về message thành công
    } else {
      alert('An error occurred: ' + data.error); // Hiển thị lỗi nếu có
    }
  })
  .catch((error: any) => {
    console.error('Error:', error);
    alert('Error adding product to cart');
  });
}


  </script>
  

<div class="TT-Course">
  <a href="/" style="margin-left: 47px;">Home</a>
  <span style="font-size: 15px;"> > </span>
  <a href="/course"> Certification Course Catalog</a>
</div>
<div class="TT-Course-2">
    <a href="/course">Certification Course Catalog</a>
</div>
<div class="Content-Course">
  <div class="Content-Course-Left">
    <a
      href="/"
      style="text-decoration: none; font-family: Arial, Helvetica, sans-serif; color: #333; font-size: 18px; margin-left: 10px;"
      >Filters</a
    >
    <hr style="margin-top: 20px;" />
    <details
      open
      style="margin-left: 10px; font-family: Arial, Helvetica, sans-serif;"
    >
      <summary style="font-size: 16px; padding: 5px 0; font-weight: bold;"
        >Price</summary
      >
      <div style="margin-left: 15px; margin-top: 10px;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 14px;">$</span>
          <input
            type="number"
            placeholder="From"
            style="margin-left: 5px; padding: 15px; width: 120px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
        <div style="display: flex; align-items: center;">
          <span style="font-size: 14px;">$</span>
          <input
            type="number"
            placeholder="To"
            style="margin-left: 5px; padding: 15px; width: 120px; border: 1px solid #ccc; border-radius: 4px;"
          />
        </div>
      </div>
    </details>
    <hr />
    <details
      open
      style="margin-left: 10px; font-family: Arial, Helvetica, sans-serif;"
    >
      <summary style="font-size: 16px;padding: 5px 0;font-weight: bold;"
        >Product type</summary
      >
      <div style="margin-left: 15px; margin-top: 10px;">
        <label
          ><input type="checkbox" name="product-type" value="type1" />Course
          (33)4</label
        >
      </div>
    </details>
  </div>

  <div class="Content-Course-Right">
    <span style="float: left;margin-top: 1px;">Sort By</span>
    <div style="float: left;margin-left: 5px;">
      <select
        style="padding: 0px; border: 0px; background-color: white; color: #333; font-size: 16px; font-family: Arial, sans-serif; transition: border-color 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); outline: none;cursor: pointer;"
      >
        <option selected>Featured</option>
        <option>Best selling</option>
        <option>Aphabetically, A-Z</option>
        <option>Aphabetically, Z-A</option>
        <option>Price, low to high</option>
        <option>Price, high to low</option>
        <option>Date, old to new</option>
        <option>Date, new to old</option>
      </select>
    </div>
  </div>

  <div class="Content-Course-Right-2" style="margin-top: 30px;">
    {#each products as product}
      <div class="Product-Course" style="width: 215px; border: 1px solid #FFF; border-radius: 2px; box-shadow: 0 4px 8px #c37070; text-align: center; transition: all 0.3s ease;">
        <div class="Course-image" style="position: relative;">
          <img class="course-image" src={product.AnhDaiDien} alt={product.TenKhoaHoc} style="width: 92%; border-radius: 2px; padding: 5px; transition: all 0.3s ease;" />
          {#if product.MucGiam}
            <div style="position: absolute; top: 10px; left: 13.8px; background-color: #1a1c27; color: #fff; padding: 4px 8px; font-size: 14px; margin-top: 152.34px;">
              Save {product.MucGiam}%
            </div>
          {/if}
          <div class="course-pricing" style="margin: 16px 0;">
            {#if product.GiaSauGiam}
              <span style="text-decoration: line-through; color: #999; font-size: 14px; float: left; margin-top: -20px; margin-left: 10px;">{formatCurrency(product.GiaGoc)}</span>
              <span style="font-size: 14px; color: #303b77; font-weight: bold; display: block; float: left; margin-left: 10px; margin-top: -20px;">
                {formatCurrency(product.GiaSauGiam)}
              </span>
            {:else}
              <span style="font-size: 14px; color: #303b77; font-weight: bold; display: block; float: left; margin-left: 10px; margin-top: -20px;">
                {formatCurrency(product.GiaGoc)}
              </span>
            {/if}
          </div>
          <div class="course-description" style="font-size: 16px; color: #333; float: left; margin-left: 10px; text-align: center;">
            {product.TenKhoaHoc}
          </div>
          <button class="btn-product-1" on:click={() => AddCart(product.ID)}>Buy Now</button>
        </div>
      </div>
    {/each}
  
    <!-- Pagination Controls -->
    <div class="pagination" style="margin-top: 20px; text-align: center;">
      <button on:click={prevPage} disabled={currentPage === 1} style="padding: 5px 15px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
        Previous
      </button>
      <span>{currentPage} / {totalPages}</span>
      <button on:click={nextPage} disabled={currentPage === totalPages} style="padding: 5px 15px; margin-left: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
        Next
      </button>
    </div>
  </div>
</div>

<style>

.btn-product-1 {
  text-align: center;
  margin-top: 10px;
  background-color: #3498db; /* Màu nền */
  color: white;              /* Màu chữ */
  padding: 10px 20px;        /* Khoảng cách trong nút */
  border: none;              /* Bỏ viền */
  border-radius: 5px;        /* Bo tròn góc */
  font-size: 16px;           /* Kích thước chữ */
  cursor: pointer;          /* Con trỏ chuột khi di chuột vào */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Hiệu ứng chuyển màu và co giãn */
}

.btn-product-1:hover {
  background-color: #2980b9; /* Màu nền khi hover */
  transform: scale(1.05);     /* Tăng kích thước nút khi hover */
}

.btn-product-1:active {
  background-color: #1d6a91; /* Màu nền khi click */
  transform: scale(0.98);     /* Giảm kích thước nút khi click */
}


button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

    .pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  /* background-color: #303b77; */
  margin-right: 15px;
  float: right;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  background-color: #303b77;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #1a1c27;
}

  .Content-Course {
    width: 100%;
    height: auto;
    min-height: 400px;
    float: left;
    margin-top: 40px;
  }

  .Content-Course-Left {
    margin-left: 40px;
    width: 200px;
    height: 100%;
    min-height: 100px;
    float: left;
    /* background-color: #95dd93; */
  }

  .Content-Course-Right {
    margin-left: 40px;
    width: 950px;
    height: auto;
    min-height: 20px;
    float: left;
  }

  /* .Content-Course-Right a {
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
  } */

  .Content-Course-Right-2 {
    margin-left: 40px;
    width: 950px;
    height: auto;
    min-height: 820px;
    float: left;
    /* background-color: #95dd93; */
  }

  .Product-Course {
    width: 215px;
    height: 340px;
    background-color: #fff;
    margin: 10px;
    float: left;
  }

  .Product-Course:hover .course-image {
    content: url("../../../src/image/imgCoursePages//CC-BackEnd-NodeJS.png"); 
    width: 92%;
    border-radius: 2px;
    padding: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .buy-now-btn {
    cursor: pointer;
  }

  /* Product */
  /* .loading {
    background-color: #ccc;
    cursor: not-allowed;
    height: 35px;
    width: 190px;
  }
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  } */

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .TT-Course {
    width: 100%;
    height: 30px;
    float: left;
    margin-top: 20px;
  }

  .TT-Course a {
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
    color: #333;
    font-size: 15px;
    margin-top: 10px;
  }

  .TT-Course-2 {
    width: 100%;
    height: auto;
    float: left;
    margin-top: 20px;
  }

  .TT-Course-2 a {
    font-family: Arial, Helvetica, sans-serif;
    text-decoration: none;
    color: #333;
    font-size: 36px;
    margin-top: 10px;
    margin-left: 44px;
  }
</style>
