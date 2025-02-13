DROP PROCEDURE IF EXISTS createTask;

DELIMITER //

CREATE PROCEDURE createTask(
  IN p_user_id INT,
  IN p_title VARCHAR(255),
  IN p_description TEXT
)
BEGIN
  DECLARE l_action VARCHAR(255) DEFAULT 'createTask';
  DECLARE p_id INT;

  -- タスク作成
  INSERT INTO tasks (user_id, title, description, status, created_at, updated_at)
  VALUES (p_user_id, p_title, p_description, 1, NOW(), NOW());

  -- 直前のID取得
  SET p_id = LAST_INSERT_ID();

  -- ログ作成
  INSERT INTO logs (user_id, action, created_at)
  VALUES (p_user_id, l_action, NOW());
END //
