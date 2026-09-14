# System Architecture


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


For more details on how these are built and hosted, see the <a href="/office/docs/deployment" style={{ color: '#2563eb' }}>Deployment Guide</a>.
## Herodoto 2.0 Engine Updates
The architecture has been expanded to support real-time Hierarchical Workflows and Geotargeted Subscriptions, leveraging PostgreSQL's relational integrity to bind Managers to Employees for task reviews.
