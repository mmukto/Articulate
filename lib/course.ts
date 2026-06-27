import type {
  Dimension,
  DimensionKey,
  DeliveryDimension,
  DeliveryKey,
  Module,
} from "./types";

export const DIMENSIONS: Dimension[] = [
  {
    key: "clarity",
    label: "Clarity",
    description:
      "Could a busy executive grasp the point on one read, with no re-reading?",
  },
  {
    key: "concision",
    label: "Concision",
    description: "Is every word load-bearing? Filler, hedging, and throat-clearing removed?",
  },
  {
    key: "structure",
    label: "Structure",
    description: "Does it lead with the point, then support it in a logical order?",
  },
  {
    key: "precision",
    label: "Precision",
    description: "Concrete and specific rather than abstract, vague, or jargon-laden?",
  },
  {
    key: "audience",
    label: "Audience",
    description:
      "Written for this reader — translates jargon into their terms and leads with what they care about (their stake, the 'so what').",
  },
  {
    key: "impact",
    label: "Impact",
    description:
      "Executive presence — confident, decisive, and owns a clear recommendation.",
  },
];

export const DIMENSION_MAP: Record<DimensionKey, Dimension> = DIMENSIONS.reduce(
  (acc, d) => {
    acc[d.key] = d;
    return acc;
  },
  {} as Record<DimensionKey, Dimension>,
);

// Dimensions evaluated from a spoken recording (the "Speak" practice mode).
export const DELIVERY_DIMENSIONS: DeliveryDimension[] = [
  {
    key: "pace",
    label: "Pace",
    description: "Steady and unhurried, with pauses that aid emphasis — not rushed or draggy.",
  },
  {
    key: "fillers",
    label: "Filler-free",
    description: "Few 'um', 'uh', 'like', 'sort of', or false starts breaking the flow.",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "Easy to follow spoken — leads with the point, well-organized, not rambling.",
  },
  {
    key: "pronunciation",
    label: "Enunciation",
    description:
      "Words clearly articulated and easy to understand (general intelligibility, not accent).",
  },
];

export const DELIVERY_MAP: Record<DeliveryKey, DeliveryDimension> =
  DELIVERY_DIMENSIONS.reduce(
    (acc, d) => {
      acc[d.key] = d;
      return acc;
    },
    {} as Record<DeliveryKey, DeliveryDimension>,
  );

