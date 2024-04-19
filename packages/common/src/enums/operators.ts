/** Operators that can be applied in a conditional to check a context field. */
export const Operators = {
  /** Value in the context field is less than the expected value. */
  LESS_THAN: 'LESS_THAN',
  /** Value in the context field is greater than the expected value. */
  GREATER_THAN: 'GREATER_THAN',
  /** Value in the context field is less than or equal to the expected value. */
  LESS_OR_EQUAL_TO: 'LESS_OR_EQUAL_TO',
  /** Value in the context field is greater than or equal to the expected value. */
  GREATER_OR_EQUAL_TO: 'GREATER_OR_EQUAL_TO',
  /** Value in the context field is equal to the expected value. */
  EQUAL_TO: 'EQUAL_TO',
  /** Value in the context field is not equal to the expected value. */
  NOT_EQUAL_TO: 'NOT_EQUAL_TO',
  /** Value in the context field starts with the expected value. */
  STARTS_WITH: 'STARTS_WITH',
  /** Value in the context field ends with the expected value. */
  ENDS_WITH: 'ENDS_WITH',
  /** Value in the context field contains the expected value. */
  CONTAINS: 'CONTAINS',
  /** Value in the context field is in the list of expected values. */
  IN: 'IN',
  /** Value in the context field is not in the list of expected values. */
  NOT_IN: 'NOT_IN',
  /** Date in the context field is before the expected date. */
  DATE_BEFORE: 'DATE_BEFORE',
  /** Date in the context field is after the expected date. */
  DATE_AFTER: 'DATE_AFTER',
};

/** Operators that can be applied in a conditional to check a context field. */
export type Operators = (typeof Operators)[keyof typeof Operators];
export const OperatorsValues = Object.values(Operators);

export const MultiValueOperators = {
  CONTAINS: Operators.CONTAINS,
  IN: Operators.IN,
  NOT_IN: Operators.NOT_IN,
};

export type MultiValueOperators =
  (typeof MultiValueOperators)[keyof typeof MultiValueOperators];
export const MultiValueOperatorsValues = Object.values(MultiValueOperators);

export const SingleValueOperators = {
  LESS_THAN: Operators.LESS_THAN,
  GREATER_THAN: Operators.GREATER_THAN,
  LESS_OR_EQUAL_TO: Operators.LESS_OR_EQUAL_TO,
  GREATER_OR_EQUAL_TO: Operators.GREATER_OR_EQUAL_TO,
  EQUAL_TO: Operators.EQUAL_TO,
  NOT_EQUAL_TO: Operators.NOT_EQUAL_TO,
  STARTS_WITH: Operators.STARTS_WITH,
  ENDS_WITH: Operators.ENDS_WITH,
  DATE_BEFORE: Operators.DATE_BEFORE,
  DATE_AFTER: Operators.DATE_AFTER,
};

export type SingleValueOperators =
  (typeof SingleValueOperators)[keyof typeof SingleValueOperators];
export const SingleValueOperatorsValues = Object.values(SingleValueOperators);
