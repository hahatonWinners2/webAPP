-- Add suspect description
-- depends: hackaton_20250523_03_Y1qIR-update-addresses-columns

alter table hackaton."suspects" add column description varchar(500);