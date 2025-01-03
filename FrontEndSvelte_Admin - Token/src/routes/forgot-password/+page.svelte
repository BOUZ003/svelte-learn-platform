<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
  
	let email = '';
	let error = '';
	let successMessage = '';
  
	async function handleForgotPassword() {
	  try {
		const response = await fetch('http://localhost:3000/api/forgot-password', {
		  method: 'POST',
		  headers: { 'Content-Type': 'application/json' },
		  body: JSON.stringify({ email })
		});
  
		if (!response.ok) {
		  throw new Error('Yêu cầu quên mật khẩu thất bại');
		}
  
		successMessage = 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.';
		error = '';
	  } catch (e) {
		if (e instanceof Error) {
		  error = e.message;
		} else {
		  error = 'Đã xảy ra lỗi không xác định';
		}
		successMessage = '';
	  }
	}
  
	onMount(() => {
	  if (localStorage.getItem('token')) {
		goto('/');
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

	<div class="forgot-password-container">
	  <h1>Quên Mật Khẩu</h1>
	  <form on:submit|preventDefault={handleForgotPassword}>
		<label>
		  Email:
		  <input type="email" bind:value={email} placeholder="Nhập email của bạn" required />
		</label>
		{#if error}
		  <p class="error-message">{error}</p>
		{/if}
		{#if successMessage}
		  <p class="success-message">{successMessage}</p>
		{/if}
		<button type="submit">Gửi Yêu Cầu</button>
	  </form>
	  
	  <div class="additional-actions">
		<button class="back-to-login-button" on:click="{() => goto('/login')}">Quay lại Đăng Nhập</button>
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
    background-image: url('../../src/images/DevUTEHY.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.15; /* Độ trong suốt để logo rõ hơn */
    transform: translateZ(0) scale(1);
    animation: floating 20s infinite ease-in-out;
  }

  /* Đặt vị trí và kích thước ngẫu nhiên cho các logo */
  .logo-bubble:nth-child(1) { top: 10%; left: 15%; transform: scale(0.9); }
  .logo-bubble:nth-child(2) { top: 50%; left: 30%; transform: scale(1.3); }
  .logo-bubble:nth-child(3) { top: 30%; left: 70%; transform: scale(1.1); }
  .logo-bubble:nth-child(4) { top: 80%; left: 20%; transform: scale(1); }
  .logo-bubble:nth-child(5) { top: 60%; left: 80%; transform: scale(1.2); }

  /* Hiệu ứng chuyển động cho logo */
  @keyframes floating {
    0% { transform: translateY(0) scale(1); opacity: 0.15; }
    50% { transform: translateY(-20px) scale(1.05); opacity: 0.2; }
    100% { transform: translateY(0) scale(1); opacity: 0.15; }
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
    background: linear-gradient(135deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.8));
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

	.forgot-password-container {
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
  
	input[type="email"] {
	  width: 100%;
	  padding: 0.8rem;
	  margin-bottom: 0.5rem;
	  border: 1px solid #ddd;
	  border-radius: 8px;
	  font-size: 1rem;
	  background: #f9f9f9;
	  transition: all 0.3s ease;
	}
  
	input[type="email"]:focus {
	  outline: none;
	  border-color: #74ebd5;
	  background: #ffffff;
	  box-shadow: 0px 0px 8px rgba(116, 235, 213, 0.4);
	  transform: scale(1.02);
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
	  margin-bottom: 1rem;
	}
  
	.success-message {
	  color: green;
	  font-size: 0.9rem;
	  margin-top: -0.5rem;
	  margin-bottom: 1rem;
	}
  
	.additional-actions {
	  display: flex;
	  justify-content: center;
	  margin-top: 1rem;
	}
  
	.back-to-login-button {
	  background: none;
	  border: none;
	  color: #74ebd5;
	  font-size: 0.9rem;
	  cursor: pointer;
	  transition: color 0.3s ease;
	  font-weight: bold;
	}
  
	.back-to-login-button:hover {
	  color: #acb6e5;
	  text-decoration: underline;
	}
  </style>
  