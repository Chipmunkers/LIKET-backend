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
  id             varchar                 ,
  title          varchar                  NOT NULL,
  description    varchar                 ,
  website_link   varchar                  NOT NULL,
  start_date     timestamp with time zone NOT NULL,
  end_date       timestamp with time zone ,
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
CREATE INDEX index_content_perform_id ON culture_content_tb(perform_id);

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
  title      varchar                  NOT NULL,
  contents   varchar                  NOT NULL,
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
  idx                int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  review_idx         int                      NOT NULL,
  description        varchar(42)              NOT NULL,
  size               smallint                 NOT NULL,
  text_shape         JSON,
  bg_img_info        JSON                     NOT NULL,
  card_img_path      varchar                  NOT NULL,
  bg_img_path        varchar                  NOT NULL,
  created_at         timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at         timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at         timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE TABLE liket_img_shape_tb
(
  idx         int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  liket_idx   int     NOT NULL,
  img_shape  JSON    NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE location_tb
(
  idx            int     NOT NULL GENERATED ALWAYS AS IDENTITY,
  address        varchar NOT NULL,
  detail_address varchar ,
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

CREATE TABLE notice_tb
(
  idx          int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  title        varchar                  NOT NULL,
  contents     varchar                  NOT NULL,
  activated_at timestamp with time zone,
  pinned_at    timestamp with time zone,
  created_at   timestamp with time zone NOT NULL DEFAULT NOW(),
  deleted_at   timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX index_pinned_at ON notice_tb(pinned_at);
CREATE INDEX index_activated_at ON notice_tb(activated_at);

CREATE TABLE temp_culture_content_tb
(
  idx            int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  location_idx   int                      NOT NULL,
  genre_idx      int                      NOT NULL,
  age_idx        int                     ,
  perform_id     varchar                  NOT NULL UNIQUE,
  title          varchar                  NOT NULL,
  description    varchar                 ,
  website_link   varchar                  NOT NULL,
  start_date     timestamp with time zone NOT NULL,
  end_date       timestamp with time zone ,
  open_time      varchar                  NOT NULL,
  is_fee         boolean                  NOT NULL DEFAULT false,
  is_reservation boolean                  NOT NULL DEFAULT false,
  is_pet         boolean                  NOT NULL DEFAULT false,
  is_parking     boolean                  NOT NULL DEFAULT false,
  registered_at  timestamp with time zone,
  created_at     timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at     timestamp with time zone,
  PRIMARY KEY (idx)
);

CREATE INDEX index_updated_at ON temp_culture_content_tb(updated_at);
CREATE INDEX index_registered_at ON temp_culture_content_tb(registered_at);

CREATE TABLE temp_content_location_tb
(
  idx            int      NOT NULL GENERATED ALWAYS AS IDENTITY,
  address        varchar  NOT NULL,
  detail_address varchar ,
  region_1_depth varchar  NOT NULL,
  region_2_depth varchar  NOT NULL,
  h_code         char(10) NOT NULL,
  b_code         char(10) NOT NULL,
  position_x     float8   NOT NULL,
  position_y     float8   NOT NULL,
  PRIMARY KEY (idx)
);

CREATE TABLE temp_style_mapping_tb
(
  content_idx int NOT NULL,
  style_idx   int NOT NULL,
  PRIMARY KEY (content_idx, style_idx)
);

CREATE TABLE temp_content_img_tb
(
  idx         int                      NOT NULL GENERATED ALWAYS AS IDENTITY,
  content_idx int                      NOT NULL,
  img_path    varchar                  NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT NOW(),
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
  ADD CONSTRAINT FK_review_tb_TO_liket_tb
    FOREIGN KEY (review_idx)
    REFERENCES review_tb (idx);

ALTER TABLE liket_img_shape_tb
  ADD CONSTRAINT FK_liket_tb_TO_liket_img_shape_tb
    FOREIGN KEY (liket_idx)
    REFERENCES liket_tb (idx);

ALTER TABLE liket_tb
    ADD CONSTRAINT review_uni UNIQUE NULLS NOT DISTINCT (review_idx, deleted_at);

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

ALTER TABLE temp_culture_content_tb
  ADD CONSTRAINT FK_temp_content_location_tb_TO_temp_culture_content_tb
    FOREIGN KEY (location_idx)
    REFERENCES temp_content_location_tb (idx);

ALTER TABLE temp_culture_content_tb
  ADD CONSTRAINT FK_genre_tb_TO_temp_culture_content_tb
    FOREIGN KEY (genre_idx)
    REFERENCES genre_tb (idx);

ALTER TABLE temp_culture_content_tb
  ADD CONSTRAINT FK_age_tb_TO_temp_culture_content_tb
    FOREIGN KEY (age_idx)
    REFERENCES age_tb (idx);

ALTER TABLE temp_style_mapping_tb
  ADD CONSTRAINT FK_temp_culture_content_tb_TO_temp_style_mapping_tb
    FOREIGN KEY (content_idx)
    REFERENCES temp_culture_content_tb (idx);

ALTER TABLE temp_style_mapping_tb
  ADD CONSTRAINT FK_style_tb_TO_temp_style_mapping_tb
    FOREIGN KEY (style_idx)
    REFERENCES style_tb (idx);

ALTER TABLE temp_content_img_tb
  ADD CONSTRAINT FK_temp_culture_content_tb_TO_temp_content_img_tb
    FOREIGN KEY (content_idx)
    REFERENCES temp_culture_content_tb (idx);
