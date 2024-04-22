CREATE USER liket_test_deploy_admin WITH PASSWORD '1234';

CREATE DATABASE liket OWNER liket_test_deploy_admin;

\c liket liket_test_deploy_admin

CREATE TABLE active_banner_tb
(
  idx          int                      NOT NULL,
  order        smallint                 NOT NULL,
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
  created_at timestamp with time zone NOT NULL,
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
  review_tb int NOT NULL,
  user_idx  int NOT NULL,
  PRIMARY KEY (review_tb, user_idx)
);

CREATE TABLE review_tb
(
  idx                 int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  culture_content_idx int                      NOT NULL,
  user_idx            int                      NOT NULL,
  description         text                     NOT NULL,
  visit_time          timestamp with time zone NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE style_mappring_tb
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
  provider         varchar                  NOT NULL DEFAULT local,
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
    FOREIGN KEY (review_tb)
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

ALTER TABLE style_mappring_tb
  ADD CONSTRAINT FK_style_tb_TO_style_mappring_tb
    FOREIGN KEY (style_idx)
    REFERENCES style_tb (idx);

ALTER TABLE style_mappring_tb
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

        
      