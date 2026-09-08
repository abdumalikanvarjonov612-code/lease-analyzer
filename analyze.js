export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { leaseText } = req.body || {};
  if (!leaseText || typeof leaseText !== "string" || !leaseText.trim()) {
    return res.status(400).json({ error: "Missing leaseText" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is not configured with an API key" });
  }

  const prompt = `You are analyzing a residential lease for a prospective tenant. Break the lease into its individual numbered clauses (keep clause text close to the original but you may lightly tidy for readability). For each clause, classify it as one of exactly three statuses:
- "standard": ordinary, protects both parties reasonably, nothing to flag
- "unusual": deviates from typical lease terms in a way the tenant should notice, but isn't necessarily unfair
- "risky": meaningfully disadvantages the tenant or is a common source of dispute

For each clause give a one-sentence plain-language "note" explaining the classification, written directly to the tenant ("You..." / "This means...").

Also produce exactly 3 short, concrete questions the tenant should ask the landlord before signing, based on the specific unusual/risky clauses found.

Respond with ONLY raw JSON, no markdown fences, no preamble, in exactly this shape:
{"questions": ["...", "...", "..."], "clauses": [{"number": "1", "title": "short 2-4 word label", "text": "clause text", "status": "standard|unusual|risky", "note": "..."}]}

Lease:
"""
${leaseText}
"""`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: "Upstream API error", detail: errText });
    }

    const data = await response.json();
    const raw = data.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    const parsed = JSON.parse(raw);
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Failed to analyze lease", detail: String(err) });
  }
}
