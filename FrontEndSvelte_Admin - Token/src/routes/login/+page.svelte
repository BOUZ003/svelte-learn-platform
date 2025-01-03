<script lang="ts">
  import { login } from "../../stores/authStore";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let username = "";
  let password = "";
  let error = "";
  let showPassword = false; // State to toggle password visibility

  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Kiểm tra nếu phản hồi không thành công
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Đăng nhập thất bại");
      }

      // Xử lý dữ liệu trả về khi đăng nhập thành công
      const data = await response.json();

      // Kiểm tra trạng thái tài khoản nếu là Admin nhưng không hoạt động
      // if (data.user.role === 'SuperAdmin' && data.user.TrangThai !== 'HoatDong') {
      //   goto('/admin-status'); // Điều hướng đến trang trạng thái admin
      //   return;
      // }

      // Lưu token và thông tin vai trò người dùng
      login(data.token, data.user.role, data.user.fullName, data.user.id);
      goto("/"); // Điều hướng sau khi đăng nhập thành công
    } catch (e) {
      // Xử lý lỗi và hiển thị thông báo
      if (e instanceof Error) {
        error = e.message; // Thông báo lỗi từ server
      } else {
        error = "Đã xảy ra lỗi không xác định"; // Trường hợp lỗi không rõ ràng
      }
    }
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  onMount(() => {
    if (localStorage.getItem("token")) {
      goto("/");
    }
  });
</script>

<div class="page-container">
  <div class="logo-background">
    <div class="logo-bubble"></div>
    <div class="logo-bubble"></div>
    <div class="logo-bubble"></div>
    <div class="logo-bubble"></div>
    <div class="logo-bubble"></div>
  </div>
  <div class="shooting-stars">
    <div class="star"></div>
    <div class="star"></div>
    <div class="star"></div>
  </div>

  <div class="login-container">
    <h1>Đăng Nhập</h1>
    <form on:submit|preventDefault={handleLogin}>
      <label>
        Tên đăng nhập:
        <input
          type="text"
          bind:value={username}
          placeholder="Nhập tên đăng nhập"
          required
        />
      </label>
      <label>
        Mật khẩu:
        <div class="password-container">
          <input
            type={showPassword ? "text" : "password"}
            bind:value={password}
            placeholder="Nhập mật khẩu"
            required
          />
          <span
            class="toggle-password-icon"
            on:click={togglePasswordVisibility}
            on:keydown={togglePasswordVisibility}
            role="button"
            aria-label="Show or hide password"
            tabindex="0"
          >
            {#if showPassword}
              👁️ <!-- Icon for showing password -->
            {:else}
              🙈 <!-- Icon for hiding password -->
            {/if}
          </span>
        </div>
      </label>
      {#if error}
        <p class="error-message">{error}</p>
      {/if}
      <button type="submit">Đăng Nhập</button>
    </form>

    <div class="additional-actions">
      <button class="register-button" on:click={() => goto("/register")}
        >Đăng Ký</button
      >
      <button
        class="forgot-password-button"
        on:click={() => goto("/forgot-password")}>Quên Mật Khẩu</button
      >
    </div>
  </div>
</div>

<style>
  .page-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #74ebd5, #acb6e5);
    overflow: hidden;
  }

  /* Nền logo 3D */
  .logo-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
  }

  .logo-bubble {
    position: absolute;
    width: 150px; /* Tăng kích thước logo */
    height: 150px;
    background-image: url("../../src/images/DevUTEHY.png");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.15; /* Độ trong suốt để logo rõ hơn */
    transform: translateZ(0) scale(1);
    animation: floating 20s infinite ease-in-out;
  }

  /* Đặt vị trí và kích thước ngẫu nhiên cho các logo */
  .logo-bubble:nth-child(1) {
    top: 10%;
    left: 15%;
    transform: scale(0.9);
  }
  .logo-bubble:nth-child(2) {
    top: 50%;
    left: 30%;
    transform: scale(1.3);
  }
  .logo-bubble:nth-child(3) {
    top: 30%;
    left: 70%;
    transform: scale(1.1);
  }
  .logo-bubble:nth-child(4) {
    top: 80%;
    left: 20%;
    transform: scale(1);
  }
  .logo-bubble:nth-child(5) {
    top: 60%;
    left: 80%;
    transform: scale(1.2);
  }

  /* Hiệu ứng chuyển động cho logo */
  @keyframes floating {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.15;
    }
    50% {
      transform: translateY(-20px) scale(1.05);
      opacity: 0.2;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 0.15;
    }
  }

  /* Hiệu ứng sao băng */
  .shooting-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 1;
    pointer-events: none;
  }

  .star {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 2px;
    height: 80px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.8)
    );
    border-radius: 50%;
    transform: rotate(45deg);
    animation: shooting 5s infinite ease-in-out;
  }

  /* Sao băng rơi từ góc trên phải xuống góc dưới trái */
  .star:nth-child(1) {
    animation-delay: 0s;
    animation-duration: 6s;
    top: 10%;
    left: 80%;
  }

  .star:nth-child(2) {
    animation-delay: 2s;
    animation-duration: 8s;
    top: 20%;
    left: 70%;
  }

  .star:nth-child(3) {
    animation-delay: 4s;
    animation-duration: 7s;
    top: 15%;
    left: 85%;
  }

  @keyframes shooting {
    0% {
      transform: translateY(0) translateX(0) rotate(45deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) translateX(-100vw) rotate(45deg);
      opacity: 0;
    }
  }

  .login-container {
    position: relative;
    z-index: 2;
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h1 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.8rem;
    font-weight: bold;
  }

  label {
    font-size: 1rem;
    color: #333;
    display: block;
    margin-bottom: 0.5rem;
    text-align: left;
    font-weight: 600;
  }

  input[type="text"],
  input[type="password"] {
    margin-top: 1%;
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    background: #f9f9f9;
    transition: all 0.3s ease;
  }

  input[type="text"]:focus,
  input[type="password"]:focus {
    outline: none;
    border-color: #74ebd5;
    background: #ffffff;
    box-shadow: 0px 0px 8px rgba(116, 235, 213, 0.4);
    transform: scale(1.02);
  }

  .password-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-container input {
    padding-right: 2.5rem; /* Space for the icon */
  }

  .toggle-password-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%); /* Center the icon vertically */
    cursor: pointer;
    font-size: 1.2rem;
    color: #74ebd5;
    transition: color 0.3s ease;
    margin-top: -3%;
  }

  .toggle-password-icon:hover {
    color: #acb6e5;
  }

  button {
    width: 100%;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #74ebd5, #acb6e5);
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
  }

  button:hover {
    box-shadow: 0px 5px 15px rgba(116, 235, 213, 0.5);
    transform: translateY(-2px);
  }

  .error-message {
    color: red;
    font-size: 0.9rem;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
  }

  .additional-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
  }

  .register-button,
  .forgot-password-button {
    background: none;
    border: none;
    color: #74ebd5;
    font-size: 0.9rem;
    cursor: pointer;
    transition: color 0.3s ease;
    font-weight: bold;
  }

  .register-button:hover,
  .forgot-password-button:hover {
    color: #acb6e5;
    text-decoration: underline;
  }
</style>
