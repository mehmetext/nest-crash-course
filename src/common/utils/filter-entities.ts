export type FilterOperation =
  | '=='
  | '!='
  | '<='
  | '<'
  | '>='
  | '>'
  | '=@'
  | '!@'
  | '=^'
  | '=$';

export interface FilteringQueryOperation<T> {
  field: keyof T;
  operation: FilterOperation;
  value: string;
}

export interface FilteringQueryGroup<T> {
  anyOf: FilteringQueryOperation<T>[];
}

export interface FilterType<T> {
  allOf: FilteringQueryGroup<T>[];
}

/**
 * Generic, type-safe filtreleme fonksiyonu
 * @param entities Filtrelenecek entity dizisi
 * @param filter FilterType<T> objesi
 * @returns Filtrelenmiş entity dizisi
 */
export function filterEntities<T>(entities: T[], filter?: FilterType<T>): T[] {
  // Tek bir koşulu uygular
  const applyOperation = (
    field: keyof T,
    operation: FilterOperation,
    value: string,
    entity: T,
  ): boolean => {
    const fieldValue = entity[field];
    switch (operation) {
      case '==':
        return (
          String(fieldValue).toLocaleLowerCase() === value.toLocaleLowerCase()
        );
      case '!=':
        return (
          String(fieldValue).toLocaleLowerCase() !== value.toLocaleLowerCase()
        );
      case '<=':
        return Number(fieldValue) <= Number(value);
      case '<':
        return Number(fieldValue) < Number(value);
      case '>=':
        return Number(fieldValue) >= Number(value);
      case '>':
        return Number(fieldValue) > Number(value);
      case '=@':
        return String(fieldValue)
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase());
      case '!@':
        return !String(fieldValue)
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase());
      case '=^':
        return String(fieldValue)
          .toLocaleLowerCase()
          .startsWith(value.toLocaleLowerCase());
      case '=$':
        return String(fieldValue)
          .toLocaleLowerCase()
          .endsWith(value.toLocaleLowerCase());
      default:
        return false;
    }
  };

  // anyOf (OR)
  const applyAnyOf = (
    anyOf: FilteringQueryOperation<T>[],
    entity: T,
  ): boolean => {
    return anyOf.some((cond) =>
      applyOperation(cond.field, cond.operation, cond.value, entity),
    );
  };

  // allOf (AND)
  const applyAllOf = (allOf: FilteringQueryGroup<T>[], entity: T): boolean => {
    return allOf.every((group) => applyAnyOf(group.anyOf, entity));
  };

  if (filter && Array.isArray(filter.allOf)) {
    return entities.filter((entity) => applyAllOf(filter.allOf, entity));
  }
  return entities;
}
