CREATE USER liket_admin_deploy WITH PASSWORD '1234';

CREATE DATABASE liket OWNER liket_admin_deploy;

\c liket liket_admin_deploy

CREATE TABLE active_banner_tb
(
  idx          int                      NOT NULL,
  banner_order smallint                 NOT NULL,
  activated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY (idx)
);

CREATE TABLE age_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
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

CREATE TABLE genre_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
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
  PRIMARY KEY (idx)
);

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
  description         text                     NOT NULL,
  visit_time          timestamp with time zone NOT NULL,
  star_rating         smallint                 NOT NULL,
  like_count          int                      NOT NULL default 0,
  created_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at          timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at          timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE style_mapping_tb
(
  style_idx   int NOT NULL,
  content_idx int NOT NULL,
  PRIMARY KEY (style_idx, content_idx)
);

CREATE TABLE style_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
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

CREATE TABLE upload_file_tb
(
  idx        int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_idx   int                      NOT NULL,
  grouping   smallint                 NOT NULL,
  file_name  varchar                  NOT NULL,
  file_ext   varchar                  NOT NULL,
  url_path   varchar                  NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp with time zone,
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
  contents     varchar                NOT NULL,
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
  gender           smallint                ,
  birth            int                     ,
  sns_id           varchar                 ,
  provider         varchar                  NOT NULL DEFAULT 'local',
  profile_img_path varchar                 ,
  blocked_at       timestamp with time zone,
  created_at       timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at       timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at       timestamp with time zone,
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

ALTER TABLE upload_file_tb
  ADD CONSTRAINT FK_user_tb_TO_upload_file_tb
    FOREIGN KEY (user_idx)
    REFERENCES user_tb (idx);

ALTER TABLE active_banner_tb
  ADD CONSTRAINT FK_banner_tb_TO_active_banner_tb
    FOREIGN KEY (idx)
    REFERENCES banner_tb (idx);

ALTER TABLE style_mapping_tb
  ADD CONSTRAINT FK_style_tb_TO_style_mappring_tb
    FOREIGN KEY (style_idx)
    REFERENCES style_tb (idx);

ALTER TABLE style_mapping_tb
  ADD CONSTRAINT FK_culture_content_tb_TO_style_mappring_tb
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

-- Seeding

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

-- Genre
INSERT INTO genre_tb
  (name)
VALUES  
  ('팝업스토어'),
  ('전시회'),
  ('연극'),
  ('뮤지컬'),
  ('콘서트'),
  ('페스티벌');

-- Style
INSERT INTO style_tb
  (name)
VALUES
  ('혼자'),
  ('함께'),
  ('반려동물'),
  ('포토존'),
  ('체험'),
  ('굿즈'),
  ('재미있는'),
  ('귀여운'),
  ('힙한'),
  ('세련된'),
  ('미니멀'),
  ('편안한'),
  ('힐링');

-- Age
INSERT INTO age_tb
  (name)
VALUES
  ('전체'),
  ('아이들'),
  ('10대'),
  ('20대'),
  ('30대'),
  ('40-50대');

-- Inquiry Type
INSERT INTO inquiry_type_tb
  (name)
VALUES 
  ('이용 문의'), -- 1
  ('오류 신고'), -- 2
  ('서비스 제안'), -- 3
  ('기타'); -- 4

-- 관리자 계정
INSERT INTO user_tb 
    (
        is_admin, 
        email, 
        pw, 
        nickname, 
        gender, 
        birth, 
        sns_id, 
        provider, 
        profile_img_path, 
        blocked_at, 
        deleted_at
    )
VALUES  
    (
        true, 
        -- is_admin
        'admin123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '관리자', -- nickname
        1, -- gedner
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    );

-- 일반 계정
INSERT INTO user_tb 
    (is_admin, email, pw, nickname, gender, birth, sns_id, provider, profile_img_path, blocked_at, deleted_at)
VALUES  
    ( -- 일반 계정 1
        false, -- is_admin
        'minjun112@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '박민준', -- nickname
        1, -- gedner
        1997, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/83b604a7-c662-4c3b-ac6a-53072ea59f12.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 2
        false, -- is_admin
        'jiiu_01@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '김지우', -- nickname
        2, -- gedner
        2001, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/0bda2b7d-e925-43e0-bcc2-0338e520a57c.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 3
        false, -- is_admin
        'choi_1994@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '최서현', -- nickname
        2, -- gedner
        1994, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/d548c382-a57b-41a3-8b03-e5eafb0c1692.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 4
        false, -- is_admin
        'park_yyy@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '박유준', -- nickname
        1, -- gedner
        2007, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 5
        false, -- is_admin
        'man123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '지상최강은우', -- nickname
        1, -- gedner
        2006, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/64f912ee-6ba0-4c63-9a46-86216abd077a.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 6
        false, -- is_admin
        'joch2712@naver.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '조총', -- nickname
        1, -- gedner
        2002, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/154432d4-ce6f-45dc-9b50-586df36a608e.png', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 7
        false, -- is_admin
        'abc123@naver.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '심심한땅콩', -- nickname
        null, -- gedner
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 8
        false, -- is_admin
        'mouse123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        'superbase', -- nickname
        1, -- gedner
        2012, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/c384b992-3e16-4e21-9863-e7a1f13a34e0.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 9
        false, -- is_admin
        'monitor123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '우서', -- nickname
        1, -- gedner
        2001, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/c6325e78-5611-4c74-a7de-e2457b11d7d9.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 10
        false, -- is_admin
        'white123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '귀여운흰둥이', -- nickname
        1, -- gedner
        2000, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/53c01ce0-7625-43a7-b4ea-ef67b6091a75.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 11
        false, -- is_admin
        'brown123@naver.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '누룽지', -- nickname
        null, -- gedner
        1999, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/deaefcf8-23f7-4e65-8090-f25acbc5449a.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 12
        false, -- is_admin
        'temp123@daum.net', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '꼴초오리', -- nickname
        2, -- gedner
        2000, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/ff6de973-31c7-4fec-ba76-ae1fd031378e.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 13
        false, -- is_admin
        'vsc123@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '무서운고냥이', -- nickname
        2, -- gedner
        null, -- birth
        null, -- sns_id
        'local', -- provider
        '/profile-img/26482974-d9f8-45c6-a7a9-15beffde6206.jpeg', -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 14
        false, -- is_admin
        'forpage1@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지1', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 15
        false, -- is_admin
        'forpage2@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지2', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 16
        false, -- is_admin
        'forpage3@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지3', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 17
        false, -- is_admin
        'forpage4@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지4', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 18
        false, -- is_admin
        'forpage5@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지5', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 19
        false, -- is_admin
        'forpage6@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지6', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 20
        false, -- is_admin
        'forpage7@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지7', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 21
        false, -- is_admin
        'forpage8@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지8', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 22
        false, -- is_admin
        'forpage9@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지9', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 23
        false, -- is_admin
        'forpage10@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지10', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 24
        false, -- is_admin
        'forpage11@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지11', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 25
        false, -- is_admin
        'forpage12@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지12', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 26
        false, -- is_admin
        'forpage13@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지13', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 27
        false, -- is_admin
        'forpage14@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지14', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 28
        false, -- is_admin
        'forpage15@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지15', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 29
        false, -- is_admin
        'forpage16@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지16', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 30
        false, -- is_admin
        'forpage17@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지17', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 31
        false, -- is_admin
        'forpage18@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지18', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 32
        false, -- is_admin
        'forpage19@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지19', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 33
        false, -- is_admin
        'forpage20@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지20', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 34
        false, -- is_admin
        'forpage21@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지21', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 40
        false, -- is_admin
        'forpage27@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지27', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 41
        false, -- is_admin
        'forpage28@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지28', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 42
        false, -- is_admin
        'forpage29@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지29', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 43
        false, -- is_admin
        'forpage30@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지30', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 44
        false, -- is_admin
        'forpage31@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지31', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 45
        false, -- is_admin
        'forpage32@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지32', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 46
        false, -- is_admin
        'forpage33@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지33', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 47
        false, -- is_admin
        'forpage34@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지34', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 48
        false, -- is_admin
        'forpage35@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지35', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 49
        false, -- is_admin
        'forpage36@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지36', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 50
        false, -- is_admin
        'forpage37@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지37', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 51
        false, -- is_admin
        'forpage38@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지38', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 52
        false, -- is_admin
        'forpage39@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지39', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 53
        false, -- is_admin
        'forpage40@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지40', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 54
        false, -- is_admin
        'forpage41@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지41', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 55
        false, -- is_admin
        'forpage42@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지42', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 56
        false, -- is_admin
        'forpage43@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지43', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 57
        false, -- is_admin
        'forpage44@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지44', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 58
        false, -- is_admin
        'forpage45@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지45', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 59
        false, -- is_admin
        'forpage46@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지46', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 60
        false, -- is_admin
        'forpage47@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지47', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 61
        false, -- is_admin
        'forpage48@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지48', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 62
        false, -- is_admin
        'forpage49@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지49', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 63
        false, -- is_admin
        'forpage50@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지50', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    ),
    ( -- 일반 계정 64
        false, -- is_admin
        'forpage51@gmail.com', -- email
        '$2b$08$9GtDWdylreyFVvLkorwgfOVQd9.fSWCkwp.VOO.aukK378LHgQ/8a', --pw
        '페이지51', -- nickname
        null, -- gender
        null, -- birth
        null, -- sns_id
        'local', -- provider
        null, -- profile_img_path
        null, -- blocked_at
        null -- deleted_at
    );

-- 정지 계정
UPDATE 
    user_tb 
SET
    blocked_at = NOW()
WHERE
    idx = 57;

UPDATE 
    user_tb 
SET
    blocked_at = NOW()
WHERE
    idx = 58;

UPDATE 
    user_tb 
SET
    blocked_at = NOW()
WHERE
    idx = 59;

INSERT INTO block_reason_tb
    (user_idx, reason)
VALUES
    (57, '악의적인 문의'),
    (58, '광고용 리뷰 사용'),
    (59, '선정적인 프로필 이미지');

-- 탈퇴 계정
UPDATE 
    user_tb
SET
    deleted_at = NOW()
WHERE
    idx = 20
OR
    idx = 21
OR
    idx = 22
OR
    idx = 23
OR
    idx = 24
OR
    idx = 25;


INSERT INTO delete_user_reason_tb
    (idx, type_idx, contents)
VALUES
    (20, 1, '앱 사용성이 좀 구린 것 같아요;'),
    (21, 2, '바빠서 잘 안쓰게 되네요...'),
    (22, 3, '우리 지역 컨텐츠가 많이 없어요. 부산에서 진행하는 팝업스토어도 넣어주세요.'),
    (23, 4, '옆 동네 어플이 더 쓸만하네요'),
    (24, 5, '가입 잘 못했어요. 카카오톡으로 가입해놓고 또 가입했네요.'),
    (25, 6, '그냥 재미없네용');

-- 문의
INSERT INTO inquiry_tb
    (user_idx, type_idx, title, contents)
VALUES
    -- 1
    (2, 1, '이용문의와 관련하여', '리뷰 중간중간 욕설이 섞인 리뷰가 있던데 이정도 욕설은 괜찮나요?\n서비스에서 비하의 의도가 아닌 욕설정도는 허용해주는지 궁금합니다.'),
    -- 2
    (3, 1, '이거 이렇게 써도 되나요?', '사진 처럼 이런식으로 쓰던데 뭐 상관없나요?'),
    -- 3
    (4, 1, '라이켓 어떻게 만드나요?', '라이켓 만들고 싶은데 어떻게 만드나요? 리뷰 꼭 써야되나요?'),
    -- 4
    (5, 1, '결제 방식이 궁금해요', '다른 결제 방식이 추가될 예정일까요? 뭔가 불편해서요.'),
    -- 5
    (6, 2, '로그인 중간중간 오류나요', '이거 계속 오류나요. 뭐 자꾸 안된다는데 이상하네요.\n확인좀해주세요 데이터 꼬였는지 자꾸 에러떠요 ㅡㅡ;'),
    -- 6
    (7, 2, '배너 가끔 모양이 이상하네요.', '배너에 들어가는 이미지가 가끔 짤려보이는데 왜 짤려보이는지는 잘 모르겠어요. 이거 왜이러는 걸까요??'),
    -- 7
    (8, 2, '이메일이 발송이 안되는데요...', '비밀번호 변경하고 싶은데 이메일 발송이 자꾸 되질 않아요... 이거 왜이러나요? 승질나서 못참겠네요.\n이러다가 진짜 탈퇴할 것 같아요 살려주세요;;'),
    -- 8
    (9, 3, '배너가 더블 클릭 요청', '배너가 자꾸 툭 건들면 링크로 이동되니까 넘 불편하네요.\n\n어떻게 다른 방법이 없을까요? 진짜 불편해서 미치겠어요!!!!!'),
    -- 9
    (10, 3, '장르 디자인 로고좀 변경해주세요.', '디자인 좀 변경해주세요. 일부 로고가 혐오를 상징하는 것 같습니다.'),
    -- 10
    (9, 3, '백엔드 개발 개판인 것 같은데요?', '자꾸 버그 터져요. 404 엄청뜨구요. 미치겠어요. 그냥 탈퇴해버릴까요.'),
    -- 11
    (12, 4, '이거 문의 잘되나요?', '문의 이렇게 하면되나요?'),
    -- 12
    (12, 4, '아 죄송해요 문의 잘못들어갔네요.', '아 이전 문의 넣은 사람인데 실수로 완료 버튼 눌렀네요.'),
    -- 13
    (13, 4, '저작권 관련 문의', '이거 일부 배너 이미지에 들어간 이미지 저작권 문제가 좀 있을 것 같아요. 괜찮을까요? 진짜 몰라서 물어봅니다.'),
    -- 14
    (14, 4, '버전 관련 업데이트 내역좀 보게해주세요.', '뭐 업데이트 된 거 있으면 볼 수 있게좀 해주세요. 궁금해미치겠어요!!!'),
    -- 15
    (15, 4, '이미지 꽉 채운 문의', '이미지 꽉 채워버리기');

INSERT INTO inquiry_img_tb 
    (inquiry_idx, img_path)
VALUES
    (1, '/inquiry/c0873d1f-73b4-4645-af96-25266321c401.png'),
    (1, '/inquiry/40e0281f-1100-4b15-8794-0802d9024894.png'),
    (1, '/inquiry/5bb09347-dfc4-4a0e-80f3-3b4698b8ff89.png'),
    (2, '/inquiry/0cc1775e-fde4-45d5-a36e-3183cf3e9f32.png'),
    (2, '/inquiry/e68b6ee0-4952-47c9-b99c-dfc37bcb4f3b.png'),
    (3, '/inquiry/cb383e09-d5b9-4f26-bfab-d34ae34ac5d8.png'),
    (3, '/inquiry/504ce9d1-d409-4610-83ee-9b6aec51ce68.png'),
    (5, '/inquiry/91853b29-1bd8-458a-8acb-131b9015f780.png'),
    (5, '/inquiry/c026a53c-4c97-4eed-900e-aed40679b925.png'),
    (6, '/inquiry/10c2add3-24f2-4681-a455-7771c414d677.png'),
    (6, '/inquiry/a5ba862d-2d35-4b87-8635-d94ad3f939eb.png'),
    (7, '/inquiry/ac3b8782-ef8a-4939-a2ae-031e2be5f6c2.png'),
    (8, '/inquiry/732f7d0e-d442-4d5f-9681-1a719271f75d.png'),
    (9, '/inquiry/2e76884a-e719-44e1-9794-99b1702ff000.png'),
    (13, '/inquiry/5cbcd919-1caa-4d78-ac3e-d9e7c7a1341d.png'),
    (14, '/inquiry/49e4ef33-911d-478e-adc0-befc39fdc103.png'),

    (15, '/inquiry/c0873d1f-73b4-4645-af96-25266321c401.png'),
    (15, '/inquiry/40e0281f-1100-4b15-8794-0802d9024894.png'),
    (15, '/inquiry/5bb09347-dfc4-4a0e-80f3-3b4698b8ff89.png'),
    (15, '/inquiry/0cc1775e-fde4-45d5-a36e-3183cf3e9f32.png'),
    (15, '/inquiry/e68b6ee0-4952-47c9-b99c-dfc37bcb4f3b.png'),
    (15, '/inquiry/cb383e09-d5b9-4f26-bfab-d34ae34ac5d8.png'),
    (15, '/inquiry/504ce9d1-d409-4610-83ee-9b6aec51ce68.png'),
    (15, '/inquiry/91853b29-1bd8-458a-8acb-131b9015f780.png'),
    (15, '/inquiry/c026a53c-4c97-4eed-900e-aed40679b925.png'),
    (15, '/inquiry/10c2add3-24f2-4681-a455-7771c414d677.png');

INSERT INTO answer_tb 
    (inquiry_idx, contents)
VALUES
    (1, '안녕하세요. 라이켓 관리자입니다.\n비하의 목적으로 사용한 욕설은 제재하고 있습니다.\n 감사합니다.'),
    (13, '안녕하세요. 라이켓 관리자입니다.\n저작권 관련하여 문제 없도록 저작권에 신경써서 올리고있습니다.\n더 나은 서비스를 위해 노력하겠습니다. 감사합니다.'),
    (8, '안녕하세요. 라이켓 관리자입니다.\n현재 이메일 발송과 관련한 문제를 확인하고 있습니다. 서비스 이용에 불편을 드려 정말 죄송합니다. 더 나은 서비스를 위해 노력하겠습니다.');

-- 배너
INSERT INTO banner_tb
    (name, link, img_path)
VALUES
    ('지속X익명깨꾹 팝업스토어', 'https://naver.com', '/banner/bcd48d20-f6e3-407b-9d8a-893fc47146f2.png'),
    ('초샵 팝업스토어', 'https://google.com', '/banner/3a955c04-6a78-4e00-9e41-ffc99aa95fe0.png'),
    ('디올 팝업스토어', 'https://www.dior.com/ko_kr', '/banner/d928733f-8fff-4ae9-a4f1-822d6c577867.jpeg');

INSERT INTO active_banner_tb 
    (idx, banner_order)
VALUES
    (1, 1),
    (3, 2);

-- 위치 데이터
INSERT INTO location_tb
    (address, detail_address, region_1_depth, region_2_depth, h_code, b_code, position_x, position_y)
VALUES
    ( -- 다비드 자맹
        '서울 영등포구 여의도동 22', -- address
        '더현대 서울 6층', -- detail_address
        '서울', -- region_1_depth
        '영등포구', -- region_2_depth
        '1156054000', -- h_code
        '1156011000', -- b_code
        126.928299685623, -- position_x
        37.5260425418848 -- position_y
    ),
    ( -- 빵빵이
        '서울 성동구 성수동2가 302-11', -- address
        '빵빵이', -- detail_address
        '서울', -- region_1_depth
        '성동구', -- region_2_depth
        '1120011500', -- h_code
        '1120069000', -- b_code
        127.052478070362, -- position_x
        37.5440420266277 -- position_y
    ),
    ( -- 모네 인사이드
        '서울 성동구 성수동2가 302-11', -- address
        '그라운드시소 명동', -- detail_address
        '서울', -- region_1_depth
        '성동구', -- region_2_depth
        '1120011500', -- h_code
        '1120069000', -- b_code
        127.052478070362, -- position_x
        37.5440420266277 -- position_y
    ),
    ( -- 디올
        '서울 중구 남대문로2가 130', -- address
        '디올', -- detail_address
        '서울', -- region_1_depth
        '중구', -- region_2_depth
        '1114052000', -- h_code
        '1114011500', -- b_code
        126.981925482483, -- position_x
        37.5641009478468 -- position_y
    );

-- 문화생활컨텐츠
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
        is_parking
    )
