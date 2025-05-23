-- Add auto generated field
-- depends: hackaton_20250523_01_xXHeE-initial

alter table hackaton."addresses" 
add column full_address text 
generated always as (
    region || 
    coalesce(', ' || district || ' р-н', '') || 
    ', г. ' || city || 
    ', ул. ' || street || 
    ', д. ' || building
) stored;
