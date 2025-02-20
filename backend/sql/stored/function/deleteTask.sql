DROP PROCEDURE IF EXISTS deleteTask;
CREATE PROCEDURE deleteTask(
  IN p_id INT,
  IN p_user_id INT
)
BEGIN
  DECLARE l_action VARCHAR(255) DEFAULT 'deleteTask';

  -- タスク削除
  UPDATE tasks
  SET delete_flag = TRUE, updated_at = NOW()
  WHERE id = p_id AND user_id = p_user_id;

  -- ログ作成
  INSERT INTO logs (user_id, action, created_at)
  VALUES (p_user_id, l_action, NOW());
END //
DELIMITER ;