VALUES
    ( -- 1 다비드자맹
        2, -- genre_idx
        3, -- user_idx
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
        true -- is_parking
    ),
    ( -- 2 빵빵이 팝업스토어
        1, -- genre_idx
        2, -- user_idx
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
        false -- is_parking
    ),
    ( -- 3 모네 인사이드
        2, -- genre_idx
        5, -- user_idx
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
        true -- is_parking
    ),
    ( -- 4 디올 팝업스토어
        1, -- genre_idx
        6, -- user_idx
        4, -- location_idx
        4, -- age_idx
        '디올 팝업스토어', -- title
        '한시적으로 운영되는 이 독특한 공간에서는 몽테뉴가 30번지의 전설적인 외관을 연상시키는 화려한 구조와 함께 시즌 및 컬렉션별로 다채로운 풍경을 펼쳐 보입니다.', -- description
        'https://www.dior.com/ko_kr/fashion/', -- web
        '2024-03-01', -- start_date
        '2024-09-01', -- end_date
        '평일 10:30-18:00 / 주말 10:30-20:30',
        false, -- is_fee
        false, -- is_reservation
        false, -- is_pet
        true -- is_parking
    );

UPDATE culture_content_tb SET accepted_at = NOW() WHERE idx = 1 OR idx = 4;
    
