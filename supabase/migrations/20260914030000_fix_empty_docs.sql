
UPDATE public.documentation_pages SET content_markdown = '# System Architecture

      Herodoto is built as a **Monorepo** using Turborepo. This allows us to share code (like database clients and UI components) between completely different applications while keeping them in the same GitHub repository.

      ## The Two Environments

        ### 1. Consumer App (apps/mobile)

        Built with **Expo (React Native)**. This is the main product that tourists and consumers use to view maps, explore guides, and track their gamification points. Even though it is a mobile app, we compile it for the Web so it can be accessed directly from a browser without installing anything.

        ### 2. Office Portal (apps/web)

        Built with **Next.js (React)**. This is the secure internal dashboard used by Employees, Managers, and Admins to manage tours, view audit logs, manage subscriptions, and oversee the platform.

      ## Unified Web Routing

      To provide a seamless experience, both environments are hosted on a single Netlify domain (`herodoto.art`). When a user visits the site:

        - The server instantly redirects them to the `/app` directory.

        - The `/app` directory serves the compiled Expo Mobile App statically.

        - If an employee logs in through the Mobile App, their profile shows an "Enter Office" button.

        - Clicking the button sends them to `/office`, which is intercepted and rendered by the Next.js Office Portal engine.

      For more details on how these are built and hosted, see the <a href="/office/docs/deployment" style={{ color: ''#2563eb'' }}>Deployment Guide</a>.' WHERE slug = 'architecture';
UPDATE public.documentation_pages SET content_markdown = '# Technology Stack

      ## Frameworks

        - **Turborepo:** High-performance build system for our monorepo. It manages dependencies and scripts across all our apps.

        - **Next.js 14 (App Router):** React framework used for the Office Portal (`apps/web`). Used for its robust routing and server components.

        - **Expo / React Native:** Used for the Consumer App (`apps/mobile`). Allows us to write code once and deploy it to iOS, Android, and the Web simultaneously.

      ## Libraries

        - **Supabase JS:** Client SDK for connecting to our PostgreSQL database. Shared between both apps in `packages/supabase`.

        - **Lucide React Native:** Icon library used in the mobile app for a consistent look.

        - **Expo Router:** File-based routing for React Native, bringing web-like navigation to the mobile app.' WHERE slug = 'tech-stack';
UPDATE public.documentation_pages SET content_markdown = '# Herodoto Deployment Guide (Free Tier for Teams)

Since you are working with a team and using a GitHub Organization, Vercel will block you from using their free tier. Instead, we will use **Netlify**, a massive Vercel competitor that **allows GitHub Organization repositories on their completely free plan**. 

*(Note: Your teammates won''t need to log into Netlify. As long as they push their code to the GitHub repository, Netlify will automatically build and update the website for everyone for free).*

## 1. Deploy the Web Office App (Netlify)

### Step 1: Push to GitHub
1. Open GitHub Desktop and commit all your recent changes.
2. Push your repository to your GitHub Organization.

### Step 2: Import to Netlify (Free Tier)
1. Go to [Netlify.com](https://www.netlify.com/) and click **Sign Up** (Choose "Sign up with GitHub").
2. Once you are in the Netlify Dashboard, click the **"Add new site"** button and select **"Import an existing project"**.
3. Click the **GitHub** icon to authorize Netlify.
4. A window will pop up asking which repositories Netlify can access. Select your Organization and choose the `HerodotoAntigravity` repository.
5. Once selected, Netlify will show you the build settings. Configure them exactly like this:
   - **Base directory:** `apps/web` *(Important!)*
   - **Build command:** `next build`
   - **Publish directory:** `.next`
6. Click the **"Add environment variables"** button and add your Supabase keys:
   - Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: `https://xyrvjfhalabgfaktcmsn.supabase.co`
   - Key: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Value: `your_key_here`
7. Click the **Deploy site** button. Netlify will now build your Next.js app in the cloud!

### Step 3: Add Your Custom Domain (`herodoto.art`)
1. Once your site finishes deploying, go to the **"Domain management"** section in your Netlify site dashboard.
2. Click **"Add custom domain"**.
3. Type in `office.herodoto.art` or `herodoto.art` and click Verify.
4. Netlify will ask if you want to configure DNS. It will give you a DNS record (like a `CNAME` pointing to `your-site-name.netlify.app` or an `A` record).
5. Log into where you bought `herodoto.art` (GoDaddy, Hostinger, etc.), go to the DNS settings, and add the record Netlify gave you. Your site will be live on your domain within minutes!

---

## 2. Deploy the Mobile App for Teammates (Expo Go)

Because building real App Store apps requires paid Apple Developer accounts and a long review process, we will use **Expo Go** to share the app with your teammates instantly and for free.

### Remote Testing (EAS Update)
This allows your teammates to test the app anywhere in the world:
1. Open a terminal in your project and install EAS CLI: `npm install -g eas-cli`
2. Log in to your Expo account: `eas login`
3. Run `eas build:configure` and just hit enter for the defaults.
4. Run `eas update`
5. This will upload the app to Expo''s cloud and give you a public URL/QR Code. You can send that link to your teammates in Slack or WhatsApp. When they open it, the app will instantly launch inside the free Expo Go app on their phones!

---

## 3. Supabase Database (Already Live)

Your Supabase project is already running live in the cloud. No further deployment is required! 

Just remember that you and your teammates will all be connecting to the same live database. If they log in using the mobile app and change a tour status, you will see the change on your end as well.
' WHERE slug = 'deployment';
