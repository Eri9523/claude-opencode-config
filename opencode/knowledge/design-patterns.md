# Design Patterns: Nielsen's Usability Heuristics

Apply these 10 heuristics to every UI/UX decision. They are hard constraints evaluated during design critique, not optional guidelines.

## The 10 Heuristics

### 1. Visibility of System Status
Always keep the user informed about what is happening via timely feedback. Loading spinners, progress bars, active states, success/error toasts, and disabled states during async operations are all required, not optional.

### 2. Match Between System and the Real World
Use the user's language — words, phrases, and concepts familiar to the user, not system-internal terms. Follow real-world conventions so information appears in a natural and logical order.

### 3. User Control and Freedom
Every action must be undoable or escapable. Provide clear "undo," "cancel," and "back" options. No dead ends. Destructive operations (delete, publish, send) require confirmation.

### 4. Consistency and Standards
One thing, one name, one style — always. Follow platform conventions (web, mobile, OS-level) unless there is a deliberate, documented reason to deviate. Inconsistency destroys learned behavior and erodes trust.

### 5. Error Prevention
Design to prevent problems from occurring in the first place. Disable invalid actions, validate inline before submission, use confirmation dialogs for irreversible operations. A good constraint beats a good error message.

### 6. Recognition Rather Than Recall
Minimize cognitive load. Make objects, actions, and options visible. Users should not have to remember information from one part of the interface to use another. Labels, icons with text, and tooltips are load-bearing elements.

### 7. Flexibility and Efficiency of Use
Accelerators for experts must not slow down novices. Keyboard shortcuts, command palettes, and bulk actions serve power users without complicating the default path. Design the obvious flow first, then add speed layers.

### 8. Aesthetic and Minimalist Design
Irrelevant or rarely needed information competes with relevant information and diminishes its relative visibility. Every element on screen must earn its place. Visual weight encodes information hierarchy.

### 9. Help Users Recognize, Diagnose, and Recover from Errors
Error messages must: (a) use plain language, (b) name the specific problem, (c) tell the user what to do next. Never blame the user, never expose technical internals, never be vague. One actionable read is the standard.

### 10. Help and Documentation
Documentation should not be required for basic use — if it is, fix the UI. When help is needed, make it searchable, task-focused, and available in context without leaving the current flow.

## Critique Checklist

Before declaring a UI component or flow complete, run this checklist:

- [ ] Does the user always know what the system is doing? (H1)
- [ ] Is all language user-facing, not system-facing? (H2)
- [ ] Can every action be undone or cancelled? (H3)
- [ ] Are labels, icons, and patterns consistent throughout? (H4)
- [ ] Are invalid/destructive actions prevented or confirmed before execution? (H5)
- [ ] Is required information visible, not memorized? (H6)
- [ ] Are power-user shortcuts available without hurting the default path? (H7)
- [ ] Does every element earn its screen real estate? (H8)
- [ ] Do error messages name the problem and prescribe the fix? (H9)
- [ ] Is in-context help available where the UI itself cannot be made clearer? (H10)

## Reference

Source: Jakob Nielsen, "10 Usability Heuristics for User Interface Design" (Nielsen Norman Group, 1994, revised 2020).
