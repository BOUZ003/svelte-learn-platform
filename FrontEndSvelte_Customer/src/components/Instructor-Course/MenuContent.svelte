<script lang="ts">
  import { onMount } from "svelte";

  interface Course {
    id: number;
    title: string;
    description: string;
    avatar: string;
    user: string;
    status: string;
  }

  let courses: Course[] = [];
  let searchQuery = "";
  let loading = true; // Trạng thái tải API
  let error: string | null = null; // Lưu lỗi nếu có

  // Fetch dữ liệu từ API khi component được mount
  onMount(async () => {
    await fetchCourses();
  });

  // Hàm fetch dữ liệu từ API
  const fetchCourses = async () => {
    try {
      loading = true;
      error = null;

      const response = await fetch("http://localhost:3000/api/khoahoc/search-by-intructor/23");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();

      // Map dữ liệu API vào courses
      courses = data.map((course: any): Course => ({
        id: course.ID,
        title: course.TenKhoaHoc,
        description: course.MoTa,
        avatar: course.AnhDaiDien, // Sửa đường dẫn ảnh nếu cần
        user: `User ${course.IDNguoiTao}`, // Thêm thông tin user
        status: course.TrangThai === "DangMo" ? "Open" : "Closed",
      }));
    } catch (err: any) {
      error = err.message || "Unknown error occurred";
    } finally {
      loading = false;
    }
  };

  // Lọc courses dựa trên search query
  const filteredCourses = () => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Xóa một course
  const deleteCourse = (id: number) => {
    courses = courses.filter((course) => course.id !== id);
  };

  // Chỉnh sửa course
  const editCourse = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      course.title = prompt("Enter new title:", course.title) || course.title;
      course.description =
        prompt("Enter new description:", course.description) ||
        course.description;
    }
  };

  // Thêm mới một course
  const addCourse = () => {
    const title = prompt("Enter course title:");
    const description = prompt("Enter course description:");
    const user = prompt("Enter course user:");
    const avatar = "https://www.w3schools.com/w3images/avatar5.png";

    if (title && description && user) {
      const newId =
        courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
      courses.push({
        id: newId,
        title,
        description,
        user,
        avatar,
        status,
      });
    }
  };
</script>

<div class="container">
  <div class="header">
    <div class="search-bar">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search for a course..."
        class="search-input"
      />
    </div>
    <button on:click={addCourse} class="add-button">Add New Course</button>
  </div>

  <!-- Hiển thị trạng thái tải -->
  {#if loading}
    <p>Loading courses...</p>
  {:else if error}
    <p class="error-message">{error}</p>
  {:else if filteredCourses().length > 0}
    {#each filteredCourses() as course (course.id)}
      <div class="course-card">
        <div class="course-header">
          <h5 class="text-2xl font-bold">{course.title}</h5>
          <div class="flex items-center space-x-4">
            <img class="user-avatar" src={course.avatar} />
          </div>
        </div>
        <div class="course-content">
          <p class="course-description">{course.description}</p>
          <span>Status: {course.status}</span>
        </div>
        <div class="course-actions">
          <button
            on:click={() => editCourse(course.id)}
            class="edit-button"
          >
            Edit
          </button>
          <button
            on:click={() => deleteCourse(course.id)}
            class="delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    {/each}
  {:else}
    <p class="no-results">No courses found.</p>
  {/if}
</div>


<style>

.no-results {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
    margin: 20px 0;
  }

  .container {
    margin-top: 95px;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-bar {
    flex-grow: 1;
  }

  .search-input {
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
    color: #333;
  }

  .add-button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }

  .course-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .text-2xl {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .user-name {
    font-size: 1rem;
    color: #333;
    font-weight: normal;
  }

  .course-content {
    margin-top: 10px;
  }

  .course-description {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
  }

  .course-actions {
    margin-top: 20px;
  }

  .edit-button, .delete-button {
    padding: 8px 16px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .edit-button {
    background-color: #4CAF50;
    color: white;
  }

  .delete-button {
    background-color: #f44336;
    color: white;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }

  .pagination .page-info {
    font-size: 1rem;
    color: #333;
  }
</style>
