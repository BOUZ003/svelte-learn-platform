<script lang="ts">
  // Dữ liệu mẫu cho Tutorials
  let tutorials = [
    {
      title: "HTML",
      description: "HTML is the standard markup language for web pages...",
      lessonsCompleted: 75,
      totalLessons: 75,
      progress: 100,
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    },
    {
      title: "CSS",
      description: "CSS is the language used to style an HTML document...",
      lessonsCompleted: 1,
      totalLessons: 130,
      progress: 1,
      icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    },
    {
      title: "SQL",
      description: "SQL (Structured Query Language) is a standard language...",
      lessonsCompleted: 63,
      totalLessons: 63,
      progress: 100,
      icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
    },
    {
      title: "Python",
      description: "Python can be used for everything from machine learning...",
      lessonsCompleted: 1,
      totalLessons: 145,
      progress: 1,
      icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    },
    {
      title: "JavaScript",
      description:
        "JavaScript is a powerful language for building dynamic websites...",
      lessonsCompleted: 3,
      totalLessons: 50,
      progress: 6,
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    },
    {
      title: "C++",
      description: "C++ is a versatile programming language...",
      lessonsCompleted: 0,
      totalLessons: 100,
      progress: 0,
      icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg",
    },
  ];

  // Biến lưu trữ từ khóa tìm kiếm
  let searchQuery = "";

  // Tab trạng thái hiện tại: "In progress", "Completed", "All"
  let currentTab = "In progress";

  // Lọc danh sách Tutorials dựa trên tab và từ khóa tìm kiếm
  $: filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearchQuery =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (currentTab === "In progress") {
      return (
        matchesSearchQuery && tutorial.progress > 0 && tutorial.progress < 100
      );
    } else if (currentTab === "Completed") {
      return matchesSearchQuery && tutorial.progress === 100;
    } else {
      // "All"
      return matchesSearchQuery;
    }
  });

  function scrollRight() {
    const container = document.getElementById("tutorials-container");
    if (container) {
      container.scrollBy({
        left: 300, // Di chuyển sang phải
        behavior: "smooth",
      });
    }
  }

  function scrollLeft() {
    const container = document.getElementById("tutorials-container");
    if (container) {
      container.scrollBy({
        left: -300, // Di chuyển sang trái
        behavior: "smooth",
      });
    }
  }

  function switchTab(tab: string) {
    currentTab = tab;
  }

  import { onMount } from "svelte";
  import { page } from "$app/stores";

  type Course = {
    CourseID: number;
    TenKhoaHoc: string;
    MoTa: string;
    NgayBatDau: string;
    NgayKetThuc: string;
    GiaGoc: string;
    GiaSauGiam: string | null;
    MucGiam: number | null;
    AnhDaiDien: string;
    TrangThai: string;
    TotalQuantity: string;
    MaxPrice: string;
    LatestOrderTime: string;
  };

  let certificationCourses: Course[] = [];

  onMount(async () => {
    const userId = $page.params.id;
    if (!userId) {
      console.error("Không có ID người dùng trong URL");
      return;
    }

    const response = await fetch(
      `http://localhost:3000/api/khoahoc/purchased/${userId}`
    );
    certificationCourses = await response.json();
  });

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Lấy ngày, tháng, năm
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Lấy giờ và phút (24h)
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Xác định AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // Định dạng giờ 12h
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

    // Trả về định dạng mong muốn
    return `${day}/${month}/${year}, ${formattedTime}`;
  }
</script>

