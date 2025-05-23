-- Initial
-- depends: 

create extension if not exists "uuid-ossp";


create schema hackaton;


create table hackaton."addresses" (
    id uuid default uuid_generate_v4() primary key not null unique,
    region varchar(128) not null,
    district varchar(128),
    city varchar(128) not null,
    street varchar(256) not null,
    building varchar(128) not null,

    unique(region, district, city, street, building)
);


create table hackaton."suspects" (
    id uuid default uuid_generate_v4() primary key not null unique,
    datetime timestamp default now(),
    address_id uuid not null references hackaton."addresses",
    is_scammer bool default null
);


create or replace function prevent_boolean_change()
returns trigger as
$$
    begin
        if old.is_scammer is not null then
            raise exception 'Cannot modify boolean field once it has been set to TRUE or FALSE';
        end if;
        return new;
    end;
$$ language plpgsql;


create trigger tr_prevent_boolean_change
before update on hackaton."suspects"
for each row
execute function prevent_boolean_change();
