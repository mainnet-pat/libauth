import { combineOperations, pushToStackVmNumberChecked, useOneVmNumber, useThreeVmNumbers, useTwoVmNumbers, } from './combinators.js';
import { ConsensusCommon } from './consensus.js';
import { applyError, AuthenticationErrorCommon } from './errors.js';
import { opVerify } from './flow-control.js';
import { safeIntegerToVmNumber, shortVmNumberToNumber, } from './instruction-sets-utils.js';
const createNumericOperation = (useVmNumbers) => (operate, { hasEncodingCost, maximumVmNumberByteLength, }) => (state) => useVmNumbers(state, (nextState, values) => {
    const result = operate(values);
    return pushToStackVmNumberChecked(nextState, result, {
        hasEncodingCost,
        maximumVmNumberByteLength,
    });
}, { maximumVmNumberByteLength });
export const numericOperationUnary = createNumericOperation(useOneVmNumber);
export const numericOperationBinary = createNumericOperation(useTwoVmNumbers);
export const numericOperationTernary = createNumericOperation(useThreeVmNumbers);
/**
 * The stack item `depth` items from the top as a Number, if it is a short VM
 * Number (see {@link shortVmNumberToNumber}) within `maximumVmNumberByteLength`.
 */
const shortOperand = (stack, depth, maximumVmNumberByteLength) => {
    const item = stack[stack.length - depth];
    return item === undefined || item.length > maximumVmNumberByteLength
        ? undefined
        : shortVmNumberToNumber(item);
};
/**
 * Replace the top `operandCount` stack items with `result`, accounting for it
 * as {@link pushToStackVmNumberChecked} does. Returns `undefined` (changing
 * nothing) if `result` is not a safe integer or its encoding is longer than
 * `maximumVmNumberByteLength`.
 */
/* eslint-disable @typescript-eslint/max-params */
const pushShortResult = (state, operandCount, result, { hasEncodingCost, maximumVmNumberByteLength }) => {
    if (!Number.isSafeInteger(result))
        return undefined;
    const encoded = safeIntegerToVmNumber(result);
    if (encoded.length > maximumVmNumberByteLength)
        return undefined;
    /* eslint-disable functional/no-expression-statements, functional/immutable-data */
    state.stack.length -= operandCount;
    state.stack.push(encoded);
    state.metrics.stackPushedBytes += encoded.length;
    state.metrics.arithmeticCost += hasEncodingCost ? encoded.length : 0;
    /* eslint-enable functional/no-expression-statements, functional/immutable-data */
    return state;
};
/* eslint-enable @typescript-eslint/max-params */
const shortUnary = (operate, options) => (state) => {
    const a = shortOperand(state.stack, 1, options.maximumVmNumberByteLength);
    return a === undefined
        ? undefined
        : pushShortResult(state, 1, operate(a), options);
};
const shortBinary = (operate, options) => (state) => {
    const { maximumVmNumberByteLength } = options;
    const b = shortOperand(state.stack, 1, maximumVmNumberByteLength);
    const a = shortOperand(state.stack, 1 + 1, maximumVmNumberByteLength);
    return a === undefined || b === undefined
        ? undefined
        : pushShortResult(state, 1 + 1, operate(a, b), options);
};
const shortTernary = (operate, options) => (state) => {
    const { maximumVmNumberByteLength } = options;
    const c = shortOperand(state.stack, 1, maximumVmNumberByteLength);
    const b = shortOperand(state.stack, 1 + 1, maximumVmNumberByteLength);
    const a = shortOperand(state.stack, 1 + 1 + 1, maximumVmNumberByteLength);
    return a === undefined || b === undefined || c === undefined
        ? undefined
        : pushShortResult(state, 1 + 1 + 1, operate(a, b, c), options);
};
/**
 * Run `short`, which computes the operation with Number arithmetic when every
 * operand is a short VM Number, and run `operation`, the bigint
 * implementation, whenever `short` does not apply: for longer operands,
 * results that are not safe integers, and every error.
 */
