// Editorial guides — public, text-rich articles that give search engines
// something substantial to index and rank, and give readers a real reason to
// land on the site before they ever sign up. Each guide targets a search
// intent ("how to be more articulate", "BLUF", "cut filler words") and
// cross-links into the matching course module.
//
// Content is authored here (not a CMS) so it ships with the build, renders as
// static HTML, and stays version-controlled alongside the course.

export type GuideSection = {
  heading: string;
  /** Paragraphs of body copy. Rendered as <p> in order. */
  body: string[];
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  /** SEO title / page H1 (the layout appends "· iArticulate"). */
  title: string;
  /** Meta description — keep ~150–160 chars. */
  description: string;
  keywords: string[];
  /** One-sentence standfirst shown under the H1 and used for OG. */
  dek: string;
  readMinutes: number;
  /** ISO date (YYYY-MM-DD). */
  datePublished: string;
  dateModified: string;
  sections: GuideSection[];
  faq?: GuideFaq[];
  /** Slug of the course module this guide maps to, for a "practice this" link. */
  relatedModuleSlug?: string;
  relatedModuleLabel?: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-to-be-more-articulate",
    title: "How to Be More Articulate: A Practical Framework",
    description:
      "A practical, evidence-based framework for becoming more articulate at work — how to organize a thought, lead with the point, and say it clearly the first time.",
    keywords: [
      "how to be more articulate",
      "become more articulate",
      "speak more clearly",
      "articulate communication",
      "clear communication skills",
    ],
    dek: "Being articulate isn't a gift you're born with — it's a small set of habits you can practice. Here's the framework.",
    readMinutes: 7,
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    sections: [
      {
        heading: "What “articulate” actually means",
        body: [
          "Most people think being articulate is about vocabulary — reaching for the impressive word in the moment. It isn't. The people we call articulate are simply easy to follow: you always know what their point is, why it matters, and what they want you to do. The words are ordinary. The structure is what makes them land.",
          "That's good news, because structure is learnable. You don't need a bigger vocabulary or more confidence to sound clearer tomorrow — you need a repeatable way to organize a thought before it leaves your mouth or your keyboard.",
        ],
      },
      {
        heading: "Lead with the point, not the build-up",
        body: [
          "The single highest-leverage habit is to say your conclusion first, then support it. Under pressure, most people do the opposite: they narrate the journey — context, caveats, background — and bury the point at the end, if they reach it at all. By then the listener has stopped tracking.",
          "This is the primacy effect at work: people remember and organize around what they hear first. Give them the headline, and everything after it becomes supporting detail they can slot into place. Bury the headline, and every detail floats free with nowhere to attach.",
          "Practically: before you speak, finish the sentence “The one thing I need you to know is…”. Say that first. In writing, put it in the subject line and the opening sentence — this is the BLUF (bottom line up front) discipline that militaries and consultancies drill for exactly this reason.",
        ],
      },
      {
        heading: "Group your support into threes",
        body: [
          "Once you've led with the point, you need to back it up without drowning the listener. Working memory holds only about three to four chunks at once, so a wall of eight reasons lands worse than the best three. Pick your strongest points, group them, and signal the structure out loud: “There are three reasons.”",
          "Numbered structure does double duty — it tells the listener how much is coming (so they can relax and track it) and it forces you to prioritize instead of dumping everything you know.",
        ],
      },
      {
        heading: "Cut the words that aren't working",
        body: [
          "Concision is a form of respect: it lowers the effort the listener has to spend. After you've drafted a message, delete hedges (“I just wanted to quickly…”), filler (“basically”, “kind of”, “sort of”), and throat-clearing openers that delay the point. Read it aloud — anything you stumble over is usually a cut.",
          "This is the fastest visible win. The same idea in half the words almost always reads as more confident and more senior, even when nothing else changed.",
        ],
      },
      {
        heading: "Land the “so what”",
        body: [
          "Facts don't move people; implications do. After you state something, answer the question the listener is silently asking: so what? A useful pattern is What → So What → Now What — the fact, why it matters, and what should happen next. It turns raw information into a decision the other person can actually act on.",
        ],
      },
      {
        heading: "Practice on real scenarios, with feedback",
        body: [
          "Reading about clarity won't make you clearer — reps will. The fastest way to improve is to write or speak a real answer to a realistic prompt, then get specific feedback on what to fix, and revise. That tight loop of attempt → critique → rewrite is what actually rewires the habit.",
          "That's exactly how the iArticulate course is built: short lessons on each of these principles, then AI-coached drills that score your answer against a clarity rubric and rewrite it stronger in your own words.",
        ],
      },
    ],
    faq: [
      {
        q: "Can you learn to be more articulate, or is it natural?",
        a: "It's learnable. Being articulate is mostly about structure — leading with your point, grouping support, and cutting filler — not about vocabulary or innate talent. These are habits you build with practice and feedback.",
      },
      {
        q: "What is the fastest way to sound more articulate?",
        a: "State your conclusion first, then support it. Leading with the point (BLUF) is the single change that most reliably makes you easier to follow, in both speaking and writing.",
      },
      {
        q: "How long does it take to become more articulate?",
        a: "You can sound clearer in a single message by leading with the point and cutting filler. Making it automatic takes weeks of deliberate practice on real scenarios with feedback.",
      },
    ],
    relatedModuleSlug: "lead-with-the-point",
    relatedModuleLabel: "Lead with the point",
  },
  {
    slug: "bluf-bottom-line-up-front",
    title: "The BLUF Method: How to Lead With the Point",
    description:
      "BLUF — bottom line up front — is the fastest way to make any message clearer. Learn what it is, why it works, and how to write BLUF emails and updates.",
    keywords: [
      "BLUF",
      "bottom line up front",
      "lead with the point",
      "BLUF email",
      "how to write clear emails",
    ],
    dek: "Bottom Line Up Front is the habit that separates messages people act on from messages they skim and forget.",
    readMinutes: 6,
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    sections: [
      {
        heading: "What BLUF means",
        body: [
          "BLUF stands for “bottom line up front.” It's a writing and speaking discipline borrowed from the military and adopted across consulting, product, and executive communication: state your conclusion, request, or recommendation in the first sentence — before the context, the analysis, or the caveats.",
          "The bottom line is what you'd say if you only had one sentence: the decision you need, the answer to the question, the thing that changed. Everything else is support that comes after.",
        ],
      },
      {
        heading: "Why leading with the point works",
        body: [
          "Readers organize information around whatever they encounter first — the primacy effect. When your point comes first, every following detail has a place to attach. When it comes last, the reader holds a bag of loose facts and has to reconstruct your logic, which most won't bother to do.",
          "It also respects attention. A manager scanning forty messages decides in seconds whether to engage. BLUF gives them the answer in that window. If they need the reasoning, it's right below; if they don't, you've already delivered the value.",
        ],
      },
      {
        heading: "How to write a BLUF email",
        body: [
          "Start with the ask or the answer. “Recommendation: ship Friday. Two risks are cleared; one is acceptable.” Then, below, give the supporting detail in descending order of importance.",
          "Put the bottom line in the subject line too. “Approve $12k for the vendor by Thu?” beats “Vendor question.” The reader knows what you want before they open it.",
          "A quick test: if someone read only your first sentence, would they know what you need from them? If not, you've buried the lede — rewrite the opener.",
        ],
      },
      {
        heading: "When to soften the order",
        body: [
          "BLUF is a default, not a law. For genuinely sensitive news — a layoff, a serious mistake, a rejection — a single sentence of framing before the bottom line can be kinder and more effective. But that's a deliberate exception for emotional register, not license to bury routine points. In day-to-day work, front-load.",
        ],
      },
      {
        heading: "Practice the habit",
        body: [
          "BLUF feels unnatural at first because it inverts how we think — we discover the point by talking through the context. The fix is to draft normally, then find the sentence that is the point and move it to the top. Do that enough times and you'll start there instinctively.",
          "The iArticulate module “Lead with the point” drills exactly this: you respond to realistic prompts and get scored on whether your bottom line is actually up front, with a rewrite that shows you how.",
        ],
      },
    ],
    faq: [
      {
        q: "What does BLUF stand for?",
        a: "BLUF stands for “bottom line up front” — a discipline of stating your main conclusion, recommendation, or request in the first sentence, before the supporting context.",
      },
      {
        q: "Is BLUF rude or too blunt?",
        a: "No. Leading with the point respects the reader's time and is standard in executive communication. For emotionally sensitive messages you can add one sentence of framing first, but routine messages should front-load the point.",
      },
      {
        q: "Where should the bottom line go in an email?",
        a: "In the subject line and the opening sentence. A reader who sees only those should already know what you need from them.",
      },
    ],
    relatedModuleSlug: "lead-with-the-point",
    relatedModuleLabel: "Lead with the point",
  },
  {
    slug: "cut-filler-words",
    title: "How to Cut Filler Words and Write With Concision",
    description:
      "Filler words and hedges make you sound less sure of yourself. Learn which words to cut, why concision reads as confidence, and how to tighten any message.",
    keywords: [
      "filler words",
      "how to stop using filler words",
      "concise writing",
      "write with concision",
      "sound more confident",
    ],
    dek: "The same idea in half the words almost always reads as more confident — and more senior. Here's how to get there.",
    readMinutes: 6,
    datePublished: "2026-07-02",
    dateModified: "2026-07-02",
    sections: [
      {
        heading: "Why concision reads as confidence",
        body: [
          "Every extra word costs the reader effort — and hedges quietly signal that you're not sure. “I just wanted to quickly check if maybe we could possibly…” tells the reader you expect to be brushed off. “Can we move the review to Thursday?” tells them you expect an answer.",
          "Concision lowers cognitive load and raises perceived authority at the same time. At senior levels especially, less is more: the tightest version of a message is usually the most credible one.",
        ],
      },
      {
        heading: "The words to cut first",
        body: [
          "Hedges: just, quickly, maybe, possibly, sort of, kind of, a bit, I think, I feel like. They shrink your point. Cut them unless the uncertainty is real and load-bearing.",
          "Throat-clearing openers: “I just wanted to reach out to…”, “I was wondering if…”, “I hope this finds you well, and…”. Delete them and start with the actual point.",
          "Redundant pairs: “each and every”, “first and foremost”, “in order to” (use “to”), “at this point in time” (use “now”). One word is doing the work; drop the passenger.",
          "Filler in speech: um, uh, like, you know, basically, actually, literally. In writing you can edit these out; when speaking, the fix is usually a short pause — silence reads far better than a filler.",
        ],
      },
      {
        heading: "A two-pass editing method",
        body: [
          "First pass — cut: go line by line and delete anything the sentence survives without. If the meaning holds, the word was decoration.",
          "Second pass — read aloud: your ear catches what your eye skips. Anything you stumble over, trip on, or run out of breath saying is a candidate for cutting or splitting. Awkward to say usually means awkward to read.",
        ],
      },
      {
        heading: "Concise isn't curt",
        body: [
          "Cutting words doesn't mean cutting warmth. Keep the human touches that matter — a genuine thanks, a clear acknowledgement — and cut the padding around them. The goal is a message that's easy to read and unmistakably yours, not a telegram.",
        ],
      },
      {
        heading: "Build the habit with reps",
        body: [
          "Concision is a muscle. The fastest way to train it is to take your own real messages, cut them by a third, and check that nothing important was lost — then get feedback on whether you cut the right things.",
          "The iArticulate module “Cut to the bone” drills this directly: you tighten realistic messages and get scored on concision, with a leaner rewrite in your own voice.",
        ],
      },
    ],
    faq: [
      {
        q: "What are filler words?",
        a: "Filler words are sounds and phrases that add no meaning — um, uh, like, you know, basically, actually — plus written hedges such as just, quickly, and maybe. They dilute your point and can make you sound unsure.",
      },
      {
        q: "How do I stop saying um and uh?",
        a: "Replace the filler with a short pause. Silence feels long to the speaker but reads as composed and deliberate to the listener. Slowing down slightly also gives you time to find the next word without a filler.",
      },
      {
        q: "Does being concise make you sound more confident?",
        a: "Yes. Cutting hedges and filler removes the signals of uncertainty, and a tighter message lowers the reader's effort — both of which read as confidence and seniority.",
      },
    ],
    relatedModuleSlug: "cut-to-the-bone",
    relatedModuleLabel: "Cut to the bone",
  },
];

export const GUIDE_MAP: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.slug, g]),
);