-- 다비드 자맹
INSERT INTO content_img_tb
    (culture_content_idx, img_path)
VALUES
    (1, '/culture-content/6d4dbfa3-eb3b-4030-bdf4-049514107f58.jpeg'),
    (1, '/culture-content/1d8d5ca4-f8bb-48d5-a755-269336546b1b.jpeg'),
    (1, '/culture-content/7f731f80-7a23-42e6-95ea-232ccf3df6f6.jpg'),
    (1, '/culture-content/5ed28b78-eef2-4ba1-84e3-a743e6aba35b.jpeg'),
    (1, '/culture-content/ea26cab5-da35-43bc-afbb-256d4d903eed.jpeg');

INSERT INTO style_mapping_tb
    (content_idx, style_idx)
VALUES
    (1, 1),
    (1, 13),
    (1, 4);

-- 빵빵이 팝업스토어
INSERT INTO content_img_tb
    (culture_content_idx, img_path)
VALUES
    (2, '/culture-content/e7488497-0484-42e1-9fb9-2f400ac77e1e.jpeg'),
    (2, '/culture-content/7796a3bf-ff0b-4ab8-9081-c9ecabaaaae8.jpeg'),
    (2, '/culture-content/c19044d3-5501-428c-9abd-f76b098c3aae.jpeg'),
    (2, '/culture-content/1a097ffe-c3b9-466f-94bb-3dff7b0dca42.jpeg');

