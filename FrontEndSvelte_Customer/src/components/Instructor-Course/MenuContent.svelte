<script lang="ts">
  let courses = [
    {
      id: 1,
      title: "Course 1",
      description: "This is the description for Course 1. It covers the basics of the subject.",
      user: "John Doe",
      avatar: "https://www.w3schools.com/w3images/avatar2.png",
    },
    {
      id: 2,
      title: "Course 2",
      description: "This is the description for Course 2. It provides advanced insights into the topic.",
      user: "Jane Smith",
      avatar: "https://www.w3schools.com/w3images/avatar5.png",
    },
    {
      id: 3,
      title: "Course 3",
      description: "This course focuses on practical applications and real-world scenarios.",
      user: "Alice Johnson",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
    },
    {
      id: 2,
      title: "Course 2",
      description: "This is the description for Course 2. It provides advanced insights into the topic.",
      user: "Jane Smith",
      avatar: "https://www.w3schools.com/w3images/avatar5.png",
    },
    {
      id: 3,
      title: "Course 3",
      description: "This course focuses on practical applications and real-world scenarios.",
      user: "Alice Johnson",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
    },
    {
      id: 2,
      title: "Course 2",
      description: "This is the description for Course 2. It provides advanced insights into the topic.",
      user: "Jane Smith",
      avatar: "https://www.w3schools.com/w3images/avatar5.png",
    },
    {
      id: 3,
      title: "Course 3",
      description: "This course focuses on practical applications and real-world scenarios.",
      user: "Alice Johnson",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
    },
    {
      id: 2,
      title: "Course 2",
      description: "This is the description for Course 2. It provides advanced insights into the topic.",
      user: "Jane Smith",
      avatar: "https://www.w3schools.com/w3images/avatar5.png",
    },
    {
      id: 3,
      title: "Course 3",
      description: "This course focuses on practical applications and real-world scenarios.",
      user: "Alice Johnson",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
    },
    {
      id: 2,
      title: "Course 2",
      description: "This is the description for Course 2. It provides advanced insights into the topic.",
      user: "Jane Smith",
      avatar: "https://www.w3schools.com/w3images/avatar5.png",
    },
    {
      id: 3,
      title: "Course 3",
      description: "This course focuses on practical applications and real-world scenarios.",
      user: "Alice Johnson",
      avatar: "https://www.w3schools.com/w3images/avatar6.png",
    },
  ];

  let searchQuery = "";
  let currentPage = 1;
  let coursesPerPage = 3;

  const filteredCourses = () => {
    return courses.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const paginatedCourses = () => {
    const startIndex = (currentPage - 1) * coursesPerPage;
    return filteredCourses().slice(startIndex, startIndex + coursesPerPage);
  };

  const deleteCourse = (id: number) => {
    courses = courses.filter((course) => course.id !== id);
    if (currentPage > totalPages()) currentPage = totalPages();
  };

  const editCourse = (id: number) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      course.title = prompt("Enter new title:", course.title) || course.title;
      course.description =
        prompt("Enter new description:", course.description) ||
        course.description;
    }
  };

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
      });
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages()) {
      currentPage = page;
    }
  };

  const totalPages = () => {
    return Math.ceil(filteredCourses().length / coursesPerPage);
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

  {#if paginatedCourses().length > 0}
    {#each paginatedCourses() as course (course.id)}
      <div class="course-card">
        <div class="course-header">
          <h5 class="text-2xl font-bold">{course.title}</h5>
          <div class="flex items-center space-x-4">
            <img class="user-avatar" src={course.avatar} alt={course.user} />
            <span class="user-name">{course.user}</span>
          </div>
        </div>
        <div class="course-content">
          <p class="course-description">{course.description}</p>
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

  <div class="pagination">
    <button
      on:click={() => changePage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span class="page-info">Page {currentPage} / {totalPages()}</span>
    <button
      on:click={() => changePage(currentPage + 1)}
      disabled={currentPage === totalPages()}
    >
      Next
    </button>
  </div>
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
    max-width: 800px;
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