const RAW_MODULES: Module[] = [
  {
    slug: "lead-with-the-point",
    number: 1,
    title: "Lead With the Point",
    tagline: "Bottom line up front. Earn the detail later.",
    outcomes: [
      "Open with your conclusion or ask in the first sentence",
      "Recognize and cut the warm-up that buries your message",
      "Use BLUF (Bottom Line Up Front) under time pressure",
    ],
    lesson: {
      summary:
        "Executives read and listen in priority order, not chronological order. The single highest-leverage habit in executive communication is to state your conclusion, recommendation, or ask first — then support it. If a reader stops after one sentence, they should still have the most important thing.",
      concepts: [
        {
          heading: "Answer first, explain second",
          body: "Most people build to their point like a story: context, then analysis, then conclusion. Executives want the reverse. Give the headline, then let those who need the reasoning read on. This is not dumbing down — it is respecting that your reader is triaging dozens of inputs.",
        },
        {
          heading: "The one-sentence test",
          body: "Before you send anything, ask: if the reader saw only my first sentence, would they know what I need from them or what I concluded? If not, your real message is buried somewhere below — promote it.",
        },
        {
          heading: "Separate the ask from the context",
          body: "A common failure is fusing the request into a paragraph of background so the reader has to extract it. State the ask cleanly, then provide the context as support a reader can skim or skip.",
        },
      ],
      evidence:
        "Cognitive psychology's primacy effect: readers recall the opening and closing of a message best, and stating the main point first gives a mental frame that improves comprehension — slide 'headlines' that carry the actual point outperform vague titles. Leading with the answer is also the core of the Minto Pyramid Principle taught in MIT Sloan's communication courses.",
      examples: [
        {
          before:
            "I wanted to reach out because over the last few weeks the team has been looking at our onboarding funnel and we've noticed some patterns in where users drop off, and after a lot of discussion we think there might be an opportunity to make some changes.",
          after:
            "We should redesign step 3 of onboarding — it's where 40% of new users abandon. Here's what we found and what I'm proposing.",
          note: "The 'after' version delivers the conclusion in the first clause. The rest becomes optional support, not a treasure hunt.",
        },
        {
          before:
            "Just circling back on the budget thing from last week — there are a few considerations I think we should probably talk through at some point when you have a moment.",
          after:
            "I need a decision on the Q3 budget by Friday. Two options below; I recommend Option A.",
          note: "Vague 'circling back' becomes a clear ask with a deadline and a recommendation.",
        },
      ],
    },
    drills: [
      {
        id: "bluf-status",
        title: "The buried status update",
        scenario:
          "Your manager asked how the data migration project is going. It is behind schedule because a vendor delivered a corrupted export, but you have a recovery plan that gets you back on track within a week.",
        task: "Write a 2–4 sentence update that leads with the bottom line.",
        tips: [
          "First sentence = the headline: are we on track or not?",
          "Don't open with the vendor backstory — that's support, not the point.",
          "End with what you need (if anything) or your next step.",
        ],
        focus: ["structure", "clarity"],
        placeholder: "We're one week behind on the migration, but...",
      },
      {
        id: "bluf-ask",
        title: "Make the ask unmissable",
        scenario:
          "You need your director to approve hiring a contractor for three months to clear a backlog. You've been hinting at the workload problem for weeks but never made a direct request.",
        task: "Write a short message (3–5 sentences) where the ask is impossible to miss.",
        tips: [
          "State the request and the decision you need in sentence one.",
          "Quantify the problem so the ask feels justified.",
          "Make it easy to say yes: be specific about scope, time, and cost.",
        ],
        focus: ["clarity", "impact"],
      },
    ],
  },
  {
    slug: "start-with-the-audience",
    number: 2,
    title: "Start With the Audience",
    tagline: "Beat the curse of knowledge — write for their head, not yours.",
    outcomes: [
      "Name your reader and what they already know before you write",
      "Translate jargon into consequences the audience cares about",
      "Lead with their stake — what's in it for them",
    ],
    lesson: {
      summary:
        "Before any technique, ask: who is reading this, and what do they already know? The single most reliable way to be misunderstood is to write from inside your own head — assuming the reader shares your context. Great communicators start from the audience and work backward to the message.",
      concepts: [
        {
          heading: "The curse of knowledge",
          body: "Once you know something, you can't un-know it — so you systematically overestimate what your reader shares and skip the context they need. This is one of the most robust findings in communication research: it persists even when people are explicitly warned about it or paid to avoid it. 'Just simplify' doesn't fix it. What works is concrete: name your audience, ask what they already know and what they need, and build the missing bridge before the detail.",
        },
        {
          heading: "Answer 'what's in it for them?'",
          body: "Readers filter everything through their own stake. Frame your message around what the audience cares about — their goals, risks, decisions — not what's interesting to you. The same fact lands differently for a CFO (cost and risk), an engineer (effort and dependencies), and a customer (impact on them). Lead with the version that matches the reader.",
        },
        {
          heading: "Calibrate altitude to the reader",
          body: "Same facts, different altitude. A board wants the decision and the one number that matters; a peer may need the mechanism. More senior and more time-pressed almost always means higher-level and shorter. Don't flatten everyone to one register — pick the altitude for your actual reader.",
        },
        {
          heading: "Write to one primary audience",
          body: "Trying to address everyone at once produces a message that lands with no one. When a note has several readers, choose the primary decision-maker, write for them, and let others read over their shoulder. One message, one audience.",
        },
      ],
      evidence:
        "The curse of knowledge is robust and cross-cultural — it doesn't go away when people are warned or even paid to overcome it, so audience-translation has to be a deliberate step, not an afterthought. MIT Sloan's management-communication courses open with exactly this: a 'strategy checklist' that fixes audience, purpose, and message before a word is written.",
      examples: [
        {
          before:
            "The migration to the new event-sourced architecture hit a race condition in the Kafka consumer group rebalancing, so we added idempotency keys and replayed the dead-letter queue, which is why we slipped.",
          after:
            "We're a week late because a data-pipeline bug corrupted some records; we've fixed it and recovered the data, with no customer impact. Full timeline below.",
          note: "The 'after' translates internal jargon into the consequence the executive reader actually needs — without dumbing it down inaccurately.",
        },
        {
          before:
            "We should adopt the new tool because it has better observability and a cleaner API.",
          after:
            "To the CFO: 'This tool cuts our incident downtime ~30%, which is ~$120k/year in avoided losses, for $40k.' To the team: 'It kills the 2am pager pain — alerts that actually tell you what broke.'",
          note: "Same recommendation, reframed around each audience's stake — money and risk for the CFO, daily pain for the team.",
        },
      ],
    },
    drills: [
      {
        id: "translate-for-audience",
        title: "Translate for the audience",
        scenario:
          "You need to tell your non-technical CEO why a project slipped. The real reason: \"The migration to the new event-sourced architecture hit a race condition in the Kafka consumer group rebalancing, so we had to add idempotency keys and replay the dead-letter queue.\"",
        task: "Rewrite that for the CEO — someone with none of your technical context — in 2–4 sentences, without dumbing it down inaccurately.",
        tips: [
          "Beat the curse of knowledge: what does the CEO actually need to know?",
          "Lead with impact (timeline, cost, customer effect), not the internals.",
          "Translate jargon into business consequences; keep it honest.",
        ],
        focus: ["audience", "clarity"],
        placeholder: "We're about a week late because…",
      },
      {
        id: "reframe-to-stake",
        title: "Reframe to their stake",
        scenario:
          "You want to convince your CFO to fund a reliability project. You're excited about the engineering elegance, but the CFO cares about cost, risk, and predictability — not architecture.",
        task: "Write a 3–5 sentence pitch aimed squarely at the CFO's interests.",
        tips: [
          "Lead with what the CFO cares about: money, risk, predictability.",
          "Translate the technical benefit into a business outcome (and a number if you can).",
          "Cut anything that's only interesting to an engineer.",
        ],
        focus: ["audience", "impact"],
      },
    ],
  },
  {
    slug: "structure-that-carries",
    number: 3,
    title: "Structure That Carries",
    tagline: "Pyramid, SCQA, PREP — scaffolding for any message.",
    outcomes: [
      "Group supporting points under one governing idea",
      "Use SCQA to frame a problem before proposing a solution",
      "Reach for PREP when you need to be persuasive on your feet",
    ],
    lesson: {
      summary:
        "Clear thinking shows up as clear structure. Three reusable scaffolds — the Pyramid Principle, SCQA, and PREP — let you organize any message so the listener never has to hold loose pieces in their head.",
      concepts: [
        {
          heading: "The Pyramid Principle",
          body: "Start with a single governing message at the top. Beneath it, group your supporting arguments into a small number of buckets (ideally three). Each bucket is itself supported by facts. The reader can stop at any level and still have a complete, coherent thought. Avoid lists of ten parallel points — group them.",
        },
        {
          heading: "SCQA for framing problems",
          body: "Situation (what's stable and agreed), Complication (what changed or went wrong), Question (the question that complication raises), Answer (your recommendation). SCQA earns buy-in because the audience agrees with your framing before they hear your solution.",
        },
        {
          heading: "PREP for speaking persuasively",
          body: "Point, Reason, Example, Point. Make your claim, give the reason it's true, ground it in a concrete example, then restate the claim. It's a fast, repeatable shape for answering a question with conviction instead of rambling.",
        },
      ],
      examples: [
        {
          before:
            "We have a lot of issues — support tickets are up, the app is slow on Android, churn ticked up, the new pricing confused people, and engineering is stretched thin.",
          after:
            "Our retention problem has three drivers: a degraded Android experience, confusing new pricing, and slower support response. I'll take each in turn.",
          note: "A flat list of five items becomes one governing idea (retention) with three grouped drivers — far easier to hold and act on.",
        },
        {
          before:
            "I think we should move to quarterly planning. It would help a lot of things and I have a few reasons.",
          after:
            "We should move to quarterly planning (Point). Annual plans go stale by month three in our market (Reason). Last year we re-forecast revenue twice and re-cut the roadmap once — work we'd have avoided with shorter cycles (Example). Quarterly planning keeps us honest without constant churn (Point).",
          note: "PREP turns a vague opinion into a tight, persuasive case in four moves.",
        },
      ],
      evidence:
        "Working memory holds only about three to four 'chunks' at once (Cowan's research), so grouping support into ≤3 buckets — the 'rule of three' — is far easier to hold and recall than a flat list. SCQA and the Minto Pyramid Principle are the structuring tools taught in MIT Sloan's management-communication courses and McKinsey's writing training.",
    },
    drills: [
      {
        id: "scqa-frame",
        title: "Frame it with SCQA",
        scenario:
          "Your company has always sold through a direct sales team. A competitor just launched self-serve signup and is winning small customers fast. You believe you should build self-serve too.",
        task: "Write a short framing (4–6 sentences) using Situation, Complication, Question, Answer.",
        tips: [
          "Situation: state what everyone already agrees is true.",
          "Complication: name what changed — make it feel urgent.",
          "Question: the natural question the complication forces.",
          "Answer: your one-line recommendation.",
        ],
        focus: ["structure", "impact"],
      },
      {
        id: "pyramid-group",
        title: "Group the mess",
        scenario:
          "A teammate sends you eight scattered reasons the launch slipped: unclear specs, a sick engineer, a vendor delay, scope creep, a failed load test, holiday PTO, a dependency on another team, and ambiguous acceptance criteria.",
        task: "Rewrite this as one governing statement plus 2–3 grouped causes.",
        tips: [
          "Find the categories: people, scope, and external dependencies often work.",
          "Lead with a single sentence that names the real story.",
          "Don't list all eight — group them so they're memorable.",
        ],
        focus: ["structure", "concision"],
      },
    ],
  },
  {
    slug: "cut-to-the-bone",
    number: 3,
    title: "Cut to the Bone",
    tagline: "Concision is a sign of respect — and of clear thinking.",
    outcomes: [
      "Strip hedging, qualifiers, and throat-clearing",
      "Replace abstract noun-phrases with strong verbs",
      "Halve a paragraph without losing meaning",
    ],
    lesson: {
      summary:
        "Wordiness hides uncertainty and wastes the reader's attention. Concision is not about being terse — it's about making every word earn its place. Most business writing can be cut by a third with no loss of meaning, and usually a gain in force.",
      concepts: [
        {
          heading: "Kill the hedges",
          body: "'I just wanted to', 'I think maybe', 'sort of', 'kind of', 'it might be possible that' — these soften you into invisibility. Hedging signals you don't trust your own point. Say it plainly; if you're genuinely uncertain, name the specific uncertainty instead of fogging the whole sentence.",
        },
        {
          heading: "Verbs over nominalizations",
          body: "'We made a decision to do an evaluation of' is four nouns doing a verb's job. 'We decided to evaluate' is sharper. Hunt for words ending in -tion, -ment, -ance and ask whether a verb would do the work in half the space.",
        },
        {
          heading: "Cut the meta-commentary",
          body: "'I wanted to reach out to let you know that...', 'It's worth noting that...', 'As you may be aware...' — these announce that you're about to say something instead of just saying it. Delete the runway and start at the point.",
        },
      ],
      examples: [
        {
          before:
            "I just wanted to quickly follow up and let you know that I think it might possibly be a good idea for us to maybe consider revisiting the timeline at some point.",
          after: "We should revisit the timeline.",
          note: "Six hedges and a runway collapse into a five-word recommendation. The short version sounds more confident, not less polite.",
        },
        {
          before:
            "The implementation of the new process resulted in an improvement in the efficiency of the team's handling of incoming requests.",
          after: "The new process helped the team handle requests faster.",
          note: "Nominalizations (implementation, improvement) become verbs; the sentence drops from 22 words to 10.",
        },
      ],
      evidence:
        "Every extra word adds cognitive load. HBR's guidance on concise writing — cut filler, prefer short words for hard ideas — works because lowering the reader's processing cost makes the point easier to find and act on. At the executive level, less really is more.",
    },
    drills: [
      {
        id: "halve-it",
        title: "Halve the paragraph",
        scenario:
          "Here is a real-sounding paragraph: \"I wanted to take a moment to reach out regarding the upcoming project kickoff, as I think it would probably be beneficial for all of us to get on the same page about some of the various expectations and deliverables that we'll be responsible for over the course of the next few weeks or so.\"",
        task: "Rewrite it in one or two sentences with no loss of meaning.",
        tips: [
          "Find the single real message hiding in the padding.",
          "Delete every 'I wanted to', 'a moment', 'probably', 'various', 'or so'.",
          "Aim to cut at least half the words.",
        ],
        focus: ["concision", "clarity"],
      },
      {
        id: "de-hedge",
        title: "Say it like you mean it",
        scenario:
          "You disagree with a proposed approach but wrote: \"I might be wrong about this, and I don't want to step on anyone's toes, but I sort of feel like maybe we could possibly think about whether this is really the best path, though I could totally be missing something.\"",
        task: "Rewrite to state your disagreement plainly and respectfully.",
        tips: [
          "One clear claim. Keep the respect, drop the hedging.",
          "If you have a specific doubt, name it concretely.",
          "Confidence and courtesy are not opposites.",
        ],
        focus: ["impact", "concision"],
      },
    ],
  },
  {
    slug: "precision-and-evidence",
    number: 4,
    title: "Precision & Evidence",
    tagline: "Trade vague adjectives for concrete numbers and nouns.",
    outcomes: [
      "Replace vague intensifiers with specifics",
      "Anchor claims in evidence a skeptic would accept",
      "Translate data into a single clear insight",
    ],
    lesson: {
      summary:
        "Executives discount vague language automatically. 'Significant', 'soon', 'a lot', 'much better' carry almost no information. Precision builds trust: when you're specific, people believe you've actually looked. The skill is converting impressions into concrete, checkable claims.",
      concepts: [
        {
          heading: "Specifics beat intensifiers",
          body: "'We grew a lot' is weaker than 'We grew 18% quarter over quarter.' 'It'll be ready soon' is weaker than 'It'll be ready Thursday.' Whenever you reach for an intensifier (very, really, significantly), ask whether a number, date, or concrete noun would say more.",
        },
        {
          heading: "Data to insight, not data dump",
          body: "Don't make the reader interpret your numbers. State the insight, then show the number that supports it. 'Mobile is now our primary channel — 62% of signups came from phones last month' beats listing six metrics and hoping the reader connects them.",
        },
        {
          heading: "What → So what → Now what",
          body: "An insight still isn't a decision. After the fact (what) and why it matters to this audience (so what), name the action or decision you're asking for (now what). 'Mobile is 62% of signups (what), but our checkout is desktop-first (so what) — I want to fund a mobile checkout rebuild this quarter (now what).' This three-beat chain is what turns analysis into a call to action.",
        },
        {
          heading: "Pass the skeptic test",
          body: "Imagine your most skeptical stakeholder reading the claim. Would they accept it, or ask 'based on what?' Pre-empt that question by attaching the evidence to the claim itself.",
        },
      ],
      examples: [
        {
          before: "Customer satisfaction has improved significantly since the redesign.",
          after:
            "Customer satisfaction rose from 3.4 to 4.2 stars in the eight weeks since the redesign — based on 1,900 reviews.",
          note: "The vague 'significantly' becomes a number, a baseline, a timeframe, and a sample size a skeptic can trust.",
        },
        {
          before:
            "We looked at a bunch of metrics and overall things are trending in a positive direction across the board.",
          after:
            "The headline: activation is up 12% this month. Retention and revenue held flat; nothing regressed.",
          note: "A data dump becomes one insight with honest detail about what didn't move.",
        },
      ],
      evidence:
        "Concrete, specific language is recalled better than abstractions (the 'concreteness effect'), and pairing a claim with its evidence pre-empts the skeptic. HBR's 'What → So What → Now What' chain turns raw data into a decision: the fact, why it matters to this audience, and the action you want.",
    },
    drills: [
      {
        id: "specify",
        title: "Make it specific",
        scenario:
          "A colleague wrote: \"The new feature is performing really well and users seem to love it. Engagement is way up and we're seeing a lot of positive signals overall.\"",
        task: "Rewrite it as if you had real numbers — invent plausible specifics — so it would survive a skeptic.",
        tips: [
          "Replace 'really well', 'way up', 'a lot' with numbers, dates, or baselines.",
          "Pick one headline metric and lead with it.",
          "Add the evidence (sample size, timeframe) inline.",
        ],
        focus: ["precision", "impact"],
      },
      {
        id: "insight-not-dump",
        title: "One insight, not six metrics",
        scenario:
          "You have these numbers from last month: signups 4,200 (+3%), mobile share 62%, desktop share 38%, avg session 5m (flat), support tickets 310 (-8%), NPS 41 (+2). Your VP asked 'what's the story?'",
        task: "Answer in 2–4 sentences using What → So What → Now What: the key insight, why it matters, and what you'd do about it.",
        tips: [
          "Don't recite all six numbers — choose the story (the 'what').",
          "Say why it matters to the VP (the 'so what').",
          "End with a recommended action or decision (the 'now what').",
        ],
        focus: ["clarity", "impact"],
      },
    ],
  },
  {
    slug: "executive-presence",
    number: 5,
    title: "Executive Presence in Words",
    tagline: "Sound like someone who has decided.",
    outcomes: [
      "Project calibrated confidence without arrogance",
      "Signpost so listeners can follow your logic",
      "Own a recommendation instead of presenting options neutrally",
    ],
    lesson: {
      summary:
        "Executive presence on the page is mostly about ownership and signposting. You take a position, you make it easy to follow, and you separate fact from judgment so people trust both. It reads as calm certainty — not volume, not jargon.",
      concepts: [
        {
          heading: "Recommend, don't just present",
          body: "Laying out three options neutrally pushes the decision back onto your reader. Presence means: here are the options, here's my recommendation, here's why. You can still invite disagreement — but lead with a point of view. Decision-makers value a clear recommendation they can react to.",
        },
        {
          heading: "Signpost the structure",
          body: "'There are two issues here. First... Second...' Tiny verbal signposts let a listener allocate attention and follow your logic. Without them, even good content feels like a stream. Signposting is the difference between sounding organized and sounding like you're thinking out loud.",
        },
        {
          heading: "Separate fact from judgment",
          body: "'Revenue fell 8% (fact). I think it's the pricing change, not the season (judgment). Here's how I'd test that (next step).' Labeling which is which makes you credible — people trust someone who knows the difference between what they observed and what they believe.",
        },
      ],
      examples: [
        {
          before:
            "So there are kind of a few ways we could go and they all have pros and cons, so I guess it depends on what you all think is best.",
          after:
            "We have three options. I recommend the phased rollout — it's the lowest risk and we can stop if metrics dip. Happy to defend that or hear the case for going faster.",
          note: "Abdication becomes a recommendation with a reason and an open door — confident without being closed-minded.",
        },
        {
          before:
            "The numbers are down and it's probably because of a bunch of things going on in the market and internally.",
          after:
            "Bookings fell 8% last quarter (fact). My read is that it's the new pricing, not the market — competitors held flat (judgment). I'd A/B the old price to confirm (next step).",
          note: "Fact, judgment, and next step are labeled and ordered, projecting command of the situation.",
        },
      ],
      evidence:
        "Signposting (discourse markers like 'first… second…') helps listeners allocate attention and follow your structure, and explicitly labeling fact vs. judgment builds credibility — both are emphasized in MIT Sloan's advanced communication course for leaders.",
    },
    drills: [
      {
        id: "take-a-position",
        title: "Take a position",
        scenario:
          "Your team is split on whether to launch a feature now (faster, riskier) or in a month (polished, slower). Leadership asked for your view. You're tempted to just lay out both sides.",
        task: "Write a short recommendation (3–5 sentences) that takes a clear position and stays open to challenge.",
        tips: [
          "Name your recommendation in the first sentence.",
          "Give the one reason that most justifies it.",
          "Invite disagreement without retreating from your view.",
        ],
        focus: ["impact", "clarity"],
      },
      {
        id: "fact-judgment",
        title: "Fact, judgment, next step",
        scenario:
          "Sales dipped for the second month. You suspect it's a new competitor, not the economy, but you're not certain.",
        task: "Write 3–4 sentences that clearly separate what you know, what you believe, and what you'd do to confirm.",
        tips: [
          "Label the fact plainly — no spin.",
          "Mark your judgment as a judgment, with your reasoning.",
          "End with a concrete test or next step.",
        ],
        focus: ["precision", "impact"],
      },
    ],
  },
  {
    slug: "answering-under-pressure",
    number: 6,
    title: "Answering Under Pressure",
    tagline: "Direct answers to hard questions, including 'I don't know.'",
    outcomes: [
      "Answer the question actually asked, first",
      "Handle pushback without getting defensive",
      "Say 'I don't know' in a way that builds trust",
    ],
    lesson: {
      summary:
        "Under pressure — a tough question, a skeptical room, a curveball in a review — the instinct is to dodge, over-explain, or get defensive. Presence is answering the question directly first, then supporting it, and being honest about the limits of what you know.",
      concepts: [
        {
          heading: "Answer the question, then elaborate",
          body: "When asked 'will we hit the date?', the answer is 'yes', 'no', or 'here's the specific risk' — not a three-minute history. Give the direct answer in the first sentence, then the context. People asked a question; pay it off before you explain.",
        },
        {
          heading: "Don't get defensive — get specific",
          body: "Pushback feels like attack, and the reflex is to justify everything. Instead, acknowledge the valid part, then address the substance with specifics. 'You're right that we slipped the first deadline. Here's what changed and why I'm confident in the new one.' Defensiveness reads as weakness; specificity reads as command.",
        },
        {
          heading: "'I don't know' is a power move — when used well",
          body: "Pretending to know erodes trust the moment you're wrong. 'I don't know, but here's how I'll find out and by when' is stronger than a confident guess. The trick is to never leave it at 'I don't know' — always attach the path to the answer.",
        },
      ],
      examples: [
        {
          before:
            "Well, it's complicated, because there are a lot of dependencies and the team has been dealing with some issues, and the vendor situation is still kind of up in the air, so it's hard to say exactly...",
          after:
            "No, we won't hit the original date — we're about a week over. The vendor delay is the cause; the recovery plan has us shipping the 14th.",
          note: "A defensive non-answer becomes a direct 'no' with the cause and the new commitment in two sentences.",
        },
        {
          before:
            "Um, I think it's probably around 20%? Maybe? I'd have to double-check but it's something like that, I believe.",
          after:
            "I don't have that number memorized. I'll send the exact figure by end of day — my rough recollection is ~20%, but don't act on that until I confirm.",
          note: "An unreliable guess becomes an honest 'I don't know' with a deadline and a clearly-flagged estimate.",
        },
      ],
      evidence:
        "A direct answer respects the question the listener actually asked, and an honest 'I don't know — here's how I'll find out' preserves credibility better than a confident wrong guess. MIT Sloan's leaders' course explicitly drills handling hostile questions and thinking on your feet.",
    },
    drills: [
      {
        id: "direct-answer",
        title: "Answer the actual question",
        scenario:
          "In a review, a VP asks point-blank: \"Are we going to lose the Acme account?\" The honest answer is: probably not, but it's at risk and you're actively working it.",
        task: "Write a 2–4 sentence answer that responds directly first, then supports it.",
        tips: [
          "First sentence must answer the yes/no/at-risk question.",
          "Then give the one fact that justifies your answer.",
          "End with what you're doing about it.",
        ],
        focus: ["clarity", "impact"],
      },
      {
        id: "honest-unknown",
        title: "Say 'I don't know' well",
        scenario:
          "An executive asks for the exact churn rate for enterprise customers last quarter. You genuinely don't know it offhand and don't want to guess wrong.",
        task: "Write a short reply that admits the gap and builds trust.",
        tips: [
          "Don't bluff a number.",
          "Attach a path: how you'll get it and by when.",
          "If you give a rough estimate, flag it clearly as unconfirmed.",
        ],
        focus: ["impact", "precision"],
      },
    ],
  },
  {
    slug: "narrative-and-persuasion",
    number: 7,
    title: "Narrative & Persuasion",
    tagline: "Move people from data to decision with story.",
    outcomes: [
      "Frame a recommendation as a before/after change",
      "Make the stakes concrete and human",
      "Anticipate the strongest objection and address it",
    ],
    lesson: {
      summary:
        "Data informs; narrative persuades. To move a decision, you frame a change — where we are, where we could be, and the bridge between — make the stakes vivid, and disarm the obvious objection before it's raised. This is the difference between being right and being convincing.",
      concepts: [
        {
          heading: "Frame the change, not just the facts",
          body: "Persuasion lives in contrast: here's where we are, here's where we could be, here's the move that gets us there. A list of facts doesn't create momentum; a clear before/after does. Name the gap you're closing.",
        },
        {
          heading: "Make the stakes concrete",
          body: "'We're losing efficiency' is abstract. 'Every week we delay, we lose ~$40k and two enterprise deals stall' is concrete and moves people. Translate abstract benefit or risk into something specific the audience can feel.",
        },
        {
          heading: "Pre-empt the strongest objection",
          body: "The most persuasive move is to name the best counter-argument yourself and answer it. 'You might worry this stretches the team — that's why I've scoped it to two weeks with no new hires.' Addressing the objection before it's voiced signals confidence and earns trust.",
        },
      ],
      examples: [
        {
          before:
            "We should invest in better tooling. Our current tools are old and the team complains about them and it would help productivity.",
          after:
            "Right now our engineers lose a day a week fighting flaky tooling. New tooling buys that day back — roughly a 20% capacity gain across 30 engineers. The cost is $50k; we'd recoup it in under a quarter. You might worry about migration risk — that's why I've scoped a two-week pilot on one team first.",
          note: "Vague benefit becomes a framed change with concrete stakes and a pre-empted objection — a complete persuasive case.",
        },
      ],
      evidence:
        "For an informed, skeptical audience, two-sided messaging — raising and answering the strongest objection yourself — is more persuasive than one-sided claims, and framing a concrete before/after change creates the contrast that moves a decision.",
    },
    drills: [
      {
        id: "frame-change",
        title: "Frame the before and after",
        scenario:
          "You want leadership to fund a customer-research function. Today, product decisions are made on gut feel; you believe research would cut wasted builds.",
        task: "Write a short pitch (4–6 sentences) that frames the change and makes the stakes concrete.",
        tips: [
          "Paint 'where we are' vividly, then 'where we could be'.",
          "Put a number or concrete cost on the status quo.",
          "Name one objection and answer it.",
        ],
        focus: ["impact", "structure"],
      },
      {
        id: "preempt-objection",
        title: "Disarm the objection",
        scenario:
          "You're proposing to sunset a legacy feature 5% of users still use. The obvious objection: 'we'll anger those users.'",
        task: "Write a 3–5 sentence case that raises and answers that objection head-on.",
        tips: [
          "State your recommendation, then name the objection yourself.",
          "Answer it with a concrete mitigation.",
          "Show you've weighed the cost, not ignored it.",
        ],
        focus: ["impact", "precision"],
      },
    ],
  },
  {
    slug: "delivering-hard-messages",
    number: 8,
    title: "Delivering Hard Messages",
    tagline: "Say no, give feedback, and break bad news — clearly is kindly.",
    outcomes: [
      "Lead a hard message with the headline, not a cushion of caveats",
      "Decline a request cleanly while keeping the relationship intact",
      "Give feedback that is specific and actionable, not vague or personal",
    ],
    lesson: {
      summary:
        "When the message is unwelcome — a no, a critique, bad news — the instinct is to bury it in softening, apology, and delay. That feels kinder but it's crueler: the reader hunts for the point, misreads how serious it is, and leaves more anxious. Clear is kind. Deliver the hard part early and plainly, own it, and pair it with a path forward.",
      concepts: [
        {
          heading: "Clear is kind — front-load the hard part",
          body: "Cushioning the bad news in three paragraphs of preamble doesn't soften the blow; it makes the reader search for it and doubt how bad it really is. State the hard thing plainly and early — 'We're not moving forward with the project' — then explain. Warmth lives in the explanation and the next step, not in hiding the headline. Being vague to spare someone's feelings usually spares your discomfort, not theirs.",
        },
        {
          heading: "Say no to the request, yes to the person",
          body: "A clean 'no' is a gift — it lets people plan. Decline the specific ask directly, give a brief honest reason (not a pile of excuses), and where you can, offer an alternative or a door left open. 'I can't take this on this quarter — I'm at capacity on the launch. I could revisit in Q3, or Sam may have room now.' No guilt, no false maybe that wastes everyone's time.",
        },
        {
          heading: "Feedback: behavior, impact, ask",
          body: "Vague or personal feedback ('be more proactive', 'your attitude') can't be acted on and breeds defensiveness. Name the specific behavior you observed, its concrete impact, and the change you want: 'The last two PRs shipped without tests (behavior), and both caused a production bug (impact). Going forward, run the test suite before requesting review (ask).' Describe what happened, not what kind of person they are.",
        },
      ],
      evidence:
        "Brené Brown's research-backed maxim — 'clear is kind, unclear is unkind' — captures why hedged bad news backfires: ambiguity transfers your discomfort onto the reader. The Situation-Behavior-Impact (SBI) model from the Center for Creative Leadership keeps feedback specific and non-personal, which makes it easier to hear and to act on.",
      examples: [
        {
          before:
            "Hey! So I've been thinking a lot about your proposal and I really appreciate all the effort you put in, it's clearly well thought through, and I'd love to support it in some way, it's just that timing-wise things are a bit tricky right now and I'm not totally sure where it fits, so maybe we can find some time to chat about it at some point?",
          after:
            "I'm going to pass on the proposal for now — it's strong, but it doesn't fit this quarter's priorities. If budget opens up after Q3 planning, I'd want to revisit it. Thanks for the thorough work on it.",
          note: "The 'after' gives a clean no in the first sentence, an honest reason, and a real door left open — instead of a warm-sounding maybe that leaves the person guessing.",
        },
        {
          before:
            "I feel like you've kind of been dropping the ball lately and not really bringing your A-game — I need you to step it up and be more reliable going forward.",
          after:
            "The last two releases went out without the test suite run, and both caused a customer-facing bug (behavior + impact). Going forward, I need tests run and green before you request review (ask). Can you build that into your checklist?",
          note: "Character judgment ('dropping the ball', 'be more reliable') becomes specific behavior, concrete impact, and a clear, doable ask the person can actually act on.",
        },
      ],
    },
    drills: [
      {
        id: "clean-no",
        title: "Say no without the runaround",
        scenario:
          "A respected senior colleague asks you to join a cross-functional committee that meets weekly. You have no bandwidth — you're already behind on a launch — and you need to decline.",
        task: "Write a 3–5 sentence reply that says no clearly, keeps the relationship warm, and avoids a false 'maybe'.",
        tips: [
          "Lead with the no — don't make them read to the end to find it.",
          "Give one honest reason, not a pile of excuses.",
          "Offer an alternative or a door left open if there's a real one.",
        ],
        placeholder: "Thanks for thinking of me — I can't take this on right now because…",
        focus: ["impact", "clarity"],
      },
      {
        id: "behavior-impact-ask",
        title: "Feedback that lands",
        scenario:
          "A talented report keeps shipping work that breaks because they skip testing. You've felt the friction but only hinted at it. You need to give direct, useful feedback in your next 1:1.",
        task: "Write 3–5 sentences using behavior → impact → ask. Be specific and keep it about the work, not their character.",
        tips: [
          "Name the exact behavior you observed — no labels like 'careless'.",
          "State the concrete impact it had.",
          "End with a clear, doable ask, not a vague 'do better'.",
        ],
        focus: ["precision", "audience"],
      },
    ],
  },
  {
    slug: "putting-it-together",
    number: 8,
    title: "Putting It Together",
    tagline: "Full-stack executive communication under real constraints.",
    outcomes: [
      "Combine BLUF, structure, concision, and presence in one message",
      "Adapt register to the audience and channel",
      "Self-edit a draft against the full rubric",
    ],
    lesson: {
      summary:
        "The final skill is integration: doing all of it at once, fast, in a real message to a real audience. This module is mostly practice. The lesson is a checklist you can run on any draft before you hit send.",
      concepts: [
        {
          heading: "The pre-send checklist",
          body: "1) Does the first sentence carry the point or ask? 2) Is it grouped under one governing idea? 3) Can I cut a third of the words? 4) Did I replace vague claims with specifics? 5) Did I take a position and signpost it? If a draft fails any of these, you know exactly what to fix.",
        },
        {
          heading: "Match register to audience and channel",
          body: "A Slack message to a peer, a board memo, and a reply to an angry customer need different registers — but all benefit from leading with the point. Calibrate formality and detail to the reader, not to your comfort. More senior and more time-pressed usually means shorter and more direct.",
        },
        {
          heading: "Edit like a reader, not a writer",
          body: "Writers love their context and caveats. Readers want the answer. The final pass is to read your draft as the impatient recipient and delete anything that isn't serving them. If you wouldn't miss it, they won't either.",
        },
      ],
      examples: [
        {
          before:
            "Hi team, hope everyone had a good weekend! I wanted to send a quick note about a few things on my mind regarding the launch that we've all been working hard on, and some thoughts about how we might want to approach the final stretch given everything that's been going on lately.",
          after:
            "Team — we're launching Thursday, two days late but solid. One ask: I need final QA sign-off by Wednesday noon. Details below, but that's the headline.",
          note: "The integrated version leads with the decision, states the one ask with a deadline, and makes the rest optional — every principle applied at once.",
        },
      ],
      evidence:
        "This is the antidote to the curse of knowledge — a robustly documented bias where experts forget what their audience doesn't share. Re-reading your draft as the impatient recipient, and running a fixed pre-send checklist, is the practical de-biasing move the research supports.",
    },
    drills: [
      {
        id: "full-stack-memo",
        title: "The board-ready update",
        scenario:
          "You run a product line. This quarter: revenue up 9%, one major launch shipped two weeks late, a key engineer resigned, and you need board approval to backfill two roles. You're writing the monthly update to the leadership team.",
        task: "Write a tight update (5–8 sentences) that leads with the headline, groups the news, and lands your ask.",
        tips: [
          "First sentence: the single most important thing.",
          "Group good news, risks, and the ask — don't interleave randomly.",
          "Make the ask specific and easy to approve.",
          "Cut anything the reader wouldn't miss.",
        ],
        focus: ["structure", "concision", "impact"],
      },
      {
        id: "hard-reply",
        title: "The high-stakes reply",
        scenario:
          "A frustrated enterprise customer emailed your CEO saying your product caused a costly outage and threatening to churn. The CEO forwarded it to you with 'handle this.' There was a real bug; it's now fixed; you want to keep the account.",
        task: "Draft a reply (5–8 sentences) that owns the issue, leads with what matters to them, and is calibrated in tone.",
        tips: [
          "Lead with accountability and the fix — not excuses.",
          "Be specific about what happened and what prevents recurrence.",
          "Match the register: serious, direct, not groveling.",
          "End with a concrete next step.",
        ],
        focus: ["clarity", "impact", "precision"],
      },
    ],
  },
];

// Number modules by their position so inserting/reordering never desyncs.
export const MODULES: Module[] = RAW_MODULES.map((m, i) => ({
  ...m,
  number: i + 1,
}));

export const MODULE_MAP: Record<string, Module> = MODULES.reduce(
  (acc, m) => {
    acc[m.slug] = m;
    return acc;
  },
  {} as Record<string, Module>,
);

export function getDrill(moduleSlug: string, drillId: string) {
  const module = MODULE_MAP[moduleSlug];
  if (!module) return null;
  const drill = module.drills.find((d) => d.id === drillId);
  if (!drill) return null;
  return { module, drill };
}
