<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
  
    let username = '';
    let password = '';
    let email = '';
    let fullName = '';
    let error = '';
  
    async function handleRegister() {
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, fullName })
        });
  
        if (!response.ok) {
          throw new Error('Đăng ký thất bại');
        }
  
        await response.json();
        goto('/login'); // Chuyển hướng sau khi đăng ký thành công
      } catch (e) {
        if (e instanceof Error) {
          error = e.message;
        } else {
          error = 'Đã xảy ra lỗi không xác định';
        }
      }
    }
</script>

<div class="page-container">
  <!-- Nền logo 3D và sao băng -->
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

  <div class="register-container">
    <h1>Đăng Ký</h1>
    <form on:submit|preventDefault={handleRegister}>
      <label>
        Tên đăng nhập:
        <input type="text" bind:value={username} placeholder="Nhập tên đăng nhập" required />
      </label>
      <label>
        Mật khẩu:
        <input type="text" bind:value={password} placeholder="Nhập mật khẩu" required />
      </label>
      <label>
        Email:
        <input type="email" bind:value={email} placeholder="Nhập email" required />
      </label>
      <label>
        Họ Tên:
        <input type="text" bind:value={fullName} placeholder="Nhập họ tên" required />
      </label>
      {#if error}
        <p class="error-message">{error}</p>
      {/if}
      <button type="submit">Đăng Ký</button>
    </form>

    <div class="additional-actions">
      <button class="forgot-password-button" on:click="{() => goto('/login')}">Đã có tài khoản? Đăng Nhập</button>
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
      width: 150px; /* Tăng kích thước logo để rõ hơn */
      height: 150px;
      background-image: url('../../src/images/DevUTEHY.png');
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.2; /* Độ trong suốt để logo rõ hơn */
      animation: floating 15s infinite ease-in-out;
    }
  
    /* Đặt vị trí cho các logo */
    .logo-bubble:nth-child(1) { top: 10%; left: 15%; transform: scale(0.8); }
    .logo-bubble:nth-child(2) { top: 40%; left: 30%; transform: scale(1.1); }
    .logo-bubble:nth-child(3) { top: 30%; left: 70%; transform: scale(1); }
    .logo-bubble:nth-child(4) { top: 75%; left: 20%; transform: scale(0.9); }
    .logo-bubble:nth-child(5) { top: 55%; left: 80%; transform: scale(1); }
  
    /* Hiệu ứng chuyển động cho logo */
    @keyframes floating {
      0% { transform: translateY(0) scale(1); opacity: 0.2; }
      50% { transform: translateY(-20px) scale(1.05); opacity: 0.25; }
      100% { transform: translateY(0) scale(1); opacity: 0.2; }
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
      width: 3px; /* Tăng kích thước sao băng */
      height: 100px; /* Tăng chiều dài sao băng */
      background: linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
      border-radius: 50%;
      transform: rotate(45deg);
      animation: shooting 6s infinite ease-in-out;
    }
  
    /* Sao băng rơi từ góc trên phải xuống góc dưới trái */
    .star:nth-child(1) { animation-delay: 0s; animation-duration: 6s; top: 10%; left: 80%; }
    .star:nth-child(2) { animation-delay: 2s; animation-duration: 8s; top: 20%; left: 70%; }
    .star:nth-child(3) { animation-delay: 4s; animation-duration: 7s; top: 15%; left: 85%; }
  
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
  
    .register-container {
      position: relative;
      z-index: 2;
      background: #fff;
      padding: 1.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
      text-align: center;
    }
  
    h1 {
      /* margin-bottom: 1rem; */
      color: #333;
      font-size: 1.6rem;
      font-weight: bold;
    }
  
    label {
      font-size: 0.9rem;
      color: #333;
      display: block;
      /* margin-bottom: 0.3rem; */
      text-align: left;
      font-weight: 600;
    }
  
    input[type="text"],
    input[type="password"],
    input[type="email"] {
      margin-top: 1%;
      width: 100%;
      padding: 0.7rem;
      margin-bottom: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 0.9rem;
      background: #f9f9f9;
      transition: all 0.3s ease;
    }
  
    input:focus {
      outline: none;
      border-color: #74ebd5;
      background: #ffffff;
      box-shadow: 0px 0px 8px rgba(116, 235, 213, 0.4);
      transform: scale(1.02);
    }
  
    button {
      width: 100%;
      padding: 0.7rem;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #74ebd5, #acb6e5);
      color: #fff;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: box-shadow 0.3s ease, transform 0.3s ease;
    }
  
    button:hover {
      box-shadow: 0px 5px 15px rgba(116, 235, 213, 0.5);
      transform: translateY(-2px);
    }
  
    .error-message {
      color: red;
      font-size: 0.9rem;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
    }
  
    .additional-actions {
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
      margin-bottom: -1rem;
    }
  
    .forgot-password-button {
      background: none;
      border: none;
      color: #74ebd5;
      font-size: 0.9rem;
      cursor: pointer;
      transition: color 0.3s ease;
      font-weight: bold;
    }
  
    .forgot-password-button:hover {
      color: #acb6e5;
      text-decoration: underline;
    }
  </style>
  
