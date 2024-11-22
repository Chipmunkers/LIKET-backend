CREATE USER liket_mobile_load_test_admin WITH PASSWORD '1234';

CREATE DATABASE liket OWNER liket_mobile_load_test_admin;

\c liket liket_mobile_load_test_admin

\i '/rdb/ddl.sql'

\i '/rdb/default-seed.sql'
