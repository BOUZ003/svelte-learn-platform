<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { username } from "../stores/authStore";

  let menu: HTMLElement;
  let leftArrow: HTMLElement;
  let rightArrow: HTMLElement;
  let autoScrollInterval: number | NodeJS.Timeout;

  function scrollToLeft() {
    if (menu) {
      menu.scrollBy({
        left: -100,
        behavior: "smooth",
      });
      setTimeout(updateArrows, 300);
    }
  }

  function scrollToRight() {
    if (menu) {
      menu.scrollBy({
        left: 100,
        behavior: "smooth",
      });
      setTimeout(updateArrows, 300);
    }
  }

  function updateArrows() {
    if (menu) {
      if (menu.scrollLeft === 0) {
        if (leftArrow) leftArrow.classList.add("hidden");
      } else {
        if (leftArrow) leftArrow.classList.remove("hidden");
      }

      if (menu.scrollLeft + menu.clientWidth >= menu.scrollWidth - 40) {
        if (rightArrow) rightArrow.classList.add("hidden");
      } else {
        if (rightArrow) rightArrow.classList.remove("hidden");
      }
    }
  }

  function startAutoScroll() {
    if (menu) {
      autoScrollInterval = setInterval(() => {
        if (menu.scrollLeft + menu.clientWidth >= menu.scrollWidth - 40) {
          menu.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          menu.scrollBy({ left: 100, behavior: "smooth" });
        }
      }, 2000);
    }
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }

  function handleScroll() {
    updateArrows();
  }

  onMount(() => {
    if (menu) {
      startAutoScroll();
      menu.addEventListener("scroll", handleScroll);
      onDestroy(() => {
        clearInterval(autoScrollInterval);
        menu.removeEventListener("scroll", handleScroll);
      });
    }

    fetchCongNgheMenu();
  });

  function handleMouseEnter() {
    stopAutoScroll();
  }

  function handleMouseLeave() {
    startAutoScroll();
  }

  function signUp() {
    goto("/register");
  }

  function logIn() {
    goto("/login");
  }

  let token = localStorage.getItem("token");
  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");

    token = null;
  }

  function goToProfile() {
    const userRole = localStorage.getItem("userId");
    if (userRole) {
      // goto(`/my-account/${userRole}`);
      goto(`/my-account`);
    } else {
      console.error("User role not found");
    }
  }

  interface Technology {
    ID: number;
    Ten: string;
    TrangThai: number;
    HienThiHot: number;
    STT: number | null;
  }
  let technologies: Technology[] = [];
  async function fetchCongNgheMenu() {
    const res = await fetch("http://localhost:3000/api/congnghe/get-menu");
    if (res.ok) {
      const data: Technology[] = await res.json();
      technologies = data.filter((item) => item.TrangThai === 1); // Lọc các công nghệ có trạng thái là 1
    } else {
      console.error("Error fetching data");
    }
  }

  function shortenName(name: any) {
    if (name.length > 10) {
      return name.slice(0, 10) + '...'; // Cắt tên ở vị trí 10 và thêm '...'
    }
    return name; // Nếu tên ngắn hơn hoặc bằng 10 ký tự thì trả về tên gốc
  }
</script>

