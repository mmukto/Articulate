import type { Drill } from "./types";

// Additional drills that expand each module beyond its 2 hand-curated drills up
// to 25, so the subscription tiers (3/6/12/25 drills per module for paid plans,
// plus the Free sampler) have content to unlock. Merged into each module's
// `drills` array in course.ts. Keyed by module slug; order within each array is
// the unlock order.
export const EXTRA_DRILLS: Record<string, Drill[]> = {
  "lead-with-the-point": [
    {
      "id": "lead-03",
      "title": "Reply to the impatient VP",
      "scenario": "Your VP Slacks: \"Are we shipping the checkout redesign this Friday or not?\" The honest answer is no — QA found a payment bug that needs two more days — but you also have a plan and a new date.",
      "task": "Write a 2-3 sentence reply that answers the yes/no question in the first sentence.",
      "tips": ["Sentence one is a direct yes or no — don't make them dig for it.", "Give the new date immediately after, not buried at the end.", "Keep the bug detail to a clause; it's support, not the headline."],
      "focus": ["clarity", "structure", "impact"],
      "placeholder": "No — Friday's at risk. We found a payment bug in QA; new ship date is..."
    },
    {
      "id": "lead-04",
      "title": "Escalate the blocked launch",
      "scenario": "Legal review has stalled your product launch for nine days with no response, and you've already missed one internal deadline. You're emailing your director, whose sign-off can unblock it, and you need them to push legal today.",
      "task": "Write a 3-4 sentence escalation email that opens with exactly what you need from your director.",
      "tips": ["Lead with the ask: what should the director do, and by when.", "State the impact of the delay in one quantified line.", "Don't open with a timeline of who emailed whom — that's context below the ask."],
      "focus": ["impact", "structure", "clarity"]
    },
    {
      "id": "lead-05",
      "title": "Two-line incident summary",
      "scenario": "A production outage took down search for 47 minutes this morning. Your CTO wants a summary in the incident channel. The root cause was a misconfigured cache, it's fixed, and no customer data was lost.",
      "task": "Write a 2-3 sentence summary that leads with status and impact, not the timeline.",
      "tips": ["First sentence: resolved or ongoing, and who/what was affected.", "Reassure on the thing leadership fears most — here, data loss.", "Save the cache-config detail for a single trailing sentence."],
      "focus": ["clarity", "concision", "impact"],
      "placeholder": "Search is back up; the 47-minute outage is fully resolved with no data loss."
    },
    {
      "id": "lead-06",
      "title": "The weekly status that buries the ask",
      "scenario": "Your standard weekly update to your team lead is three paragraphs of activity. Buried in paragraph three is the one thing that actually matters: you're blocked on access to the analytics database and can't proceed without it.",
      "task": "Rewrite the opening so the blocker and the ask come first.",
      "tips": ["Promote the blocker to sentence one — that's the real message.", "Name exactly what you need to be unblocked.", "Let the 'what I did this week' recap follow as skimmable support."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "lead-07",
      "title": "Recommend, don't just present",
      "scenario": "You've evaluated three vendors for the new CRM and built a thorough comparison deck. Your manager opens the meeting with: \"So which one should we pick?\" You tend to walk through all the analysis before revealing your pick.",
      "task": "Write the 2-3 sentence opening you'd say out loud, leading with your recommendation.",
      "tips": ["Name your pick in the first sentence — don't make them sit through the analysis to learn it.", "Give the single strongest reason right after.", "Offer the full comparison as available detail, not a prerequisite."],
      "focus": ["clarity", "impact", "structure"],
      "placeholder": "I recommend Vendor B. It's the only one that..."
    },
    {
      "id": "lead-08",
      "title": "Decision needed by Thursday",
      "scenario": "You need your director to choose between two architecture approaches before the sprint starts Thursday. You've written a long message explaining both, but it never clearly states that you need a decision or by when.",
      "task": "Write a 3-4 sentence message where the decision request and deadline are unmissable.",
      "tips": ["Sentence one: 'I need a decision by [when] on [what].'", "State your recommendation so they can just confirm it.", "Summarize the two options in a line each — detail can follow."],
      "focus": ["clarity", "structure", "impact"]
    },
    {
      "id": "lead-09",
      "title": "Answer the board's one question",
      "scenario": "A board member emails: \"Are we going to hit the Q4 revenue target?\" You're tracking 8% below plan but have two deals that could close the gap. You're tempted to open with a paragraph of market context.",
      "task": "Write a 2-3 sentence reply that answers the question directly, then qualifies.",
      "tips": ["Give them the real answer in clause one, even when it's uncomfortable.", "Follow with the single number that matters and what could change it.", "Cut the market-context warm-up entirely — they asked a yes/no-ish question."],
      "focus": ["audience", "clarity", "concision"],
      "placeholder": "We're at risk — currently tracking 8% below the Q4 target, with two deals that could close the gap."
    },
    {
      "id": "lead-10",
      "title": "Subject line that carries the point",
      "scenario": "You're emailing your skip-level about a hiring freeze that will delay a committed project. Your draft subject line reads \"Quick update on the platform team.\" Most readers will skim the subject and the first line and move on.",
      "task": "Write a subject line plus a one-sentence opener that together deliver the actual point.",
      "tips": ["Make the subject line state the consequence, not the topic.", "The first sentence should stand alone as the whole message if needed.", "Avoid 'quick update' and 'touching base' — they signal 'skippable.'"],
      "focus": ["clarity", "impact", "audience"],
      "placeholder": "Subject: Platform project slips 3 weeks due to hiring freeze"
    },
    {
      "id": "lead-11",
      "title": "Cut the throat-clearing intro",
      "scenario": "You wrote: \"I hope you're doing well. I wanted to reach out because over the last few weeks I've been thinking a lot about our retention numbers lately, and I had a few thoughts I wanted to share when you get a chance.\" The real point — churn jumped to 6% and you propose a fix — is missing from the opening.",
      "task": "Rewrite the opening so the point lands in the first sentence.",
      "tips": ["Delete the pleasantries and the 'I wanted to reach out' framing.", "State the problem and your proposal up front.", "Quantify so the message earns attention immediately."],
      "focus": ["concision", "clarity", "structure"],
      "placeholder": "Churn jumped to 6% last month. I want to..."
    },
    {
      "id": "lead-12",
      "title": "The 30-second hallway pitch",
      "scenario": "You catch your CEO walking to a meeting and have maybe 30 seconds. You want approval to run a paid pilot of a new feature with 500 users. You usually start with how the idea came up.",
      "task": "Write the 2-3 sentences you'd say, leading with the ask.",
      "tips": ["Open with the specific ask and what it costs — they may only hear sentence one.", "Skip the origin story; lead with the decision you need.", "Make saying yes easy: small, bounded, reversible."],
      "focus": ["concision", "impact", "clarity"],
      "placeholder": "I'd like your OK to run a 2-week paid pilot with 500 users for about $5k."
    },
    {
      "id": "lead-13",
      "title": "Flag the risk before the recap",
      "scenario": "You're presenting sprint results to leadership. Velocity was fine, but a key dependency just slipped and now threatens the launch date. Your instinct is to walk through completed tickets first and mention the risk at the end.",
      "task": "Write a 2-3 sentence opening that surfaces the launch risk first.",
      "tips": ["Lead with the thing that changes a decision — here, the at-risk date.", "State what you need from leadership, if anything.", "Completed-work recap belongs after the risk, as reassurance."],
      "focus": ["structure", "impact", "clarity"]
    },
    {
      "id": "lead-14",
      "title": "Say no, clearly",
      "scenario": "A peer team asks your team to take on a large integration this quarter. The answer is no — you're fully committed to the migration — but your draft hedges with three paragraphs of sympathy before getting there.",
      "task": "Write a 3-4 sentence reply that leads with the decision, then explains.",
      "tips": ["Give the no in the first sentence; hedging reads as a maybe.", "Follow with the one real reason, not three soft ones.", "Offer a concrete alternative or timing so the no is constructive."],
      "focus": ["clarity", "structure", "audience"],
      "placeholder": "We can't take this on this quarter — the migration has us fully committed through Q3."
    },
    {
      "id": "lead-15",
      "title": "Exec summary for the deck",
      "scenario": "You've built a 14-slide analysis recommending you sunset a legacy product line. You need a one-paragraph executive summary at the top so a busy reader gets the whole story without opening the deck.",
      "task": "Write a 3-4 sentence executive summary that leads with the recommendation.",
      "tips": ["First sentence is the recommendation, stated plainly.", "Follow with the strongest 1-2 reasons and the headline number.", "End with the decision or next step you're asking for."],
      "focus": ["structure", "concision", "impact"]
    },
    {
      "id": "lead-16",
      "title": "Reply-all that needs a verdict",
      "scenario": "A 20-message email thread is going in circles about which date to launch. As the owner, you need to call it. People keep restating preferences without anyone deciding.",
      "task": "Write a 2-3 sentence reply that leads with the decision and ends the thread.",
      "tips": ["Open with the decision, not a summary of everyone's views.", "State it as final: 'We're going with X.'", "Give a one-line rationale so it sticks, then stop."],
      "focus": ["clarity", "impact", "concision"],
      "placeholder": "Decision: we launch on the 14th. Here's why, and what each team needs to do next."
    },
    {
      "id": "lead-17",
      "title": "Budget request to finance",
      "scenario": "You need finance to approve $80k for additional cloud capacity to handle a traffic spike from an upcoming campaign. Your draft opens with two paragraphs about the campaign's marketing goals before the number appears.",
      "task": "Write a 3-4 sentence request that leads with the amount and the decision needed.",
      "tips": ["State the dollar amount and what it's for in sentence one.", "Frame it in finance's terms: cost vs. risk of not doing it.", "Campaign backstory is support — move it below the ask."],
      "focus": ["audience", "clarity", "impact"],
      "placeholder": "I'm requesting $80k in cloud capacity to handle the campaign traffic spike."
    },
    {
      "id": "lead-18",
      "title": "Standup update under pressure",
      "scenario": "It's your turn at a fast standup and you have 15 seconds. The one thing the team needs to know: the API contract changed and three downstream teams must update their code today. You tend to recap yesterday's tasks first.",
      "task": "Write the 1-2 sentence update that leads with the thing others must act on.",
      "tips": ["Lead with what affects other people, not your task log.", "Name who needs to do what, today.", "Drop the 'yesterday I…' recap if it changes nothing."],
      "focus": ["concision", "impact", "audience"],
      "placeholder": "Heads up — the API contract changed; downstream teams need to update by EOD."
    },
    {
      "id": "lead-19",
      "title": "Bad-news email to a customer",
      "scenario": "A key feature your enterprise customer expected next month will slip to the following quarter. You're the account owner emailing their VP. You're tempted to bury the slip after a long apology and explanation.",
      "task": "Write a 3-4 sentence email that states the slip up front, professionally.",
      "tips": ["Lead with the new reality — the date — not the apology.", "Be specific about the new commitment so they can plan.", "Follow with what you're doing to limit the impact on them."],
      "focus": ["clarity", "audience", "structure"]
    },
    {
      "id": "lead-20",
      "title": "Promote the buried recommendation",
      "scenario": "Your analysis memo ends with: \"…and so, taking all of this together, it may be worth considering whether we should pause the rollout.\" The actual recommendation — pause the rollout — is hedged and stuck at the very bottom.",
      "task": "Rewrite the memo's first sentence so the recommendation leads and is unhedged.",
      "tips": ["Move the conclusion from the last line to the first.", "Cut 'it may be worth considering whether' — just recommend it.", "Keep the supporting analysis below, where it belongs."],
      "focus": ["structure", "precision", "clarity"],
      "placeholder": "I recommend we pause the rollout. Here's why..."
    },
    {
      "id": "lead-21",
      "title": "Answer 'how's it going' precisely",
      "scenario": "Your director catches you and asks how the security audit is going. It's 80% done, on schedule, with one medium finding already being remediated. You usually answer with a vague \"good, making progress.\"",
      "task": "Write a 2-3 sentence verbal answer that leads with a precise status.",
      "tips": ["Replace 'good' with a real status: on track, % done, any findings.", "Surface the one finding rather than letting it surprise them later.", "Keep it tight — they asked in passing, not for a briefing."],
      "focus": ["precision", "clarity", "concision"],
      "placeholder": "On track — about 80% done and on schedule. One medium finding, already being fixed."
    },
    {
      "id": "lead-22",
      "title": "Open the all-hands segment",
      "scenario": "You have a 3-minute slot in the company all-hands to update on the platform reliability initiative. The headline everyone cares about: uptime hit 99.95%, beating the goal. You tend to open with the team's process and history.",
      "task": "Write the 2-3 sentence opening that leads with the headline result.",
      "tips": ["Open with the win and the number — that's what they'll remember.", "Tie it to why it matters to the audience in the room.", "Process and credit can follow once the headline has landed."],
      "focus": ["impact", "audience", "concision"],
      "placeholder": "We beat our reliability goal — uptime hit 99.95% this quarter."
    },
    {
      "id": "lead-23",
      "title": "Forward with a verdict on top",
      "scenario": "You're forwarding a long vendor proposal to your manager. If you just forward it with \"FYI, thoughts?\", they have to read all eight pages to know what you think. You've already concluded the pricing is too high to proceed.",
      "task": "Write the 2-3 sentence note you'd put above the forward, leading with your verdict.",
      "tips": ["State your recommendation before the forwarded wall of text.", "Give the one deal-breaker so they don't have to hunt for it.", "Tell them what you need: a confirm, a decision, or nothing."],
      "focus": ["clarity", "structure", "impact"],
      "placeholder": "My take: I'd pass on this one. Pricing is ~40% over budget — details below."
    },
    {
      "id": "lead-24",
      "title": "The 'circling back' rewrite",
      "scenario": "You wrote to a stakeholder: \"Just wanted to circle back on the dashboard thing we discussed a while ago — wondering if there's been any movement and whether we might be able to sync at some point.\" You actually need their data sources confirmed by Wednesday to build it.",
      "task": "Rewrite it as a 2-3 sentence message with a clear ask and deadline.",
      "tips": ["Replace 'circle back' with the specific thing you need.", "Add a concrete deadline so it can be acted on.", "Cut 'at some point' and 'might be able to' — be direct."],
      "focus": ["clarity", "precision", "concision"],
      "placeholder": "I need your three data sources confirmed by Wednesday to build the dashboard."
    },
    {
      "id": "lead-25",
      "title": "Brief the CEO before the meeting",
      "scenario": "Your CEO walks into a partner meeting in five minutes and Slacks you: \"Anything I need to know?\" The one thing that matters: the partner is unhappy about a missed SLA and will likely raise it. You have the fix and the credit already approved.",
      "task": "Write a 2-3 sentence brief that leads with what they need to know first.",
      "tips": ["Open with the live issue they'll face in the room.", "Hand them the response they can give: the fix and the credit.", "Keep it to what's actionable in the next five minutes."],
      "focus": ["audience", "concision", "impact"],
      "placeholder": "Heads up: they're upset about last week's missed SLA and will likely raise it. You can tell them..."
    }
  ],
  "start-with-the-audience": [
    {
      "id": "audience-03",
      "title": "Brief the board on an outage",
      "scenario": "A six-hour service outage took down your payments flow last night. The board meets this morning; they care about money lost, customer trust, and whether it can happen again — not your incident-response runbook or which microservice failed.",
      "task": "Write a 3-4 sentence board update that leads with the business impact and the one assurance they need.",
      "tips": ["Open with the impact and the decision-relevant number, not the timeline of events.", "Name what you've done to prevent a repeat — that's what the board is really asking.", "Keep root-cause detail to one plain-language clause."],
      "focus": ["audience", "impact", "concision"],
      "placeholder": "Last night we lost roughly… "
    },
    {
      "id": "audience-04",
      "title": "Explain the bug to a customer",
      "scenario": "A paying customer's invoices were emailed to the wrong recipients because of a templating error in your billing system. The customer cares about who saw their data, whether it's fixed, and what you'll do — not the templating internals.",
      "task": "Draft a 3-5 sentence message to the customer that owns the problem and reassures them, in their terms.",
      "tips": ["Lead with what happened to *them*, plainly, then what you've done.", "Translate the technical cause into a one-line, honest summary.", "Avoid jargon and defensiveness; name the concrete next step."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "audience-05",
      "title": "Pitch finance on headcount",
      "scenario": "You want to hire two engineers. Finance evaluates this as a cost-and-return decision; they don't care that your team is 'underwater on tickets' or excited about a refactor.",
      "task": "Write a 3-4 sentence ask aimed at finance, framing the hire as a return, not a relief.",
      "tips": ["Translate 'we're stretched' into a cost, risk, or revenue consequence.", "Give finance a number or comparison they can weigh.", "Lead with the outcome the spend buys, not the team's pain."],
      "focus": ["audience", "impact", "precision"]
    },
    {
      "id": "audience-06",
      "title": "Onboard the new hire",
      "scenario": "A new engineer joins Monday with no knowledge of your systems or acronyms. You want to explain what the 'reconciliation service' does and why it matters, without assuming the context the rest of the team shares.",
      "task": "Write a 3-5 sentence explanation that a smart newcomer could follow on day one.",
      "tips": ["Name what they likely don't know yet and bridge it before the detail.", "Define the term in plain language before using it.", "Anchor the 'why it matters' in something concrete."],
      "focus": ["audience", "clarity", "structure"],
      "placeholder": "The reconciliation service is the thing that… "
    },
    {
      "id": "audience-07",
      "title": "Win over a skeptical peer team",
      "scenario": "You're proposing that the platform team adopt your new shared library. They're skeptical — they care about maintenance burden, breaking their builds, and not inheriting your team's problems.",
      "task": "Write a 3-5 sentence pitch that addresses the peer team's stake and earns trust.",
      "tips": ["Lead with what *they* gain and what you're taking off their plate.", "Name the risk they're worried about and address it head-on.", "Skip the parts that only excite your own team."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "audience-08",
      "title": "Translate a metric for the CEO",
      "scenario": "Your dashboards show p99 latency dropped from 1,200ms to 300ms after a quarter of work. Your non-technical CEO doesn't know what p99 or latency means, but cares about whether customers are happier and whether the investment paid off.",
      "task": "Rewrite the result for the CEO in 2-3 sentences, translating the metric into a consequence they care about.",
      "tips": ["Don't say 'p99' — say what users actually experience now.", "Tie the improvement to a customer or business outcome.", "Keep one comparison so the win is legible."],
      "focus": ["audience", "clarity", "concision"]
    },
    {
      "id": "audience-09",
      "title": "Brief legal on a data flow",
      "scenario": "Legal needs to assess a new feature that shares user data with a third-party analytics vendor. They care about what data leaves, where it goes, consent, and retention — not your event schema or SDK choice.",
      "task": "Write a 3-5 sentence summary for legal that surfaces exactly what they need to assess.",
      "tips": ["Lead with what data leaves the system and to whom.", "Translate engineering details into consent, location, and retention facts.", "Be precise about specifics legal will ask about anyway."],
      "focus": ["audience", "precision", "clarity"]
    },
    {
      "id": "audience-10",
      "title": "Explain the delay to sales",
      "scenario": "The feature sales promised a big prospect will slip two weeks. The sales team cares about what to tell the customer and whether the deal is at risk — not why the integration test suite is flaky.",
      "task": "Write a 3-4 sentence update for the sales lead they can act on with the customer.",
      "tips": ["Give them the new date and a one-line, customer-safe reason.", "Tell them what's at risk and what isn't, clearly.", "Hand them language they can repeat, not internals to translate."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "audience-11",
      "title": "Pitch the board on a bet",
      "scenario": "You want the board to approve a risky new product line. They care about market size, downside, and what success looks like in numbers — and they want the decision up front, not a slow build to it.",
      "task": "Write a 4-5 sentence pitch that leads with the ask and frames the bet at board altitude.",
      "tips": ["Open with the decision you want and the one number that matters.", "Name the downside honestly — boards distrust pitches that hide it.", "Calibrate altitude: the thesis, not the implementation."],
      "focus": ["audience", "structure", "impact"]
    },
    {
      "id": "audience-12",
      "title": "Explain a price increase",
      "scenario": "You're raising a long-time customer's subscription price 20%. They care about whether they're still getting value and why now — not your cost structure or margin targets.",
      "task": "Draft a 3-5 sentence message that frames the increase around their value, honestly.",
      "tips": ["Lead with value to them before the number.", "Give a real reason that respects their intelligence.", "Don't hide behind 'market conditions' — be concrete and human."],
      "focus": ["audience", "impact", "clarity"]
    },
    {
      "id": "audience-13",
      "title": "Demystify ML for a marketer",
      "scenario": "A marketing colleague asks how your new recommendation model works so they can describe it in a campaign. They don't need the architecture — they need an accurate, repeatable way to describe what it does for users.",
      "task": "Explain the model in 2-4 sentences a marketer could confidently paraphrase, without overclaiming.",
      "tips": ["Describe what it does for the user, not how it's built.", "Avoid jargon they'd have to relay incorrectly.", "Keep it accurate so marketing doesn't overpromise."],
      "focus": ["audience", "clarity", "precision"]
    },
    {
      "id": "audience-14",
      "title": "Report risk to the audit committee",
      "scenario": "The audit committee wants to understand a control gap your team found in access provisioning. They care about exposure, likelihood, and remediation status — not the IAM tooling specifics.",
      "task": "Write a 3-5 sentence summary that frames the gap in risk terms the committee can govern.",
      "tips": ["Lead with exposure and likelihood, then status.", "Translate the technical gap into what could go wrong and how bad.", "Be precise about the remediation timeline — they'll track it."],
      "focus": ["audience", "precision", "structure"]
    },
    {
      "id": "audience-15",
      "title": "Sell the migration to engineers",
      "scenario": "Leadership approved a platform migration; now you must get the engineers who'll do the work on board. They care about effort, what breaks, and whether it kills daily pain — not the strategic rationale that won leadership over.",
      "task": "Write a 3-5 sentence message aimed at the engineers' stake in the change.",
      "tips": ["Lead with the daily pain it removes for them.", "Be honest about the effort and what's disruptive.", "Drop the executive framing — it won't move this audience."],
      "focus": ["audience", "impact", "clarity"]
    },
    {
      "id": "audience-16",
      "title": "Update an anxious customer",
      "scenario": "A customer has been waiting through three missed deadlines and is frustrated. They care about a credible date and whether you've got control — not another detailed explanation of what went wrong.",
      "task": "Write a 3-4 sentence update that rebuilds confidence and gives them something firm.",
      "tips": ["Lead with a commitment you can keep, not another excuse.", "Acknowledge their frustration briefly and sincerely.", "Show control: one clear date, one clear owner."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "audience-17",
      "title": "Brief a non-technical investor",
      "scenario": "An investor with a finance background, not a technical one, asks why your infrastructure costs jumped 40% this quarter. They care about whether it's a problem, whether it scales with revenue, and whether you have it under control.",
      "task": "Explain the cost jump in 3-4 sentences framed for an investor's concerns.",
      "tips": ["Translate the cause into 'good growth cost' vs. 'waste' terms.", "Tie spend to revenue or usage so it reads as a ratio, not a leak.", "Signal control with a concrete next step."],
      "focus": ["audience", "impact", "precision"]
    },
    {
      "id": "audience-18",
      "title": "Explain the trade-off to a PM",
      "scenario": "A product manager wants both speed and a clean architecture. You need to explain that they can't have both this quarter. They care about ship dates and feature scope — not technical-debt taxonomy.",
      "task": "Write a 3-5 sentence explanation that frames the trade-off in terms the PM decides on.",
      "tips": ["Frame it as a choice between outcomes the PM owns, not internals.", "Make the cost of each path concrete (time, scope, future speed).", "Recommend one option and say why, in their terms."],
      "focus": ["audience", "structure", "clarity"]
    },
    {
      "id": "audience-19",
      "title": "Write for the support team",
      "scenario": "You're shipping a change that alters how refunds work. The support team will field the questions; they care about what customers will ask and exactly what to say — not the backend logic that changed.",
      "task": "Write a 3-5 sentence note that arms support with what changed and how to handle it.",
      "tips": ["Lead with what customers will notice and ask about.", "Give them words to use, not logic to interpret.", "Flag the one edge case most likely to generate tickets."],
      "focus": ["audience", "clarity", "structure"]
    },
    {
      "id": "audience-20",
      "title": "Pitch the exec team on killing a feature",
      "scenario": "You want to sunset a beloved-but-costly feature used by 2% of customers. The exec team cares about revenue at risk, support savings, and customer backlash — not the maintenance horror story behind it.",
      "task": "Write a 4-5 sentence recommendation that leads with the decision and quantifies the case.",
      "tips": ["State the recommendation first, then the numbers behind it.", "Name the backlash risk and how you'd manage it.", "Translate 'painful to maintain' into a cost they can weigh."],
      "focus": ["audience", "impact", "concision"]
    },
    {
      "id": "audience-21",
      "title": "Explain an API to a partner",
      "scenario": "A business partner's non-technical project lead wants to know what your new integration will let their company do. They care about capabilities and timeline — not endpoints, auth schemes, or rate limits.",
      "task": "Describe what the integration enables in 3-4 sentences a business lead can grasp and relay.",
      "tips": ["Describe capabilities and outcomes, not endpoints.", "Name what their side will and won't need to do.", "Keep the timeline clear; save the technical spec for their engineers."],
      "focus": ["audience", "clarity", "concision"]
    },
    {
      "id": "audience-22",
      "title": "Brief a skeptical regulator",
      "scenario": "A regulator is reviewing how you handle customer consent. They care about compliance, evidence, and whether your process is defensible — not your product roadmap or UX rationale.",
      "task": "Write a 3-5 sentence summary of your consent process framed for a regulator's standard.",
      "tips": ["Lead with the controls and evidence, stated precisely.", "Avoid marketing language; regulators read it as evasion.", "Map your process to what they must verify, plainly."],
      "focus": ["audience", "precision", "clarity"]
    },
    {
      "id": "audience-23",
      "title": "Reframe a win for the CMO",
      "scenario": "Your team cut page-load time and you're proud of the technical work. The CMO cares about conversion, bounce rate, and campaign performance — not the rendering pipeline you optimized.",
      "task": "Write a 2-4 sentence summary that reframes the technical win as a marketing outcome.",
      "tips": ["Lead with the metric the CMO is measured on.", "Translate the speed improvement into conversion or engagement terms.", "Cut the engineering detail entirely."],
      "focus": ["audience", "impact", "concision"]
    },
    {
      "id": "audience-24",
      "title": "Explain a postponement to the whole company",
      "scenario": "A long-promised internal tool launch is being pushed to next quarter. The all-hands audience is mixed — engineers, sales, ops — but the primary readers are the people whose daily work was counting on it. They care about what changes for them now.",
      "task": "Write a 3-5 sentence all-hands note written to that one primary audience, letting others read over their shoulder.",
      "tips": ["Pick the one audience most affected and write to them.", "Lead with what changes for them and the new date.", "Resist addressing everyone at once — it lands with no one."],
      "focus": ["audience", "structure", "clarity"]
    },
    {
      "id": "audience-25",
      "title": "Justify the spend to procurement",
      "scenario": "Procurement is reviewing your request to renew an expensive vendor contract. They care about cost justification, alternatives considered, and lock-in risk — not how much your team likes the tool.",
      "task": "Write a 3-5 sentence justification aimed at procurement's evaluation criteria.",
      "tips": ["Lead with the cost justification and the alternative you weighed.", "Address lock-in and switching cost before they ask.", "Replace 'the team loves it' with a defensible business reason."],
      "focus": ["audience", "precision", "impact"]
    }
  ],
  "structure-that-carries": [
    {
      "id": "structure-03",
      "title": "Sequence the board update",
      "scenario": "You're prepping a quarterly board email and have these facts in no order: revenue beat plan by 6%, you lost two senior engineers, cash runway is now 14 months, a key customer renewed at 2x, and the new pricing experiment is inconclusive. The chair skims on her phone and wants the verdict first.",
      "task": "Outline the email as one headline takeaway followed by 3 grouped sections, in the order a busy reader should meet them.",
      "tips": ["Lead with the single sentence the chair would repeat to a co-director.", "Group facts into themes (e.g. results, risks, asks) rather than chronology.", "Put the most decision-relevant group first, not the most flattering."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-04",
      "title": "SCQA for a hiring freeze",
      "scenario": "Finance wants you to pause all hiring for a quarter. Your team agreed headcount growth was the plan for the year, but a funding round slipped and burn is now too high. You need to tell the team without panic.",
      "task": "Write a 4–6 sentence framing using Situation, Complication, Question, Answer.",
      "tips": ["Situation: the growth plan everyone signed up for.", "Complication: name what changed concretely (the slipped round, the burn).", "Answer: state the freeze plainly in one line."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-05",
      "title": "Group the postmortem",
      "scenario": "An outage postmortem lists nine contributing factors: a missed alert, an expired certificate, an on-call engineer who wasn't paged, a runbook that was out of date, no staging test for the change, a risky Friday deploy, a single point of failure in the database, slow rollback, and unclear ownership of the service.",
      "task": "Rewrite this as one governing statement plus 2–3 grouped root-cause categories.",
      "tips": ["Categories like detection, prevention, and recovery often separate the noise.", "Lead with the real story in one sentence before the buckets.", "Don't enumerate all nine — group so leaders can act."],
      "focus": ["structure", "concision"]
    },
    {
      "id": "structure-06",
      "title": "Outline the recommendation",
      "scenario": "Leadership asked whether to build, buy, or partner for a new analytics capability. You've done the analysis and lean toward 'buy'. You have cost figures, timelines, risk notes, and team-capacity concerns scattered across a doc.",
      "task": "Sketch a top-down outline: your recommendation first, then the 3 buckets of reasons that support it.",
      "tips": ["State the answer in the first line — don't make them read to the verdict.", "Each bucket should be a reason, not a category of data.", "Aim for three supporting buckets; merge anything that overlaps."],
      "focus": ["structure", "clarity"],
      "placeholder": "Recommendation: We should buy rather than build, because…"
    },
    {
      "id": "structure-07",
      "title": "PREP on the spot",
      "scenario": "In a planning meeting someone asks, 'Should we drop support for the legacy desktop client?' You believe yes — usage is under 3%, it consumes a quarter of your bug backlog, and it blocks a needed refactor.",
      "task": "Answer in four moves using Point, Reason, Example, Point.",
      "tips": ["Point: lead with a clear yes or no.", "Example: ground it in one concrete number or incident.", "Close by restating the point so it lands."],
      "focus": ["structure", "impact"]
    },
    {
      "id": "structure-08",
      "title": "Frame the price increase",
      "scenario": "You need to email customers about a 12% price rise. They've had stable pricing for three years, your costs have climbed, and you've added several features they now rely on. The risk is they feel nickel-and-dimed.",
      "task": "Frame the announcement with SCQA so customers accept the reasoning before they hit the new number.",
      "tips": ["Situation: the value and stability they've enjoyed.", "Complication: what genuinely changed on your side.", "Answer: the increase, stated plainly and without apology."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-09",
      "title": "Untangle the status update",
      "scenario": "Your weekly project update has become a wall of fourteen bullet points mixing wins, blockers, next steps, and minor FYIs. Your sponsor said she can't tell what needs her attention.",
      "task": "Restructure the fourteen items into a governing line plus 3 labelled groups, surfacing what needs a decision.",
      "tips": ["Separate 'needs you' from 'for awareness' from 'on track'.", "Lead with the one sentence that says whether the project is healthy.", "Put anything requiring her action at the top of its group."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-10",
      "title": "Order the argument",
      "scenario": "You're making the case to consolidate three regional support teams into one. You have five supporting points but they're listed in the order you thought of them: cost savings, faster nights-and-weekends coverage, a simpler tooling stack, fewer handoff errors, and easier hiring.",
      "task": "Reorder the five points into the most persuasive sequence and say in one line why that order.",
      "tips": ["Lead with the point your specific audience cares about most.", "Group related points so they reinforce, not scatter.", "End on a strong point, not a weak afterthought."],
      "focus": ["structure", "impact"]
    },
    {
      "id": "structure-11",
      "title": "MECE the customer feedback",
      "scenario": "You've collected 20 verbatim complaints from a survey. They overlap and repeat: slow onboarding, confusing UI, missing export, slow support, no mobile app, pricing unclear, hard to find help docs, and more. Your PM wants themes, not a transcript.",
      "task": "Group the complaints into 3–4 mutually exclusive, collectively exhaustive themes with a one-line label each.",
      "tips": ["Make sure each complaint lands in exactly one bucket (no overlap).", "Check that together your buckets cover everything (no orphans).", "Name each theme as a problem, not a feature request."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-12",
      "title": "Build the pyramid",
      "scenario": "You want to convince leadership that the team should adopt a four-day work week trial. You have facts about productivity studies, your team's current overtime, a competitor that did it, expected recruiting upside, and a plan to measure outcomes.",
      "task": "Arrange these into a Minto pyramid: one governing claim on top, three supporting arguments, each backed by a fact.",
      "tips": ["The top line should be a claim, not a topic.", "Three supporting arguments — group the facts beneath them.", "A reader stopping at any level should still have a complete thought."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-13",
      "title": "Frame the pivot",
      "scenario": "Your startup built a tool for marketers but most traction is coming from sales teams. You want to recommend refocusing the product on sales. The founders are emotionally invested in the marketing story.",
      "task": "Write an SCQA framing that earns agreement on the facts before proposing the pivot.",
      "tips": ["Situation: the original marketing thesis, stated fairly.", "Complication: the data showing where users actually are.", "Question: the natural question that data forces."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-14",
      "title": "Collapse the timeline into a verdict",
      "scenario": "A vendor evaluation produced a chronological log: kickoff call, demo, a security review that flagged two issues, a reference check that went well, a pricing negotiation, and a trial that performed adequately. Your exec doesn't want the diary — she wants to know if you'd sign.",
      "task": "Convert the timeline into a recommendation-first structure: verdict, then 2–3 grouped reasons.",
      "tips": ["Open with go / no-go in the first sentence.", "Group the events into themes (fit, risk, cost), not dates.", "Drop steps that don't change the decision."],
      "focus": ["structure", "concision"]
    },
    {
      "id": "structure-15",
      "title": "Structure the all-hands message",
      "scenario": "You're announcing a reorg. The points you must cover: two teams are merging, one director is changing roles, reporting lines shift, the goal is faster shipping, no layoffs are involved, and there's a Q&A next week.",
      "task": "Order and group these into a clear all-hands message that leads with reassurance and the 'why'.",
      "tips": ["Lead with the reason and the no-layoffs fact — defuse fear first.", "Group the mechanics (who, reporting, teams) into one section.", "End with the concrete next step (the Q&A)."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-16",
      "title": "Three buckets for the budget ask",
      "scenario": "You need an extra $200k. The reasons are a jumble: you want two contractors, a new monitoring tool, a security audit, training budget, and a conference booth. Finance will push back on a shopping list.",
      "task": "Group the five line-items under one governing ask and 2–3 themed buckets that each justify spend.",
      "tips": ["Lead with the single outcome the $200k buys.", "Buckets like 'capacity', 'risk reduction', 'growth' beat an itemized list.", "Tie each bucket to a result Finance cares about."],
      "focus": ["structure", "concision"]
    },
    {
      "id": "structure-17",
      "title": "SCQA for the missed deadline",
      "scenario": "You promised a client delivery by month-end and you'll miss it by two weeks. The original scope was agreed, but the client added requirements mid-stream and a key integration proved harder than scoped.",
      "task": "Frame the slip with SCQA so the client accepts the cause before hearing the new date.",
      "tips": ["Situation: the original agreed plan and date.", "Complication: be specific and avoid blame — name the scope change and the integration.", "Answer: the new date, committed clearly."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-18",
      "title": "Lead with the answer",
      "scenario": "Your manager asked 'Why is the conversion rate down this month?' You wrote three paragraphs building up to the cause through every dead end you investigated. He replied 'TL;DR?'",
      "task": "Rewrite the answer top-down: the cause in sentence one, then the supporting evidence grouped beneath it.",
      "tips": ["Answer the question he asked in the first line.", "Move your investigation narrative below the conclusion, or cut it.", "Group evidence into a few clusters, not a step-by-step log."],
      "focus": ["structure", "concision"]
    },
    {
      "id": "structure-19",
      "title": "Sequence the migration plan",
      "scenario": "You must explain a database migration to a mixed audience of engineers and executives. You have details on the technical steps, the downtime window, the rollback plan, the cost, the risk, and the customer impact, all in one undifferentiated brain-dump.",
      "task": "Structure the message so executives get the impact and risk first and engineers get the detail in a clearly separated section.",
      "tips": ["Lead with customer impact and risk — that's what executives need.", "Group technical steps into their own clearly labelled section.", "Let each audience stop reading at the level that serves them."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-20",
      "title": "One idea on top",
      "scenario": "Your product update reads: 'We shipped dark mode, fixed a login bug, improved load time by 20%, added two integrations, and updated the docs.' Five parallel items, no governing idea. Your CEO asked what story this tells customers.",
      "task": "Add a single governing message on top and group the five items under it so the release has a point.",
      "tips": ["Find the theme (speed? polish? reach?) that ties the items together.", "Lead with that theme as one sentence.", "Group the items so they prove the theme."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-21",
      "title": "Frame the de-prioritization",
      "scenario": "A long-promised feature keeps slipping and you've decided to formally shelve it for the year. Stakeholders were told it was coming; demand for it has actually faded while two other bets have grown.",
      "task": "Write an SCQA framing that justifies shelving the feature before you say it's shelved.",
      "tips": ["Situation: the commitment that was made.", "Complication: the shift in demand and the rise of better bets.", "Answer: the shelving decision, with the rationale already established."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-22",
      "title": "Regroup the risk register",
      "scenario": "A project risk list has eleven entries mixing severities and types: a flaky third-party API, an untrained support team, an aggressive deadline, a single overloaded lead, unclear requirements, a possible budget cut, and more. The steering committee wants the headline risks, not the spreadsheet.",
      "task": "Group the eleven risks into 3 categories and lead with the one sentence the committee must hear.",
      "tips": ["Categories like people, technical, and external often partition cleanly.", "Surface the single biggest risk in your opening line.", "Don't read the register — distil it."],
      "focus": ["structure", "concision"]
    },
    {
      "id": "structure-23",
      "title": "Order for the skeptic",
      "scenario": "You're recommending a controversial vendor switch to a stakeholder who championed the current vendor. Your points: lower cost, better support, a cleaner API, faster onboarding, and one migration risk you're honest about. Order matters when the reader starts resistant.",
      "task": "Sequence the points to disarm the skeptic, deciding where the honest risk should sit.",
      "tips": ["Open with the point the skeptic can't easily dismiss.", "Address the migration risk before they raise it — but don't lead with it.", "Group benefits so they build momentum toward the recommendation."],
      "focus": ["structure", "audience"]
    },
    {
      "id": "structure-24",
      "title": "Pyramid the strategy memo",
      "scenario": "You're writing a one-page strategy memo arguing the company should move upmarket to enterprise customers. You have evidence on margins, win rates, support load, competitive positioning, and sales-cycle length, all currently flat and unranked.",
      "task": "Build a pyramid: governing recommendation up top, three grouped arguments, each supported by your evidence.",
      "tips": ["Top line is the recommendation, phrased as a claim.", "Sort the five evidence points under three arguments — don't list five.", "Make each argument stand on its own facts."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "structure-25",
      "title": "From notes to a clear memo",
      "scenario": "After a strategy offsite you have a page of raw notes: action items, half-formed decisions, open questions, and observations all jumbled together. You need to send a follow-up memo people can actually act on.",
      "task": "Impose structure: separate decisions, open questions, and owned action items into distinct sections under a one-line summary of the offsite.",
      "tips": ["Lead with one sentence capturing what the offsite concluded.", "Put decisions first, then open questions, then actions with owners.", "Don't leave action items without a name attached."],
      "focus": ["structure", "clarity"]
    }
  ],
  "cut-to-the-bone": [
    {
      "id": "concise-03",
      "title": "Trim the status update",
      "scenario": "Your weekly status note reads: \"At this point in time, I think it's probably fair to say that we are more or less still on track, though there are a few things here and there that we are continuing to keep an eye on as we move forward.\" Your VP skims twenty of these on Friday.",
      "task": "Rewrite this as one sentence that states the status and any real risk.",
      "tips": ["Lead with the actual status: on track or not.", "Replace 'a few things here and there' with the specific risk, or cut it.", "Delete 'at this point in time', 'more or less', 'as we move forward'."],
      "focus": ["concision", "clarity"]
    },
    {
      "id": "concise-04",
      "title": "The runway-only email",
      "scenario": "You start a message: \"I hope this email finds you well. I wanted to reach out and touch base with you because I had a quick question that I was hoping you might be able to help me with if you have a moment.\" Then the actual question follows.",
      "task": "Cut everything before the real question. Write the opening line you'd keep.",
      "tips": ["The reader wants the question, not the announcement of a question.", "One warm line is fine; four is stalling.", "Start at the point."],
      "focus": ["concision", "impact"]
    },
    {
      "id": "concise-05",
      "title": "Nominalizations to verbs",
      "scenario": "A project recap states: \"The team undertook a review of the requirements and made a determination that a revision of the scope would be necessary for the achievement of the deadline.\" It's all nouns doing verbs' jobs.",
      "task": "Rewrite using strong verbs instead of -tion/-ment noun phrases.",
      "tips": ["'Made a determination' becomes 'decided'.", "'Undertook a review of' becomes 'reviewed'.", "Hunt every -tion and ask if a verb is hiding inside it."],
      "focus": ["concision", "precision"],
      "placeholder": "The team reviewed the requirements and..."
    },
    {
      "id": "concise-06",
      "title": "Slack thread, one line",
      "scenario": "A teammate posts: \"Hey, so I was just wondering, and feel free to ignore this if it's not relevant, but do you maybe have any sense of roughly when the staging environment might possibly be back up and running again?\"",
      "task": "Rewrite the question in under 12 words.",
      "tips": ["Drop the apology and the permission-seeking.", "Ask the question directly: when is staging back?", "Politeness survives concision."],
      "focus": ["concision", "clarity"],
      "placeholder": "When is staging back up?"
    },
    {
      "id": "concise-07",
      "title": "Two minutes, then stop",
      "scenario": "You have to brief a director on why a launch slipped. You're tempted to walk through the whole timeline, every dependency, and the three meetings where it nearly recovered.",
      "task": "Write a 3-sentence verbal brief: what slipped, why, and the new date.",
      "tips": ["Cause and new date are what they need; the saga is not.", "One sentence each: what, why, when now.", "Offer detail on request rather than front-loading it."],
      "focus": ["concision", "structure"]
    },
    {
      "id": "concise-08",
      "title": "Kill the qualifiers",
      "scenario": "A recommendation reads: \"In general, it seems like this approach could potentially be somewhat more effective in most cases, at least based on what we've seen so far.\" Five qualifiers bury one claim.",
      "task": "State the recommendation plainly. If a caveat is real, name the specific one.",
      "tips": ["Stacked qualifiers signal you don't trust your own point.", "Keep at most one honest, concrete caveat.", "Vague hedging is worse than a clean limitation."],
      "focus": ["concision", "precision"]
    },
    {
      "id": "concise-09",
      "title": "Halve the meeting recap",
      "scenario": "Your recap email: \"Thanks so much to everyone for taking the time to join today's call. It was a really productive conversation and I think we covered a lot of useful ground. As discussed, there were a number of action items that came out of our discussion that I wanted to go ahead and summarize below for everyone's reference.\"",
      "task": "Cut this preamble to a single sentence that leads into the action items.",
      "tips": ["The action items are the value; the gratitude is filler.", "'A number of action items that came out of our discussion' is just 'action items'.", "One line of thanks, max."],
      "focus": ["concision", "structure"]
    },
    {
      "id": "concise-10",
      "title": "The bloated apology",
      "scenario": "You missed a deadline and wrote: \"I just wanted to sincerely apologize for the fact that I wasn't able to get this over to you by when I had originally said I would, and I really hope it hasn't caused too much in the way of inconvenience on your end.\"",
      "task": "Rewrite as a crisp apology plus the new delivery time.",
      "tips": ["Apologize once, briefly, then give the fix.", "What the reader needs most is the new date.", "Over-apologizing reads as anxious, not accountable."],
      "focus": ["concision", "impact"]
    },
    {
      "id": "concise-11",
      "title": "Redundant pairs",
      "scenario": "A memo is littered with doublets: \"Each and every one of our various and sundry partners will receive full and complete documentation, first and foremost, in order to ensure and guarantee a smooth and seamless transition.\"",
      "task": "Cut every redundant pair down to one word.",
      "tips": ["'Each and every' is just 'every'.", "'Ensure and guarantee' say the same thing once.", "Pick the stronger word of each pair and delete its twin."],
      "focus": ["concision", "precision"]
    },
    {
      "id": "concise-12",
      "title": "The 200-word answer to a yes/no",
      "scenario": "A stakeholder asked: \"Can we ship by Friday?\" You drafted three paragraphs about resourcing, risk, and dependencies before ever saying yes or no.",
      "task": "Answer in one sentence: yes or no, plus the single deciding factor.",
      "tips": ["Lead with the answer the question asked for.", "One reason, the load-bearing one, not all five.", "Detail can follow if they want it; the answer comes first."],
      "focus": ["concision", "clarity"]
    },
    {
      "id": "concise-13",
      "title": "Tighten the value prop",
      "scenario": "A landing-page line reads: \"Our innovative, cutting-edge platform leverages a wide range of powerful capabilities in order to help enable businesses to more effectively optimize and streamline their day-to-day operational workflows.\" It says almost nothing.",
      "task": "Rewrite it in one concrete sentence a customer would actually understand.",
      "tips": ["Cut buzzwords: innovative, cutting-edge, leverage, optimize.", "Name what it actually does, not how impressive it is.", "Concrete verb plus concrete benefit."],
      "focus": ["concision", "audience"]
    },
    {
      "id": "concise-14",
      "title": "Throat-clearing intro",
      "scenario": "A report opens: \"Before diving into the specifics, it's probably worth taking a step back to provide a bit of context and set the stage for the broader discussion that follows in the sections below.\" Then the report begins.",
      "task": "Delete the throat-clearing. Write the real first sentence of the report.",
      "tips": ["Sentences that announce you're about to start can be cut whole.", "'Set the stage' is the stage; just walk on it.", "Begin with substance, not with a plan to provide substance."],
      "focus": ["concision", "structure"]
    },
    {
      "id": "concise-15",
      "title": "Shrink the bullet",
      "scenario": "A slide bullet reads: \"We are currently in the process of working towards the implementation of a new set of internal guidelines that are intended to help improve overall consistency across teams.\" Slides should be scannable.",
      "task": "Rewrite the bullet in 8 words or fewer.",
      "tips": ["'Currently in the process of working towards' is just 'building' or 'rolling out'.", "A bullet is a headline, not a sentence.", "Cut 'a new set of', 'are intended to help'."],
      "focus": ["concision", "clarity"],
      "placeholder": "Rolling out guidelines to improve cross-team consistency."
    },
    {
      "id": "concise-16",
      "title": "The wandering ask",
      "scenario": "You need budget approval but wrote: \"I know everyone is really busy and budgets are tight, and I completely understand if this isn't the right time, but I was wondering whether there might be any possibility of potentially allocating some additional funds toward the tooling we talked about.\"",
      "task": "Rewrite as a direct, specific ask with the amount and purpose.",
      "tips": ["Bury the ask and people miss it; lead with it.", "Name the number and what it buys.", "You can be respectful and still be direct."],
      "focus": ["concision", "impact"]
    },
    {
      "id": "concise-17",
      "title": "Decongest the dependency note",
      "scenario": "An engineer wrote: \"It should be noted that there is a possibility that we may encounter some potential delays due to the fact that we are currently dependent upon the delivery of the API from the other team.\"",
      "task": "Rewrite in one plain sentence stating the dependency and the risk.",
      "tips": ["'Due to the fact that' is just 'because'.", "'It should be noted that' adds nothing; delete it.", "Name the dependency and what it blocks."],
      "focus": ["concision", "precision"]
    },
    {
      "id": "concise-18",
      "title": "One-line elevator answer",
      "scenario": "A board member asks in the hallway: \"What does your team actually do?\" You start describing your roadmap, your stack, and your last three projects.",
      "task": "Answer in a single sentence anyone could repeat back.",
      "tips": ["If they can't repeat it, it was too long.", "Function and outcome, not roadmap and tooling.", "Plain words beat jargon for a non-specialist."],
      "focus": ["concision", "audience"]
    },
    {
      "id": "concise-19",
      "title": "Cut the caveats from the headline",
      "scenario": "A results email leads: \"While there are of course many factors at play and it's still relatively early, and we'll need more data before drawing firm conclusions, it does appear that conversion may have ticked up a little.\" The good news is buried under hedges.",
      "task": "Lead with the result, then keep only the one caveat that matters.",
      "tips": ["Put the finding first; caveats earn at most one clause.", "Replace 'ticked up a little' with the actual number if you have it.", "Pre-hedging an entire sentence drowns the signal."],
      "focus": ["concision", "clarity"]
    },
    {
      "id": "concise-20",
      "title": "The over-explained decline",
      "scenario": "Declining a meeting, you wrote: \"Thank you so much for thinking of me and including me on this invite. Unfortunately, due to a number of competing priorities and some prior commitments on my calendar, I don't think I'm going to be able to make it work to attend this particular session at this time.\"",
      "task": "Rewrite as a short, gracious decline in two sentences max.",
      "tips": ["A 'no' doesn't need a paragraph of justification.", "Thanks, decline, optional one-line reason. Done.", "Offer an alternative if useful, then stop."],
      "focus": ["concision", "audience"]
    },
    {
      "id": "concise-21",
      "title": "Strip the executive summary",
      "scenario": "Your exec summary runs: \"This document seeks to provide a comprehensive overview of the various considerations, findings, and recommendations that emerged over the course of our extensive analysis of the current state of affairs with respect to our customer onboarding process.\"",
      "task": "Replace it with a one-sentence summary of the actual finding and recommendation.",
      "tips": ["A summary describing that it's a summary has said nothing.", "State the finding and the ask, not the document's intentions.", "What did you learn and what should they do?"],
      "focus": ["concision", "structure"]
    },
    {
      "id": "concise-22",
      "title": "Compress the timeline",
      "scenario": "You need to give a one-line update but keep writing: \"So basically what happened was we started by looking into the issue, and then after that we ran some tests, and then once we had the results we went ahead and rolled out a fix, which seems to be holding up okay so far.\"",
      "task": "Compress the whole narrative into one sentence focused on the outcome.",
      "tips": ["Drop the play-by-play; the reader wants where it landed.", "Cut 'so basically what happened was', 'went ahead and'.", "Outcome first, process only if asked."],
      "focus": ["concision", "clarity"]
    },
    {
      "id": "concise-23",
      "title": "Verb up the job post",
      "scenario": "An internal blurb reads: \"The successful candidate will be responsible for the management of the coordination of cross-functional initiatives and the facilitation of the alignment of stakeholder expectations.\" It's a tower of nominalizations.",
      "task": "Rewrite using direct verbs so a reader knows what the role actually does.",
      "tips": ["'Be responsible for the management of' is just 'manage'.", "Stack of -tion words means a verb is missing.", "Each duty should start with an action."],
      "focus": ["concision", "precision"]
    },
    {
      "id": "concise-24",
      "title": "The padded compliment",
      "scenario": "Praising a colleague's work, you wrote: \"I just wanted to say that I think you really did an absolutely fantastic and incredible job on this, and it's honestly some of the best and most impressive work that I think I've seen in quite a long time.\" The intensifiers dilute the praise.",
      "task": "Rewrite as one specific, genuine compliment.",
      "tips": ["Specific praise lands harder than stacked superlatives.", "Name the one thing they did well.", "Cut 'just wanted to say', 'honestly', 'really'."],
      "focus": ["concision", "impact"]
    },
    {
      "id": "concise-25",
      "title": "Final pass: cut a third",
      "scenario": "A finished paragraph reads: \"Going forward, in an effort to make sure that we are all aligned, I would like to suggest that perhaps we could consider putting together some kind of a regular cadence of check-ins so that we have the ability to stay on top of any issues that might come up as the project continues to progress over time.\"",
      "task": "Make an editing pass and cut at least a third of the words with no loss of meaning.",
      "tips": ["'Have the ability to' is just 'can'.", "'Some kind of a regular cadence of check-ins' is 'regular check-ins'.", "Mark every word that adds nothing, then delete it."],
      "focus": ["concision", "clarity"]
    }
  ],
  "precision-and-evidence": [
    {
      "id": "precision-03",
      "title": "Kill the weasel words",
      "scenario": "A status email reads: \"We've made good progress on the migration and should be largely done fairly soon. There are a few minor issues left but nothing major.\"",
      "task": "Rewrite it so every vague phrase ('good progress', 'largely', 'fairly soon', 'a few') becomes a number, percentage, or date.",
      "tips": ["Quantify progress as a percent or a count of items done vs. total.", "Replace 'soon' with a specific date.", "Name the 'few minor issues' so the reader can judge them."],
      "focus": ["precision", "clarity"],
      "placeholder": "We've completed ___ of ___ services. The migration finishes ___. The remaining issues are: ___."
    },
    {
      "id": "precision-04",
      "title": "The load-bearing number",
      "scenario": "Your deck has a slide with eight metrics: CAC $310, LTV $1,240, churn 4.1%, MRR $82k, trial-to-paid 18%, NPS 38, seats 1,900, and ARPU $44. The board only has time for one takeaway.",
      "task": "Pick the single number that most changes the board's decision this quarter and write the one sentence you'd say out loud.",
      "tips": ["Ask which number, if it moved, would change what you'd do next.", "Pair the chosen number with what it implies, not just its value.", "Drop the other seven from the spoken line."],
      "focus": ["precision", "impact"]
    },
    {
      "id": "precision-05",
      "title": "Define 'high priority'",
      "scenario": "A support lead writes: \"This bug is high priority and affecting a lot of customers. We should fix it ASAP before it gets worse.\"",
      "task": "Rewrite to make 'high priority', 'a lot', and 'ASAP' concrete enough that an engineer could triage without asking a follow-up.",
      "tips": ["Quantify the blast radius (how many customers, what % of accounts).", "Replace 'ASAP' with a deadline tied to a consequence.", "State severity in terms of what the customer can't do."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-06",
      "title": "Jargon to plain noun",
      "scenario": "A product update says: \"We're leveraging a synergistic, best-in-class framework to holistically optimize the end-to-end customer journey and drive impactful outcomes.\"",
      "task": "Rewrite in plain language that names the actual change and the actual result. Strip every empty buzzword.",
      "tips": ["For each abstract word, ask 'what specifically?' and answer it.", "Name the concrete thing you built or changed.", "If a phrase survives being deleted, delete it."],
      "focus": ["clarity", "precision"]
    },
    {
      "id": "precision-07",
      "title": "Survive the skeptic",
      "scenario": "You claim in a memo: \"Our onboarding is clearly the best in the market.\" Your CFO is the kind of person who replies 'based on what?' to every adjective.",
      "task": "Rewrite the claim so it carries its own evidence and would survive the CFO's 'based on what?'",
      "tips": ["Attach the comparison: best by what measure, against whom?", "Include a number, a source, or a timeframe inline.", "If you can't back it, soften the claim to what you can defend."],
      "focus": ["precision", "impact"]
    },
    {
      "id": "precision-08",
      "title": "From dump to one line (sales)",
      "scenario": "Q3 sales data: 142 deals closed (+9%), avg deal $24k (-5%), pipeline $3.1M, win rate 22% (+3pts), sales cycle 47 days (-6), enterprise share 31% (+11pts), reps quota-attained 6 of 9.",
      "task": "Tell the VP of Sales the one story these numbers add up to in 2–3 sentences using What → So What → Now What.",
      "tips": ["Find the through-line, don't list seven figures.", "Note the trade-off (more enterprise, smaller average deal?).", "End with the decision you want the VP to make."],
      "focus": ["clarity", "impact"]
    },
    {
      "id": "precision-09",
      "title": "Pin down 'soon'",
      "scenario": "An exec asks when the API rate-limit fix ships. The engineer replies: \"Soon — we're almost there, just wrapping up a couple of things.\"",
      "task": "Rewrite the answer with a real date and what 'a couple of things' actually are, including the risk that could slip it.",
      "tips": ["Commit to a date, or a date range with the blocker named.", "List the remaining work as concrete items.", "Flag the one thing that could move the date."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-10",
      "title": "Quantify the win",
      "scenario": "A retro note says: \"The new caching layer made the app feel much faster and our users are happier as a result.\"",
      "task": "Rewrite with invented but plausible specifics: the latency change, the measurement, and the user signal you'd cite as proof.",
      "tips": ["Give before/after numbers, not just 'faster'.", "Name the metric (p95 latency, load time) and where it's measured.", "Back 'happier' with a real signal, not a feeling."],
      "focus": ["precision", "impact"],
      "placeholder": "p95 latency dropped from ___ to ___ after the caching layer. We saw ___ in ___."
    },
    {
      "id": "precision-11",
      "title": "The honest 'flat'",
      "scenario": "Last month: revenue $1.20M (vs $1.19M), users 48,100 (vs 47,900), conversion 3.2% (vs 3.2%), churn 5.0% (vs 4.9%). A teammate wants to call this 'strong continued growth across all key metrics.'",
      "task": "Write the honest one-sentence read of these numbers — what actually moved and what didn't.",
      "tips": ["Don't inflate noise into a trend.", "Name what's genuinely flat instead of dressing it up.", "Precision about non-movement builds more trust than spin."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-12",
      "title": "Scope the outage",
      "scenario": "An incident summary reads: \"We had some downtime earlier today that impacted certain users for a little while. The team responded quickly and things are back to normal.\"",
      "task": "Rewrite as an exec-ready incident line: exact duration, who was affected and how many, and the resolution time.",
      "tips": ["Replace 'some', 'certain', 'a little while' with figures.", "Quantify impact: % of users, requests failed, revenue at risk.", "Give start time, detection time, and recovery time."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-13",
      "title": "Name the cohort",
      "scenario": "A growth memo claims: \"Power users churn way less than everyone else, so we should focus on getting people to that level.\"",
      "task": "Rewrite defining 'power user' concretely and quantifying the churn gap so the claim is falsifiable.",
      "tips": ["Define the cohort by a measurable threshold (e.g. 3+ sessions/week).", "State both churn rates so the gap is checkable.", "Make sure a skeptic could replicate the comparison."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-14",
      "title": "One insight (finance)",
      "scenario": "Monthly burn review: cash $4.2M, monthly burn $480k, runway 8.7 months, headcount 41, revenue $310k MRR (+6%), gross margin 71%, AR aging 52 days. The CEO asks 'where do we stand?'",
      "task": "Give the CEO the single most decision-relevant read in 2–3 sentences, ending with what you'd act on.",
      "tips": ["Lead with the number that constrains the next decision (runway).", "Connect two figures if they tell a story together.", "Close with the action: extend runway, raise, or cut."],
      "focus": ["clarity", "impact"]
    },
    {
      "id": "precision-15",
      "title": "Specific verb, specific object",
      "scenario": "A roadmap bullet reads: \"Improve the dashboard to better serve our users' evolving needs and enhance overall usability.\"",
      "task": "Rewrite it as a concrete deliverable: what specifically changes, for whom, and how you'll know it worked.",
      "tips": ["Swap 'improve' and 'enhance' for a specific action and object.", "Name the user and the task they're trying to do.", "Add a success metric so the goal is testable."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-16",
      "title": "The comparison you're hiding",
      "scenario": "A report states: \"Conversion improved a lot this quarter — it's looking really healthy now.\"",
      "task": "Rewrite supplying the baseline and the benchmark: improved from what, to what, versus what target or prior period.",
      "tips": ["A number means little without its baseline — add it.", "Compare to a target or the prior period explicitly.", "Drop 'a lot' and 'healthy' once the numbers carry the weight."],
      "focus": ["precision", "impact"]
    },
    {
      "id": "precision-17",
      "title": "Ops capacity, exactly",
      "scenario": "An ops lead writes: \"The warehouse is getting pretty stretched and we might struggle to keep up if volume keeps climbing.\"",
      "task": "Rewrite with numbers: current utilization, the threshold where it breaks, and the volume growth that triggers it.",
      "tips": ["Quantify 'stretched' as a utilization percentage.", "Name the capacity ceiling and current run-rate against it.", "State the growth rate that hits the wall, and when."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-18",
      "title": "Falsifiable claim",
      "scenario": "A pitch slide says: \"Customers love our product.\" Your most cynical investor reads it and rolls his eyes.",
      "task": "Replace it with a claim that is specific, measurable, and could in principle be proven false.",
      "tips": ["Pick a metric that captures 'love' (retention, NPS, referral rate).", "Add the number and the sample it's drawn from.", "Ask: could someone check this and find it untrue? If not, it's vague."],
      "focus": ["precision", "impact"]
    },
    {
      "id": "precision-19",
      "title": "Trim to the decisive metric",
      "scenario": "A teammate's Slack message lists everything: \"DAU up 4%, WAU up 2%, MAU flat, new signups up 7%, reactivations up 3%, but session length down 9% and feature adoption down 11%.\"",
      "task": "Identify which one or two numbers actually matter for the team's next decision and state the takeaway in a single sentence.",
      "tips": ["More metrics isn't more insight — find the tension.", "Spot the contradiction (growth up, depth down).", "Say what that contradiction means for what to do next."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-20",
      "title": "Concrete example beats adjective",
      "scenario": "A customer-research summary says: \"Users find the checkout flow confusing and frustrating.\"",
      "task": "Rewrite by anchoring the abstraction in one concrete, specific example of where and how users get confused, plus how often.",
      "tips": ["Replace the adjective with the exact step that fails.", "Quantify: what % drop off, or how many of N testers stumbled.", "A specific failure is more actionable than a feeling."],
      "focus": ["clarity", "precision"]
    },
    {
      "id": "precision-21",
      "title": "Estimate with a range",
      "scenario": "A finance partner asks the impact of a proposed pricing change. You reply: \"It should boost revenue meaningfully without hurting volume too much.\"",
      "task": "Rewrite with a quantified estimate: a revenue range, the volume assumption, and the confidence level or key uncertainty.",
      "tips": ["Give a range, not false precision and not vagueness.", "State the assumption the estimate hinges on.", "Name the biggest uncertainty so it's honest."],
      "focus": ["precision", "impact"]
    },
    {
      "id": "precision-22",
      "title": "What → So what → Now what (eng)",
      "scenario": "Telemetry: error rate climbed from 0.3% to 1.1% over two weeks, concentrated in the payments service, correlated with a deploy on the 14th. Your eng director asks for the readout.",
      "task": "Deliver it in three beats: the fact, why it matters, and the action you recommend — under four sentences.",
      "tips": ["State the fact with its numbers and timeframe.", "Translate the error rate into customer/revenue impact.", "Recommend a specific action: rollback, hotfix, or investigate."],
      "focus": ["structure", "impact"]
    },
    {
      "id": "precision-23",
      "title": "Cut the hedge stack",
      "scenario": "A recommendation reads: \"We could maybe consider possibly looking into perhaps testing a slightly different approach at some point if it seems worthwhile.\"",
      "task": "Rewrite as one precise, committed recommendation with a specific action and timeframe — no hedge words.",
      "tips": ["Count the hedges, then delete all but the one honest caveat.", "Replace 'some point' with a date or trigger.", "Commit to the action; precision and ownership go together."],
      "focus": ["concision", "precision"]
    },
    {
      "id": "precision-24",
      "title": "The metric that's actually a proxy",
      "scenario": "A team celebrates: \"We hit 50,000 page views this week — engagement is through the roof!\" But page views don't equal value here.",
      "task": "Rewrite to name the metric that actually reflects value, state it, and explain why page views overstated the story.",
      "tips": ["Distinguish a vanity metric from an outcome metric.", "Quantify the metric that maps to real value.", "Be precise about what the big number does and doesn't prove."],
      "focus": ["precision", "clarity"]
    },
    {
      "id": "precision-25",
      "title": "Specific ask, specific amount",
      "scenario": "In a budget request you wrote: \"We need more resources to properly support the growing demand on the platform.\"",
      "task": "Rewrite as a precise ask: the exact resource, the amount, what demand metric justifies it, and the consequence of not getting it.",
      "tips": ["Name the resource and the number (headcount, dollars, servers).", "Tie the ask to a measured demand figure.", "State what breaks without it, quantified."],
      "focus": ["precision", "impact"]
    }
  ],
  "executive-presence": [
    {
      "id": "presence-03",
      "title": "Kill the hedge words",
      "scenario": "You've drafted an update to your VP and it's littered with 'I think maybe', 'sort of', 'it seems like', and 'just wanted to flag'. The content is solid; the delivery sounds apologetic.",
      "task": "Rewrite the message stripping every hedge so it reads as a senior person stating what is true.",
      "tips": ["Cut 'just', 'maybe', 'sort of', and 'I think' on the first pass.", "If a claim is solid, state it flat — no cushion.", "Keep genuine uncertainty, but mark it as a judgment, not a hedge."],
      "focus": ["impact", "concision"],
      "placeholder": "I just think it maybe seems like we should sort of consider..."
    },
    {
      "id": "presence-04",
      "title": "Pick the vendor",
      "scenario": "Procurement narrowed it to two vendors and asked which you'd choose. Both are defensible. You're tempted to write up a balanced comparison and let leadership decide.",
      "task": "Write a 3–4 sentence note that names your pick and the single reason it wins.",
      "tips": ["Lead with the choice, not the comparison.", "Give the one deciding factor, not all five.", "Acknowledge the trade-off you're accepting on purpose."],
      "focus": ["impact", "precision"]
    },
    {
      "id": "presence-05",
      "title": "Own the recommendation",
      "scenario": "You wrote 'the data suggests we might want to consider pausing the campaign.' You actually believe the campaign should stop now. The passive framing hides your own conviction.",
      "task": "Rewrite so you own the recommendation in the first person and the data backs you, not the reverse.",
      "tips": ["Make yourself the subject: 'I recommend...'", "Use the data as support, not as the one doing the recommending.", "State the action plainly: pause it, don't 'consider pausing'."],
      "focus": ["impact", "clarity"],
      "placeholder": "The data suggests we might want to consider..."
    },
    {
      "id": "presence-06",
      "title": "Decide under ambiguity",
      "scenario": "A customer outage has an unclear root cause. Leadership wants a call: roll back the release or push a forward fix. You don't have complete data and won't for hours.",
      "task": "Write a recommendation that commits to one path despite the missing data, and states what would change your mind.",
      "tips": ["Commit first; caveat second.", "Name the specific signal that would reverse your call.", "Don't wait for certainty to sound certain about the next move."],
      "focus": ["impact", "precision"]
    },
    {
      "id": "presence-07",
      "title": "From narrator to owner",
      "scenario": "Your status update reads like a play-by-play: 'We met with the team, then we looked at the numbers, then we had a discussion, and there were some concerns raised.' It narrates activity but takes no stance.",
      "task": "Rewrite it to lead with the conclusion you reached, then support it — owner voice, not narrator voice.",
      "tips": ["Open with the 'so what', not the timeline.", "Cut process narration unless it changes the conclusion.", "Say what you concluded, not just what happened."],
      "focus": ["structure", "impact"],
      "placeholder": "We met with the team, then we looked at the numbers..."
    },
    {
      "id": "presence-08",
      "title": "Signpost the two issues",
      "scenario": "You need to raise two distinct problems with a project plan — a budget gap and a staffing risk — but your draft mashes them into one dense paragraph the reader has to untangle.",
      "task": "Rewrite using explicit signposts so the reader can follow the two issues separately.",
      "tips": ["Tell them how many issues there are up front.", "Use 'First... Second...' to separate them cleanly.", "Keep each issue to its own claim and ask."],
      "focus": ["structure", "clarity"]
    },
    {
      "id": "presence-09",
      "title": "The decisive Slack reply",
      "scenario": "A peer pings you: 'Should we delay the launch or ship Friday?' You start typing a long message weighing both. They need a call, not an essay.",
      "task": "Write a short, decisive reply (2–3 sentences) that gives your answer and the reason, in a tone fit for chat.",
      "tips": ["Answer in the first line — ship or delay.", "One reason, then stop.", "Conversational, but no waffling."],
      "focus": ["concision", "impact"],
      "placeholder": "Hmm, well it kind of depends, on one hand..."
    },
    {
      "id": "presence-10",
      "title": "Recommend, then invite challenge",
      "scenario": "You're proposing a reorg of your team. It's a big call and you want buy-in, but you also genuinely want pushback from peers who see blind spots you might miss.",
      "task": "Write an opening that states your recommendation firmly while explicitly inviting the strongest counter-argument.",
      "tips": ["Lead with the position — don't bury it under the invitation.", "Ask for the best objection, not just 'thoughts?'", "Confidence and openness can coexist; show both."],
      "focus": ["impact", "audience"]
    },
    {
      "id": "presence-11",
      "title": "Fact, judgment, next step on churn",
      "scenario": "Enterprise churn ticked up this quarter. You suspect onboarding, not the product itself, but you've only seen two cancellation calls.",
      "task": "Write 3–4 sentences that label what you know, what you believe and why, and how you'd confirm it.",
      "tips": ["State the churn fact plainly, with the number.", "Mark your onboarding theory as a judgment, with your reasoning.", "End with a concrete way to test it this week."],
      "focus": ["precision", "structure"]
    },
    {
      "id": "presence-12",
      "title": "Stop CC-ing the decision upward",
      "scenario": "You wrote 'Let me know how you'd like to proceed' to your director on a call that's squarely yours to make. You're handing back a decision you're equipped to own.",
      "task": "Rewrite to state the decision you're making and what you need from them — informing, not asking permission.",
      "tips": ["Replace 'how would you like to proceed' with 'here's what I'm doing'.", "Flag only what genuinely needs their input.", "Default to ownership; escalate only the real fork."],
      "focus": ["impact", "audience"],
      "placeholder": "Let me know how you'd like to proceed."
    },
    {
      "id": "presence-13",
      "title": "The confident 'no'",
      "scenario": "A stakeholder asks you to add a feature you believe will hurt the product. Your draft softens it so much — 'we could maybe look at it down the line' — that it reads like a soft yes.",
      "task": "Write a clear, respectful 'no' that owns the reasoning without leaving false hope.",
      "tips": ["Say no in the first sentence; don't make them dig for it.", "Give the real reason, not a scheduling excuse.", "Respectful and firm are not opposites."],
      "focus": ["clarity", "impact"]
    },
    {
      "id": "presence-14",
      "title": "Recommend across the cost trade-off",
      "scenario": "Leadership must choose between a cheaper tool that's slower to integrate and a pricier one that's faster. They asked for your recommendation, not a spreadsheet.",
      "task": "Write a recommendation that picks one and names the trade-off you're consciously accepting.",
      "tips": ["State the pick before the math.", "Name what you're giving up — that's what makes it credible.", "Tie the choice to what matters most right now."],
      "focus": ["impact", "precision"]
    },
    {
      "id": "presence-15",
      "title": "Open the exec summary with a verdict",
      "scenario": "Your one-page memo to the leadership team opens with three paragraphs of background before the recommendation appears on page two. Busy readers will never reach it.",
      "task": "Write a first sentence that delivers the verdict, so the rest of the memo becomes the justification.",
      "tips": ["Front-load the answer; context can follow.", "Assume they read only the first line — make it count.", "A verdict is a claim plus a recommended action."],
      "focus": ["structure", "impact"]
    },
    {
      "id": "presence-16",
      "title": "Calibrated confidence, not bravado",
      "scenario": "Your draft overcorrects from hedging into bluster: 'This will absolutely work, guaranteed, no question.' You don't actually have that certainty, and a sharp reader will distrust the swagger.",
      "task": "Rewrite to project confidence that matches your actual evidence — sure where you're sure, honest where you're not.",
      "tips": ["Strong claims need strong backing; calibrate to your evidence.", "Replace 'guaranteed' with the specific reason you're confident.", "Mark the one real risk instead of pretending none exists."],
      "focus": ["precision", "impact"],
      "placeholder": "This will absolutely work, guaranteed, no question."
    },
    {
      "id": "presence-17",
      "title": "Make the call on hiring",
      "scenario": "After a debrief, the panel is split on a candidate. As hiring manager, you have to write the decision. Your instinct is to summarize everyone's views and call it 'mixed'.",
      "task": "Write a 3–4 sentence decision that states hire or no-hire and the deciding factor.",
      "tips": ["Make the call; 'mixed' is not a decision.", "Name the one signal that tipped you.", "Acknowledge the dissent without hiding behind it."],
      "focus": ["impact", "clarity"]
    },
    {
      "id": "presence-18",
      "title": "Cut the throat-clearing intro",
      "scenario": "Your email opens with 'I hope this finds you well. I wanted to reach out because I've been thinking about something and wasn't sure if it was the right time to bring it up, but...' The real point is in sentence four.",
      "task": "Rewrite so the first sentence carries the actual point, with no throat-clearing.",
      "tips": ["Delete the warm-up and start at the point.", "Apologizing for writing weakens the message.", "Get to the ask or claim immediately."],
      "focus": ["concision", "impact"],
      "placeholder": "I hope this finds you well. I wanted to reach out because..."
    },
    {
      "id": "presence-19",
      "title": "Recommend killing your own project",
      "scenario": "A pilot you championed isn't hitting its numbers. The honest read is to sunset it. Writing that recommendation about your own initiative is uncomfortable, and your draft buries it in qualifications.",
      "task": "Write a clear recommendation to wind it down that owns the call without defensiveness.",
      "tips": ["Lead with the recommendation, not the excuses.", "Separate the result (fact) from the lesson (judgment).", "Owning a miss reads as senior, not weak."],
      "focus": ["impact", "precision"]
    },
    {
      "id": "presence-20",
      "title": "Pick a date and commit",
      "scenario": "Leadership wants a launch date. Your draft offers 'sometime in Q3, depending on a few things, possibly early Q4.' They can't plan around a fog.",
      "task": "Rewrite to commit to a specific date and state the one dependency that could move it.",
      "tips": ["Name a real date, not a range with escape hatches.", "List the single dependency that matters, not five.", "Commitment plus one honest risk beats a vague window."],
      "focus": ["precision", "impact"],
      "placeholder": "Sometime in Q3, depending on a few things, possibly early Q4."
    },
    {
      "id": "presence-21",
      "title": "Decisive in the board update",
      "scenario": "Your board update lists every metric flat, with no interpretation: 'Revenue is X. Churn is Y. Headcount is Z.' The board can read a dashboard; they want to know what you make of it.",
      "task": "Rewrite the opening to lead with your interpretation of where the business stands, then support with the numbers.",
      "tips": ["Start with your read of the quarter, not the raw figures.", "Separate the facts from your judgment of them.", "A board wants the CEO's view, not a data dump."],
      "focus": ["audience", "impact"]
    },
    {
      "id": "presence-22",
      "title": "Replace 'we' that hides you",
      "scenario": "Your draft uses 'we feel' and 'the team thinks' to describe a recommendation that is actually yours. The collective voice diffuses ownership and makes the position harder to challenge or trust.",
      "task": "Rewrite so you own the recommendation in your own voice, reserving 'we' for what the team genuinely did together.",
      "tips": ["Use 'I recommend' for your judgment.", "Save 'we' for shared facts and shared work.", "Diffuse ownership reads as no ownership."],
      "focus": ["clarity", "impact"],
      "placeholder": "We feel like the team thinks we should probably..."
    },
    {
      "id": "presence-23",
      "title": "One ask, clearly stated",
      "scenario": "You need budget approval, but your message lists context, history, and three possible amounts without ever stating plainly what you're asking for. The approver has to guess the actual request.",
      "task": "Write a version that states the single, specific ask in one sentence near the top.",
      "tips": ["Name the exact amount and what it's for.", "One ask — don't offer a menu and call it deferring.", "Put the ask before the justification."],
      "focus": ["clarity", "concision"]
    },
    {
      "id": "presence-24",
      "title": "Turn a risk list into a stance",
      "scenario": "Asked whether to proceed with an acquisition, you produced a tidy list of risks and benefits and stopped there. The reader is left holding the decision you were asked to make.",
      "task": "Add a closing that takes a clear position — proceed or don't — grounded in which risk matters most.",
      "tips": ["A risk list is analysis, not a recommendation.", "Weigh the risks, then pick a side.", "Tell them which single risk drove your call."],
      "focus": ["impact", "structure"]
    },
    {
      "id": "presence-25",
      "title": "Decisive bad-news delivery",
      "scenario": "You must tell a client a deliverable will slip. Your draft circles the news with apologies and softeners for a full paragraph before admitting the delay, which reads as evasive.",
      "task": "Rewrite to state the slip and the new commitment up front, with ownership and no over-apologizing.",
      "tips": ["Lead with the news; don't make them wait for it.", "State the fact, then the recovery plan and new date.", "Own it once — don't apologize five times."],
      "focus": ["impact", "audience"],
      "placeholder": "I'm so sorry to have to write this, and I really hate to be the bearer of..."
    }
  ],
  "answering-under-pressure": [
    {
      "id": "pressure-03",
      "title": "The board wants a yes or no",
      "scenario": "In a board meeting, the chair cuts you off mid-explanation: \"I don't need the backstory — will we hit the Q4 revenue target, yes or no?\" You believe you'll land 5% short.",
      "task": "Write a 2-3 sentence answer that opens with a clear yes/no/short-by-how-much, then one supporting fact.",
      "tips": ["Lead with the binary the chair asked for.", "Quantify the miss instead of hedging.", "Stop after the one fact that explains it."],
      "focus": ["clarity", "concision", "impact"]
    },
    {
      "id": "pressure-04",
      "title": "Customer asks if their data leaked",
      "scenario": "On a tense call, your largest customer's CISO asks: \"Was our data exposed in the incident, yes or no?\" You know unauthorized access occurred but haven't confirmed which records were touched.",
      "task": "Write a 2-3 sentence answer that states what you know for certain, separates it from what you're still confirming, and commits to a follow-up time.",
      "tips": ["Don't overstate certainty to calm them.", "Separate confirmed facts from open questions explicitly.", "Attach a concrete time you'll report back."],
      "focus": ["precision", "clarity", "audience"]
    },
    {
      "id": "pressure-05",
      "title": "Skeptic challenges your numbers",
      "scenario": "During your readout, a known skeptic says: \"I don't buy that 30% lift — your baseline looks cherry-picked.\" The baseline is defensible, but you didn't show how it was chosen.",
      "task": "Write a 2-4 sentence reply that concedes the fair part, then defends the number with a specific.",
      "tips": ["Acknowledge the valid concern first, without flinching.", "Name the actual baseline method in one line.", "Stay specific, not defensive."],
      "focus": ["precision", "structure", "impact"]
    },
    {
      "id": "pressure-06",
      "title": "CEO puts you on the spot in front of peers",
      "scenario": "In an all-hands, the CEO turns to you unexpectedly: \"You own onboarding — why are new users churning in week one?\" You have a hypothesis but not a confirmed root cause yet.",
      "task": "Write a 2-3 sentence answer that gives your best current read, flags it as a hypothesis, and states how you'll confirm it.",
      "tips": ["Don't freeze or ramble to fill the silence.", "Frame your hypothesis as a hypothesis, not fact.", "Close with the test that will confirm or kill it."],
      "focus": ["clarity", "structure", "impact"]
    },
    {
      "id": "pressure-07",
      "title": "Investor presses on the burn rate",
      "scenario": "An investor leans in: \"At this burn, how many months of runway do you actually have?\" You know the number is tight — about 7 months at current spend.",
      "task": "Write a 2-3 sentence answer that gives the number directly, then the one lever that changes it.",
      "tips": ["State the months first — don't bury it.", "Avoid softening language like 'roughly fine'.", "Name the single biggest lever on that number."],
      "focus": ["precision", "concision", "impact"]
    },
    {
      "id": "pressure-08",
      "title": "Hostile question about a layoff",
      "scenario": "In a town hall, an employee asks pointedly: \"Were these layoffs about performance, or did leadership just mismanage the budget?\" The honest answer is that it was a strategic/budget decision, not performance.",
      "task": "Write a 2-4 sentence answer that responds honestly and respectfully without getting defensive.",
      "tips": ["Answer the actual question — don't deflect to talking points.", "Own the decision without blaming those affected.", "Keep your tone steady; match honesty with composure."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "pressure-09",
      "title": "Exec asks why you missed the deadline",
      "scenario": "A senior exec asks flatly: \"This is the second slip. Why should I believe the new date?\" You slipped because of a dependency you've now resolved.",
      "task": "Write a 2-4 sentence answer that acknowledges the slip, explains what's different now, and earns confidence in the new date.",
      "tips": ["Concede the miss plainly before explaining.", "Make 'what changed' concrete and specific.", "Tie the new date to the thing that changed."],
      "focus": ["structure", "precision", "impact"]
    },
    {
      "id": "pressure-10",
      "title": "Asked a question outside your area",
      "scenario": "In a cross-functional review, someone asks you a detailed legal-compliance question that genuinely isn't yours to answer. The room is waiting.",
      "task": "Write a 1-2 sentence response that declines to guess, redirects to the right owner, and keeps the meeting moving.",
      "tips": ["Don't bluff into someone else's domain.", "Name who actually owns the answer.", "Offer to get it answered by a specific time."],
      "focus": ["concision", "clarity", "audience"]
    },
    {
      "id": "pressure-11",
      "title": "Board member doubts the strategy",
      "scenario": "A board member says: \"I think this whole market bet is wrong. Convince me you're not throwing good money after bad.\" You believe in the bet and have early signal.",
      "task": "Write a 2-4 sentence answer that respectfully holds your position with evidence, while acknowledging the risk.",
      "tips": ["Don't cave, and don't get defensive — get specific.", "Lead with the strongest piece of real signal.", "Acknowledge the risk to show you've weighed it."],
      "focus": ["impact", "structure", "precision"]
    },
    {
      "id": "pressure-12",
      "title": "Pinned down on an exact metric",
      "scenario": "A VP asks: \"What's our exact gross margin this quarter?\" You remember it's in the low 60s but not the precise figure.",
      "task": "Write a short reply that gives a clearly-flagged estimate and commits to the exact number with a deadline.",
      "tips": ["Don't state a guess as if it's the confirmed number.", "Label the estimate as approximate, explicitly.", "Promise the exact figure with a time attached."],
      "focus": ["precision", "concision", "clarity"]
    },
    {
      "id": "pressure-13",
      "title": "Customer demands a commitment you can't make",
      "scenario": "A frustrated customer asks: \"Can you promise this bug is fixed by Friday?\" You can't honestly promise Friday, but you can commit to a status update and a realistic target.",
      "task": "Write a 2-3 sentence answer that's honest about what you can and can't commit to, without sounding evasive.",
      "tips": ["Don't make a promise you might break to please them.", "Replace the false promise with a real commitment.", "Be direct about the uncertainty — it builds trust."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "pressure-14",
      "title": "Asked to justify the team's headcount",
      "scenario": "In a budget review, finance asks: \"Why do you need twelve people for this? Convince me it's not bloated.\" You believe the team is right-sized but lean.",
      "task": "Write a 2-4 sentence answer that defends the number with a concrete output-to-headcount link.",
      "tips": ["Tie headcount to specific outputs, not effort.", "Lead with the number and what it produces.", "Avoid sounding defensive about your own team."],
      "focus": ["precision", "structure", "impact"]
    },
    {
      "id": "pressure-15",
      "title": "The 'simple yes or no' trap",
      "scenario": "A director insists: \"Just give me a yes or no — is the migration safe to ship Monday?\" The truth is conditional: safe if one final test passes.",
      "task": "Write a 2-3 sentence answer that gives a clear conditional answer without dodging the yes/no.",
      "tips": ["Don't let 'it depends' become a non-answer.", "State the condition that decides yes vs no.", "Tell them when the condition resolves."],
      "focus": ["clarity", "concision", "precision"]
    },
    {
      "id": "pressure-16",
      "title": "Accused of overpromising last time",
      "scenario": "An exec says: \"Last time you said this would move the needle and it didn't. Why is this different?\" The prior bet underperformed and you learned from it.",
      "task": "Write a 2-4 sentence answer that owns the prior miss and shows what you changed because of it.",
      "tips": ["Own the past result without excuses.", "Name the specific lesson you applied this time.", "Let the change in approach carry the credibility."],
      "focus": ["structure", "impact", "clarity"]
    },
    {
      "id": "pressure-17",
      "title": "Hostile press-style question",
      "scenario": "At a partner summit, someone asks loudly: \"Isn't it true your product is just losing to the competition?\" You're behind on one segment but leading on two.",
      "task": "Write a 2-3 sentence answer that addresses the premise honestly and reframes with a specific fact.",
      "tips": ["Don't accept a loaded premise wholesale.", "Concede the true part, correct the overstatement.", "Anchor your reframe to a concrete number."],
      "focus": ["audience", "precision", "impact"]
    },
    {
      "id": "pressure-18",
      "title": "Put on the spot for a recommendation",
      "scenario": "Mid-meeting, the CFO asks: \"You've heard both options — which one do you recommend, right now?\" You have a lean but were planning to hedge.",
      "task": "Write a 2-3 sentence answer that commits to one option and gives the single deciding reason.",
      "tips": ["Pick one — a hedge reads as no answer.", "Lead with your choice, then the one reason.", "Note the trade-off you're accepting, briefly."],
      "focus": ["clarity", "concision", "impact"]
    },
    {
      "id": "pressure-19",
      "title": "Don't know the root cause yet",
      "scenario": "During an outage review, leadership asks: \"What caused the outage?\" The investigation is ongoing and you only have partial signal.",
      "task": "Write a 2-3 sentence answer that's honest about the open investigation while sharing what's confirmed.",
      "tips": ["Don't name a cause you haven't confirmed.", "Share what's already ruled in or out.", "Commit to a time for the full root-cause."],
      "focus": ["precision", "clarity", "structure"]
    },
    {
      "id": "pressure-20",
      "title": "Challenged on a tradeoff you made",
      "scenario": "A peer challenges you in front of the VP: \"Why did you cut the security review to hit the date? That seems reckless.\" You made a scoped, deliberate call — not a blind cut.",
      "task": "Write a 2-4 sentence answer that defends the decision as deliberate, with the reasoning, while respecting the concern.",
      "tips": ["Show it was a considered tradeoff, not a corner cut.", "Acknowledge the concern is legitimate.", "Name the guardrail that kept the risk bounded."],
      "focus": ["structure", "precision", "impact"]
    },
    {
      "id": "pressure-21",
      "title": "Asked to predict something uncertain",
      "scenario": "An investor asks: \"Where will ARR be in twelve months?\" You can give a grounded range but not a precise promise, and you don't want to set a number you'll be held to falsely.",
      "task": "Write a 2-3 sentence answer that gives an honest range with the assumptions it rests on.",
      "tips": ["Give a range, not false precision.", "State the one or two assumptions driving it.", "Be clear about what would move it up or down."],
      "focus": ["precision", "clarity", "audience"]
    },
    {
      "id": "pressure-22",
      "title": "Cornered into agreeing prematurely",
      "scenario": "A senior leader says: \"So we're all aligned on shipping this quarter, right?\" You have a real reservation you haven't voiced, and the room is nodding.",
      "task": "Write a 2-3 sentence reply that respectfully surfaces your reservation instead of false-agreeing.",
      "tips": ["Don't nod along to avoid friction.", "Name the specific concern, not a vague unease.", "Pose it as a question to resolve, not a blocker."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "pressure-23",
      "title": "Pressed to blame someone else",
      "scenario": "An exec asks: \"Whose fault was the missed launch — was it engineering or product?\" The honest answer is that it was a shared process gap, and finger-pointing would be unfair and unhelpful.",
      "task": "Write a 2-3 sentence answer that takes accountability and redirects to the fix, without scapegoating.",
      "tips": ["Resist the invitation to name a scapegoat.", "Own the shared gap as the leader in the room.", "Pivot quickly to what prevents a repeat."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "pressure-24",
      "title": "Grilled on a number you reported",
      "scenario": "A board member says: \"Your deck claims 40% growth, but the appendix shows 25%. Which is it?\" One is year-over-year, the other quarter-over-quarter — both are real but you didn't label them.",
      "task": "Write a 2-3 sentence answer that clears up the discrepancy precisely and owns the labeling miss.",
      "tips": ["Resolve the apparent contradiction in one clear line.", "Define each figure's basis explicitly.", "Own the unclear labeling rather than getting defensive."],
      "focus": ["precision", "clarity", "structure"]
    },
    {
      "id": "pressure-25",
      "title": "Asked if you'd stake your job on it",
      "scenario": "Under pressure, an exec asks: \"Are you confident enough in this plan to put your name on it?\" You're confident in the plan but aware of one real external risk.",
      "task": "Write a 2-3 sentence answer that commits with conviction while naming the one risk honestly.",
      "tips": ["Give a real commitment, not a vague 'pretty sure'.", "Stand behind the plan clearly.", "Name the single external risk so your confidence is credible."],
      "focus": ["impact", "clarity", "precision"]
    }
  ],
  "narrative-and-persuasion": [
    {
      "id": "narrative-03",
      "title": "Pitch the new initiative",
      "scenario": "You want the executive team to greenlight a six-month bet on an AI-assisted onboarding flow. Today, new customers take three weeks to reach first value, and a third churn before they get there.",
      "task": "Write a 4-6 sentence pitch that frames the change and ends with a clear ask.",
      "tips": ["Open with the painful 'before', not the feature.", "Name the gap your initiative closes.", "Close with a specific, fundable ask."],
      "focus": ["structure", "impact"],
      "placeholder": "Right now, new customers take three weeks to..."
    },
    {
      "id": "narrative-04",
      "title": "Justify the budget line",
      "scenario": "Finance is questioning your $200k request for a data platform in next year's budget. They see a cost; you see a multiplier on every team that touches data.",
      "task": "Write a 4-5 sentence justification that translates the spend into concrete return.",
      "tips": ["Anchor the cost against a bigger cost you avoid.", "Put a number on the status quo's drag.", "Speak to what finance cares about: payback, not features."],
      "focus": ["impact", "precision", "audience"]
    },
    {
      "id": "narrative-05",
      "title": "Win buy-in for reorg",
      "scenario": "You're proposing to merge two sibling teams that keep duplicating work and stepping on each other. The people in those teams are anxious it means losing autonomy or headcount.",
      "task": "Write a 4-6 sentence case to the affected teams that frames the change as a gain, not a loss.",
      "tips": ["Lead with the shared frustration they already feel.", "Show the 'after' as more control, not less.", "Name the fear of headcount cuts and address it directly."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "narrative-06",
      "title": "Sell the three-year roadmap",
      "scenario": "At a board meeting, you must convince directors to back a roadmap that delays revenue for 18 months to build a platform that compounds afterward. They are impatient for near-term numbers.",
      "task": "Write a 5-6 sentence narrative that makes the long bet feel inevitable rather than risky.",
      "tips": ["Frame the patient path against the cost of the quick one.", "Use a before/after that spans the full arc.", "Pre-empt the 'why not faster' objection."],
      "focus": ["structure", "audience", "impact"]
    },
    {
      "id": "narrative-07",
      "title": "Disarm the 'too risky' objection",
      "scenario": "You want to migrate the core billing system off a vendor everyone distrusts but nobody wants to touch. The strongest objection: 'if billing breaks, we lose revenue and trust overnight.'",
      "task": "Write a 4-5 sentence case that raises that exact objection and defuses it with a concrete plan.",
      "tips": ["Name the worst-case fear in their words.", "Answer with a staged, reversible rollout.", "Show the risk of doing nothing is larger."],
      "focus": ["impact", "precision"]
    },
    {
      "id": "narrative-08",
      "title": "Frame the turnaround",
      "scenario": "Your unit has had two flat quarters. You're addressing your team to rally them behind a new focus, and morale is low. They need to believe the next chapter is different.",
      "task": "Write a 4-6 sentence message that honestly frames where you are and credibly paints where you're going.",
      "tips": ["Acknowledge the 'before' without sugarcoating it.", "Make the 'after' specific enough to believe.", "Name the one move that bridges them."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "narrative-09",
      "title": "Persuade a skeptical peer",
      "scenario": "A fellow director controls the engineers you need for your project but has their own priorities. They're polite but unconvinced your work should jump their queue.",
      "task": "Write a 4-5 sentence pitch that reframes your ask as serving their goals too.",
      "tips": ["Lead with what they win, not what you need.", "Show the overlap between your goal and theirs.", "Make the trade concrete and time-bound."],
      "focus": ["audience", "impact", "concision"]
    },
    {
      "id": "narrative-10",
      "title": "Make the case to a customer",
      "scenario": "A major client is hesitant to adopt your new platform tier. They're comfortable with the old one and don't see why they should change what works.",
      "task": "Write a 4-6 sentence pitch that frames the upgrade as closing a gap they already feel.",
      "tips": ["Surface the friction they're quietly living with.", "Contrast their current state with the better one.", "Pre-empt 'if it isn't broken' directly."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "narrative-11",
      "title": "Pitch killing the project",
      "scenario": "You believe a flagship project everyone is invested in should be cancelled before it burns another quarter. The room is emotionally attached to it.",
      "task": "Write a 4-6 sentence case that frames stopping as the courageous, value-creating move.",
      "tips": ["Reframe 'quit' as 'redirect' toward a better bet.", "Make the sunk-cost trap visible and concrete.", "Name what the freed resources unlock."],
      "focus": ["impact", "structure", "audience"]
    },
    {
      "id": "narrative-12",
      "title": "Win over the resister",
      "scenario": "One influential senior engineer is the loudest blocker against your proposed move to a new framework. Until they're on board, the team won't commit.",
      "task": "Write a 4-5 sentence message aimed at them that addresses their concern and gives them a stake in the outcome.",
      "tips": ["Engage their objection as legitimate, not an obstacle.", "Offer them a role in shaping the change.", "Make the 'after' something they'd want to own."],
      "focus": ["audience", "impact"]
    },
    {
      "id": "narrative-13",
      "title": "Frame the price increase",
      "scenario": "You must tell long-standing customers that prices are rising 15%. They could read it as greed; you need them to read it as continued value.",
      "task": "Write a 4-5 sentence message that frames the increase around what they gain and pre-empts the resentment.",
      "tips": ["Lead with the value, not the apology.", "Be concrete about what the increase funds.", "Name the 'this feels like a grab' reaction and answer it."],
      "focus": ["audience", "impact", "precision"]
    },
    {
      "id": "narrative-14",
      "title": "Pitch the hire",
      "scenario": "You want approval to add a senior security engineer in a hiring freeze. Leadership's default answer to any new headcount right now is no.",
      "task": "Write a 4-5 sentence case that makes this one exception feel obvious rather than special pleading.",
      "tips": ["Tie the role to a risk leadership already fears.", "Quantify the cost of the gap staying open.", "Pre-empt 'why not defer it a quarter'."],
      "focus": ["impact", "precision", "audience"]
    },
    {
      "id": "narrative-15",
      "title": "Sell the migration to engineers",
      "scenario": "You're asking your engineering team to spend a quarter paying down infrastructure debt instead of shipping features. They'd rather build new things.",
      "task": "Write a 4-6 sentence message that frames the unglamorous work as a force multiplier they'll thank themselves for.",
      "tips": ["Connect the debt to pain they feel weekly.", "Show the 'after' as faster, freer building.", "Acknowledge the trade-off honestly."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "narrative-16",
      "title": "Frame the pivot to investors",
      "scenario": "Your startup is changing its core market after early traction stalled. Investors backed the original thesis and may read the pivot as failure.",
      "task": "Write a 5-6 sentence narrative that frames the pivot as evidence of learning and conviction, not retreat.",
      "tips": ["Tell the before/after as a story of what you learned.", "Make the new direction feel earned by data.", "Pre-empt 'are you just chasing the next shiny thing'."],
      "focus": ["structure", "audience", "impact"]
    },
    {
      "id": "narrative-17",
      "title": "Build the persuasive arc",
      "scenario": "You have five minutes in an all-hands to convince the whole company to rally behind a single annual goal. Right now everyone is pulling in different directions.",
      "task": "Write a 5-7 sentence speech with a clear arc: tension, stakes, and the unifying move.",
      "tips": ["Open with the tension everyone privately feels.", "Raise the stakes before naming the goal.", "End on a vivid picture of the 'after'."],
      "focus": ["structure", "impact", "audience"]
    },
    {
      "id": "narrative-18",
      "title": "Justify the slower launch",
      "scenario": "Marketing and sales want to ship the product next month; you believe launching unready will damage the brand. You need to persuade them to wait two months.",
      "task": "Write a 4-5 sentence case that makes patience the more ambitious choice, not the timid one.",
      "tips": ["Reframe waiting as protecting the upside they want.", "Make the cost of a botched launch concrete.", "Address their fear of losing the window."],
      "focus": ["impact", "audience", "precision"]
    },
    {
      "id": "narrative-19",
      "title": "Pitch the partnership",
      "scenario": "You're proposing a co-marketing partnership to a larger company that doesn't need you as much as you need them. You must make them want it.",
      "task": "Write a 4-6 sentence pitch framed entirely around what they gain from saying yes.",
      "tips": ["Lead with their strategic gap, not your product.", "Show the asymmetry working in their favor too.", "Make the first step low-risk and easy to accept."],
      "focus": ["audience", "impact", "concision"]
    },
    {
      "id": "narrative-20",
      "title": "Frame the policy change",
      "scenario": "You're rolling out a return-to-office policy that part of the workforce will dislike. You need to explain it so people see the reasoning, not just the mandate.",
      "task": "Write a 4-6 sentence message that frames the change around a shared goal and pre-empts the strongest pushback.",
      "tips": ["Anchor the change to something the team values.", "Name the resentment before they voice it.", "Be specific about what stays flexible."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "narrative-21",
      "title": "Move the decision-maker to act now",
      "scenario": "A VP keeps agreeing your proposal is good but defers the decision meeting after meeting. You need to convert 'good idea' into action this week.",
      "task": "Write a 3-5 sentence message that makes the cost of waiting concrete enough to force a decision.",
      "tips": ["Put a price on every week of delay.", "Make the window for acting feel real and closing.", "Ask for a specific decision by a specific date."],
      "focus": ["impact", "concision", "precision"]
    },
    {
      "id": "narrative-22",
      "title": "Sell the unsexy bet",
      "scenario": "You want leadership to fund a year of reliability and quality work over a flashy new product line that would generate buzz. The flashy option is winning the room.",
      "task": "Write a 4-6 sentence case that makes the boring bet the strategically smarter story.",
      "tips": ["Connect reliability to a growth ceiling they want to break.", "Make the hidden cost of fragility vivid.", "Pre-empt 'this won't excite the market'."],
      "focus": ["impact", "structure", "audience"]
    },
    {
      "id": "narrative-23",
      "title": "Frame the experiment as low-risk",
      "scenario": "You want to run a controversial pricing experiment that some fear will alienate customers. You need a cautious leader to approve a limited test.",
      "task": "Write a 4-5 sentence pitch that shrinks the perceived risk and frames the test as the safe way to learn.",
      "tips": ["Scope it small, reversible, and measurable.", "Frame not-testing as the riskier path.", "Name the worst case and how you contain it."],
      "focus": ["precision", "impact", "audience"]
    },
    {
      "id": "narrative-24",
      "title": "Persuade across functions",
      "scenario": "You need legal, security, and product to all back a faster customer-data deletion flow. Each function cares about something different and is wary of the others' priorities.",
      "task": "Write a 5-6 sentence case that frames the change as a win for each of the three audiences at once.",
      "tips": ["Name what each function gains, in their language.", "Find the shared goal that unites all three.", "Pre-empt the objection each will raise."],
      "focus": ["audience", "structure", "impact"]
    },
    {
      "id": "narrative-25",
      "title": "Close the deal with the story",
      "scenario": "You're in the final pitch to a prospect deciding between you and a cheaper competitor. The decision-maker is risk-averse and wants to feel safe, not dazzled.",
      "task": "Write a 5-6 sentence closing pitch that frames choosing you as the lower-risk, higher-value path.",
      "tips": ["Tell a vivid before/after of a customer like them.", "Reframe 'cheaper' as the costlier risk.", "End with the confident, reassuring next step."],
      "focus": ["impact", "audience", "structure"]
    }
  ],
  "delivering-hard-messages": [
    {
      "id": "hard-03",
      "title": "Decline a vendor's pitch",
      "scenario": "A sales rep from a vendor you evaluated has emailed three times for a decision. You've chosen a competitor and won't change your mind. They were courteous throughout, so you want to close it cleanly rather than ghost them.",
      "task": "Write a 3-4 sentence reply that tells them you've gone another direction, without hedging or implying the door is open.",
      "tips": ["Give the decision in the first sentence.", "One honest reason is enough — no consolation-prize 'maybes'.", "Stay warm without inviting more follow-up."],
      "focus": ["clarity", "concision", "audience"],
      "placeholder": "Thanks for your patience — we've decided to go with another provider…"
    },
    {
      "id": "hard-04",
      "title": "Tell the team the launch slips",
      "scenario": "A feature you publicly committed to for Friday won't be ready; a dependency broke late and the fix needs another week. The team and two partner orgs are expecting it. You need to send the delay notice now, not after more slips.",
      "task": "Write a short announcement that leads with the new date and the reason, and states what happens next.",
      "tips": ["Put the new date in the first line — don't bury it under apology.", "Name the cause plainly; skip the blow-by-blow.", "Close with the concrete next step and owner."],
      "focus": ["clarity", "structure", "impact"],
      "placeholder": "The launch is moving to next Friday, the 18th…"
    },
    {
      "id": "hard-05",
      "title": "Own the data you got wrong",
      "scenario": "You sent leadership a revenue figure last week that turned out to be overstated by 12% because you pulled from a stale report. Decisions are being made on it. You need to correct the record before the next meeting.",
      "task": "Write a 3-5 sentence message that states the error, the correct number, and how you'll prevent a repeat — accountable, not groveling.",
      "tips": ["Lead with the correction, not a paragraph of apology.", "Give the right number clearly so it can't be missed.", "One sentence of fix, not five of self-flagellation."],
      "focus": ["clarity", "precision", "impact"]
    },
    {
      "id": "hard-06",
      "title": "Push back on your boss's deadline",
      "scenario": "Your manager just committed you to a Monday delivery in front of their boss. It's genuinely not feasible without cutting scope or quality, and you know it. You need to push back privately without making them look bad for the commitment.",
      "task": "Write a message that names the real constraint and offers a choice between scope and date, respectfully but firmly.",
      "tips": ["State the constraint as fact, not complaint.", "Offer two viable options — let them decide.", "Protect their standing; the goal is a better plan, not blame."],
      "focus": ["clarity", "audience", "structure"]
    },
    {
      "id": "hard-07",
      "title": "Decline a friend at work",
      "scenario": "A colleague you genuinely like asks you to be a reference for an internal transfer. You don't think they're ready for that role and can't honestly endorse them for it. You want to decline without damaging the friendship.",
      "task": "Write a 3-4 sentence reply that declines the reference honestly, without a dishonest excuse or a vague brush-off.",
      "tips": ["Be kind and direct — don't invent a scheduling excuse.", "Decline the specific ask, not the person.", "Offer support you can genuinely give instead."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "hard-08",
      "title": "Critique a peer's deck",
      "scenario": "A peer asks for honest feedback on a board deck before they present it tomorrow. The narrative is buried and the ask is unclear — it would land badly as-is. They're nervous and clearly want reassurance.",
      "task": "Give specific, actionable feedback using behavior → impact → ask. Focus on the deck, not their effort or talent.",
      "tips": ["Point to specific slides, not a general 'feels off'.", "Name the impact on the board's likely reaction.", "Give a concrete fix they can do tonight."],
      "focus": ["precision", "clarity", "audience"]
    },
    {
      "id": "hard-09",
      "title": "Tell a contractor it's not working",
      "scenario": "A contractor on a 3-month engagement is producing work that consistently misses the brief and needs heavy rework. You're a month in. You need to either course-correct sharply or end it — and the conversation can't keep being deferred.",
      "task": "Write the opening message that states the gap clearly, sets a specific expectation, and names the consequence if it doesn't change.",
      "tips": ["Lead with the specific gap, not 'how are things going'.", "Make the expectation measurable.", "State the stakes calmly — clarity here is fairness."],
      "focus": ["clarity", "precision", "impact"]
    },
    {
      "id": "hard-10",
      "title": "Announce a budget cut",
      "scenario": "Your team's tooling budget is being cut 30% next quarter; one paid tool everyone relies on has to go. The decision is final and above you. The team will be frustrated, and they'll hear rumors if you wait.",
      "task": "Write a short message that delivers the cut, what's changing concretely, and where you'll push for the team — no false hope it might reverse.",
      "tips": ["State the cut and what it means in the first lines.", "Don't pretend the decision is still open.", "Show where you'll actually advocate, specifically."],
      "focus": ["clarity", "impact", "audience"]
    },
    {
      "id": "hard-11",
      "title": "Reject a candidate you liked",
      "scenario": "A finalist you personally championed didn't get the role — the panel chose someone else. They invested heavily, asked thoughtful questions, and you'd genuinely work with them someday. The rejection email is yours to send.",
      "task": "Write a 4-5 sentence rejection that is clear it's a no, respects their effort, and leaves a genuine (not performative) door open.",
      "tips": ["Make the no unambiguous early — no false suspense.", "Keep specifics honest; avoid empty 'strong field' filler.", "Only leave a door open if it's real."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "hard-12",
      "title": "Apologize to a customer for an outage",
      "scenario": "Your service was down for four hours during a customer's busy period and cost them sales. They're a major account and they're angry. The CEO is cc'd on their complaint, and your reply will be read by both sides.",
      "task": "Write a reply that owns the failure plainly, states what happened and what you're doing about it — accountability, not defensiveness or excessive grovel.",
      "tips": ["Own it in the first sentence; don't open with 'we apologize for any inconvenience'.", "Be concrete about cause and fix, not vague reassurance.", "Match the seriousness — keep the register grave, not chirpy."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "hard-13",
      "title": "Set a boundary on after-hours pings",
      "scenario": "A teammate routinely messages you at 10pm expecting same-night replies, and it's bleeding into your evenings. They're not malicious — they just work late. You need to reset the expectation without sounding like you're slacking.",
      "task": "Write a short message that sets the boundary clearly, explains how you'll handle their requests, and keeps the working relationship solid.",
      "tips": ["State the boundary as a norm, not a complaint about them.", "Tell them what to expect instead (when you'll respond).", "Keep it warm — a boundary isn't a rebuke."],
      "focus": ["clarity", "audience", "concision"]
    },
    {
      "id": "hard-14",
      "title": "Tell your boss a project should stop",
      "scenario": "A project your manager sponsored and is invested in isn't working — the metrics are flat and the cost is rising. You believe it should be killed or paused. Saying so risks looking disloyal, but staying quiet wastes money.",
      "task": "Write a message that recommends stopping, backs it with the key evidence, and frames it as protecting the goal, not attacking their idea.",
      "tips": ["Lead with the recommendation, then the evidence.", "Use specific numbers, not 'it feels stalled'.", "Frame around the shared objective, not blame."],
      "focus": ["clarity", "precision", "structure"]
    },
    {
      "id": "hard-15",
      "title": "Deny a raise request",
      "scenario": "A solid performer asks for a raise you can't grant this cycle — the budget is frozen and it's out of your hands. They've earned the ask and you don't want to lose them. A vague 'let's see' would be worse than a clean answer.",
      "task": "Write a 4-5 sentence reply that gives the honest no now, explains the real constraint, and lays out a concrete path for the next cycle.",
      "tips": ["Give the answer for this cycle plainly — no soft maybe.", "Name the real constraint without hiding behind 'policy'.", "Offer a specific path with a timeline, not just 'soon'."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "hard-16",
      "title": "Tell a partner team they missed",
      "scenario": "A partner team delivered an integration late and broke your release plan. Their lead is senior to you and sensitive to criticism. You need to flag the impact and prevent a repeat without starting a turf war.",
      "task": "Write a message that states the impact factually, makes one clear request for next time, and keeps it collaborative, not accusatory.",
      "tips": ["Describe what happened and its impact — skip the blame language.", "One specific ask for the future, not a list of grievances.", "Keep the tone level; the goal is a fix, not a win."],
      "focus": ["precision", "audience", "clarity"]
    },
    {
      "id": "hard-17",
      "title": "Walk back an over-promise",
      "scenario": "You told a client last month you'd include a custom report in their package. It turns out it's not feasible within the contract, and you have to retract it. They've been telling their own stakeholders it's coming.",
      "task": "Write a 4-5 sentence message that owns the over-promise, states clearly what you can and can't deliver, and offers a real alternative.",
      "tips": ["Own that you promised it — don't pretend it was always unclear.", "Draw the line precisely: what's in, what's out.", "Lead with an alternative they can actually use."],
      "focus": ["clarity", "precision", "impact"]
    },
    {
      "id": "hard-18",
      "title": "Address a tone problem in a meeting",
      "scenario": "A senior engineer repeatedly cuts off junior teammates in design reviews, and people are starting to stay quiet. You've noticed it for weeks. You need to raise it in your 1:1 — it's about behavior in the room, not their character.",
      "task": "Write feedback using behavior → impact → ask. Cite the specific pattern and the effect on the team, and make a concrete request.",
      "tips": ["Describe the observed pattern, not a label like 'dismissive'.", "Connect it to a concrete effect — people going silent.", "Ask for a specific, doable change in the next review."],
      "focus": ["precision", "clarity", "impact"]
    },
    {
      "id": "hard-19",
      "title": "Decline scope creep",
      "scenario": "A stakeholder keeps adding 'small' requests to a project that's already at capacity, each framed as no big deal. Saying yes again will sink the timeline. You need to decline the latest add without sounding rigid.",
      "task": "Write a short reply that declines the new request, names the tradeoff plainly, and offers a path (next phase or swap something out).",
      "tips": ["Say no to the add clearly — don't slip into a reluctant yes.", "Make the tradeoff visible: this means that slips.", "Offer the trade-off as their choice."],
      "focus": ["clarity", "concision", "structure"]
    },
    {
      "id": "hard-20",
      "title": "Break news of a reorg",
      "scenario": "Your team is being restructured: two people will report to a different manager starting next month. It's decided. They'll worry it's a demotion or a prelude to cuts, and they deserve to hear it from you, clearly, before the org chart leaks.",
      "task": "Write a message that delivers the change plainly, says what it does and doesn't mean for them, and offers a direct conversation.",
      "tips": ["State the change up front; don't open with reassurance.", "Address the unspoken fear directly — is this about cuts?", "Be honest about what you do and don't yet know."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "hard-21",
      "title": "Refuse an unethical shortcut",
      "scenario": "A peer suggests fudging a compliance check to hit a deadline — 'everyone does it, just this once.' You won't, and you need to shut it down without blowing up the relationship or sounding self-righteous.",
      "task": "Write a 3-4 sentence reply that declines firmly, states the line clearly, and redirects to a legitimate path forward.",
      "tips": ["Make the no unambiguous — no soft 'I'm not sure that's a good idea'.", "State the line as principle, not a lecture about them.", "Pivot fast to a real way to hit the goal."],
      "focus": ["clarity", "impact", "concision"]
    },
    {
      "id": "hard-22",
      "title": "Tell a high performer they're blocked",
      "scenario": "A strong report has asked about a promotion that won't happen this cycle — there's no open headcount at the next level, regardless of their performance. They may read 'no' as 'not valued.' You want to keep them and be honest.",
      "task": "Write a message that gives the straight answer, separates it from their performance, and names what would have to change for it to happen.",
      "tips": ["Answer the promotion question directly and early.", "Decouple the no from their value — be explicit about it.", "Name the real gating factor, not a vague 'keep it up'."],
      "focus": ["clarity", "audience", "precision"]
    },
    {
      "id": "hard-23",
      "title": "Apologize for missing a commitment",
      "scenario": "You promised a colleague you'd review their work by Tuesday and forgot entirely; they were waiting on you and missed their own window. They're frustrated and a little hurt. You need to own it without drowning them in apology.",
      "task": "Write a 3-4 sentence message that owns the miss plainly, doesn't make excuses, and states exactly when and how you'll make it right.",
      "tips": ["Own it directly — no 'things got crazy' deflection.", "One clean apology beats five anxious ones.", "Commit to a specific recovery time."],
      "focus": ["clarity", "concision", "impact"]
    },
    {
      "id": "hard-24",
      "title": "Decline a board member's idea",
      "scenario": "A board member is pushing a strategy idea you think is wrong and would cost the company months. They're influential and used to deference. You need to disagree clearly in writing before the next meeting locks it in.",
      "task": "Write a message that respectfully declines the direction, gives the core reason with evidence, and proposes an alternative.",
      "tips": ["State your position clearly — don't hide it behind 'some concerns'.", "Lead with the strongest evidence, not a list.", "Offer a credible alternative so it's a choice, not just a no."],
      "focus": ["clarity", "audience", "structure"]
    },
    {
      "id": "hard-25",
      "title": "Answer 'is my job safe?' honestly",
      "scenario": "A round of cuts hit a teammate's close collaborator, and your teammate is shaken and asking you directly whether their own role is safe. You don't have full certainty, but you owe them an honest, steady answer — not false comfort or stonewalling.",
      "task": "Write a 4-5 sentence reply that is honest about what you know and don't know, avoids both false reassurance and cold deflection, and tells them what you'll do next.",
      "tips": ["Don't promise safety you can't guarantee.", "Be clear about the line between what you know and don't.", "Match the gravity — steady and serious, not breezy."],
      "focus": ["clarity", "audience", "impact"]
    }
  ],
  "putting-it-together": [
    {
      "id": "capstone-03",
      "title": "The board pre-read one-pager",
      "scenario": "You're presenting a new pricing strategy at next week's board meeting. The chair has asked for a one-page pre-read so the meeting can skip the setup and go straight to debate. Three directors are skeptical that raising prices won't spike churn.",
      "task": "Write a one-page strategy summary (under 200 words) that states the recommendation up front, gives the three reasons it works, and names the biggest risk honestly.",
      "tips": ["Open with the recommendation as a single declarative sentence.", "Anticipate the churn objection and address it inside the page, not in an appendix.", "Use a position, not a survey of options.", "If a director only reads the first two lines, they should still know your ask."],
      "focus": ["structure", "impact", "audience"],
      "placeholder": "Recommendation: "
    },
    {
      "id": "capstone-04",
      "title": "The 9pm incident update",
      "scenario": "Your payments system has been degraded for 40 minutes. Roughly 15% of checkouts are failing. Engineering has a fix in staging but it won't deploy for another 30 minutes. The exec channel is anxious and rumors are outpacing facts.",
      "task": "Post a status update (4–6 sentences) that states impact, current status, ETA, and the next update time — no speculation.",
      "tips": ["Lead with scope of impact in plain numbers.", "Separate what you know from what you're still investigating.", "Commit to a specific time for the next update.", "Calm and factual beats reassuring and vague."],
      "focus": ["clarity", "precision", "structure"]
    },
    {
      "id": "capstone-05",
      "title": "Saying no to your boss's boss",
      "scenario": "The SVP two levels above you wants your team to add a feature before launch. It's a reasonable request, but it would slip the date by three weeks and you've already committed that date publicly. You need to decline without sounding obstructive.",
      "task": "Draft a reply (5–7 sentences) that declines for this release, explains the trade-off in one line, and offers a credible alternative.",
      "tips": ["Lead with the decision, then the reason — not the other way around.", "Frame it as a trade-off you're protecting, not a refusal.", "Offer a real alternative so 'no' isn't a dead end.", "Stay warm but don't hedge the answer into ambiguity."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "capstone-06",
      "title": "The all-hands after a hard week",
      "scenario": "You laid off 8% of the company three days ago. Morale is low, rumors of a second round are circulating, and the remaining team is exhausted. You're opening Monday's all-hands and the first 90 seconds will set the tone.",
      "task": "Write the opening (6–9 sentences) that acknowledges the moment honestly, states whether more cuts are coming, and gives the team one clear focus for the quarter.",
      "tips": ["Don't bury the question everyone is actually asking.", "Be specific about what you can and can't promise — vagueness reads as evasion.", "Lead with honesty, not a pep-talk.", "End with one concrete thing to rally around."],
      "focus": ["audience", "impact", "clarity"]
    },
    {
      "id": "capstone-07",
      "title": "The strategy summary in one paragraph",
      "scenario": "Your CEO is doing a press interview tomorrow and asks you to explain your team's entire annual strategy in a single paragraph she can internalize in two minutes. Right now it lives in a 40-slide deck.",
      "task": "Compress the strategy into one paragraph (under 90 words): the bet, why now, and how you'll know it worked.",
      "tips": ["Name the single bet, not three priorities.", "Cut every qualifier that doesn't change the meaning.", "Make 'how you'll know it worked' a concrete metric.", "If she can't repeat it from memory, it's still too long."],
      "focus": ["concision", "clarity", "structure"]
    },
    {
      "id": "capstone-08",
      "title": "Escalating without burning the bridge",
      "scenario": "A peer team has missed two deadlines that block your launch, and informal nudges haven't worked. You need to escalate to both directors, but you'll keep working with this team for years. The email must move things without poisoning the relationship.",
      "task": "Write an escalation email (5–8 sentences) that states the blocker and the ask plainly, stays factual about the misses, and proposes a path forward.",
      "tips": ["Lead with the impact and the decision you need, not the grievance.", "Describe what happened in dates and facts, not adjectives.", "Assume good faith in the wording even while being firm.", "Close with a specific next step and owner."],
      "focus": ["precision", "audience", "impact"]
    },
    {
      "id": "capstone-09",
      "title": "The customer incident postmortem",
      "scenario": "A data-processing bug caused 200 enterprise customers to see incorrect billing for two days. It's fixed and refunds are issued. Your largest account's CTO has asked for a written explanation she can forward to her own leadership.",
      "task": "Write a customer-facing postmortem (7–10 sentences): what happened, blast radius, root cause, fix, and prevention — no jargon.",
      "tips": ["Open with a one-line summary a non-engineer can forward.", "Quantify the impact precisely instead of minimizing it.", "Explain root cause in plain language, not stack traces.", "Make the prevention commitment specific and verifiable."],
      "focus": ["precision", "clarity", "structure"]
    },
    {
      "id": "capstone-10",
      "title": "The 6am CEO question",
      "scenario": "At 6am your CEO Slacks: 'Are we going to hit the number this quarter? Yes or no, then explain.' You're tracking 4% under plan with three weeks left and one large deal that could close it.",
      "task": "Reply (3–5 sentences) that answers the binary question first, then gives the one variable that decides it.",
      "tips": ["Answer yes, no, or a clear conditional in the first word.", "Resist the urge to front-load context before the answer.", "Name the single swing factor, not a list of caveats.", "Give her something she can act on, not just absorb."],
      "focus": ["concision", "clarity", "impact"]
    },
    {
      "id": "capstone-11",
      "title": "The reorg announcement",
      "scenario": "You're merging two teams and changing four people's reporting lines. The change is sound but people are nervous about losing their managers and shifting priorities. You're announcing it to the combined group of 30.",
      "task": "Write the announcement (8–11 sentences) that leads with the why, states exactly what's changing for whom, and tells people what stays the same.",
      "tips": ["Open with the rationale before the org chart.", "Be concrete about who reports to whom as of when.", "Name what isn't changing — it's what calms people.", "Close with how questions will get answered."],
      "focus": ["structure", "audience", "clarity"]
    },
    {
      "id": "capstone-12",
      "title": "The budget cut you must defend",
      "scenario": "Finance is cutting your team's budget 20% and asking you to confirm what you'll stop doing. You disagree with the cut but the decision is final. Your team will read whatever you write next.",
      "task": "Write a memo (6–9 sentences) that states the cut, names exactly what you're stopping, and protects what matters most — without trashing the decision.",
      "tips": ["Don't pretend the cut is your idea, but don't undermine it either.", "Be specific about what stops, so nothing dies by ambiguity.", "Lead with the one or two things you're protecting.", "Give the team a defensible logic for the prioritization."],
      "focus": ["precision", "audience", "impact"]
    },
    {
      "id": "capstone-13",
      "title": "The investor update after a miss",
      "scenario": "You're a founder writing your monthly update to investors. You missed your revenue target by 18%, but pipeline is strong and you fixed the sales-hiring problem that caused the miss. Investors hate surprises and hate spin more.",
      "task": "Write the update (8–12 sentences) that states the miss up front, explains the cause and fix, and gives a credible read on next month.",
      "tips": ["Put the bad number in the first two sentences.", "Own the cause specifically; vague causes read as no diagnosis.", "Show the fix is already in motion, not aspirational.", "End with a forecast you'd be willing to be held to."],
      "focus": ["clarity", "precision", "impact"]
    },
    {
      "id": "capstone-14",
      "title": "The cross-functional decision memo",
      "scenario": "Engineering, design, and marketing have been deadlocked for two weeks on whether to ship a smaller v1 now or a complete v1 in six weeks. As the DRI, you've decided: ship small now. You need to document the decision so it sticks.",
      "task": "Write a decision memo (7–10 sentences): the decision, the key reasons, the trade-off accepted, and what you'll revisit later.",
      "tips": ["State the decision in the title line and the first sentence.", "Give the two or three reasons that actually drove it.", "Name the trade-off out loud so no one relitigates it.", "Define the trigger for revisiting, so 'now' doesn't mean 'never complete'."],
      "focus": ["structure", "clarity", "precision"]
    },
    {
      "id": "capstone-15",
      "title": "The angry-exec reply, calibrated",
      "scenario": "A VP fired off a terse email — 'This dashboard is wrong and it's embarrassing me in front of my team. Fix it today.' The dashboard isn't wrong; he's misreading a filter. You need to correct him without making him feel stupid.",
      "task": "Draft a reply (4–7 sentences) that resolves the confusion, leads with help not defensiveness, and offers to make it harder to misread.",
      "tips": ["Don't lead with 'actually, it's correct' — lead with the resolution.", "Explain the filter in one plain sentence.", "Give him a graceful way to have been right to ask.", "Offer a fix that prevents the next person's confusion too."],
      "focus": ["audience", "concision", "clarity"]
    },
    {
      "id": "capstone-16",
      "title": "The security breach disclosure",
      "scenario": "A vulnerability exposed email addresses (no passwords, no payment data) for about 12,000 users. Legal has cleared disclosure. You're writing the email that goes to every affected user, who will be alarmed and may forward it to press.",
      "task": "Write the disclosure email (7–10 sentences): what was exposed, what wasn't, what you've done, and what the user should do.",
      "tips": ["Lead with exactly what was and wasn't exposed — precision lowers panic.", "Don't minimize, but don't inflate beyond the facts.", "Tell users the one action they should take, if any.", "Write every line assuming a journalist will quote it."],
      "focus": ["precision", "audience", "clarity"]
    },
    {
      "id": "capstone-17",
      "title": "The promotion case in five sentences",
      "scenario": "Your strongest engineer deserves a promotion, but the calibration committee is tough and your written case is the only thing in the room — you won't be there to defend it. Two other managers are advocating for their own people for the same slot.",
      "task": "Write the promotion case (5–7 sentences) that leads with the strongest evidence, quantifies impact, and shows scope above the current level.",
      "tips": ["Open with the single most undeniable accomplishment.", "Replace 'great engineer' with specific, measurable outcomes.", "Show work at the next level, not just excellence at this one.", "Cut adjectives; let the evidence carry the weight."],
      "focus": ["precision", "impact", "concision"]
    },
    {
      "id": "capstone-18",
      "title": "The pivot announcement to the team",
      "scenario": "After a year of building, the data is clear: the core product isn't working and you're pivoting to an adjacent market. The team poured themselves into the old direction. You're telling them in person tomorrow and want a written version that's ready.",
      "task": "Write the pivot message (8–12 sentences) that names the change honestly, respects the old work, and gives the team a reason to believe in the new direction.",
      "tips": ["Lead with the decision and the evidence behind it.", "Honor the prior work without pretending it succeeded.", "Make the new direction concrete, not just 'exciting'.", "Tell people what you need from them now."],
      "focus": ["audience", "impact", "structure"]
    },
    {
      "id": "capstone-19",
      "title": "The two-line executive summary",
      "scenario": "A 12-page analysis you commissioned just landed. The CEO will only read the top of the email it's attached to. The findings are nuanced: the new market is attractive but entry costs are higher than expected.",
      "task": "Write a two-sentence executive summary that captures the recommendation and the single most important caveat — nothing else.",
      "tips": ["Sentence one: the recommendation. Sentence two: the caveat.", "Pick the one caveat that would change the decision.", "No throat-clearing; the first word should carry weight.", "If you need a third sentence, you haven't found the core yet."],
      "focus": ["concision", "clarity", "impact"]
    },
    {
      "id": "capstone-20",
      "title": "The deadline-slip note to a customer",
      "scenario": "You committed a custom integration to a major customer by month-end. It's going to be two weeks late due to a dependency you underestimated. The customer's launch depends on it and their champion vouched for you internally.",
      "task": "Write the note (5–8 sentences) that delivers the slip up front, takes ownership, gives a firm new date, and protects their champion.",
      "tips": ["State the new date in the first two sentences — don't bury it.", "Own the miss without a paragraph of excuses.", "Give the champion something they can defend internally.", "Make the new commitment specific and credible, not padded."],
      "focus": ["clarity", "audience", "precision"]
    },
    {
      "id": "capstone-21",
      "title": "The 'why are we doing this?' answer",
      "scenario": "Mid-project, a senior skeptic on your team asks in a group channel: 'Honest question — why are we building this instead of the thing customers keep asking for?' Others are quietly wondering the same. A weak answer here loses the room.",
      "task": "Reply (5–8 sentences) that takes the question seriously, gives the real strategic reason, and acknowledges the trade-off without defensiveness.",
      "tips": ["Treat it as a fair question, not a challenge to swat down.", "Give the actual reason, not a slogan.", "Name what you're consciously not doing and why.", "Be direct enough that the silent skeptics are answered too."],
      "focus": ["clarity", "audience", "impact"]
    },
    {
      "id": "capstone-22",
      "title": "The board risk disclosure",
      "scenario": "You've discovered that a key vendor your product depends on may be acquired by a competitor, which could cut off your access within a year. It's not certain. You owe the board a clear-eyed heads-up at this week's meeting without triggering panic.",
      "task": "Write the risk brief (6–9 sentences): the risk, the likelihood, the exposure, and your mitigation plan.",
      "tips": ["Lead with the risk in one sentence, then size it.", "Distinguish what's known from what's speculative.", "Quantify the exposure so the board can weigh it.", "Pair every risk with the action you're already taking."],
      "focus": ["precision", "structure", "clarity"]
    },
    {
      "id": "capstone-23",
      "title": "The peer-conflict resolution email",
      "scenario": "You and a peer director publicly disagreed in a leadership meeting, and it got tense in front of your shared boss. You still think you were right, but the relationship matters more than the point. You're writing to reset before it festers.",
      "task": "Write the email (5–8 sentences) that de-escalates, separates the disagreement from the relationship, and proposes how to decide it cleanly.",
      "tips": ["Lead with the relationship, not a rehash of who was right.", "Acknowledge their view fairly before restating yours.", "Propose a concrete way to resolve the actual decision.", "Keep the tone level — no scorekeeping, no passive aggression."],
      "focus": ["audience", "clarity", "impact"]
    },
    {
      "id": "capstone-24",
      "title": "The all-hands metrics moment",
      "scenario": "You're presenting company metrics at the all-hands. Half the numbers are great, two are concerning, and the team is sophisticated enough to notice if you spin. You have one slide and 60 seconds before Q&A.",
      "task": "Write the 60-second narration (6–9 sentences) that leads with the honest overall read, highlights the two concerns, and frames what you're doing about them.",
      "tips": ["Give the honest top-line first — green or yellow, say it.", "Don't bury the two concerning numbers among the good ones.", "Pair each concern with an action, not an apology.", "Earn credibility by naming the bad news before they do."],
      "focus": ["structure", "impact", "audience"]
    },
    {
      "id": "capstone-25",
      "title": "The capstone: cold draft to send-ready",
      "scenario": "You wrote this draft to your exec team at the end of a long day: 'Hi all, wanted to circle back on the Q3 roadmap stuff we discussed. There are a few open questions I think we should probably align on at some point, and I had some thoughts about resourcing that might be worth discussing, plus the timeline feels a bit tight to me but I could be wrong. Let me know what you think when you get a chance!'",
      "task": "Rewrite it (4–7 sentences) so it leads with the actual ask, names the specific decisions needed, and gives a deadline — then it should be ready to send.",
      "tips": ["Find the buried ask and move it to sentence one.", "Convert 'a few open questions' into the specific decisions.", "Replace 'at some point' and 'when you get a chance' with a date.", "Run the full pre-send checklist before you call it done."],
      "focus": ["concision", "structure", "clarity"],
      "placeholder": "Hi all, wanted to circle back on the Q3 roadmap stuff we discussed..."
    }
  ],
};
