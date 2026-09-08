# Lease Risk Check

A single-page tool that analyzes a pasted lease and flags standard/unusual/risky clauses, using the Claude API.

## Deploy to Vercel (no coding required)

**1. Get an Anthropic API key**
- Go to https://console.anthropic.com
- Sign up / log in, go to "API Keys," create a new key
- Copy it — you'll need it in step 4

**2. Create a Vercel account**
- Go to https://vercel.com/signup (free tier is enough to start)

**3. Upload this project**
- Easiest path: create a free GitHub account, create a new repository, and upload these three files/folders to it: `index.html`, `api/analyze.js`, `vercel.json`
- Then in Vercel: click "Add New" → "Project" → "Import" your GitHub repo
- Alternative without GitHub: install the Vercel CLI (`npm i -g vercel`) on your computer, open a terminal in this folder, run `vercel`, and follow the prompts

**4. Add your API key as an environment variable**
- In your Vercel project dashboard → Settings → Environment Variables
- Add: Name = `ANTHROPIC_API_KEY`, Value = the key you copied in step 1
- Redeploy after adding it (Vercel will prompt you, or go to Deployments → click the three dots on the latest deploy → Redeploy)

**5. Get your live URL**
- Vercel gives you a URL like `lease-analyzer-yourname.vercel.app`
- That's the link you put in Whop's "redirect after checkout" field

## Cost note
Every lease check calls the Claude API and costs a small amount (a few cents per check, depending on lease length). Your $12–15 price point comfortably covers this with room to spare. Keep an eye on usage in the Anthropic console as you scale.

## Next steps once live
- Add a simple check that the visitor actually paid before running the analysis (Whop can pass a token in the redirect URL that your `api/analyze.js` verifies)
- Consider a custom domain instead of the default `.vercel.app` one
