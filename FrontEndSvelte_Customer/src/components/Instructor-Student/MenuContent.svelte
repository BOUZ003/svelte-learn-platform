<script lang="ts">
  import { onMount } from 'svelte';

  interface Student {
    id: number;
    name: string;
    avatar: string;
    course: string;
    progress: string;
  }

  let students: Student[] = [];
  let searchQuery: string = "";
  let filteredStudents: Student[] = [];
  let paginatedStudents: Student[] = [];
  let currentPage: number = 1;
  const itemsPerPage: number = 3; // Số sinh viên trên mỗi trang

  onMount(() => {
    students = [
      { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/50', course: 'Math 101', progress: '75%' },
      { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/50', course: 'Science 202', progress: '50%' },
      { id: 3, name: 'Sam Brown', avatar: 'https://via.placeholder.com/50', course: 'History 303', progress: '90%' },
      { id: 4, name: 'Alice Green', avatar: 'https://via.placeholder.com/50', course: 'Physics 404', progress: '80%' },
      { id: 5, name: 'Alice Green', avatar: 'https://via.placeholder.com/50', course: 'Physics 404', progress: '80%' },
      { id: 6, name: 'Alice Green', avatar: 'https://via.placeholder.com/50', course: 'Physics 404', progress: '80%' },
      { id: 7, name: 'Alice Green', avatar: 'https://via.placeholder.com/50', course: 'Physics 404', progress: '80%' },
      { id: 8, name: 'Alice Green', avatar: 'https://via.placeholder.com/50', course: 'Physics 404', progress: '80%' }

    ];
    filteredStudents = students;
    paginateStudents();
  });

  function handleSearch() {
    filteredStudents = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
    currentPage = 1; // Reset về trang đầu tiên
    paginateStudents();
  }

  function paginateStudents() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedStudents = filteredStudents.slice(start, end);
  }

  function goToPage(page: number) {
    currentPage = page;
    paginateStudents();
  }

  function viewStudentInfo(student: Student) {
    alert(`Name: ${student.name}\nCourse: ${student.course}\nProgress: ${student.progress}`);
  }

  function viewStudentProgress(student: Student) {
    alert(`Progress of ${student.name}: ${student.progress}`);
  }

  function assignHomework(student: Student) {
    alert(`Assigned homework to ${student.name} for ${student.course}`);
  }

  function previousPage() {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < Math.ceil(filteredStudents.length / itemsPerPage)) {
      goToPage(currentPage + 1);
    }
  }
</script>

<div class="container">
  <div class="header">
    <h5 class="title">Students</h5>
    <input
      type="text"
      placeholder="Search by name or course..."
      bind:value={searchQuery}
      on:input={handleSearch}
      class="search-bar"
    />
  </div>

  {#if paginatedStudents.length > 0}
    <div class="students-list">
      {#each paginatedStudents as student (student.id)}
        <div class="student-item">
          <img src="{student.avatar}" alt="Avatar" class="avatar">
          <div class="student-info">
            <span class="name">{student.name}</span>
            <p class="course">Course: {student.course}</p>
          </div>
          <div class="actions">
            <button class="info-button" on:click={() => viewStudentInfo(student)}>View Info</button>
            <button class="progress-button" on:click={() => viewStudentProgress(student)}>View Progress</button>
            <button class="assign-button" on:click={() => assignHomework(student)}>Assign Homework</button>
          </div>
        </div>
      {/each}
    </div>
    <div class="pagination">
      {#if currentPage > 1}
        <button class="nav-button" on:click={previousPage}>← Previous</button>
      {/if}
      <span class="page-indicator">Page {currentPage} / {Math.ceil(filteredStudents.length / itemsPerPage)}</span>
      {#if currentPage < Math.ceil(filteredStudents.length / itemsPerPage)}
        <button class="nav-button" on:click={nextPage}>Next →</button>
      {/if}
    </div>
  {:else}
    <div class="no-students">
      <p>No students found.</p>
    </div>
  {/if}
</div>

  
  <style>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}
.nav-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.nav-button:hover {
  background-color: #0056b3;
}
.page-indicator {
  font-size: 1rem;
  font-weight: bold;
  margin: 0 10px;
  color: #333;
}
    .assign-button {
  background-color: #ffc107;
  padding: 8px 16px;
  font-size: 0.9rem;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.assign-button:hover {
  background-color: #e0a800;
}

  .container {
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px;
    background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .title {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }
  .search-bar {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }
  .students-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .student-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .student-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
    border: 2px solid #007bff;
  }
  .student-info {
    flex-grow: 1;
  }
  .name {
    font-size: 1.2rem;
    font-weight: 600;
    color: #444;
  }
  .course {
    font-size: 0.9rem;
    color: #666;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
  .info-button, .progress-button {
    padding: 8px 16px;
    font-size: 0.9rem;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .info-button {
    background-color: #28a745;
  }
  .info-button:hover {
    background-color: #218838;
  }
  .progress-button {
    background-color: #007bff;
  }
  .progress-button:hover {
    background-color: #0056b3;
  }
  .no-students {
    text-align: center;
    color: #888;
    font-size: 1rem;
  }
  </style>
  