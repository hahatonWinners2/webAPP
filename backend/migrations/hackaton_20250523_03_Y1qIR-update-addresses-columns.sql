-- Update addresses columns
-- depends: hackaton_20250523_02_WE1dq-add-auto-generated-field
alter table hackaton."addresses" drop column full_address;
alter table hackaton."addresses" drop constraint addresses_region_district_city_street_building_key;
alter table hackaton."addresses" 
drop column region,
drop column district,
drop column city,
drop column street,
drop column building;


alter table hackaton."addresses" add column address text not null default '';
alter table hackaton."addresses" add constraint addresses_address_unique unique (address);