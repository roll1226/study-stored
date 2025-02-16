DROP PROCEDURE IF EXISTS updateTask;

DELIMITER //

CREATE PROCEDURE updateTask(
  IN p_id INT,
  IN p_user_id INT,
  IN p_title VARCHAR(255),
  IN p_description TEXT
)
BEGIN
  DECLARE l_action VARCHAR(255) DEFAULT 'updateTask';

  -- タスク更新
  UPDATE tasks
  SET title = p_title, description = p_description, updated_at = NOW()
  WHERE id = p_id AND user_id = p_user_id;

  -- ログ作成
  INSERT INTO logs (user_id, action, created_at)
  VALUES (p_user_id, l_action, NOW());
END //
