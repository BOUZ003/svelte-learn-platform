<script lang="ts">

</script>

<div class="comment-section">
    <h2>Bình luận</h2>
    <!-- Comment Input -->
    <div class="comment-input">
      <img src="user-avatar.png" alt="User Avatar" class="comment-avatar">
      <input type="text" id="commentBox" placeholder="Viết bình luận..." />
      <button id="submitComment">Đăng</button>
    </div>
    <!-- Comment List -->
    <div class="comment-list" id="commentList">
      <!-- Bình luận sẽ được thêm vào đây -->
    </div>
    <div class="comment-item">
      <img src="pike-avatar.png" alt="Avatar">
      <div class="comment-content">
        <h4>@pikechannel</h4>
        <p>Bộ hẹn giờ yêu thích của tôi: <a href="https://mineetimer.com/ja?ref=mfav97e4js" target="_blank">minee</a></p>
        <span>1 năm trước</span>
      </div>
    </div>
    
    <div class="comment-item">
      <img src="sakura-avatar.png" alt="Avatar">
      <div class="comment-content">
        <h4>@SakuraSerenity110</h4>
        <p>Âm thanh này thật tuyệt vời. Tôi cầu chúc cho những ai đang đọc bình luận này đạt được thành công lớn, sức khỏe, tình yêu và hạnh phúc!</p>
        <span>9 tháng trước</span>
      </div>
    </div>
    
    <div class="comment-item">
      <img src="euphoria-avatar.png" alt="Avatar">
      <div class="comment-content">
        <h4>@euphoriavibes8536</h4>
        <p>Gửi đến người đang đọc bình luận này, chúc bạn may mắn! Đừng căng thẳng, mọi thứ rồi sẽ ổn thôi. Dù bạn đang đối mặt với khó khăn gì, bạn sẽ vượt qua được! Bạn mạnh mẽ và dũng cảm.</p>
        <span>1 năm trước</span>
      </div>
    </div>
    
</div>

<style>
    .comment-section {
        border-radius: 10px solid;
        margin-left: 20px;
    width: 880px;
    height: auto;
    background-color: #ffffff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .comment-section h2 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
  }

  .comment-input {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  #commentBox {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    margin-right: 10px;
    font-size: 14px;
  }

  #commentBox:focus {
    border-color: #007bff;
  }

  #submitComment {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #submitComment:hover {
    background-color: #0056b3;
  }

  .comment-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .comment-item {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .comment-item img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .comment-content {
    flex: 1;
  }

  .comment-content h4 {
    font-size: 14px;
    margin-bottom: 5px;
    color: #007bff;
  }

  .comment-content p {
    font-size: 14px;
    color: #333;
  }

  .comment-content span {
    font-size: 12px;
    color: #666;
  }
</style>