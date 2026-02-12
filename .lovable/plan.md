

# Bug Report: Mind Map Application

## Bug 1: ExamCatalog reads from wrong localStorage key
**Severity:** Critical
**File:** `src/pages/ExamCatalog.tsx` (line 29)

The ExamCatalog tries to read mind map metadata using `localStorage.getItem('mindmap_${name}')` but all mind maps are stored under a single `mindmaps` key in localStorage (see `mindmapStorage.ts`). This means the exam category, sub-exam name, and creation date are never loaded -- every card shows "Unknown date" and no category badge.

**Fix:** Read from the `mindmaps` key and extract the data for each map name.

---

## Bug 2: Duplicate keyboard shortcut handlers
**Severity:** Medium
**Files:** `src/components/mindmap/MindMapKeyboardHandlers.tsx` and `src/components/mindmap/hooks/useMindMapNodeHandlers.ts`

Both files register `keydown` event listeners for the same shortcuts (Ctrl+C, Ctrl+V, Delete) and a `duplicate-node` custom event listener. This means every keyboard action fires twice, causing duplicate toasts and potential double operations.

**Fix:** Remove `MindMapKeyboardHandlers.tsx` entirely since `useMindMapNodeHandlers.ts` already handles all the same shortcuts (plus Ctrl+D and Backspace). Remove the import from `MindMap.tsx`.

---

## Bug 3: Node ID collision on add
**Severity:** Medium
**File:** `src/components/mindmap/MindMapNodeManager.ts` (line 13)

New node IDs are generated as `nodes.length + 1`. If you add 3 nodes (IDs: 1, 2, 3), delete node 2, then add another, the new ID will be `3` again (since length is now 3), causing a collision.

**Fix:** Use `uuid` (already installed) or a timestamp-based ID instead.

---

## Bug 4: View mode still shows interactive elements
**Severity:** Medium  
**File:** `src/components/mindmap/ExportedMindMap.tsx`

The CSS rule `.mindmap-viewer .react-flow__node button { display: none !important; }` hides all buttons, but `elementsSelectable={true}` still allows selecting nodes which triggers resize handles and selection outlines. This creates a confusing experience in view mode.

**Fix:** Set `elementsSelectable={false}` and keep `onNodeClick` for the detail dialog.

---

## Bug 5: Auto-save missing examCategory and subExamName
**Severity:** Low
**File:** `src/utils/mindmapAutoSave.ts` (line 53) and `src/components/mindmap/MindMap.tsx` (line 198)

When auto-save runs, it calls `saveMindMap({ nodes, edges, name })` without `examCategory` or `subExamName`. This overwrites any previously saved exam metadata with empty values.

**Fix:** Store and pass `examCategory` and `subExamName` in the auto-save call.

---

## Bug 6: MindMapSaveDialog does not pre-populate fields on re-open
**Severity:** Low  
**File:** `src/components/mindmap/MindMapSaveDialog.tsx`

The `name` state is initialized from `currentName` only once. When the dialog is re-opened with a different `currentName`, the old value persists.

**Fix:** Add a `useEffect` to sync `name` with `currentName` when the dialog opens.

---

## Bug 7: `window.mindmapApi` assigned outside useEffect
**Severity:** Low
**File:** `src/components/mindmap/MindMap.tsx` (line 219)

`window.mindmapApi` is assigned directly in the render body, which runs on every render. It should be inside a `useEffect` with proper cleanup.

**Fix:** Move the assignment into a `useEffect` and clean up on unmount.

---

## Implementation Plan

1. **Delete** `src/components/mindmap/MindMapKeyboardHandlers.tsx` and remove its import/usage from `MindMap.tsx` (Bug 2)
2. **Fix** `MindMapNodeManager.ts` to use `crypto.randomUUID()` or `uuid` for node IDs (Bug 3)
3. **Fix** `ExamCatalog.tsx` to read metadata from the `mindmaps` localStorage key (Bug 1)
4. **Fix** `ExportedMindMap.tsx` to set `elementsSelectable={false}` (Bug 4)
5. **Fix** `MindMap.tsx` auto-save to include exam metadata, and move `window.mindmapApi` into `useEffect` (Bugs 5, 7)
6. **Fix** `MindMapSaveDialog.tsx` to sync state when dialog opens (Bug 6)

