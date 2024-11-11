CREATE USER liket_mobile_test_admin WITH PASSWORD '1234';

CREATE DATABASE liket_mobile_test OWNER liket_mobile_test_admin;

\c liket_mobile_test liket_mobile_test_admin

CREATE TABLE email_cert_code_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  email      varchar                  NOT NULL,
  code       varchar                  NOT NULL,
  type       smallint                 NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE active_banner_tb
(
  idx          int                      NOT NULL,
  banner_order smallint                 NOT NULL,
  activated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE age_tb
(
  idx        int                      NOT NULL,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE answer_tb
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  inquiry_idx int                      NOT NULL,
  contents    varchar                  NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE banner_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  link       varchar                  NOT NULL,
  img_path   varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE content_img_tb
(
  idx                 int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  culture_content_idx int                      NOT NULL,
  img_path            varchar                  NOT NULL,
  created_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at          timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE content_like_tb
(
  content_idx int                      NOT NULL,
  user_idx    int                      NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (content_idx, user_idx)
);

CREATE TABLE culture_content_tb
(
  idx            int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  genre_idx      int                      NOT NULL,
  user_idx       int                      NOT NULL,
  location_idx   int                      NOT NULL,
  age_idx        int                      NOT NULL,
  title          varchar                  NOT NULL,
  description    varchar                 ,
  website_link   varchar                  NOT NULL,
  start_date     timestamp with time zone NOT NULL,
  end_date       timestamp with time zone NOT NULL,
  view_count     int                      NOT NULL DEFAULT 0,
  open_time      varchar                  NOT NULL,
  is_fee         boolean                  NOT NULL DEFAULT false,
  is_reservation boolean                  NOT NULL DEFAULT false,
  is_pet         boolean                  NOT NULL DEFAULT false,
  is_parking     boolean                  NOT NULL DEFAULT false,
  like_count     int                      NOT NULL DEFAULT 0,
  accepted_at    timestamp with time zone,
  created_at     timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at     timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at     timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX index_content_like_count ON culture_content_tb(like_count);
CREATE INDEX index_content_accepted_at ON culture_content_tb(accepted_at);
CREATE INDEX index_content_start_date ON culture_content_tb(start_date);
CREATE INDEX index_content_end_date ON culture_content_tb(end_date);

CREATE TABLE genre_tb
(
  idx        int                      NOT NULL,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE inquiry_img_tb
(
  idx         int                      GENERATED ALWAYS AS IDENTITY,
  inquiry_idx int                      NOT NULL,
  img_path    varchar                  NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE inquiry_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  type_idx   int                      NOT NULL,
  title      varchar(30)              NOT NULL,
  contents   varchar(200)             NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE inquiry_type_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE liket_tb
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx  int                      NOT NULL,
  user_idx    int                      NOT NULL,
  img_path    varchar                  NOT NULL,
  description varchar                 ,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at  timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE location_tb
(
  idx            int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  address        varchar NOT NULL,
  detail_address varchar NOT NULL,
  region_1_depth varchar NOT NULL,
  region_2_depth varchar NOT NULL,
  h_code         varchar NOT NULL,
  b_code         varchar NOT NULL,
  position_x     float8  NOT NULL,
  position_y     float8  NOT NULL,
  sido_code      char(2)  NOT NULL,
  sgg_code       char(3)  NOT NULL,
  leg_code       char(3)  NOT NULL,
  ri_code        char(2)  NOT NULL,
  PRIMARY KEY (idx)
);

CREATE INDEX index_sido_code ON location_tb(sido_code);
CREATE INDEX index_sgg_code ON location_tb(sgg_code);
CREATE INDEX index_leg_code ON location_tb(leg_code);

CREATE TABLE review_img_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx int                      NOT NULL,
  img_path   varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE review_like_tb
(
  review_idx int NOT NULL,
  user_idx  int NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (review_idx, user_idx)
);

CREATE TABLE review_tb
(
  idx                 int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  culture_content_idx int                      NOT NULL,
  user_idx            int                      NOT NULL,
  report_count        int                      NOT NULL DEFAULT 0,
  description         text                     NOT NULL,
  visit_time          timestamp with time zone NOT NULL,
  star_rating         smallint                 NOT NULL,
  like_count          int                      NOT NULL default 0,
  created_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at          timestamp with time zone,
  first_reported_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX review_like_count ON review_tb(like_count);
CREATE INDEX index_report_count ON review_tb(report_count);
CREATE INDEX index_first_reported_at ON review_tb(first_reported_at);

CREATE TABLE style_mapping_tb
(
  style_idx   int NOT NULL,
  content_idx int NOT NULL,
  PRIMARY KEY (style_idx, content_idx)
);

CREATE TABLE style_tb
(
  idx        int                      NOT NULL,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE tos_agree_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  tos_idx    int                      NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
  PRIMARY KEY (idx)
);


CREATE TABLE tos_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  title        varchar                  NOT NULL,
  contents     text                     NOT NULL,
  is_essential boolean                  NOT NULL,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE block_reason_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  reason     varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE delete_user_type_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE delete_user_reason_tb
(
  idx        int                      NOT NULL,
  type_idx   int                      NOT NULL,
  contents   varchar                  NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE user_tb
(
  idx              int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  is_admin         boolean                  NOT NULL DEFAULT false,
  email            varchar                  NOT NULL,
  pw               varchar                  NOT NULL,
  nickname         varchar                  NOT NULL,
  report_count     int                      NOT NULL DEFAULT 0,
  gender           smallint                ,
  birth            int                     ,
  sns_id           varchar                 ,
  provider         varchar                  NOT NULL DEFAULT 'local',
  profile_img_path varchar                 ,
  login_at         timestamp with time zone,
  blocked_at       timestamp with time zone,
  created_at       timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at       timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at       timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX index_user_email ON user_tb(email);
CREATE INDEX index_reported_count ON user_tb(report_count);

ALTER TABLE user_tb
    ADD CONSTRAINT email_uni UNIQUE NULLS NOT DISTINCT (email, deleted_at);

CREATE TABLE refresh_token_tb
(
    idx        bigint                   NOT NULL GENERATED ALWAYS AS IDENTITY,
    user_idx   int                      NOT NULL,
    token      varchar                  NOT NULL UNIQUE,
    expired_at timestamp with time zone,
    PRIMARY KEY (idx)
);

CREATE TABLE map_level_1_tb
(
  code varchar    NOT NULL,
  name varchar NOT NULL,
  lng  float8  NOT NULL,
  lat  float8  NOT NULL,
  PRIMARY KEY (code)
);

CREATE TABLE map_level_2_tb
(
  code varchar    NOT NULL,
  name varchar NOT NULL,
  lng  float8  NOT NULL,
  lat  float8  NOT NULL,
  PRIMARY KEY (code)
);

CREATE TABLE map_level_3_tb
(
  code varchar    NOT NULL,
  name varchar NOT NULL,
  lng  float8  NOT NULL,
  lat  float8  NOT NULL,
  PRIMARY KEY (code)
);

CREATE TABLE review_report_tb
(
  review_idx      int                      NOT NULL,
  report_user_idx int                      NOT NULL,
  type_idx        int                      NOT NULL,
  created_at      timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at      timestamp with time zone,
  PRIMARY KEY (review_idx, report_user_idx)
);

CREATE TABLE review_report_type_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  name       varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

ALTER TABLE culture_content_tb
  ADD CONSTRAINT FK_genre_tb_TO_culture_content_tb
    FOREIGN KEY (genre_idx)
    REFERENCES genre_tb (idx);

ALTER TABLE culture_content_tb
  ADD CONSTRAINT FK_user_tb_TO_culture_content_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE content_img_tb
  ADD CONSTRAINT FK_culture_content_tb_TO_content_img_tb
    FOREIGN KEY (culture_content_idx)
    REFERENCES culture_content_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_culture_content_tb_TO_review_tb
    FOREIGN KEY (culture_content_idx)
    REFERENCES culture_content_tb (idx);

ALTER TABLE review_tb
  ADD CONSTRAINT FK_user_tb_TO_review_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE tos_agree_tb
  ADD CONSTRAINT FK_user_tb_TO_tos_agree_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE tos_agree_tb
  ADD CONSTRAINT FK_tos_tb_TO_tos_agree_tb
    FOREIGN KEY (tos_idx)
    REFERENCES tos_tb (idx);

ALTER TABLE inquiry_img_tb
  ADD CONSTRAINT FK_inquiry_tb_TO_inquiry_img_tb
    FOREIGN KEY (inquiry_idx)
    REFERENCES inquiry_tb (idx);

ALTER TABLE inquiry_tb
  ADD CONSTRAINT FK_user_tb_TO_inquiry_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE culture_content_tb
  ADD CONSTRAINT FK_location_tb_TO_culture_content_tb
    FOREIGN KEY (location_idx)
    REFERENCES location_tb (idx);

ALTER TABLE liket_tb
  ADD CONSTRAINT FK_review_tb_TO_liket_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_like_tb
  ADD CONSTRAINT FK_review_tb_TO_review_like_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_like_tb
  ADD CONSTRAINT FK_user_tb_TO_review_like_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE content_like_tb
  ADD CONSTRAINT FK_culture_content_tb_TO_content_like_tb
    FOREIGN KEY (content_idx)
    REFERENCES culture_content_tb (idx);

ALTER TABLE content_like_tb
  ADD CONSTRAINT FK_user_tb_TO_content_like_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE active_banner_tb
  ADD CONSTRAINT FK_banner_tb_TO_active_banner_tb
    FOREIGN KEY (idx)
    REFERENCES banner_tb (idx);

ALTER TABLE style_mapping_tb
  ADD CONSTRAINT FK_style_tb_TO_style_mapping_tb
    FOREIGN KEY (style_idx)
    REFERENCES style_tb (idx);

ALTER TABLE style_mapping_tb
  ADD CONSTRAINT FK_culture_content_tb_TO_style_mapping_tb
    FOREIGN KEY (content_idx)
    REFERENCES culture_content_tb (idx);

ALTER TABLE culture_content_tb
  ADD CONSTRAINT FK_age_tb_TO_culture_content_tb
    FOREIGN KEY (age_idx)
    REFERENCES age_tb (idx);

ALTER TABLE review_img_tb
  ADD CONSTRAINT FK_review_tb_TO_review_img_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE inquiry_tb
  ADD CONSTRAINT FK_inquiry_type_tb_TO_inquiry_tb
    FOREIGN KEY (type_idx)
    REFERENCES inquiry_type_tb (idx);

ALTER TABLE answer_tb
  ADD CONSTRAINT FK_inquiry_tb_TO_answer_tb
    FOREIGN KEY (inquiry_idx)
    REFERENCES inquiry_tb (idx);

ALTER TABLE liket_tb
  ADD CONSTRAINT FK_user_tb_TO_liket_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE block_reason_tb
  ADD CONSTRAINT FK_user_tb_TO_block_reason_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE delete_user_reason_tb
  ADD CONSTRAINT FK_user_tb_TO_delete_user_reason_tb
    FOREIGN KEY (idx)
    REFERENCES user_tb (idx);

ALTER TABLE delete_user_reason_tb
  ADD CONSTRAINT FK_delete_user_type_tb_TO_delete_user_reason_tb
    FOREIGN KEY (type_idx)
    REFERENCES delete_user_type_tb (idx);

ALTER TABLE refresh_token_tb
    ADD CONSTRAINT FK_user_tb_TO_refresh_token_tb
        FOREIGN KEY (user_idx)
            REFERENCES user_tb (idx);

ALTER TABLE review_report_tb
  ADD CONSTRAINT FK_review_report_type_tb_TO_review_report_tb
    FOREIGN KEY (type_idx)
    REFERENCES review_report_type_tb (idx);

ALTER TABLE review_report_tb
  ADD CONSTRAINT FK_review_tb_TO_review_report_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE review_report_tb
  ADD CONSTRAINT FK_user_tb_TO_review_report_tb
    FOREIGN KEY (report_user_idx)
    REFERENCES user_tb (idx);

-- Common Seeding --

-- Delete user type
INSERT INTO delete_user_type_tb
    (name)
VALUES
    ('앱 사용이 불편해요.'), -- 1
    ('사용하지 않는 앱이에요.'), -- 2
    ('컨텐츠가 별로 없어요.'), -- 3
    ('다른 서비스를 이용해요.'), -- 4
    ('다른 계정이 있거나, 재가입할 거에요.'), -- 5
    ('기타'); -- 6

-- Genre
INSERT INTO genre_tb
  (idx, name)
VALUES  
  (1, '팝업스토어'),
  (2, '전시회'),
  (3, '연극'),
  (4, '뮤지컬'),
  (5, '콘서트'),
  (6, '페스티벌');

-- Style
INSERT INTO style_tb
  (idx, name)
VALUES
  (1, '혼자'),
  (2, '함께'),
  (3, '반려동물'),
  (4, '가족'),
  (5, '포토존'),
  (6, '체험'),
  (7, '굿즈'),
  (8, '로맨스'),
  (9, '스포츠'),
  (10, '동양풍'),
  (11, '자연'),
  (12, '만화'),
  (13, '재미있는'),
  (14, '귀여운'),
  (15, '활기찬'),
  (16, '세련된'),
  (17, '힙한'),
  (18, '핫한'),
  (19, '편안한'),
  (20, '힐링'),
  (21, '감동'),
  (22, '예술적인'),
  (23, '신비로운'),
  (24, '공포'),
  (25, '미스터리'),
  (26, '추리'),
  (27, '진지한');

-- Age
INSERT INTO age_tb
  (idx, name)
VALUES
  (1, '전체'), -- 1
  (2, '아이들'), -- 2
  (3, '10대'), -- 3
  (4, '20대'), -- 4
  (5, '30대'), -- 5 
  (7, '40-50대'); -- 6

-- Inquiry Type
INSERT INTO inquiry_type_tb
  (name)
VALUES 
  ('이용 문의'), -- 1
  ('오류 신고'), -- 2
  ('서비스 제안'), -- 3
  ('기타'); -- 4

-- Report Type
INSERT INTO review_report_type_tb
    (name)
VALUES
    ('컨텐츠와 무관한 내용 게시'), -- 1
    ('개인정보 노출 위험'), -- 2
    ('욕설, 음란 등 부적절한 내용 게시'), -- 3
    ('이미지 도용, 사칭, 저작권 지식재산권 침해'), -- 4
    ('기타'); -- 5

-- Infra seeding --

-- Terms of Service
INSERT INTO tos_tb 
  (title, contents, is_essential)
VALUES
  (
    '서비스이용약관', 
    '\n제1조(목적)\n\n이 약관은(주)셀몬인터랙티브(전자상거래 사업자)가 운영하는 하나린(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.\n\n※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」\n\n\n\n제2조(정의)\n\n① “몰”이란 OO 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.\n\n② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n\n③ ‘회원’이라 함은 “몰”에(삭제) 회원등록을 한 자로서, 계속적으로 “몰”이 제공하는 서비스를 이용할 수 있는 자를 말합니다.\n\n④ ‘비회원’이라 함은 회원에 가입하지 않고 “몰”이 제공하는 서비스를 이용하는 자를 말합니다.\n\n\n\n제3조(약관 등의 명시와 설명 및 개정) \n\n① “몰”은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호․모사전송번호․전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 00 사이버몰의 초기 서비스화면(전면)에 게시합니다.다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.\n\n② “몰은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회․배송책임․환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.\n\n③ “몰”은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.\n\n④ “몰”이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.이 경우 몰“은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다. \n\n⑤ “몰”이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다.다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 “몰”에 송신하여 “몰”의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.\n\n⑥ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.\n\n\n제4조(서비스의 제공 및 변경)',
    true
  ),
  (
    '개인정보처리방침',
    '\n제1조(목적)\n\n이 약관은(주)셀몬인터랙티브(전자상거래 사업자)가 운영하는 하나린(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.\n\n※「PC통신, 무선 등을 이용하는 전자상거래에 대해서도 그 성질에 반하지 않는 한 이 약관을 준용합니다.」\n\n\n\n제2조(정의)\n\n① “몰”이란 OO 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.\n\n② “이용자”란 “몰”에 접속하여 이 약관에 따라 “몰”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.\n\n③ ‘회원’이라 함은 “몰”에(삭제) 회원등록을 한 자로서, 계속적으로 “몰”이 제공하는 서비스를 이용할 수 있는 자를 말합니다.\n\n④ ‘비회원’이라 함은 회원에 가입하지 않고 “몰”이 제공하는 서비스를 이용하는 자를 말합니다.\n\n\n\n제3조(약관 등의 명시와 설명 및 개정) \n\n① “몰”은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호․모사전송번호․전자우편주소, 사업자등록번호, 통신판매업 신고번호, 개인정보관리책임자등을 이용자가 쉽게 알 수 있도록 00 사이버몰의 초기 서비스화면(전면)에 게시합니다.다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.\n\n② “몰은 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회․배송책임․환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.\n\n③ “몰”은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.\n\n④ “몰”이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 몰의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.이 경우 몰“은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다. \n\n⑤ “몰”이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이전에 이미 체결된 계약에 대해서는 개정 전의 약관조항이 그대로 적용됩니다.다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻을 제3항에 의한 개정약관의 공지기간 내에 “몰”에 송신하여 “몰”의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.\n\n⑥ 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.\n\n\n제4조(서비스의 제공 및 변경)',
    true
  ),
  (
    '청소년보호정책',
    '만 14세 이상...',
    true
  );

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

-- 리뷰
INSERT INTO review_tb
(culture_content_idx, user_idx, description, visit_time, star_rating)
VALUES
    -- 1
    (1, 1, '정말 재미있었습니다.', '2024-05-05', 4),
    -- 2
    (1, 1, '꼭 가보세요. 다비드 자맹의 작품 정말 역대급입니다.', '2024-05-06', 5);

-- 문의
INSERT INTO inquiry_tb
(user_idx, type_idx, title, contents)
VALUES
    -- 1
    (1, 1, '이용문의와 관련하여', '리뷰 중간중간 욕설이 섞인 리뷰가 있던데 이정도 욕설은 괜찮나요?\n서비스에서 비하의 의도가 아닌 욕설정도는 허용해주는지 궁금합니다.'),
    -- 2
    (1, 2, '이거 이렇게 써도 되나요?', '사진 처럼 이런식으로 쓰던데 뭐 상관없나요?'),
    -- 3
    (1, 3, '라이켓 어떻게 만드나요?', '라이켓 만들고 싶은데 어떻게 만드나요? 리뷰 꼭 써야되나요?');

INSERT INTO answer_tb
(inquiry_idx, contents)
VALUES
    (1, '안녕하세요. 라이켓 관리자입니다.\n비하의 목적으로 사용한 욕설은 제재하고 있습니다.\n 감사합니다.');
