# Article Type · interactive-explainer

Reconstructs a long technical article / paper / system design document **into a "learn by using it" learning page carried primarily by interactive animation**. Reference points: 3blue1brown-style visualization, distill.pub's tunable-parameter explanations of machine learning, and Bartosz Ciechanowski's (ciechanow.ski) "playable hardware-principles pages."

> **Key difference from explainer**:
>
> - `explainer`: **prose is the lead**, Raw is a supporting illustration. After reading, the reader "knows."
> - `interactive-explainer`: **Raw is the lead**, prose is brief guidance and definitions. After operating it, the reader "can use it."

- **Recommended retention**: ~25% (**note: this percentage does not mean "75% of the source text was deleted" — it means "sentences/paragraphs taken directly from the source make up only about 25% of the finished piece"**). The essence of this type is **content reconstruction** — from the source, **only excerpt** the key definitions, formulas, data, constraints, and common pitfalls of the core knowledge points; the AI writes the remaining 75% **entirely from scratch** around those knowledge points: guiding text, intuitive explanations, interactive demos, "try it yourself," and understanding checks. The source's narrative setup, historical background, worked-example elaboration, and extended discussion are **all discarded**, replaced by interactivity. **Do not treat this as "an explainer with 50% cut"** — that approach fails to teach deeply and defeats the purpose of this type.
- **Typical structure**:
  - `Hero` (one-sentence positioning: what this page teaches you / what you'll play with)
  - `Lead` (prerequisites: 1-2 sentences on what background you need, and what you'll be able to do after playing with it)
  - optional `Summary` (listing N core knowledge points as a roadmap)
  - multiple **Concept Sections**, one core knowledge point per section, each in a three-part structure:
    1. **Definition / intuition**: 1-3 paragraphs of prose + an `Aside tone="principle"` pulling out a one-sentence intuition.
    2. **Interactive demo** (Raw lead): animation / sliders / drag-and-drop / state toggles / real-time visualization of parameter changes.
    3. **Try it yourself / verify understanding** (Raw interactivity): let the reader hands-on try an edge case / counterexample / application scenario; optionally a collapsible "reveal the answer."
  - `Conclusion` (a review tying the knowledge points together + when to use / not use + further reading).
- **Component choice**:
  - prose is **short**: the total prose per section is usually no more than 200-400 words;
  - `Aside tone="principle"` to flag definitions, key intuitions, common pitfalls;
  - `Detail` / `Tabs` to collapse secondary details, answers, derivations;
  - `Quote` to cite the source text / memorable lines from the paper;
  - use `Table` / `CodeBlock` sparingly (if used, they must serve a specific interactive demo, not a full page of code);
  - `Raw` is the star.
- **Raw boundary (core · required reading)**:
  - **Every Raw must serve one specific knowledge point** — decorative showing-off is not allowed.
  - **Operability first**: sliders / drag-and-drop / toggles / input fields / step buttons; let the user **change a quantity** and **see the result in real time**. This goes deeper than "watching an animation."
  - **State must be visible**: the current parameters, current values, and current stage must all be explicitly visible — don't hide them inside the animation.
  - **Resettable**: every interaction should come with a "reset" or "restore initial value" control, encouraging repeated experimentation.
  - **Styling goes through tokens**: use `--ra-*` for color / font / spacing, no ad hoc CSS.
  - **Error examples are just as valuable**: let the user drag to a position that "breaks," with a line explaining "why it breaks here."
- **Imagery tendency**: `none` preferred (interactivity carries more information than images); a small amount of `placeholders` (theoretical diagrams / screenshots); avoid `ai-generated` (mood imagery interrupts the learning rhythm).
- **Theme tendency**: `tufte` (restrained + data-driven, suited to ML/algorithm visualization), `shannon` (dark, engineering feel, suited to system/hardware interactive demos), `knuth` (academic restraint, suited to paper reconstructions); avoid lively color schemes like `freddie` / `sottsass` (they make the interaction feel like a game rather than learning).
- **Self-check**:
  - After playing with it, can the reader **actually use** the concept, rather than just having "heard of / seen" it?
  - Does every interaction serve a specific knowledge point? Is there any Raw that shows off but teaches nothing?
  - For any section without interaction — does it genuinely not need interaction, or was this laziness? (This is the key question for judging whether the type has drifted off course.)
  - Can it be operated on mobile? Many sliders / drag-and-drop interactions / complex SVGs don't work on mobile — you must decide during the Plan phase whether to "forgo mobile interactivity" or "provide an alternative mobile presentation."
  - After removing all Raw, is the remaining prose too thin? Being too thin means Raw isn't carrying the information — it should be supplemented within the Raw block or immediately adjacent to it.
  - Is the proportion of "sentences/paragraphs taken directly from the source" in the finished piece **really around the ~25% mark**? Too high (>40%) means you're "trimming an explainer" rather than reconstructing; too low (<10%) means the core knowledge points aren't clearly stated.
  - **Core knowledge point selection must be justified**: can you state in one sentence "why these N knowledge points, and not others, were kept on this page"? Picking a few at random is the first sign of this type drifting off course.

> **When not to use interactive-explainer**:
>
> - The source material is narrative / opinion / commentary (→ essay).
> - The source material is a sequence of procedural steps (→ tutorial; steps have a before/after dependency, not a parallel set of knowledge points).
> - The source material is a data report (→ full-report; conclusions matter more than interactivity).
> - You don't intend to build a genuinely operable Raw (→ explainer suffices; don't fake being interactive).