<div class="container" style="margin-top: 95px;">
  <div class="header">
    <h5 class="text-2xl font-bold">My Learning</h5>
    <div class="flex items-center space-x-4">
      <div class="user-avatar"></div>
    </div>
  </div>
  <div class="tabs">
    <button
      class={currentTab === "In progress" ? "active" : ""}
      on:click={() => switchTab("In progress")}
    >
      In progress
    </button>
    <button
      class={currentTab === "Completed" ? "active" : ""}
      on:click={() => switchTab("Completed")}
    >
      Completed
    </button>
    <button
      class={currentTab === "All" ? "active" : ""}
      on:click={() => switchTab("All")}
    >
      All
    </button>
  </div>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Filter by name or description..."
      bind:value={searchQuery}
    />
  </div>
  <div class="tutorials-wrapper">
    <button
      class="scroll-button scroll-left"
      on:click={scrollLeft}
      style="margin-top: -230px;"
      aria-label="Scroll Left"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <div id="tutorials-container" class="tutorials-container">
      {#if filteredTutorials.length > 0}
        {#each filteredTutorials as tutorial}
          <div class="tutorial-card">
            <img src={tutorial.icon} alt={tutorial.title} />
            <h3>{tutorial.title}</h3>
            <p>{tutorial.description}</p>
            <p>
              {tutorial.lessonsCompleted}/{tutorial.totalLessons} lessons completed
            </p>
            <div class="progress-bar">
              <div class="progress" style="width: {tutorial.progress}%"></div>
            </div>
            <p class="text-right text-green-500 font-semibold mt-2">
              {tutorial.progress}%
            </p>
          </div>
        {/each}
      {:else}
        <p class="no-results">No tutorials found.</p>
      {/if}
    </div>
    <button
      class="scroll-button"
      on:click={scrollRight}
      style="margin-top: -230px;"
      aria-label="Scroll Right"
    >
      <i class="fa-solid fa-chevron-left fa-rotate-180"></i>
    </button>
  </div>



  <div class="header" style="margin-top: 30px;">
    <h5 class="text-2xl font-bold">Certification Courses and Exams</h5>
    <div class="flex items-center space-x-4">
      <a
        href="/purchased-courses"
        style="position: absolute; right: 0; margin-top: -15px; margin-right: 68px; text-decoration: underline;"
      >
        View More Purchased Courses
      </a>
      <div class="user-avatar"></div>
    </div>
  </div>
  <div class="certifications-container">
    {#if certificationCourses.length > 0}
      {#each certificationCourses as course}
        <div class="certification-card">
          <img
            src={course.AnhDaiDien}
            alt={course.AnhDaiDien}
            class="certification-icon"
          />
          <h6>{course.TenKhoaHoc}</h6>
          <p class="text-right text-green-500 font-semibold mt-2">
            {course.MoTa}
          </p>
          <p class="status">
            Sign-Up Date: <span>{formatDate(course.LatestOrderTime)}</span>
          </p>
          <a href={`/course-details/${course.CourseID}`} class="btn-view-course">
            View Course
          </a>
        </div>
      {/each}
    {:else}
      <p class="no-results">No courses or certifications found.</p>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .tabs {
    display: flex;
    border-bottom: 2px solid #ddd;
    margin-bottom: 20px;
  }

  .tabs button {
    padding: 10px 15px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    transition: color 0.3s ease;
  }

  .tabs button.active {
    color: #28a745;
    font-weight: bold;
    border-bottom: 2px solid #28a745;
  }

  .search-bar input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
    margin-bottom: 20px;
  }

  .search-bar input:focus {
    border-color: #28a745;
  }

  .tutorials-wrapper {
    display: flex;
    align-items: center;
  }

  .tutorials-container {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
    scroll-behavior: smooth;
  }

  .tutorial-card {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 20px;
    flex: 0 0 250px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .tutorial-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .tutorial-card img {
    width: 40px;
    height: 40px;
    margin-bottom: 15px;
  }

  .progress-bar {
    background-color: #f0f0f0;
    height: 6px;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 10px;
  }

  .progress-bar .progress {
    height: 6px;
    background-color: #28a745;
    border-radius: 5px;
  }

  .container {
    position: relative;
    width: 100%;
    height: auto;
  }

  .scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.8);
    color: #4a4a4a;
    border: 1px solid #ccc; /* Đường viền nhẹ */
    border-radius: 50%; /* Bo góc tròn */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Hiệu ứng đổ bóng */
    cursor: pointer;
    transition: all 0.3s ease;

    position: absolute; /* Nút cố định trong container */
    top: 50%; /* Đặt nút ở giữa container theo chiều dọc */
    right: 20px; /* Cách cạnh phải 20px */
    transform: translateY(-50%); /* Dịch chuyển nút lên đúng giữa */
    z-index: 10; /* Đảm bảo không bị che khuất */
  }

  .scroll-button:hover {
    background-color: rgba(200, 200, 200, 0.9); /* Màu nền khi hover */
    transform: translateY(-50%) scale(1.1); /* Phóng to nhẹ khi hover */
  }

  .scroll-button::after {
    font-size: 20px;
    font-weight: bold;
  }

  .no-results {
    text-align: center;
    font-size: 18px;
    color: #999;
    margin-top: 20px;
  }

  /* To target webkit browsers (Chrome, Edge, Safari) */
  ::-webkit-scrollbar {
    width: 5px; /* Chiều rộng thanh dọc */
    height: 5px; /* Chiều cao thanh ngang */
  }

  ::-webkit-scrollbar-thumb {
    background: #888; /* Màu của thanh kéo */
    border-radius: 10px; /* Bo góc thanh kéo */
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* Màu khi rê chuột vào thanh kéo */
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* Màu nền của track */
  }

  .scroll-left {
    left: 20px; /* Đặt nút ở bên trái container */
    right: auto; /* Loại bỏ vị trí bên phải */
  }

  .certifications-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
  }

  .certification-card {
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 20px;
    width: 300px;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .certification-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .certification-card img {
    width: 260px;
    height: 26s0px;
    margin-bottom: 15px;
  }

  .certification-card .status span {
    font-weight: bold;
    color: #28a745;
    font-size: 13px;
  }
</style>
