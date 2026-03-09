---
name: write-tech-info
description: Writes long-form tech descriptions for getStack's tech_info table. Use when writing or expanding descriptions for technologies listed in docs/tech-info-todo.md, when the user asks to write tech info, or when populating the tech_info table with long_description, website, and github.
---

# Write Tech Info

Write compelling long descriptions for technologies displayed on getStack tech pages. Each description is stored in the `tech_info` Postgres table and displayed on `/tech/:key` pages.

## Output Format

**Use Markdown, never HTML.** Write plain text with Markdown syntax (bold, lists, links). No HTML tags (`<p>`, `<br>`, `<strong>`, etc.).

Provide:

1. **long_description** — Markdown (see structure below)
2. **website** — URL (from [apps/backend/src/utils/stacks.ts](apps/backend/src/utils/stacks.ts) or updated if changed)
3. **github** — `org/repo` if applicable (e.g. `n8n-io/n8n`)

## Description Structure

Follow this structure for each tech:

1. **Opening paragraph** (2–3 sentences)
   - What the tech is and its main value prop
   - Never mention the brand name here
   - Describe factually what it is and what is does

2. **Second paragraph** (optional, 2-4 sentences)
   - Trust signals: notable customers, enterprises, adoption
   - Key differentiator vs alternatives, mention names if possible
   - Metrics: community size, number of customers, number of SDKs (never GitHub stars)
   - You can mention the brand again here

3. **Key capabilities** — Bullet list (3–5 items)
   - Core features, integrations, deployment options
   - Order by most impactful to least
   - Do not fill if not relevant or very common (e.g: SSO, SAML)

4. **Use cases** (2–5 sentences)
   - Give a few example of use cases.
   - Why technical person would use this
   - Integration with dev tooling
   - Do not start with "Typical use cases" try to come up with a different first sentence

## Do

- Mention AI only if it's a core part of the product
- Focus on fact
- Try to use synonyms for the headings

## Don't do

- **Never use HTML** — Output Markdown only (no `<p>`, `<br>`, `<strong>`, etc.)
- **Never mention pricing** — Do not include pricing, plans, or cost
- **Never mention branded cloud offerings for open source** — For OSS tech, do not name commercial cloud products (e.g. "Tanzu RabbitMQ", "AWS Managed Kafka"). Describe capabilities generically (e.g. "cloud deployment options") without vendor names
- **Never mention GitHub stars** — Do not cite star counts as social proof
- **Avoid** buzzword and vague wording, keep it factual. Nothing is proven or amazing or blazing, etc.
- **Never use parenthesis** it sucks, use commas or colons.

## Reference Example: n8n

```
Workflow automation platform offering code-like flexibility with no-code speed. Supports both visual design and code-based customization for automations while keeping data under your control.

Trusted by enterprises like Cisco, Microsoft, and Liberty Mutual. Stands out by letting technical teams switch between visual flows and raw code: JavaScript and Python in the same workflow.

**Key features:**

- Full code access with JavaScript and Python support
- On-premises or cloud deployment
- 1200+ pre-built templates and integrations
- Advanced debugging and testing features

Typical use cases: IT operations such as onboarding and provisioning, Security incident management, Sales automation and customer insights. Developers benefit from single-step execution for testing, direct cURL support, and npm or Python library integration.
```

## Research Steps

Before writing:

1. **Read existing metadata** — Check [apps/backend/src/utils/stacks.ts](apps/backend/src/utils/stacks.ts) for `website`, `github`, and short `description`
2. **Visit the official website** — Understand positioning, features, use cases
3. **Check GitHub** — Description, README for technical details
4. **Optional** — G2, Gartner, product comparisons for social proof and differentiation

## Insertion

Use the **PUT** endpoint to upsert tech info.
DO NOT check .env it's well configured.

**Script** (loads `.env` via dotenv or `node --env-file=.env`):

```bash
npm run tech-info:put -- <json-file>
# or
node --env-file=.env .cursor/skills/write-tech-info/put-tech-info.js <json-file>
```

**JSON file format:**

```json
{
  "key": "rabbitmq",
  "longDescription": "Full markdown text...",
  "website": "https://www.rabbitmq.com/",
  "github": "rabbitmq/rabbitmq-server"
}
```

`key` and `longDescription` are required; `website` and `github` are optional. API base URL from `VITE_API_URL` (apps/frontend/.env) or `API_URL`; defaults to `http://localhost:3000`.

## Checklist

- [ ] Opening paragraph has trust signals and differentiator
- [ ] Key capabilities are 4–6 concrete bullets
- [ ] Use cases and social proof (ratings, adoption) when available — never GitHub stars
- [ ] Technical section for dev-focused tools
- [ ] website and github match or correct stacks.ts
- [ ] Description is 150–400 words (substantial but scannable)