INSERT INTO style_mapping_tb
    (content_idx, style_idx)
VALUES
    (2, 2),
    (2, 6),
    (2, 8),
    (2, 9);

-- 모네 인사이드
INSERT INTO content_img_tb
    (culture_content_idx, img_path)
VALUES
    (3, '/culture-content/62396056-7a5b-40ac-b821-951f4240994b.jpeg'),
    (3, '/culture-content/32eb71b3-8fe3-4eb2-a8c5-e25ed2236531.jpeg'),
    (3, '/culture-content/f0b92317-2e7a-4d0e-b01f-15b1b6626b3e.jpeg'),
    (3, '/culture-content/0c28444b-b0f1-4e78-becd-cc204ede3bc5.jpeg');

INSERT INTO style_mapping_tb
    (content_idx, style_idx)
VALUES
    (3, 1),
    (3, 12);

-- 디올 팝업스토어
INSERT INTO content_img_tb
    (culture_content_idx, img_path)
VALUES
    (4, '/culture-content/3fe225cb-cf50-4301-bde1-e1b3d3907368.png'),
    (4, '/culture-content/a33ea8f2-de9e-4dd3-9a64-7663821f28f9.png'),
    (4, '/culture-content/a33ea8f2-de9e-4dd3-9a64-7663821f28f9.png'),
    (4, '/culture-content/b026e4b5-52aa-45f6-a884-72326f50885c.jpeg');

