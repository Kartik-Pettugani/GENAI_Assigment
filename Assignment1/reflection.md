# Reflection — Persona-Based AI Chatbot

## What Worked

The biggest thing that worked was treating research and specificity as the “core feature” instead of treating the UI or API wiring as the hard part. Once the prompts contained concrete identity anchors (ICPC cities for Anshuman, the Malta sale + Fab.com product lens for Abhimanyu, and Kshitij’s “just 2 classes” teaching origin plus LLD obsession), the model started sounding distinct almost immediately. The suggestion chips were also surprisingly important: they nudged the first interaction into topics that strongly expose the persona voice, which made the rest of the conversation more consistent.

The second win was the chain-of-thought rubric inside each prompt. Without that reasoning structure, all three personas occasionally drifted into a generic “helpful tutor” voice. With it, answers became grounded in an experience → evidence/story → takeaway pattern, and they reliably ended with a question/challenge, which is critical for natural chat flow.

On the implementation side, the simplest UX decisions created the biggest perceived quality jump: resetting the conversation on persona switch, keeping the active persona card always visible, and showing suggestion chips only at the start. These small constraints make it hard for the user to “accidentally” blend personas and also make evaluation easy: you can switch to a persona, ask one chip question, and immediately judge whether the voice matches.

## What the GIGO Principle Taught Me

GIGO became obvious in early tests. When the persona description was vague (“be inspiring”, “be helpful”), outputs were polite but interchangeable. When the input contained specific, verifiable details and specific constraints (no competitor-bashing, no invented salary numbers, no hedging-without-a-point-of-view), outputs became more opinionated, more consistent, and more “human.” In other words, the model didn’t magically “become Anshuman/Kshitij/Abhimanyu” — it mirrored the quality of the identity container I gave it.

I also learned that constraints are part of “good input.” They prevent the model from wandering into risky or tone-breaking territory. For persona work, constraints aren’t optional — they’re the guardrails that keep authenticity intact.

Another practical lesson was that persona quality isn’t binary — it drifts. A persona can sound perfect on one category of questions and become generic on another. The only way I found to catch this was to test each persona with a small “evaluation set” (technical question, career question, and a values/opinion question). When the output didn’t feel authentic, the fix was almost always upstream: add a sharper constraint, add a few-shot example that demonstrates the missing behavior, or tighten the output format.

## What I Would Improve

If I had more time, I would add (1) streaming responses so the typing indicator feels more natural, (2) more few-shot examples (5–7 per persona) covering edge cases like deeply technical questions and sensitive career dilemmas, and (3) stronger “voice forcing” rules for technical explanations so that even a basic DSA question still gets framed through each persona’s lens (Anshuman → conviction + outcomes, Abhimanyu → systems/product thinking, Kshitij → pedagogy + uncomfortable-but-necessary questions).
