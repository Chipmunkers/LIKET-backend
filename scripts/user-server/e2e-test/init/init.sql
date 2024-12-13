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

-- location
INSERT INTO location_tb
(address, detail_address, region_1_depth, region_2_depth, h_code, b_code, position_x, position_y, sido_code, sgg_code, leg_code, ri_code)
VALUES
    ( -- 다비드 자맹
        '서울 영등포구 여의도동 22', -- address
        '더현대 서울 6층', -- detail_address
        '서울', -- region_1_depth
        '영등포구', -- region_2_depth
        '1156054000', -- h_code
        '1156011000', -- b_code
        126.928299685623, -- position_x
        37.5260425418848, -- position_y
        '11',
        '560',
        '540',
        '00'
    ),
    ( -- 빵빵이
        '서울 성동구 성수동2가 302-11', -- address
        '빵빵이', -- detail_address
        '서울', -- region_1_depth
        '성동구', -- region_2_depth
        '1120011500', -- h_code
        '1120069000', -- b_code
        127.052478070362, -- position_x
        37.5440420266277, -- position_y
        '11',
        '200',
        '115',
        '00'
    ),
    ( -- 모네 인사이드
        '서울 성동구 성수동2가 302-11', -- address
        '그라운드시소 명동', -- detail_address
        '서울', -- region_1_depth
        '성동구', -- region_2_depth
        '1120011500', -- h_code
        '1120069000', -- b_code
        127.052478070362, -- position_x
        37.5440420266277, -- position_y
        '11',
        '200',
        '115',
        '00'
    ),
    ( -- 디올
        '서울 중구 남대문로2가 130', -- address
        '디올', -- detail_address
        '서울', -- region_1_depth
        '중구', -- region_2_depth
        '1114052000', -- h_code
        '1114011500', -- b_code
        126.981925482483, -- position_x
        37.5641009478468, -- position_y
        '11',
        '140',
        '520',
        '00'
    );

-- Culture Content
INSERT INTO culture_content_tb
(
    genre_idx,
    user_idx,
    location_idx,
    age_idx,
    title,
    description,
    website_link,
    start_date,
    end_date,
    open_time,
    is_fee,
    is_reservation,
    is_pet,
    is_parking,
    accepted_at,
    deleted_at
)
VALUES
    ( -- 1 다비드자맹
        2, -- genre_idx
        1, -- user_idx
        1, -- location_idx
        1, -- age_idx
        '다비드자맹 : 프로방스에서 온 댄디보이', -- title
        '다비드 자맹 전시는 작가 인생에 최대 규모로 진행된 전시입니다. 미공개 신작 100점을 포함한 아크릴 원화 130점이 전시중입니다.\n다비드자맹이 서울을 방문하고 프로방스로 돌아가 서울을 그리워하는 마음으로 제작한 작품인 [서울]도 추가로 전시하고 있습니다.', -- description
        'https://google.com', -- web
        '2023-02-04', -- start_date
        '2023-04-27', -- end_date
        '평일 10:30-20:00 / 주말 10:30-20:30',
        true, -- is_fee
        false, -- is_reservation
        false, -- is_pet
        true, -- is_parking
        NOW(), -- accepted_at
        null
    ),
    ( -- 2 빵빵이 팝업스토어
        1, -- genre_idx
        1, -- user_idx
        2, -- location_idx
        4, -- age_idx
        '더 현대 서울 빵빵이 팝업스토어', -- title
        '첫 팝업 때보다 더 크고 더 다양하고 더 귀여운 굿즈들이 가득 준비되어 있습니다. 크리스마스 팝업에서만 구매할 수 있는 한정 굿즈도 놓치지 마세요~!', -- description
        'https://archivep.kr/category/%EB%B9%B5%EB%B9%B5%EC%9D%B4/60/', -- web
        '2024-04-04', -- start_date
        '2024-06-27', -- end_date
        '평일 10:30-18:00 / 주말 10:30-20:30',
        false, -- is_fee
        false, -- is_reservation
        false, -- is_pet
        false, -- is_parking
        null, -- accepted_at
        null
    ),
    ( -- 3 모네 인사이드
        2, -- genre_idx
        1, -- user_idx
        3, -- location_idx
        5, -- age_idx
        '모네 인사이드', -- title
        '빛의 화가 클로드 모네가 남긴 소중한 명작들을 현대적 감각으로 재해석해 음악과 함께 감상하는 미디어아트 전시입니다.\n르아브르의 캐리커처 화가로 시작해 지베르니의 수련 연작 대서사시에 이르기까지.\n고단한 일상의 순간에서도 한 줌의 빛을 찾아낸 클로드 모네의 찬란하고도 열정적인 여정이 펼쳐집니다.', -- description
        'https://groundseesaw.co.kr/product/%EB%AA%A8%EB%84%A4-%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C/38/', -- web
        '2024-08-01', -- start_date
        '2024-09-01', -- end_date
        '오전 11시~오후8시(매표소 마감 7시)',
        true, -- is_fee
        true, -- is_reservation
        false, -- is_pet
        true, -- is_parking
        NOW(), -- accepted_at
        NOW()
    );
