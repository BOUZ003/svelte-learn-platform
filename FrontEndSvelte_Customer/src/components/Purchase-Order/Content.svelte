<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  let purchaseOrders = [];
  let selectedOrder = null; // Lưu thông tin đơn hàng đang chọn
  let showModal = false; // Trạng thái hiển thị modal

  onMount(async () => {
    const userId = $page.params.id;
    const response = await fetch(`http://localhost:3000/api/donhang/${userId}`);

    if (response.ok) {
      const data = await response.json();
      purchaseOrders = data.map((order: any) => ({
        orderNumber: order.ID,
        orderDate: new Date(order.ThoiGianTao).toLocaleString(),
        customerName: order.Email,
        totalAmount: order.TongTien,
        paymentMethod: order.PhuongThucThanhToan,
        paymentStatus: order.TrangThaiThanhToan,
      }));
    } else {
      console.error("Lỗi khi lấy dữ liệu đơn hàng");
    }
  });

  function formatCurrency(amount: number): string {
    if (isNaN(amount)) {
      return "";
    }

    const roundedAmount = Math.floor(amount);
    const formattedAmount = roundedAmount.toLocaleString("vi-VN");
    return `${formattedAmount} đ`;
  }

  function openModal(order: any) {
    selectedOrder = order;
    showModal = true; // Mở modal
  }

  function closeModal() {
    showModal = false; // Đóng modal
    selectedOrder = null; // Xóa thông tin đơn hàng đã chọn
  }
</script>

<div class="purchase-order">
  <table class="item-table">
    <thead>
      <tr>
        <th style="text-align: center;">Order Date</th>
        <th style="text-align: center;">Total Amount</th>
        <th style="text-align: center;">Payment Method</th>
        <th style="text-align: center;">Payment Status</th>
        <th style="text-align: center;">Action</th>
      </tr>
    </thead>
    <tbody>
      {#if purchaseOrders.length === 0}
        <tr>
          <td colspan="5" class="no-data">No data available</td>
        </tr>
      {:else}
        {#each purchaseOrders as order (order.orderNumber)}
          <tr>
            <td style="text-align: center;">{order.orderDate}</td>
            <td style="text-align: center;"
              >{formatCurrency(order.totalAmount)}</td
            >
            <td style="text-align: center;">{order.paymentMethod}</td>
            <td style="text-align: center;">{order.paymentStatus}</td>
            <td style="text-align: center;">
              <button on:click={() => openModal(order)}>View Details</button>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<!-- Modal Display -->
<div class="modal {showModal ? 'show' : ''}">
  <div class="modal-content">
    <div class="modal-header">Order Details</div>
    <div class="modal-body">
      {#if selectedOrder}
        <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
        <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
        <p><strong>Order Date:</strong> {selectedOrder.orderDate}</p>
        <p>
          <strong>Total Amount:</strong>
          {formatCurrency(selectedOrder.totalAmount)}
        </p>
        <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
      {/if}
    </div>
    <button class="close-btn" on:click={closeModal}>Close</button>
  </div>
</div>

<style>
  .purchase-order {
    margin-top: 60px;
    font-family: "Arial", sans-serif;
    padding: 30px;
    max-width: 1000px;
    width: 100%;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .item-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .item-table th,
  .item-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }

  .item-table th {
    background-color: #f7f7f7;
    color: #555555;
    font-weight: bold;
  }

  .item-table td {
    font-size: 13px;
    color: #333333;
  }

  .item-table tr:hover {
    background-color: #f4f4f4;
  }

  .item-table td input {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    width: 100%;
    box-sizing: border-box;
  }

  .purchase-order input[type="number"] {
    -moz-appearance: textfield;
  }

  .purchase-order input[type="number"]::-webkit-outer-spin-button,
  .purchase-order input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  button {
    padding: 10px 20px;
    font-size: 13px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Modal Style */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .modal.show {
    visibility: visible;
    opacity: 1;
  }

  .modal-content {
    background-color: #fff;
    padding: 30px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
  }

  .modal-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .modal-body {
    margin-bottom: 20px;
  }

  .close-btn {
    background-color: #f44336;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
  }

  .close-btn:hover {
    background-color: #d32f2f;
  }

  button:hover {
    background-color: #0056b3; /* Màu nền khi hover */
    transform: translateY(-2px); /* Di chuyển nút lên khi hover */
  }

  button:focus {
    outline: none; /* Bỏ đường viền khi nút được chọn */
  }

  button:active {
    background-color: #003d7a; /* Màu nền khi nhấn */
    transform: translateY(1px); /* Giảm hiệu ứng di chuyển khi nhấn */
  }
</style>
