# System Architecture

Herodoto is built as a **Monorepo** using Turborepo. This allows us to share code (like database clients and UI components) between completely different applications while keeping them in the same GitHub repository.

## The Two Environments

### 1. Consumer App (apps/mobile)
Built with **Expo (React Native)**. This is the main product that tourists and consumers use to view maps, explore guides, and track their gamification points. Even though it is a mobile app, we compile it for the Web so it can be accessed directly from a browser without installing anything.
Recent Gamification & Discovery features include:
- A user current location indicator utilizing `expo-location` and Mapbox.
- 15 active guides synced dynamically with the Supabase database.
- Interactive user history tracking (`user_guide_history`).

### 2. Office Portal (apps/web)
Built with **Next.js (React)**. This is the secure internal dashboard used by Employees, Managers, and Admins to manage tours, view audit logs, manage subscriptions, and oversee the platform.
Recent features include:
- Content Management System for managing live guides and guide images.
- Interactive Human Resources (HR) Organizational Chart mapping hierarchical relationships (`organization_members` joined with `profiles` and `roles`).

## Unified Web Routing
To provide a seamless experience, both environments are hosted on a single Netlify domain (`herodoto.art`). When a user visits the site:
- The server instantly redirects them to the `/app` directory.
- The `/app` directory serves the compiled Expo Mobile App statically.
- If an employee logs in through the Mobile App, their profile shows an "Enter Office" button.
- Clicking the button sends them to `/office`, which is intercepted and rendered by the Next.js Office Portal engine.

## Herodoto 2.0 Engine Updates
The architecture has been expanded to support real-time Hierarchical Workflows, HR Org Charts, and Geotargeted Subscriptions, leveraging PostgreSQL's relational integrity to bind Managers to Employees for task reviews. All schema components adhere to modern database standards, including full foreign key indexes, automated `updated_at` triggers, and soft delete support via `deleted_at`.
