from enum import StrEnum


class BuildingType(StrEnum):
    PRIVATE = 'Частный'
    APARTMENT = 'Многоквартирный'
    COUNTRY_HOUSE = 'Дача'
    OTHER = 'Прочий'
