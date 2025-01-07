<script lang="ts">
    import { onMount } from "svelte";

interface Course {
  ID: number;
  Ten: string;
  TieuDe: string;
  MoTa: string;
  LoaiCongNgheID: number;
  Icon: string | null;
  Logo: string | null;
  PhienBan: string;
  STT: number | null;
  Tags: string;
  HienThiTrangChu: number;
  HienThiHot: number;
  NgayTao: string;
  NguoiTao: string;
  NgayCapNhat: string;
  NguoiCapNhat: string;
  MetaKeyword: string;
  MetaDescription: string;
  TrangThai: number;
}

let courses: Course[] = [];
let currentPage: number = 1;
let totalPages: number = 1;
let totalRows: number = 0;
const limit: number = 3;

// Lấy dữ liệu từ API
const fetchCourses = async (page: number = 1): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/api/congnghe/get-hienthitrangchu?searchKeyword=&page=${page}&limit=${limit}`);
    const data = await response.json();
    
    if (data) {
      courses = data.data;
      totalRows = data.totalRows;
      totalPages = Math.ceil(totalRows / limit);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Hàm chuyển trang
const goToPage = (page: number): void => {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    fetchCourses(currentPage);
  }
};

// Khi component được mount, fetch dữ liệu
onMount(() => {
  fetchCourses(currentPage);
});


    let slideIndex = 0;
  let slides: HTMLDivElement[] = [];  // Định nghĩa kiểu cho mảng slide

  // Hàm để hiển thị các slide
  const showSlides = () => {
    // Ẩn tất cả các slide
    slides.forEach((slide) => {
      slide.style.display = "none";
    });

    // Hiển thị slide hiện tại
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1; // Reset về slide đầu tiên nếu đã hết slide
    }

    slides[slideIndex - 1].style.display = "block"; // Hiển thị slide mới

    // Chuyển slide sau 7 giây
    setTimeout(showSlides, 3000);  // Mỗi slide chuyển sau 7 giây
  };

  onMount(() => {
    showSlides();
  });

  let blogs = [
    {
      id: 1,
      title: "Khóa học lập trình JavaScript cho người mới bắt đầu",
      summary: "Khóa học lập trình JavaScript sẽ giúp bạn nắm vững các kiến thức cơ bản về JavaScript, một trong những ngôn ngữ lập trình phổ biến nhất hiện nay.",
      date: "2024-12-01",
      link: "/blogs/javascript-course"
    },
    {
      id: 2,
      title: "Cập nhật tính năng mới cho ứng dụng web",
      summary: "Ứng dụng web của chúng tôi vừa ra mắt một số tính năng mới giúp cải thiện hiệu suất và trải nghiệm người dùng.",
      date: "2024-11-28",
      link: "/blogs/new-features"
    },
    {
      id: 3,
      title: "5 mẹo học lập trình hiệu quả",
      summary: "Học lập trình không phải là điều dễ dàng. Hãy tham khảo 5 mẹo học lập trình để nâng cao kỹ năng của bạn.",
      date: "2024-11-20",
      link: "/blogs/5-tips-to-learn-programming"
    },
    {
      id: 4,
      title: "Hướng dẫn sử dụng Node.js cho backend",
      summary: "Node.js là một nền tảng mạnh mẽ để phát triển ứng dụng backend. Hãy cùng khám phá cách sử dụng Node.js.",
      date: "2024-11-15",
      link: "/blogs/nodejs-for-backend"
    },
    {
      id: 5,
      title: "Giới thiệu về React.js và cách sử dụng",
      summary: "React.js là một thư viện JavaScript mạnh mẽ giúp xây dựng giao diện người dùng. Tìm hiểu cách sử dụng React.js.",
      date: "2024-11-10",
      link: "/blogs/introduction-to-react"
    },
    {
      id: 6,
      title: "Lập trình Python cơ bản",
      summary: "Python là một ngôn ngữ lập trình dễ học. Khám phá các khái niệm cơ bản về Python trong bài viết này.",
      date: "2024-11-05",
      link: "/blogs/intro-to-python"
    },
    {
      id: 7,
      title: "Các công cụ lập trình phổ biến cho phát triển web",
      summary: "Cùng khám phá những công cụ lập trình phổ biến mà các lập trình viên sử dụng để phát triển ứng dụng web.",
      date: "2024-10-30",
      link: "/blogs/popular-web-dev-tools"
    },
    {
      id: 8,
      title: "Tạo ứng dụng web với Vue.js",
      summary: "Vue.js là một framework JavaScript mạnh mẽ giúp xây dựng ứng dụng web. Cùng tìm hiểu cách sử dụng Vue.js.",
      date: "2024-10-25",
      link: "/blogs/vuejs-web-app"
    }
  ];

  // Các biến để phân trang
  let currentPageBlog = 1;
  let blogsPerPage = 3;
  let totalPagesBlog = Math.ceil(blogs.length / blogsPerPage);

  // Hàm chuyển sang trang khác
  const goToPageBlog = (page: number) => {
    if (page < 1 || page > totalPagesBlog) return;
    currentPageBlog = page;
  };

  // Lấy các bài blog cho trang hiện tại
  const getPaginatedBlogs = () => {
    const start = (currentPageBlog - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    return blogs.slice(start, end);
  };

  
  // Giả lập dữ liệu ngôn ngữ lập trình và mức lương
  let programmingLanguages = [
    { name: "JavaScript", growth: 70, averageSalary: 75000, growthOverTime: [50, 55, 60, 65, 70] },
    { name: "Python", growth: 65, averageSalary: 85000, growthOverTime: [40, 45, 50, 55, 65] },
    { name: "Java", growth: 60, averageSalary: 95000, growthOverTime: [45, 50, 55, 58, 60] },
    { name: "C#", growth: 50, averageSalary: 80000, growthOverTime: [35, 40, 45, 48, 50] },
    { name: "Ruby", growth: 40, averageSalary: 70000, growthOverTime: [30, 32, 35, 38, 40] },
    { name: "PHP", growth: 30, averageSalary: 65000, growthOverTime: [20, 22, 25, 28, 30] },
    { name: "Go", growth: 55, averageSalary: 90000, growthOverTime: [45, 48, 50, 53, 55] },
    { name: "Rust", growth: 80, averageSalary: 95000, growthOverTime: [60, 65, 70, 75, 80] },
    { name: "Swift", growth: 60, averageSalary: 95000, growthOverTime: [50, 55, 60, 65, 70] },
    { name: "TypeScript", growth: 85, averageSalary: 90000, growthOverTime: [55, 60, 65, 70, 85] }
  ];

  // Các tham số phân trang
  let currentPageThongKe = 1;
  const languagesPerPage = 3; // Hiển thị 4 ngôn ngữ mỗi trang
  const totalPagesThongKe = Math.ceil(programmingLanguages.length / languagesPerPage);

  // Hàm chuyển trang
  const goToPageThongKe = (page: number) => {
    if (page >= 1 && page <= totalPagesThongKe) {
        currentPageThongKe = page;
    }
  };

  // Lấy dữ liệu của ngôn ngữ trong trang hiện tại
  const getPaginatedLanguages = () => {
    const start = (currentPageThongKe - 1) * languagesPerPage;
    const end = start + languagesPerPage;
    return programmingLanguages.slice(start, end);
  };
  
  let successStories = [
    {
      name: "Nguyễn Văn A",
      testimonial: "Khóa học JavaScript đã giúp tôi thay đổi sự nghiệp. Cảm ơn DevUTEHY!",
      image: "../../src/image/User1.svg"
    },
    {
      name: "Trần Thị B",
      testimonial: "React.js thực sự là một bước ngoặt trong công việc của tôi. Học ở DevUTEHY thật tuyệt vời!",
      image: "../../src/image/User2.svg"
    },
    {
      name: "Lê Minh C",
      testimonial: "Tôi đã xây dựng được nhiều ứng dụng web nhờ khóa học Node.js tại DevUTEHY. Cảm ơn các bạn!",
      image: "../../src/image/User3.svg"
    }
  ];

  let name = '';
  let email = '';
  let message = '';

  function handleSubmit(event: any) {
    event.preventDefault(); // Ngừng gửi form
    alert(`Tên: ${name}\nEmail: ${email}\nLời nhắn: ${message}`);
  }
  </script>
  
  <main>
    <!-- Intro Section -->
    <section class="intro">
        <h2><img src="../../src/image/DevUTEHY.jpg" style="width: 50px;" alt="Logo DevUTEHY"> 
          Welcome to the Online Programming Course at DevUTEHY!</h2>
      <p>
        We offer high-quality courses and programming tutorials to help you build strong programming skills and prepare for a successful career. 
      </p>
    </section>

    <section class="courses">
      <h2>Outstanding Technology</h2>
      <div class="courses-list">
        {#each courses as course}
          <div class="course-card">
            <img src={course.Logo} alt="HTML logo" style="width: 30px;">
            <h3>{course.Ten}</h3>
            <p>{course.MoTa}</p>
            <button on:click={() => alert(`Đi đến chi tiết khóa học: ${course.Ten}`)}>View Details</button>
          </div>
        {/each}
      </div>
      
    
      <!-- Phân trang -->
      <div class="pagination">
        <button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>{currentPage}/{totalPages}</span>
        <button on:click={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
      </div>
    </section>

    <section class="slideshow">
        <div class="slideshow-container">
          <div class="slide fade" bind:this={slides[0]}>
            <img src="../../src/image/Slide1.svg" alt="Slide 1">
          </div>
          <div class="slide fade" bind:this={slides[1]}>
            <img src="../../src/image/Slide2.svg" alt="Slide 2">
          </div>
          <div class="slide fade" bind:this={slides[2]}>
            <img src="../../src/image/Slide3.svg" alt="Slide 3">
          </div>
        </div>
      </section>

    <section class="blogs">
        <h2 class="section-title">Blog Mới</h2>
        
        <div class="blog-list">
          {#each getPaginatedBlogs() as blog}
            <div class="blog-card">
              <h3>{blog.title}</h3>
              <p class="date">{blog.date}</p>
              <p>{blog.summary}</p>
              <a href={blog.link} class="read-more">Đọc thêm</a>
            </div>
          {/each}
        </div>
      
        <!-- Phân trang -->
        <div class="pagination">
          <button on:click={() => goToPageBlog(currentPageBlog - 1)} disabled={currentPageBlog === 1}>Previous</button>
          <span>{currentPageBlog}/{totalPagesBlog}</span>
          <button on:click={() => goToPageBlog(currentPageBlog + 1)} disabled={currentPageBlog === totalPagesBlog}>Next</button>
        </div>
      </section>

      <section class="statistics">
        <h2 class="section-title">Thống Kê Phát Triển Các Ngôn Ngữ Lập Trình và Mức Lương 2024</h2>
      
        <!-- Thống kê ngôn ngữ lập trình -->
        <div class="language-stats">
          {#each getPaginatedLanguages() as language}
            <div class="language-card">
              <h3>{language.name}</h3>
              <div class="growth-bar">
                <div class="growth" style="width: {language.growth}%"></div>
              </div>
              <p><strong>Tăng trưởng: </strong>{language.growth}%</p>
              <p><strong>Mức lương trung bình: </strong>${language.averageSalary}</p>
            </div>
          {/each}
        </div>
      
        <!-- Phân trang -->
        <div class="pagination">
          <button on:click={() => goToPageThongKe(currentPageThongKe - 1)} disabled={currentPageThongKe === 1}>Trang trước</button>
          <span>{currentPageThongKe}/{totalPagesThongKe}</span>
          <button on:click={() => goToPageThongKe(currentPageThongKe + 1)} disabled={currentPageThongKe === totalPagesThongKe}>Trang sau</button>
        </div>
      </section>

      <section class="community">
        <h2 class="section-title">Cộng Đồng Lập Trình Viên DevUTEHY</h2>
        <p>Tham gia cộng đồng của chúng tôi để kết nối, học hỏi và chia sẻ kinh nghiệm lập trình!</p>
        <div class="community-links">
          <a href="https://discord.com" target="_blank">Tham gia Discord</a>
          <a href="https://slack.com" target="_blank">Tham gia Slack</a>
          <a href="https://stackoverflow.com" target="_blank">Truy cập StackOverflow</a>
        </div>
      </section>
      
      <section class="success-stories">
        <h2 class="section-title">Câu Chuyện Cộng Đồng DevUTEHY</h2>
        <div class="stories">
          {#each successStories as story}
            <div class="story-card">
              <img src={story.image} alt={story.name}>
              <h3>{story.name}</h3>
              <p>{story.testimonial}</p>
            </div>
          {/each}
        </div>
      </section>
      

      <!-- <section class="contact-us">
        <h2 class="section-title">Liên Hệ Với Chúng Tôi</h2>
        <form on:submit={handleSubmit}>
          <label for="name">Tên của bạn:</label>
          <input type="text" id="name" bind:value={name} required>
          <label for="email">Email:</label>
          <input type="email" id="email" bind:value={email} required>
          <label for="message">Lời nhắn:</label>
          <textarea id="message" bind:value={message} required></textarea>
          <button type="submit">Gửi</button>
        </form>
      </section> -->
  </main>
  
  <style>
    :root {
      --primary-color: #2d89ef; /* Xanh nhạt hiện đại */
      --secondary-color: #f7b84b; /* Vàng nhạt */
      --background-color: #f7f9fc; /* Nền sáng nhẹ */
      --card-bg-color: #ffffff; /* Nền thẻ */
      --text-color: #2d2d2d; /* Màu chữ chính */
      --text-light-color: #5e5e5e; /* Màu chữ nhạt */
      --button-gradient: linear-gradient(135deg, #4c89f9, #246bce); /* Gradient nút */
      --button-bg-hover: #1f5db2; /* Nút hover */
    }
  
  
    main {
      padding: 40px 20px;
      max-width: 1200px;
      margin: 0 auto;
      overflow-x: none;
      /* background-color: #1f5db2; */
    }
  
    /* Phần giới thiệu */
    .intro {
      margin-top: 70px;
      text-align: center;
      background: var(--card-bg-color);
      padding: 30px;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      margin-bottom: 40px;
    }
  
    .intro h2 {
      font-size: 1.8rem;
      color: var(--primary-color);
      margin-bottom: 20px;
    }
  
    .intro p {
      font-size: 1.2rem;
      color: var(--text-light-color);
      line-height: 1.8;
    }
  
    /* Phần khóa học */
    .courses h2 {
      font-size: 2.0rem;
      color: var(--primary-color);
      text-align: center;
      margin-bottom: 30px;
    }
  
    .courses-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      padding: 0 15px;
    }
  
    .course-card {
      background-color: var(--card-bg-color);
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
    }
  
    .course-card:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    }
  
    /* .course-card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 20px;
    } */
  
    .course-card h3 {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin-bottom: 15px;
    }
  
    .course-card p {
      font-size: 1rem;
      color: var(--text-light-color);
      margin-bottom: 20px;
    }
  
    .course-card button {
  background: var(--button-gradient);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease; /* Mượt mà khi thay đổi */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Shadow nhẹ cho nút */
}

.course-card button:hover {
  background: var(--button-bg-hover);
  transform: scale(1.1); /* Tăng kích thước nhẹ khi hover */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); /* Tăng shadow khi hover */
  transition: all 0.3s ease; /* Đảm bảo hiệu ứng mượt mà */
}

  
    /* Phân trang */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
    }
  
    .pagination button,
    .pagination span {
      background: var(--card-bg-color);
      padding: 10px 15px;
      margin: 0 5px;
      border-radius: 5px;
      font-size: 1rem;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.3s ease;
    }
  
    .pagination button:hover {
      background: var(--primary-color);
      color: white;
    }
  
    .pagination button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .slideshow {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 12px;
    text-align: center;
  }

  .slideshow-container {
    position: relative;
    width: 100%;
    height: 600px;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }

  .slide {
    display: none; /* Ẩn các slide khi không hiển thị */
    width: 100%;
    height: 100%;
  }

  .slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  .fade {
    animation-name: fade;
    animation-duration: 3s;  /* Tăng thời gian hiệu ứng */
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;  /* Giữ lại trạng thái cuối cùng */
  }

  /* Hiệu ứng fade */
  @keyframes fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .blogs {
    padding: 40px 20px;
    /* background-color: #f7f9fc; */
  }

  .section-title {
    font-size: 2rem;
    text-align: center;
    color: #2d89ef;
    margin-bottom: 30px;
  }

  .blog-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .blog-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
    padding: 20px;
    padding-left: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .blog-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .blog-card h3 {
    font-size: 1.5rem;
    color: #2d89ef;
    margin-bottom: 10px;
  }

  .date {
    font-size: 0.9rem;
    color: #777;
    margin-bottom: 15px;
  }

  .blog-card p {
    font-size: 1rem;
    color: #333;
    margin-bottom: 20px;
  }

  .read-more {
    font-size: 1rem;
    color: #2d89ef;
    text-decoration: none;
    font-weight: bold;
  }

  .read-more:hover {
    text-decoration: underline;
  }

  /* Phân trang */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
  }

  .pagination button,
  .pagination span {
    background: #fff;
    padding: 10px 15px;
    margin: 0 5px;
    border-radius: 5px;
    font-size: 1rem;
    border: 1px solid #2d89ef;
    color: #2d89ef;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .pagination button:hover {
    background: #2d89ef;
    color: white;
  }

  .pagination button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .statistics {
    padding: 40px 20px;
    /* background-color: #f7f9fc; */
  }

  .section-title {
    font-size: 2rem;
    text-align: center;
    color: #2d89ef;
    margin-bottom: 30px;
  }

  .language-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }

  .language-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .language-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  .language-card h3 {
    font-size: 1.5rem;
    color: #2d89ef;
    margin-bottom: 10px;
  }

  .growth-bar {
    height: 10px;
    background-color: #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    overflow: hidden;
  }

  .growth {
    height: 100%;
    background-color: #2d89ef;
    border-radius: 5px;
    transition: width 0.5s ease;
  }

  .language-card p {
    font-size: 1rem;
    color: #333;
    margin-bottom: 10px;
  }

  .language-card p strong {
    font-weight: bold;
  }


  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
  }

  .pagination button,
  .pagination span {
    background: var(--card-bg-color);
    padding: 10px 15px;
    margin: 0 5px;
    border-radius: 5px;
    font-size: 1rem;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .pagination button:hover {
    background: var(--primary-color);
    color: white;
  }

  .pagination button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .community {
  padding: 40px 20px;
  background-color: #f7f9fc; /* Nền sáng nhẹ */
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Hiệu ứng đổ bóng */
  margin: 30px auto;
  max-width: 800px; /* Giới hạn chiều rộng */
}

.section-title {
  font-size: 2rem;
  color: #2d89ef; /* Màu xanh dương nổi bật */
  margin-bottom: 20px;
}

.community p {
  font-size: 1.2rem;
  color: #5e5e5e;
  margin-bottom: 30px;
  line-height: 1.6;
}

.community-links {
  display: flex;
  flex-wrap: wrap; /* Tự động xuống hàng khi không đủ chỗ */
  justify-content: center;
  gap: 20px; /* Khoảng cách giữa các liên kết */
}

.community-links a {
  display: inline-block;
  padding: 12px 25px;
  background-color: #2d89ef; /* Nền xanh dương */
  color: #fff; /* Màu chữ trắng */
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  transition: all 0.3s ease; /* Hiệu ứng mượt mà */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.community-links a:hover {
  background-color: #1f6fb2; /* Đổi màu khi hover */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Tăng bóng khi hover */
  transform: translateY(-3px); /* Hiệu ứng nhấn */
}

@media (max-width: 600px) {
  .community-links a {
    padding: 10px 20px; /* Điều chỉnh kích thước trên màn hình nhỏ */
    font-size: 0.9rem;
  }
}

.success-stories {
  padding: 40px 20px;
  background-color: #ffffff; /* Nền trắng để làm nổi bật các câu chuyện */
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  margin: 30px auto;
  max-width: 1200px; /* Giới hạn chiều rộng */
}

.section-title {
  font-size: 2.2rem;
  color: #2d89ef; /* Màu xanh nổi bật cho tiêu đề */
  margin-bottom: 40px;
  font-weight: bold;
}

.stories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Tự động chia cột khi màn hình nhỏ */
  gap: 30px;
}

.story-card {
  background-color: #f7f9fc; /* Nền thẻ sáng */
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Bóng đổ nhẹ */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Mượt mà khi hover */
}

.story-card:hover {
  transform: translateY(-5px); /* Đẩy thẻ lên khi hover */
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15); /* Tăng hiệu ứng bóng đổ khi hover */
}

.story-card img {
  width: 100%;
  height: 300px;
  object-fit: cover; /* Cắt ảnh sao cho vừa vặn */
  border-radius: 8px;
  margin-bottom: 20px;
}

.story-card h3 {
  font-size: 1.5rem;
  color: #2d2d2d; /* Màu chữ tối cho tên người */
  margin-bottom: 15px;
  font-weight: bold;
}

.story-card p {
  font-size: 1.1rem;
  color: #5e5e5e; /* Màu chữ nhạt cho câu chuyện */
  line-height: 1.6;
}

@media (max-width: 600px) {
  .section-title {
    font-size: 1.8rem; /* Giảm kích thước tiêu đề cho màn hình nhỏ */
  }

  .story-card {
    padding: 20px; /* Giảm padding trên thẻ khi màn hình nhỏ */
  }

  .story-card h3 {
    font-size: 1.3rem; /* Giảm kích thước font chữ tên người khi màn hình nhỏ */
  }

  .story-card p {
    font-size: 1rem; /* Giảm kích thước font chữ nội dung khi màn hình nhỏ */
  }
}

.contact-us {
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f7fb; /* Màu nền sáng nhẹ */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: #2d89ef; /* Màu xanh */
  text-align: center;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  font-size: 1rem;
  color: #333;
  margin-bottom: 8px;
}

input, textarea {
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  width: 100%;
  transition: border-color 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #2d89ef;
}

textarea {
  height: 150px; /* Kích thước cao hơn cho textarea */
}

button {
  background-color: #2d89ef;
  color: white;
  padding: 12px 25px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: fit-content;
  align-self: center; /* Canh giữa nút */
}

button:hover {
  background-color: #246bce;
}

  </style>
  
  