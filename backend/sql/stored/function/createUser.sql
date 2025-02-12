DROP PROCEDURE createUser;
DELIMITER //

CREATE PROCEDURE createUser(
  IN p_name VARCHAR(255),
  IN p_email VARCHAR(255),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE p_id INT;
  DECLARE l_action VARCHAR(255) DEFAULT 'createUser';

  -- エラーハンドラー（エラー時にロールバックして例外をスロー）
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Error inserting user or log';
  END;

  -- トランザクション開始
  START TRANSACTION;

  -- ユーザー作成
  INSERT INTO users (name, email, password, created_at, updated_at)
  VALUES (p_name, p_email, SHA2(p_password, 256), NOW(), NOW());

  -- 直前のID取得
  SET p_id = LAST_INSERT_ID();

  -- ログ作成
  INSERT INTO logs (user_id, action, created_at)
  VALUES (p_id, l_action, NOW());

  -- すべて成功したらコミット
  COMMIT;
END //

DELIMITER ;
