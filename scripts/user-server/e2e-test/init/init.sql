CREATE USER liket_mobile_test_admin WITH PASSWORD '1234';

CREATE DATABASE liket_mobile_test OWNER liket_mobile_test_admin;

\c liket_mobile_test liket_mobile_test_admin

\i '/rdb/ddl.sql'

\i '/rdb/default-seed.sql'

-- User
INSERT INTO user_tb
(is_admin, email, pw, nickname, gender, birth, sns_id, provider, profile_img_path, blocked_at, deleted_at)
VALUES
    ( -- 일반 계정 1
        false, -- is_admin
        'user1@gmail.com', -- email
        '$2b$08$DyBlccSuF7TION2j0la0ZO/vLWEvYXz0Eaf7q0SY9yUjz6zijzHge', --pw
        'user1', -- nickname
        1, -- gedner
        1997, -- birth
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
    ),
    ( -- 정지 계정
        false, -- is_admin
        'user3@gmail.com', -- email
        '$2b$08$DyBlccSuF7TION2j0la0ZO/vLWEvYXz0Eaf7q0SY9yUjz6zijzHge', --pw
        'user3', -- nickname
        2, -- gedner
        2001, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        NOW(), -- blocked_at
        null -- deleted_at
    ),
    ( -- 카카오 계정
        false, -- is_admin
        'kakao1@daum.net', -- email
        'pw', --pw
        'kakao1', -- nickname
        2, -- gedner
        2001, -- birth
        '12312412', -- sns_id 변경 시 소셜 로그인 테스트 코드 확인 필요
        'kakao', -- provider
        null, -- profile_img_path
        NOW(), -- blocked_at
        null -- deleted_at
    );
