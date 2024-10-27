# v1.0.2 Release bug hotfix patch
*Updated: 26 October 2954*

Pushed out a few more fixes, as well as adding some of the missing ships (more are on our backlog!). More fixes and tweaks will be coming soon, but I wanted to get these out to you.

# Features
- Re-added the full stats view, so we can keep track of verified citizens, ships and fleets!
- Set profiles to auto-sync new data from RSI once every 12 hours when you're logged in, to keep things in sync.
- Added the discord QR code to the front page, and removed the ATMO event widget

# Bug fixes
- Fixed the Fleet banner not navigating back to your org page when clicked
- Fixed buddy codes not displaying once an account is verified. All good now!
- Fixed some issues with user registration, due to a configuration preventing people with emails longer than 15 characters registering. Oops!

# Vehicles
Added the following vehicles:
- ATLS
- CSV
- Starlancer variants
- Ironclad variants
- Banu Merchantman



# v1.0.1 Release bug hotfix patch
*Updated: 20 October 2954*

Pushed out a bunch of hotfixes over the weekend to deal with some bugs that came up with the new registrations, and a few ease of use fixes. Also snuck in a couple of bonus things ;) The changes/fixes include:

# Bug Fixes
- Fixed an issue with citizens trying to register who don't have a record number (noone knows why!)
- Fixed a bunch of layout and visual quirks
- Fixed access issues to assignments and assignment visibility

# Ease of Use
- Added a "click to copy" button for the verification code, to reduce errors when trying to put the code in your RSI bio as part of the account verification flow

# Bonus
- Added a direct link out from the front page to the Medrunners crew! If you are downed, stranded, injured and alone, give them a call, maybe they can help!

# v1.0 Initial Release
*Updated: 18 October 2954*

We are live! Welcome to the initial release of UEE.life, with a core set of functionalities, built on a complex graph of data that connects you to your friends and assets in the verse. While we think the features we are providing in this release are pretty cool, they are only the start! Check back often to see new features as the come online!

This is an initial release though, so there may be a few bugs and issues. Please let us know if you see anything so we can fix things and give you the best experience possible!

# Launch Features
- Citizen profiles with RSI verification
  - Personal ship/fleet management
- Org profiles
  - Org ship/fleet management
- Assignment system
  - Hierarchical fleet groups
  - Fleet commanders
  - Ship Crew
  - Personal assignment tracking
- Friends and online status tracking
- Unversal Database
  - Vehicles data
  - Starmap and location data

# v0.2.0 Fleet Feature Test Release
*Updated: 4 October 2954*

This was a lot of work under the covers to get to, so apologies it's taken a while, but I think the work is worth it! I build a whole assignments system under the cover which manages Vehicle Groups and commanders, ships with independent fleet crews per group (separate from personal crews), and strong support for some super cool features in the future! (such as job/tasks boards and more!)

Now is a great time to jump in and start testing, so we can find and fix any major bugs before official re-release in time for Citizencon 2954!

On which note, if you will be there, look out for us there! We will be walking the venue, and may have something special for anyone who finds us and says hello!

# Content
- Added the Org Fleet management feature! Build a fleet hierarchy, add ships from your org, assign commanders and prepare for fleet operations! (check out this old video covering how fleets work: [Org Fleet Intro](https://youtu.be/nnfFEGjxf9g?si=gspyzAqt0KNPKb3n))
- Added an assignments system under the cover to support fleet assignments and more. Visit the assignments page to view everything you are assigned to!
- Added online status! See who is online now! (This will become restricted soon to only viewing friends/org members)

# Fixes
- Too many to list. Seriously. I overhauled a *lot*

## &#x1F50E; Testing Focus
- New account flow
- Account verification
- Ship & Crew Management
- Org Fleet Management

# v0.1.2 Minor Feature Update
*Updated: 30 July 2954*

Pushing out a new update with some low key features added, including some visual improvements, online status for verified accounts, as well as some administrative functionality which will allow us to add in all the missing ships, and update existing ships if there are any issues. Please notify us via discord of any incorrect data or missing ships!

We also still need verification folk are able to register and verify their citizen record, so let us know if you do so successfully! Thanks!

## &#x1F50E; Testing Focus
- New account flow
- Account verification
- Ship & Crew Management

---

# v0.1.1 Security & Bug Fix Patch
*Updated: 23 July 2954*

A new update is live on the test server, tightening some Authorization controls on our bac-end API, as well as fixing some bugs/issues with citizen verification and user account management.

Also fixed a vulnerability that would allow someone to take over another person's verified account.

It's not all boring though. If you are logged in, and verified, see how fancy your portrait in the top right is now ;)

# Content
- Added a notification banner stack to support muliple notificatiosn of different types (info, warning, error and debug)
- Added a banner notifying you if your account is not yet verified
- Added more granular access checks to some key API's
- Updated profile picture in the site header, added a verified flair to the picture

# Fixes
- [Security] Fixed an vulnerability that would allow a user to take over another citizens account
- Fixed an issue when changing your handle and immediately trying to re-verify
- Added a check to make sure you are not able to change your handle to an existing users verified handle

---

# v0.1.0 Initial Test Release
*Updated: 20 July 2954*

Given this is a full re-write of the site, in a new version of Vue and Nuxt, with an entirely new back end infrastructure, I'm starting the update numbering over again. This will allow us to track the re-release of old features, as well as new features being added.

This test release is going to be pretty large, as I have been working on the new version (internal codename uee.life.next) for a while, but susequent releases will be much more specific.

Here's the status of all the core content and features with this release!

## &#x1F50E; Testing Focus
- New account flow
- Account verification
- Ship & Crew Management

## Pages
- &#x2705; Main Page
- &#x2705; About Page
- &#x2705; Citizen Search & Pages
- &#x2705; Org Search & Pages
- &#x2705; Explore pages

## Core Infrastructure
- &#x2705; Main API
- &#x2705; Auth0 Integration
- &#x2705; Graph DB
- &#x2705; Containerized Deployments
- &#x2705; VHosts & Certificate Management
- &#x1F4CB; Static content CDN

## Features
- &#x2705; RSI News Feed
- &#x2705; Account Management
- &#x1F50E; Citizen Verification
- &#x1F50E; Personal Ship Management
- &#x1F50E; Ship Crew Management
- &#x1F6A7; Org Management
- &#x1F6A7; Org Fleet Management
- &#x1F6A7; Non-RSI News Feeds
- &#x1F6A7; Mobile Browser Support
- &#x1F4CB; Events & Event Management
- &#x1F4CB; Friends System
- &#x1F4CB; User Status Updates/Posts
- &#x1F4CB; User Image Gallery

---

Legend:

- &#x2705; Complete
- &#x1F50E; Testing
- &#x1F6A7; Developing
- &#x1F4CB; Planning