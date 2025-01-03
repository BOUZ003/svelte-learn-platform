<script lang="ts">
	import { onMount } from 'svelte';
	
	let editor: any;
	let ClassicEditor;
	
	// Khởi tạo CKEditor
	onMount(async () => {
	  const module = await import('@ckeditor/ckeditor5-build-classic');
	  ClassicEditor = module.default;
	
	  const editorElement = document.querySelector('#editor');
	
	  if (editorElement) {
		ClassicEditor.create(editorElement as HTMLElement)
		  .then((newEditor) => {
			editor = newEditor;
		  })
		  .catch((error) => {
			console.error('Error initializing CKEditor:', error);
		  });
	  } else {
		console.error('Editor element not found');
	  }
	});
	
	// Lưu nội dung của editor
	function saveContent() {
	  if (editor) {
		const editorData = editor.getData();
		localStorage.setItem('editorContent', editorData);
		alert('Content saved!');
	  } else {
		console.warn('Editor is not initialized yet.');
	  }
	}
	
	// Reset nội dung của editor
	function resetContent() {
	  if (editor) {
		editor.setData('');
		alert('Content reset!');
	  } else {
		console.warn('Editor is not initialized yet.');
	  }
	}
	
	// Hàm chờ (sleep) để delay giữa các yêu cầu
	function sleep(ms: number) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
  
	// Hàm gửi yêu cầu với retry cơ chế
	async function fetchWithRetry(url: string, options: any, retries: number = 5, delay: number = 5000) {
	  let response;
	  for (let i = 0; i < retries; i++) {
		response = await fetch(url, options);
		
		if (response.status === 429) {
		  console.log(`Too many requests, retrying in ${delay / 1000} seconds...`);
		  const retryAfter = response.headers.get('Retry-After');
		  // Nếu OpenAI cung cấp thời gian Retry-After, sử dụng nó thay vì delay mặc định
		  const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;
		  await sleep(waitTime); // Đợi trước khi thử lại
		} else {
		  return response; // Nếu không phải lỗi 429, trả về phản hồi
		}
	  }
	  throw new Error("Exceeded maximum retries");
	}
  
  </script>
  
  
	
  <!-- CKEditor Container -->
  <div class="editor-container">
	<h2 class="editor-title">Write your content</h2>
	<div id="editor" class="editor"></div>
	
	<div class="editor-actions">
	  <button class="save-button" on:click={saveContent}>Save</button>
	  <button class="reset-button" on:click={resetContent}>Reset</button>
	</div>
  </div>
  
  <!-- Styling -->
  <style>
	body {
	  font-family: 'Roboto', sans-serif;
	  background-color: #f4f7fa;
	  margin: 0;
	  padding: 0;
	}
  
	.editor-container {
	  width: 100%;
	  max-width: 1000px;
	  margin: 40px auto;
	  background-color: white;
	  border-radius: 15px;
	  padding: 30px;
	  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  transition: all 0.3s ease;
	}
  
	.editor-title {
	  font-size: 26px;
	  color: #333;
	  margin-bottom: 20px;
	  text-align: center;
	}
  
	.editor {
	  /* width: 120%; */
	  width: 900px;
	  height: 900px;
	  background-color: #fafafa;
	  border-radius: 12px;
	  box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.05);
	}
  
	.ck-editor__editable {
	  font-size: 16px;
	  color: #333;
	  padding: 12px;
	  background-color: white;
	  border-radius: 10px;
	  transition: all 0.3s ease;
	}
  
	.ck-editor__editable:focus {
	  border-color: #007bff;
	  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
	}
  
	.editor-actions {
	  display: flex;
	  gap: 25px;
	  margin-top: 25px;
	  width: 100%;
	  justify-content: center;
	}
  
	.save-button, .reset-button {
	  padding: 12px 25px;
	  border: none;
	  border-radius: 8px;
	  font-size: 16px;
	  cursor: pointer;
	  transition: all 0.3s ease;
	  width: 120px;
	}
  
	.save-button {
	  background-color: #28a745;
	  color: white;
	}
  
	.save-button:hover {
	  background-color: #218838;
	}
  
	.reset-button {
	  background-color: #dc3545;
	  color: white;
	}
  
	.reset-button:hover {
	  background-color: #c82333;
	}
  
	@media (max-width: 768px) {
	  .editor-container {
		width: 90%;
		padding: 20px;
	  }
  
	  .editor {
		height: 350px;
	  }
  
	  .editor-actions {
		flex-direction: column;
	  }
  
	  .save-button, .reset-button {
		width: 100%;
		margin-bottom: 15px;
	  }
	}
  
	/* Kiểu cho nút Ask ChatGPT */
	.ai-button {
	  padding: 12px 25px;
	  border: none;
	  border-radius: 8px;
	  font-size: 16px;
	  cursor: pointer;
	  transition: all 0.3s ease;
	  background-color: #007bff;
	  color: white;
	  width: 120px;
	}
  
	.ai-button:hover {
	  background-color: #0056b3;
	}
  </style>
  