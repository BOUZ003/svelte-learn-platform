import db from '../config/db.js';

//true
export const getVideoAndOthersById = (req, res) => {
    const { videoId, courseId } = req.params; 

    const sqlUpdateViews = 'UPDATE videokhoahoc SET LuotXem = LuotXem + 1 WHERE ID = ?'; 
    const sql = 'CALL get_video_and_others_By_ID_plus(?, ?)'; 

    const params = [parseInt(videoId, 10), parseInt(courseId, 10)]; 

    db.query(sqlUpdateViews, [parseInt(videoId, 10)], (err, results) => {
        if (err) {
            console.error('Lỗi khi cập nhật số lượt xem:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật số lượt xem' });
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Lỗi khi gọi Stored Procedure:', err);
                return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
            }

            const videoData = results[0] || [];
            const otherVideos = results[1] || []; 
            const userData = results[2] || [];

            if (videoData.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy video này trong khóa học' });
            }

            return res.json({
                user: userData[0] || null,
                video: videoData[0], 
                otherVideos: otherVideos
            });
        });
    });
};
