# Assess Flow

Build a modern responsive online assessment platform similar to PAXOS.

Create a candidate assessment flow for an “Accounting Manager Assessment”:

Welcome page — PAXOS logo, assessment title, position, duration, short introduction, and “Scroll to Begin”.

Assessment Overview — Responsibilities, Key Requirements, and Assessment Summary.

Candidate Information — First name, last name, email, phone, gender, years of experience, LinkedIn URL, referral source, agreement checkbox, and “Start Assessment”.

Assessment Page — Show a top progress bar with 4 sections:

Financial Management

Compliance & Controls

Leadership & Team Management

Video Question

Each written section has a 5-minute countdown, 2 open-ended questions, 1 multiple-choice question, and “Submit Section”.

After completing each section, automatically move to the next section and show a checkmark for completed sections.

Video Question — 40-minute timer, question prompt, camera/microphone preview, “Start Recording”, video review, re-record option, and “Final Submit”.

Add camera/microphone permission error handling with a simple troubleshooting modal.

Add an Assessment Support side panel with common questions and AI-style responses.

Add Login and Create Account pages with email/password authentication UI.

Use a clean professional SaaS design: white/light background, rounded cards, subtle shadows, green/teal accent color, large typography, responsive desktop/mobile layout.

Focus on frontend UI and interactions first. Use mock data; no real backend or authentication is required.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://assess-buddy-46.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9ff45b5d-b7eb-4ed2-be24-3c062694981c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
