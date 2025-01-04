import db from '../config/db.js';

export const getPurchasedCoursesByStudent = (req, res) => {
    const { id } = req.params; 

    const sql = 'CALL get_purchased_courses_by_student(?)';
    const params = [parseInt(id, 10)];  

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Lỗi khi gọi Stored Procedure:', err);
            return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
        }

        const data = results[0] || []; 

        if (data.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy khóa học đã mua' });
        }

        return res.json(data); 
    });
};
