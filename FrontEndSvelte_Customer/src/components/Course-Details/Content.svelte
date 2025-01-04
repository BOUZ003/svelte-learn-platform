<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  interface Video {
    ID: string;
    TenVideo: string;
    MoTaVideo: string;
    LinkVideo: string;
    LuotXem: number;
    NgayTao: string;
    NgayCapNhat: string | null;
    TrangThai: "HoatDong" | "BiKhoa";
    ThuTu: number;
    channelName?: string;
    subscribers?: number;
  }

  let videoData: Video = {} as Video;
  let relatedVideos: Video[] = [];
  let courseData: any = {}; // Course details (to be fetched)

  const getVideoData = async (videoId: string, courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/videokhoahoc/${videoId}/${courseId}`
      );
      const data = await response.json();

      if (response.ok) {
        videoData = data.video; // Video đã chọn
        relatedVideos = data.otherVideos; // Các video còn lại
      } else {
        console.error("Không thể tải video và các video liên quan");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const getCourseData = async (courseId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/khoahoc/get-by-id/${courseId}`
      );
      const data = await response.json();

      if (response.ok) {
        courseData = data; // Course details
      } else {
        console.error("Không thể tải thông tin khóa học");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API khóa học:", error);
    }
  };

  const handleVideoClick = (videoId: string, courseId: string) => {
    getVideoData(videoId, courseId);
  };

  onMount(async () => {
    const KhoaHocId = $page.params.id; 
    await getVideoData("1", KhoaHocId); 
    await getCourseData(KhoaHocId); 
  });

  const goBack = () => {
    window.history.back(); 
  };
</script>

<div class="youtube-layout">
  <div class="header">
    <a href="/">
      <img src="../../../src/image/DevUTEHY.jpg" class="logo" alt="Logo" />
    </a>
    <!-- <input type="text" placeholder="Tìm kiếm" class="search-bar" /> -->
    <h3>{courseData.TenKhoaHoc}</h3>
    <div>
        <button class="create-button" style="background-color: blue;">Check the exam schedul</button>
        <button class="create-button" style="background-color: green;">Practice</button>
        <button class="create-button" on:click={goBack}>Go Back</button>
    </div>
  </div>

  <div class="video-section">
    <div class="main-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoData.LinkVideo}`}
        width="560"
        height="315"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
      <h1>{videoData.TenVideo}</h1>
      <div class="channel-info">
        <img src="channel-avatar.png" alt="Avatar" class="avatar" />
        <div>
          <h6 style="text-decoration: underline;">Vũ Văn Trường</h6>
          <p>{videoData.LuotXem} views</p>
        </div>
        <button class="subscribe-button">Theo dõi</button>
      </div>
    </div>

    <div class="related-videos">
      <h2>Related Videos</h2>
      {#each relatedVideos as video (video.ID)}
        <div class="video-item">
          <iframe
            src={`https://www.youtube.com/embed/${video.LinkVideo}`}
            title={`Video: ${video.TenVideo}`}
            frameborder="0"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>

          <div class="video-info">
            <h4 on:click={() => handleVideoClick(video.ID, $page.params.id)}>
              {video.TenVideo}
            </h4>
            <p>{video.LuotXem} views</p>
          </div>
        </div>
      {/each}

      <div class="load-more">
        <button class="load-more-button">Complete</button>
      </div>
    </div>
  </div>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .logo {
    width: 80px;
    height: auto;
  }

  .search-bar {
    flex: 1;
    margin: 0 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 20px;
    outline: none;
    transition: border-color 0.3s ease;
  }

  .search-bar:focus {
    border-color: #007bff;
  }

  .create-button {
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .create-button:hover {
    background-color: #cc0000;
  }

  /* Video Section */
  .video-section {
    display: flex;
    padding: 20px;
    gap: 20px;
  }

  .main-video {
    flex: 3;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .main-video iframe {
    width: 100%;
    height: 380px;
    border-radius: 10px;
    transition: transform 0.3s ease;
  }

  .main-video iframe:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .main-video h1 {
    font-size: 20px;
    margin-top: 10px;
    color: #444;
  }

  .channel-info {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .subscribe-button {
    background-color: #ff0000;
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    margin-left: auto;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .subscribe-button:hover {
    background-color: #cc0000;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
  }

  /* Related Videos */
  .related-videos {
    flex: 1;
    background-color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    max-height: 550px;
    overflow-y: auto;
  }

  .related-videos h2 {
    font-size: 18px;
    margin-bottom: 15px;
    color: #444;
  }

  .video-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .video-item iframe {
    width: 100%;
    height: 120px;
    border-radius: 10px;
    margin-bottom: 5px;
  }

  .video-info h4 {
    font-size: 14px;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }

  .video-info p {
    font-size: 12px;
    color: #666;
  }

  .video-item:hover h4 {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }

  .load-more {
    text-align: center;
    margin-top: 20px;
  }

  .load-more-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .load-more-button:hover {
    background-color: #0056b3;
  }
</style>
