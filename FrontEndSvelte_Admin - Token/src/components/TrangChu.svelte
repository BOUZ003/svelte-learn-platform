<!-- src/components/CongNgheTable.svelte -->
<script lang="ts">
	import type { CongNghe } from '../types/congNghe';
	import styles from '../styles/TrangChu.module.css'; // Import CSS module
  
	export let data: CongNghe[];
  </script>
  
  <table class={styles.table}>
	<thead>
	  <tr>
		<th>ID</th>
		<th>Tên</th>
		<th>Tiêu Đề</th>
		<th>Mô Tả</th>
		<th>Loại Công Nghệ</th>
		<th>Phiên Bản</th>
		<th>Hiển Thị Trang Chủ</th>
		<th>Hiển Thị Hot</th>
		<th>Ngày Tạo</th>
		<th>Trạng Thái</th>
	  </tr>
	</thead>
	<tbody>
	  {#each data as item}
		<tr>
		  <td>{item.ID}</td>
		  <td>{item.Ten}</td>
		  <td>{item.TieuDe}</td>
		  <td>{item.MoTa}</td>
		  <td>{item.LoaiCongNgheID}</td>
		  <td>{item.PhienBan}</td>
		  <td>{item.HienThiTrangChu ? 'Có' : 'Không'}</td>
		  <td>{item.HienThiHot ? 'Có' : 'Không'}</td>
		  <td>{item.NgayTao}</td>
		  <td>{item.TrangThai ? 'Hoạt Động' : 'Không Hoạt Động'}</td>
		</tr>
	  {/each}
	</tbody>
  </table>
  