<div class="container-fluid">
  <div class="laptop-view-banner">
    <div class="banner-top-1-danhmuc" style="overflow: hidden;">
      <div class="col-xl-1 h-100" style="float: left; width: 80px;">
        <a href="/">
          <img
            src="../../src/image/DevUTEHY.jpg"
            alt=""
            style="width: 100%; margin-top: -10px;"
          />
        </a>
      </div>

      <div
        class="col-xl-4 h-100"
        style="background-color: rgb(126, 126, 172); float: left; width: 420px;"
      >
        <div class="menu">
          <ul>
            <li>
              <a href="/">Tutorials <i class="fa-solid fa-caret-down"></i></a>
            </li>
            <li>
              <a href="indexProductCategoryPage.html"
                >Exercises <i class="fa-solid fa-caret-down"></i></a
              >
            </li>
            <li>
              <a href="indexBlogs.html"
                >Certificates <i class="fa-solid fa-caret-down"></i></a
              >
            </li>
            <li>
              <a href="LINK5">Services <i class="fa-solid fa-caret-down"></i></a
              >
            </li>
          </ul>
        </div>
      </div>

      <div class="col-xl-3 h-100" style="float: left; width: 300px;">
        <div
          class="input-group"
          style="margin-top: -10px;margin-left: 20px; width: 200px;"
        >
          <input
            type="text"
            class="form-control"
            placeholder="Search..."
            aria-label="Search"
            style="border-top-left-radius: 20px; border-bottom-left-radius: 20px;"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            aria-label="Search"
            style="border-top-right-radius: 20px; border-bottom-right-radius: 20px;"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      <div class="col-xl-4 h-100" style="float: left; width: 456px;">
        <div class="menuSpacesAndCart">
          <ul>
            <li>
              <a href="#Spaces"
                ><i
                  class="fa-solid fa-code"
                  style="color: rgb(13, 178, 238);font-size: 13px;"
                ></i> Spaces</a
              >
            </li>
            <li>
              <a href="/course"
                ><i
                  class="fa-solid fa-cart-shopping"
                  style="color: rgb(13, 178, 238);font-size: 13px;"
                ></i> Get Certified</a
              >
            </li>
          </ul>
        </div>
        <div class="Login">
          {#if token}
            <div style="margin-top: 7%; margin-left: 8%;">
              <div style="float: left;">
                <button
                  type="button"
                  class="profile-icon-btn"
                  on:click={goToProfile}
                  aria-label="Go to profile"
                >
                  <i
                    class="fas fa-user-circle profile-icon"
                    style="color: blue; font-size:20px"
                  ></i>
                </button>
              </div>
              <div style="float: left; margin-top: -2px;">
                <span>{shortenName($username)}</span>
              </div>
              <div
                style="float: left; float: left; margin-top: -8px; margin-left: 3px"
              >
                <button class="button log-out" on:click={logOut}>Log out</button
                >
              </div>
            </div>
          {:else}
            <div class="button-container">
              <button class="button sign-up" on:click={signUp}>Sign Up</button>
              <button class="button log-in" on:click={logIn}>Log in</button>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <div class="banner-top-2-congnghe">
      <div class="menu-container" style="width: 95%;">
        <button
          class="arrow left-arrow hidden"
          bind:this={leftArrow}
          on:click={scrollToLeft}>&#9664;</button
        >
        <div
          class="menuCongNghe"
          bind:this={menu}
          role="menu"
          tabindex="0"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}
        >
          <ul>
            {#each technologies as tech}
              <li>
                <a href={`/tutorials/${tech.ID}`} target="_blank">
                  {tech.Ten}
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <button
          class="arrow right-arrow"
          bind:this={rightArrow}
          on:click={scrollToRight}
          aria-label="Scroll to the right"
        >
          &#9654;
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .laptop-view-banner {
    float: left;
    margin-left: -15px;
    height: 90px;
    width: 100%;
    background-color: rgb(0, 0, 0);
    position: absolute;
    z-index: 100;
  }

  .banner-top-1-danhmuc {
    float: left;
    background-color: #ffffff;
    height: 65%;
    width: 100%;
    position: relative;
    z-index: 100;
  }

  .section {
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
  }
  #section1 {
    background-color: #6f5c5e;
  }
  #section2 {
    background-color: #d1ecf1;
  }
  #section3 {
    background-color: #d4edda;
  }
  #section4 {
    background-color: #c3e6cb;
  }
  #section8 {
    height: 100vh;
    background-color: #554647;
  }

  ul {
    list-style: none;
  }

  .menu {
    background-color: #ffffff;
    float: left;
    text-align: center;
  }

  .menu ul {
    display: inline-flex;
    list-style: none;
    color: #fff;
    margin-left: -35px;
  }

  .menu ul li {
    width: 105px;
    margin: 5px 2px;
    padding: 20px 5px;
    margin-top: -5px;
  }

  .menu ul li a {
    color: black;
    text-decoration: none;
  }

  .active,
  .menu ul li:hover {
    background: #0fd180;
    transition: 0.6s;
  }
  .active,
  .menu ul li:hover a {
    transition: 0.1s;
    color: white;
  }

  .active,
  .menu ul li::before {
    background: #7cb3ae;
    transition: 0.6s;
  }

  .box-submenu {
    display: none;
  }

  .menu ul li:hover .box-submenu {
    display: block;
    position: absolute;
    background: #7cb3ae;
    margin-top: 10px;
    margin-left: -10px;
  }

  .menu ul li:hover .box-submenu ul {
    display: block;
    margin: 0px;
    padding: 0px;
  }

  .menu ul li:hover .box-submenu ul li {
    width: 220px;
    text-align: left;
    border-bottom: dotted 1px #fff;
    background: transparent;
    border-radius: 0;
    padding: 10px 20px;
  }

  .menu ul li:hover .box-submenu ul li:last-child {
    border-bottom: none;
  }

  .menu ul li:hover .box-submenu ul li a:hover {
    color: #333;
  }

  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .input-group {
    width: 100%;
  }

  .form-control {
    border-radius: 20px 0 0 20px;
    border: 1px solid #ccc;
    height: 40px;
  }

  .btn-outline-secondary {
    border-radius: 0 20px 20px 0;
    border: 1px solid #ccc;
    background-color: white;
    color: black;
  }

  .btn-outline-secondary:hover {
    background-color: #ccc;
  }

  .col-xl-3 {
    padding: 20px;
  }

  .menuSpacesAndCart {
    background-color: #ffffff;
    float: left;
    text-align: center;
  }

  .menuSpacesAndCart ul {
    display: inline-flex;
    list-style: none;
    color: #fff;
    margin-left: -85px;
  }

  .menuSpacesAndCart ul li {
    width: 125px;
    margin: 5px 2px;
    padding: 20px 5px;
    margin-top: -5px;
  }

  .menuSpacesAndCart ul li a {
    color: black;
    text-decoration: none;
  }

  .active,
  .menuSpacesAndCart ul li:hover {
    background: #d9dedc;
    transition: 0.6s;
  }
  .active,
  .menuSpacesAndCart ul li:hover a {
    transition: 0.1s;
  }

  .active,
  .menuSpacesAndCart ul li::before {
    background: #7cb3ae;
    transition: 0.6s;
  }

  .box-submenu {
    display: none;
  }

  .menuSpacesAndCart ul li:hover .box-submenu {
    display: block;
    position: absolute;
    background: #7cb3ae;
    margin-top: 10px;
    margin-left: -10px;
  }

  .menuSpacesAndCart ul li:hover .box-submenu ul {
    display: block;
    margin: 0px;
    padding: 0px;
  }

  .menuSpacesAndCart ul li:hover .box-submenu ul li {
    width: 220px;
    text-align: left;
    border-bottom: dotted 1px #fff;
    background: transparent;
    border-radius: 0;
    padding: 10px 20px;
  }

  .menuSpacesAndCart ul li:hover .box-submenu ul li:last-child {
    border-bottom: none;
  }

  .menuSpacesAndCart ul li:hover .box-submenu ul li a:hover {
    color: #333;
  }

  .Login {
    width: 250px;
    height: 100%;
    /* background-color: #0fd180; */
    float: left;
  }

  .button-container {
    display: flex;
    align-items: center;
    border-radius: 50px;
    background-color: #e6f4ec;
    padding: 5px;
    width: 130px;
    margin-top: 5px;
    margin-left: 50px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }

  .button {
    border: none;
    padding: 5px 5px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 16px;
  }

  .sign-up {
    background-color: #00ab5b;
    color: white;
  }

  .log-in {
    background-color: transparent;
    color: #00ab5b;
  }

  .menu-container {
    position: relative;
    width: 80%;
    margin: 50px auto;
    display: flex;
    align-items: center;
  }

  .menuCongNghe {
    display: flex;
    overflow-x: hidden; /* Ẩn thanh cuộn ngang */
    scroll-behavior: smooth;
    width: 100%;
  }

  .menuCongNghe ul {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .menuCongNghe li {
    flex: none;
    padding: 4px 10px;
    margin: 0 5px;
    /* background-color: #4CAF50; */
    color: white;
    text-align: center;
    /* border-radius: 5px; */
  }

  .menuCongNghe li:hover {
    background-color: #8fa390;
    cursor: pointer;
  }

  .menuCongNghe a {
    text-decoration: none;
    color: #fff;
  }

  .arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: white;
    border: none;
    cursor: pointer;

    background-color: black;
    height: 95%;
  }

  .left-arrow {
    left: -35px;
  }

  .right-arrow {
    right: -35px;
  }

  .hidden {
    display: none;
  }
  .menuCongNghe {
    white-space: nowrap; /* Đảm bảo các mục li không xuống dòng */
    overflow-x: scroll; /* Cho phép cuộn ngang */
  }

  .menuCongNghe::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn */
  }

  .log-out {
    background-color: red;
    color: white;
  }

  .profile-icon-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-right: 0.5rem;
  }
</style>
