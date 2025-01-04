<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from "$app/navigation";

  // Khởi tạo store với giá trị mặc định
  let paymentMethod = writable('credit-card');
  let cardNumber = writable('');
  let cardExpiry = writable('');
  let cardCVV = writable('');
  let email = writable('');
  let phone = writable('');
  let courseName = 'Khóa học lập trình Svelte';
  let coursePrice = 500000;
  let quantity = 'x 1';
  let TongTien = 0;
  // Hàm xử lý thanh toán
  const handlePayment = () => {
  // Kiểm tra thông tin thẻ và các thông tin cần thiết
  if (!$cardNumber || !$cardExpiry || !$cardCVV || !$email || !$phone) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  // Hiển thị hộp thoại xác nhận trước khi thanh toán
  const isConfirmed = window.confirm("Bạn chắc chắn muốn thanh toán không?");
  
  // Nếu người dùng xác nhận thanh toán
  if (isConfirmed) {
    alert('Thanh toán thành công!');

    let userId = localStorage.getItem('userId');
    const userIdNumber = Number(userId);


    fetch('http://localhost:3000/api/donhang/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      NguoiDungID: userIdNumber, 

      Email: $email,
      SoDienThoai: $phone,

      TongTien: $totalPrice,      
      PhuongThucThanhToan: 'Thẻ tín dụng',
      TrangThaiThanhToan:'Đã thanh toán',
      DataKhoaHoc:$cartItems
    }),
  })
  .then(response => response.json())
  .then((data: { message?: string, error?: string }) => {
    if (data.message) {
      alert(data.message); 
    } else {
      alert('An error occurred: ' + data.error); 
    }
  })
  .catch((error: any) => {
    console.error('Error:', error);
    alert('Error adding product to cart');
  });




    goto('/course'); 
  } else {
    alert('Thanh toán đã bị hủy!');
    // Nếu muốn, có thể thực hiện các hành động khác khi người dùng hủy
  }
};



  interface CartItem {
    CartID: number;
    Hinhanh: string;
    Ten: string;
    Tien: number;
    SoLuong: number;
  }

  interface Payment{
    TongTien: string;
  }

  // Create a writable store to hold the cart items
  const cartItems = writable<CartItem[]>([]);
  const totalPrice = writable<Payment[]>([]);


  // Fetch the cart data when the component mounts
  onMount(async () => {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    console.error('User ID is not found in localStorage');
    return; // Exit if no userId is available
  }

  try {
    // Use the userId from localStorage in the API call URL
    const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
    const data = await response.json();

    // Set the cart items to the store
    cartItems.set(data.cartItems || []);
 
    console.log($cartItems);
    

    const Total = await fetch(`http://localhost:3000/api/cart/total/${userId}`);
    const dataTotal = await Total.json();

    totalPrice.set(dataTotal.totalPrice || []);


  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
});

const calculateTotal = (item: CartItem) => {
    return (item.Tien * item.SoLuong).toFixed(2);
    
  };

  function formatNumberWithVND(number: number): string {
    return new Intl.NumberFormat('de-DE').format(number) + ' đ';
}



</script>


<div class="payment-container">
  <h1>Payment</h1>

  <!-- Thông tin cá nhân -->
  <form class="payment-form" on:submit|preventDefault={handlePayment}>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" bind:value={$email} id="email" placeholder="Enter Email" required />
    </div>

    <div class="form-group">
      <label for="phone">Phone:</label>
      <input type="text" bind:value={$phone} id="phone" placeholder="Enter Phone Number" required />
    </div>

    <!-- Thông tin thanh toán -->
    <div class="form-group">
      <label for="cardNumber">Credit Card Number:</label>
      <input type="text" bind:value={$cardNumber} id="cardNumber" placeholder="Enter Card Number" required />
    </div>

    <div class="form-group">
      <label for="cardExpiry">Expiration Date:</label>
      <input type="text" bind:value={$cardExpiry} id="cardExpiry" placeholder="MM/YY" required />
    </div>

    <div class="form-group">
      <label for="cardCVV">CVV:</label>
      <input type="text" bind:value={$cardCVV} id="cardCVV" placeholder="CVV" required />
    </div>

    <!-- Thông tin khóa học -->
    <div class="course-summary">
      {#each $cartItems as item, index (item.CartID)}
        <div class="summary-item">
          <span class="course-name">{item.Ten} x {item.SoLuong}</span>
          <span class="course-price">{formatNumberWithVND(calculateTotal(item))}</span>
        </div>
      {/each}
      <div class="summary-item">
        <span  class="course-name" style="color: blue;">- Total Amount:</span> <!-- Hiển thị tổng tiền -->
        <span class="course-price" style="color: blue;">{formatNumberWithVND($totalPrice)}</span>
      </div>
    </div>
    

    <!-- Điều khoản và chính sách -->
    <div class="terms-container">
      <input type="checkbox" id="terms" required />
      <label for="terms">I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>.</label>
    </div>

    <!-- Nút thanh toán -->
    <button type="submit" class="payment-btn">Complete Payment</button>
  </form>

  <div class="footer">
    <p>We protect your information with the highest security standards.</p>
  </div>
</div>

<style>
  /* Container của form thanh toán */
  .payment-container {
    max-width: 600px;
    margin: 50px auto;
    padding: 30px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }

  /* Tiêu đề form */
  h1 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 28px;
    color: #333;
    font-weight: 600;
  }

  /* Nhóm các trường input */
  .form-group {
    margin-bottom: 20px;
  }

  /* Nhãn cho các input */
  .form-group label {
    display: block;
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    font-weight: 500;
  }

  /* Các input và select */
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-sizing: border-box;
    transition: border 0.3s ease-in-out;
  }

  /* Hiệu ứng border khi focus vào input */
  .form-group input:focus,
  .form-group select:focus {
    border-color: #007bff;
    outline: none;
  }

  /* Phần tóm tắt khóa học */
  .course-summary {
    margin-top: 30px;
    padding: 15px;
    background: #f1f1f1;
    border-radius: 6px;
    margin-bottom: 25px;
  }

  /* Mỗi mục trong tóm tắt */
  .course-summary .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  /* Giá tiền trong tóm tắt */
  .course-summary .summary-item .price {
    color: #4CAF50;
    font-weight: bold;
    font-size: 18px;
  }

  /* Phần điều khoản */
  .terms-container {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }

  .terms-container input {
    margin-right: 10px;
  }

  .terms-container label {
    font-size: 14px;
    color: #555;
  }

  /* Nút thanh toán */
  .payment-btn {
    width: 100%;
    padding: 14px;
    background-color: #4CAF50;
    color: #fff;
    font-size: 18px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
  }

  /* Hiệu ứng khi hover vào nút thanh toán */
  .payment-btn:hover {
    background-color: #45a049;
  }

  /* Thông báo lỗi hoặc thành công */
  .alert {
    padding: 10px;
    margin-bottom: 20px;
    background-color: #f44336;
    color: white;
    border-radius: 5px;
    font-size: 14px;
  }
</style>