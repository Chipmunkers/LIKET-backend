CREATE USER liket_test_admin WITH PASSWORD '1234';

CREATE DATABASE liket OWNER liket_test_admin;

\c liket liket_test_admin

\i '/rdb/ddl.sql'

\i '/rdb/default-seed.sql'

-- User
INSERT INTO user_tb
(is_admin, email, pw, nickname, gender, birth, sns_id, provider, profile_img_path, blocked_at, deleted_at)
VALUES
    ( -- 관리자 계정
        true, -- is_admin
        'admin', -- email
        '$2b$08$DyBlccSuF7TION2j0la0ZO/vLWEvYXz0Eaf7q0SY9yUjz6zijzHge', --pw
        'admin', -- nickname
        null, -- gedner
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 1
        false, -- is_admin
        'user1@gmail.com', -- email
        '$2b$08$DyBlccSuF7TION2j0la0ZO/vLWEvYXz0Eaf7q0SY9yUjz6zijzHge', --pw
        'user1', -- nickname
        2, -- gedner
        2001, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 2
        false, -- is_admin
        'user2@gmail.com', -- email
        '$2b$08$DyBlccSuF7TION2j0la0ZO/vLWEvYXz0Eaf7q0SY9yUjz6zijzHge', --pw
        'user2', -- nickname
        2, -- gedner
        2001, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    );
