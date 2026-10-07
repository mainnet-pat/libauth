---
'@bitauth/libauth': minor
---

Improve VM performance for large stack items, BCH 2026 functions, and short VM Numbers; add `isFunctionTableShared`, `safeIntegerToVmNumber`, and `shortVmNumberToNumber`. Stack items may now share memory with other stack items, and a cloned program state shares its function table with the original until either defines a function: operations must not modify stack items in place, and must copy a shared function table (see `isFunctionTableShared`) before modifying it.