const withShortPath = (short, operation) => (state) => short(state) ?? operation(state);
export const createOp1Add = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => a + 1, options), numericOperationUnary(([value]) => value + 1n, options));
};
export const op1Add = createOp1Add();
export const createOp1Sub = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => a - 1, options), numericOperationUnary(([value]) => value - 1n, options));
};
export const op1Sub = createOp1Sub();
export const createOpNegate = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => -a, options), numericOperationUnary(([value]) => -value, options));
};
export const opNegate = createOpNegate();
export const createOpAbs = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => (a < 0 ? -a : a), options), numericOperationUnary(([value]) => (value < 0 ? -value : value), options));
};
export const opAbs = createOpAbs();
export const createOpNot = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => (a === 0 ? 1 : 0), options), numericOperationUnary(([value]) => (value === 0n ? 1n : 0n), options));
};
export const opNot = createOpNot();
export const createOp0NotEqual = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortUnary((a) => (a === 0 ? 0 : 1), options), numericOperationUnary(([value]) => (value === 0n ? 0n : 1n), options));
};
export const op0NotEqual = createOp0NotEqual();
export const createOpAdd = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => a + b, options), numericOperationBinary(([a, b]) => a + b, options));
};
export const opAdd = createOpAdd();
export const createOpSub = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => a - b, options), numericOperationBinary(([a, b]) => a - b, options));
};
export const opSub = createOpSub();
export const createOpBoolAnd = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a !== 0 && b !== 0 ? 1 : 0), options), numericOperationBinary(([a, b]) => (a !== 0n && b !== 0n ? 1n : 0n), options));
};
export const opBoolAnd = createOpBoolAnd();
export const createOpBoolOr = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a !== 0 || b !== 0 ? 1 : 0), options), numericOperationBinary(([a, b]) => (a !== 0n || b !== 0n ? 1n : 0n), options));
};
export const opBoolOr = createOpBoolOr();
export const createOpNumEqual = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a === b ? 1 : 0), options), numericOperationBinary(([a, b]) => (a === b ? 1n : 0n), options));
};
export const opNumEqual = createOpNumEqual();
export const createOpNumEqualVerify = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => combineOperations(createOpNumEqual({ maximumVmNumberByteLength }), opVerify);
export const opNumEqualVerify = createOpNumEqualVerify();
export const createOpNumNotEqual = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a === b ? 0 : 1), options), numericOperationBinary(([a, b]) => (a === b ? 0n : 1n), options));
};
export const opNumNotEqual = createOpNumNotEqual();
export const createOpLessThan = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a < b ? 1 : 0), options), numericOperationBinary(([a, b]) => (a < b ? 1n : 0n), options));
};
export const opLessThan = createOpLessThan();
export const createOpLessThanOrEqual = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a <= b ? 1 : 0), options), numericOperationBinary(([a, b]) => (a <= b ? 1n : 0n), options));
};
export const opLessThanOrEqual = createOpLessThan();
export const createOpGreaterThan = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a > b ? 1 : 0), options), numericOperationBinary(([a, b]) => (a > b ? 1n : 0n), options));
};
export const opGreaterThan = createOpGreaterThan();
export const createOpGreaterThanOrEqual = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a >= b ? 1 : 0), options), numericOperationBinary(([a, b]) => (a >= b ? 1n : 0n), options));
};
export const opGreaterThanOrEqual = createOpGreaterThanOrEqual();
export const createOpMin = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a < b ? a : b), options), numericOperationBinary(([a, b]) => (a < b ? a : b), options));
};
export const opMin = createOpMin();
export const createOpMax = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return withShortPath(shortBinary((a, b) => (a > b ? a : b), options), numericOperationBinary(([a, b]) => (a > b ? a : b), options));
};
export const opMax = createOpMax();
export const createOpWithin = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => {
    const options = { hasEncodingCost: false, maximumVmNumberByteLength };
    return withShortPath(shortTernary((a, b, c) => (b <= a && a < c ? 1 : 0), options), numericOperationTernary(([a, b, c]) => (b <= a && a < c ? 1n : 0n), options));
};
export const opWithin = createOpWithin();
export const measureArithmeticCost = (state, operation) => {
    const [firstInput, secondInput] = state.stack.slice(-2 /* Constants.lastTwoItems */);
    const firstLength = firstInput?.length ?? 0;
    const secondLength = secondInput?.length ?? 0;
    // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
    state.metrics.arithmeticCost += firstLength * secondLength;
    return operation(state);
};
export const createOpMul = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => (state) => {
    const options = { hasEncodingCost: true, maximumVmNumberByteLength };
    return measureArithmeticCost(state, withShortPath(shortBinary((a, b) => a * b, options), numericOperationBinary(([a, b]) => a * b, options)));
};
export const opMul = createOpMul();
export const createOpDiv = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => (state) => measureArithmeticCost(state, () => useTwoVmNumbers(state, (nextState, [a, b]) => b === 0n
    ? applyError(nextState, AuthenticationErrorCommon.divisionByZero)
    : pushToStackVmNumberChecked(nextState, a / b, {
        hasEncodingCost: true,
        maximumVmNumberByteLength,
    }), { maximumVmNumberByteLength }));
export const opDiv = createOpDiv();
export const createOpMod = ({ maximumVmNumberByteLength = ConsensusCommon.maximumVmNumberByteLength, } = {}) => (state) => measureArithmeticCost(state, () => useTwoVmNumbers(state, (nextState, [a, b]) => b === 0n
    ? applyError(nextState, AuthenticationErrorCommon.divisionByZero)
    : pushToStackVmNumberChecked(nextState, a % b, {
        hasEncodingCost: true,
        maximumVmNumberByteLength,
    }), { maximumVmNumberByteLength }));
export const opMod = createOpDiv();
//# sourceMappingURL=arithmetic.js.map