INSERT INTO style_mapping_tb
    (content_idx, style_idx)
VALUES
    (4, 5),
    (4, 8);

-- 리뷰
INSERT INTO review_tb   
    (culture_content_idx, user_idx, description, visit_time, star_rating)
VALUES
    -- 1
    (1, 2, '정말 재미있었습니다.', '2024-05-05', 4),
    -- 2
    (1, 2, '꼭 가보세요. 다비드 자맹의 작품 정말 역대급입니다.', '2024-05-06', 5),
    -- 3
    (1, 2, '전 막 그렇게까지 좋은지는 모르겟네요.', '2024-05-06', 1),
    -- 4
    (1, 7, '적당히 좋았습니다.', '2024-05-06', 3),
    -- 5
    (4, 4, '성수 팝업스토어 디올 뷰티, 들어가자마자 예쁜 야외 정원이 있는데 보기만 해도 아름답다는 말이 나왔어요! 제가 20살 초반에 처음으로 접했던 향수가 디올이기도 했고...', '2024-05-06', 5),
    -- 6
    (4, 10, '꼭 예약하고 가세요~ 고생했습니다.', '2024-05-06', 5);

INSERT INTO review_img_tb
    (review_idx, img_path)
VALUES
    (1, '/review/d883e234-d137-4815-8526-2ff58cb2bf45.jpeg'),
    (2, '/review/27cd5a21-8691-4982-ad6f-47b8b43fe5b8.jpeg'),
    (3, '/review/0e81c842-a6da-4bb6-9001-8924a462c91d.jpeg'),
    (5, '/review/fe1b34c5-98e8-401d-b0a4-99cbf51a1f71.jpeg'),
    (5, '/review/d8967bb2-05d6-4d3f-a907-0dbd8e25ba40.jpeg'),
    (6, '/review/dbc9bc4d-7b4f-4516-b721-76a6e7828957.jpeg');
