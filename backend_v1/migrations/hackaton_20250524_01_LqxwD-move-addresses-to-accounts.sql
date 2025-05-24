-- move Addresses to Accounts
-- depends: hackaton_20250523_04_GYupF-add-suspect-description

alter table hackaton."addresses" rename to "accounts";

alter table hackaton."accounts" drop column id cascade;
alter table hackaton."accounts" add column id serial primary key not null;
alter table hackaton."accounts" add column building_type varchar(32) not null default 'Частный';
alter table hackaton."accounts" add column rooms_count int4 default null;
alter table hackaton."accounts" add column residents_count int4 default null;
alter table hackaton."accounts" add column total_area float default null;