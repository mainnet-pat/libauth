import test from 'ava';
import { createAuthenticationVirtualMachine } from '../lib.js';
import { applyError } from './vm.js';
const simpleInstructionSet = {
    clone: (state) => ({
        ...(state.error === undefined ? {} : { error: state.error }),
        instructions: state.instructions.slice(),
        ip: state.ip,
        ...(state.repeated === undefined ? {} : { repeated: state.repeated }),
        stack: state.stack.slice(),
    }),
    continue: (state) => state.error === undefined && state.ip < state.instructions.length,
    evaluate: (program, stateEvaluate) => {
        const internalState = { ip: 0, stack: [] };
        return stateEvaluate({ ...internalState, ...program });
    },
    every: (state) => (state.stack[state.stack.length - 1] ?? 0) > 2
        ? applyError(state, "Values may be no larger than 2." /* SimpleError.EXCESSIVE */)
        : state,
    operations: {
        [0 /* SimpleOps.OP_0 */]: (state) => {
            state.stack.push(0);
            return state;
        },
        [1 /* SimpleOps.OP_INCREMENT */]: (state) => {
            const top = state.stack.pop();
            if (top === undefined) {
                state.error = "The program tried to pop from an empty stack." /* SimpleError.EMPTY_STACK */;
                return state;
            }
            state.stack.push(top + 1);
            return state;
        },
        [2 /* SimpleOps.OP_DECREMENT */]: (state) => {
            const top = state.stack.pop();
            if (top === undefined) {
                state.error = "The program tried to pop from an empty stack." /* SimpleError.EMPTY_STACK */;
                return state;
            }
            state.stack.push(top - 1);
            return state;
        },
        [3 /* SimpleOps.OP_ADD */]: (state) => {
            const a = state.stack.pop();
            const b = state.stack.pop();
            if (a === undefined || b === undefined) {
                state.error = "The program tried to pop from an empty stack." /* SimpleError.EMPTY_STACK */;
                return state;
            }
            state.stack.push(a + b);
            return state;
        },
        [4 /* SimpleOps.OP_REPEAT */]: (state) => {
            if (state.repeated) {
                return state;
            }
            state.repeated = true;
            state.ip = -1;
            return state;
        },
    },
    success: (state) => state.error === undefined
        ? state.stack[state.stack.length - 1] === 1
            ? true
            : "The top stack item must be a 1." /* SimpleError.FAIL */
        : state.error,
    undefined: (state) => {
        state.error = "The program called an undefined opcode." /* SimpleError.UNDEFINED */;
        return state;
    },
    verify: (resolvedTransaction, evaluate, success) => {
        const result = success(evaluate({
            instructions: resolvedTransaction.transaction.instructions,
        }));
        return typeof result === 'string' ? result : true;
    },
};
const vm = createAuthenticationVirtualMachine(simpleInstructionSet);
const instructions = [
    { opcode: 0 /* SimpleOps.OP_0 */ },
    { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
    { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
    { opcode: 0 /* SimpleOps.OP_0 */ },
    { opcode: 2 /* SimpleOps.OP_DECREMENT */ },
    { opcode: 3 /* SimpleOps.OP_ADD */ },
];
const instructionsFail1 = [
    { opcode: 0 /* SimpleOps.OP_0 */ },
    { opcode: 2 /* SimpleOps.OP_DECREMENT */ },
];
const instructionsFail2 = [
    { opcode: 0 /* SimpleOps.OP_0 */ },
    { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
    { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
    { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
    { opcode: 2 /* SimpleOps.OP_DECREMENT */ },
    { opcode: 2 /* SimpleOps.OP_DECREMENT */ },
];
test('vm.evaluate with a simple instruction set', (t) => {
    t.deepEqual(vm.evaluate({ instructions }), {
        instructions,
        ip: 6,
        stack: [1],
    });
});
test('vm.debug with a simple instruction set', (t) => {
    t.deepEqual(vm.debug({ instructions }), [
        { instructions, ip: 0, stack: [] },
        { instructions, ip: 1, stack: [0] },
        { instructions, ip: 2, stack: [1] },
        { instructions, ip: 3, stack: [2] },
        { instructions, ip: 4, stack: [2, 0] },
        { instructions, ip: 5, stack: [2, -1] },
        { instructions, ip: 6, stack: [1] },
        { instructions, ip: 6, stack: [1] },
    ]);
});
test('vm.debug with a simple instruction set (failure 1)', (t) => {
    t.deepEqual(vm.debug({ instructions: instructionsFail1 }), [
        { instructions: instructionsFail1, ip: 0, stack: [] },
        { instructions: instructionsFail1, ip: 1, stack: [0] },
        { instructions: instructionsFail1, ip: 2, stack: [-1] },
        { instructions: instructionsFail1, ip: 2, stack: [-1] },
    ]);
});
test('vm.debug with a simple instruction set (failure 2)', (t) => {
    t.deepEqual(vm.debug({ instructions: instructionsFail2 }), [
        { instructions: instructionsFail2, ip: 0, stack: [] },
        { instructions: instructionsFail2, ip: 1, stack: [0] },
        { instructions: instructionsFail2, ip: 2, stack: [1] },
        { instructions: instructionsFail2, ip: 3, stack: [2] },
        {
            error: "Values may be no larger than 2." /* SimpleError.EXCESSIVE */,
            instructions: instructionsFail2,
            ip: 4,
            stack: [3],
        },
        {
            error: "Values may be no larger than 2." /* SimpleError.EXCESSIVE */,
            instructions: instructionsFail2,
            ip: 4,
            stack: [3],
        },
    ]);
});
test('vm.verify with a simple instruction set (success)', (t) => {
    t.deepEqual(vm.verify({ transaction: { instructions } }), true);
});
test('vm.verify with a simple instruction set (failure 1)', (t) => {
    t.deepEqual(vm.verify({ transaction: { instructions: instructionsFail1 } }), "The top stack item must be a 1." /* SimpleError.FAIL */);
});
test('vm.verify with a simple instruction set (failure 2)', (t) => {
    t.deepEqual(vm.verify({ transaction: { instructions: instructionsFail2 } }), "Values may be no larger than 2." /* SimpleError.EXCESSIVE */);
});
test('vm.stateDebug with a simple instruction set', (t) => {
    t.deepEqual(vm.stateDebug({ instructions, ip: 0, stack: [] }), [
        { instructions, ip: 0, stack: [] },
        { instructions, ip: 1, stack: [0] },
        { instructions, ip: 2, stack: [1] },
        { instructions, ip: 3, stack: [2] },
        { instructions, ip: 4, stack: [2, 0] },
        { instructions, ip: 5, stack: [2, -1] },
        { instructions, ip: 6, stack: [1] },
    ]);
});
test('vm.stateEvaluate does not mutate the original state', (t) => {
    const unchanged = { instructions, ip: 0, stack: [] };
    t.deepEqual(vm.stateEvaluate(unchanged), { instructions, ip: 6, stack: [1] });
    t.deepEqual(unchanged, { instructions, ip: 0, stack: [] });
});
test('vm.stateStep does not mutate the original state', (t) => {
    const unchanged = { instructions, ip: 5, stack: [2, -1] };
    t.deepEqual(vm.stateStep(unchanged), { instructions, ip: 6, stack: [1] });
    t.deepEqual(unchanged, { instructions, ip: 5, stack: [2, -1] });
});
test('vm.stateStepMutate does not clone (mutating the original state)', (t) => {
    const changed = { instructions, ip: 5, stack: [2, -1] };
    t.deepEqual(vm.stateStepMutate(changed), { instructions, ip: 6, stack: [1] });
    t.deepEqual(changed, { instructions, ip: 6, stack: [1] });
});
test('vm.stateSuccess is available', (t) => {
    t.deepEqual(vm.stateSuccess({ instructions: instructionsFail1, ip: 0, stack: [2] }), "The top stack item must be a 1." /* SimpleError.FAIL */);
});
test('vm.stateClone is available', (t) => {
    t.deepEqual(vm.stateClone({
        instructions,
        ip: 0,
        stack: [1, 2, 3],
    }), {
        instructions,
        ip: 0,
        stack: [1, 2, 3],
    });
});
test('vm can control the instruction pointer', (t) => {
    const repeated = [
        { opcode: 0 /* SimpleOps.OP_0 */ },
        { opcode: 1 /* SimpleOps.OP_INCREMENT */ },
        { opcode: 4 /* SimpleOps.OP_REPEAT */ },
        { opcode: 3 /* SimpleOps.OP_ADD */ },
        { opcode: 0 /* SimpleOps.OP_0 */ },
        { opcode: 2 /* SimpleOps.OP_DECREMENT */ },
        { opcode: 3 /* SimpleOps.OP_ADD */ },
    ];
    const result = vm.stateDebug({ instructions: repeated, ip: 0, stack: [] });
    t.deepEqual(result, [
        { instructions: repeated, ip: 0, stack: [] },
        { instructions: repeated, ip: 1, stack: [0] },
        { instructions: repeated, ip: 2, stack: [1] },
        { instructions: repeated, ip: 0, repeated: true, stack: [1] },
        { instructions: repeated, ip: 1, repeated: true, stack: [1, 0] },
        { instructions: repeated, ip: 2, repeated: true, stack: [1, 1] },
        { instructions: repeated, ip: 3, repeated: true, stack: [1, 1] },
        { instructions: repeated, ip: 4, repeated: true, stack: [2] },
        { instructions: repeated, ip: 5, repeated: true, stack: [2, 0] },
        { instructions: repeated, ip: 6, repeated: true, stack: [2, -1] },
        { instructions: repeated, ip: 7, repeated: true, stack: [1] },
    ]);
});
//# sourceMappingURL=virtual-machine.spec.js.map