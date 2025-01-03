<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from "$app/navigation";

  interface CartItem {
    CartID: number;
    Hinhanh: string;
    Ten: string;
    Tien: number;
    SoLuong: number;
  }

  // Create a writable store to hold the cart items
  const cartItems = writable<CartItem[]>([]);

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
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
});


const updateQuantity = async (index: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Không giảm số lượng dưới 1

    const cartItem = $cartItems[index];
    const cartid = cartItem.CartID;
    const url = newQuantity > cartItem.SoLuong
      ? `http://localhost:3000/api/cart/increase/${cartid}`
      : `http://localhost:3000/api/cart/decrease/${cartid}`;

    try {
      // Gọi API cập nhật số lượng
      const response = await fetch(url, { method: 'PUT' });
      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật số lượng');
      }

      // Cập nhật lại số lượng trong store sau khi thành công
      cartItem.SoLuong = newQuantity;
      $cartItems = [...$cartItems]; // Cập nhật lại store để giao diện re-render
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  // Remove a cart item
  const removeItem = async (cartid: number) => {
    try {
      // Gọi API xóa sản phẩm với CartID
      const response = await fetch(`http://localhost:3000/api/cart/delete/${cartid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Lỗi khi xóa sản phẩm');
      }

      // Cập nhật giỏ hàng sau khi xóa sản phẩm
      $cartItems = $cartItems.filter(item => item.CartID !== cartid);
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  // Calculate the total price for a cart item
  const calculateTotal = (item: CartItem) => {
    return (item.Tien * item.SoLuong).toFixed(2);
  };

  function formatNumberWithVND(number: number): string {
  return new Intl.NumberFormat('de-DE').format(number) + ' đ';
}

</script>

<div class="Content-Cart">
    <a href="/cart" style="font-family: Arial, Helvetica, sans-serif; font-size: 30px; margin-top: 50px; float: left; margin-left: 20px;color:black;text-decoration: none;">Giỏ hàng của bạn</a>
    
    <div style="float: right; margin-right: 20px; text-align: right;">
        <button on:click={() => goto('/payment')} style="background-color: #2cc54f; color: white; font-family: Arial, Helvetica, sans-serif; font-size: 18px; padding: 10px 14px; border: none; cursor: pointer;border-radius: 5px; margin-top: 50px;margin-right: 20px;">
            <img src="../../../src/image/course/cart-shopping-solid (1).svg" alt="cart" style="width: 20px; margin-right: 10px;">
            Thanh toán
        </button>
        <!-- <p style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; margin: 0;margin-right: 180px;margin-top: -56px;">Thành:</p> -->
        <!-- <p id="subtotal" style="font-family: Arial, Helvetica, sans-serif; font-size: 28px; margin: 0;margin-right: 180px;margin-top: 4px;">$0.00</p> -->
    </div>
</div>
<div id="cart-items" style="width: 100%; height: auto;">
    <div id="cart-items-container">
      {#each $cartItems as item, index (item.CartID)}
        <div class="cart-item">
          <img src={item.Hinhanh} alt={item.Ten} />
          <div class="cart-item-info">
            <div class="cart-item-title">{item.Ten}</div>
            <div class="cart-item-price">{formatNumberWithVND(item.Tien)}</div>
          </div>
          <div class="quantity">
            <button on:click={() => updateQuantity(index, item.SoLuong - 1)}>-</button>
            <span style="padding:15px;">{item.SoLuong}</span>
            <button on:click={() => updateQuantity(index, item.SoLuong + 1)}>+</button>
          </div>
          <div class="cart-item-total">{formatNumberWithVND(calculateTotal(item))}</div>
          <div class="cart-item-remove" on:click={() => removeItem(item.CartID)}>&times;</div>
        </div>
      {/each}
    </div>
  </div>

<hr>
<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center;">
    <a href="/course" style="text-decoration: none; color: #2cc54f; font-size: 20px; font-weight: 600;margin-top: -150px;">Quay trở lại giỏ hàng</a>
</div>

<style>
    .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .cart-item img {
    width: 100px;
    margin-left: 30px;
  }
  .cart-item-info {
    flex-grow: 1;
    margin-left: 20px;
  }
  .cart-item-title {
    font-size: 18px;
    font-weight: bold;
  }
  .cart-item-price {
    font-size: 16px;
  }
  .quantity {
    display: flex;
    align-items: center;
  }
  .cart-item-total {
    margin-left: 20px;
  }
  .cart-item-remove {
    cursor: pointer;
    font-size: 24px;
    margin-left: 10px;
  }
    .Content-Cart{
    width: 100%;
    height: 140px;
    float: left;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.cart-item-info {
    flex-grow: 1;
    padding-left: 20px;
}
.cart-item-title {
    font-size: 1.2em;
    font-weight: bold;
}
.cart-item-price {
    margin-left: 100px;
    font-size: 1.2em;
    color: #333;
    font-weight: bold;
}
.quantity {
    display: flex;
    align-items: center;
}
.quantity button {
    background-color: #eee;
    border: 1px solid #ccc;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 1.2em;
    border-radius: 5px 0 0 5px;
}
.quantity input {
    width: 50px;
    text-align: center;
    border: 1px solid #ccc;
    font-size: 1.2em;
    padding: 10px 0;
    border-left: none;
    border-right: none;
}
.quantity button:last-child {
    border-radius: 0 5px 5px 0;
}
.cart-item-remove {
    border-radius: 10px;
    margin-left: 100px;
    margin-right: 30px;
    cursor: pointer;
    color: gray;
    font-size: 2em;
}
.cart-item-remove:hover {
    color: red;
}
</style>