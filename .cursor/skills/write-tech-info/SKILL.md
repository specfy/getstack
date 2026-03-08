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
   - Trust signals: notable customers, enterprises, adoption
   - Key differentiator vs alternatives

2. **Key capabilities** — Bullet list (4–6 items)
   - Core features, integrations, deployment options
   - Use "Key capabilities include:" as heading

3. **Use cases & social proof** (1–2 sentences)
   - Example use cases by domain (IT ops, Security, Sales, etc.)
   - Metrics: G2/Gartner ratings, community size (never GitHub stars)

4. **Technical depth** (optional) — "Technical teams particularly value:" + bullets
   - Developer-focused features: branching, debugging, APIs, SDKs
   - Integration with dev tooling

## Don't do

- **Never use HTML** — Output Markdown only (no `<p>`, `<br>`, `<strong>`, etc.)
- **Never mention pricing** — Do not include pricing, plans, or cost
- **Never mention branded cloud offerings for open source** — For OSS tech, do not name commercial cloud products (e.g. "Tanzu RabbitMQ", "AWS Managed Kafka"). Describe capabilities generically (e.g. "cloud deployment options") without vendor names
- **Never mention GitHub stars** — Do not cite star counts as social proof

## Reference Example: n8n

```
n8n stands out as a versatile workflow automation platform trusted by major enterprises like Cisco, Microsoft, and Liberty Mutual. The platform offers unique flexibility with both visual and code-based automation options, making it ideal for technical teams who need precise control.

Key capabilities include:

Seamless integration of AI with business processes
Full code access with JavaScript and Python support
On-premises or cloud deployment options
1200+ pre-built templates and integrations
Advanced debugging and testing features
The platform excels in various use cases from IT operations (employee onboarding, account provisioning) to Security operations (incident management) and Sales automation (customer insights). n8n has proven its reliability and effectiveness in enterprise environments.

Technical teams particularly value:

The ability to merge workflow branches
Single-step execution for testing
Built-in debugging tools
Direct cURL request support
npm and Python library integration
```

## Research Steps

Before writing:

1. **Read existing metadata** — Check [apps/backend/src/utils/stacks.ts](apps/backend/src/utils/stacks.ts) for `website`, `github`, and short `description`
2. **Visit the official website** — Understand positioning, features, use cases
3. **Check GitHub** — Description, README for technical details
4. **Optional** — G2, Gartner, product comparisons for social proof and differentiation

## Insertion

Use the **PUT** endpoint to upsert tech info. Requires `ADMIN_SECRET` in `.env`; send it via header `X-Admin-Secret` or `Authorization: Bearer <secret>`.

```bash
curl -X PUT "https://your-api/1/technologies/rabbitmq/info" \
  -H "X-Admin-Secret: YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"longDescription": "Full text...", "website": "https://www.rabbitmq.com/", "github": "rabbitmq/rabbitmq-server"}'
```

**Body:** `longDescription` (required), `website` (optional), `github` (optional).

## Checklist

- [ ] Opening paragraph has trust signals and differentiator
- [ ] Key capabilities are 4–6 concrete bullets
- [ ] Use cases and social proof (ratings, adoption) when available — never GitHub stars
- [ ] Technical section for dev-focused tools
- [ ] website and github match or correct stacks.ts
- [ ] Description is 150–400 words (substantial but scannable)
