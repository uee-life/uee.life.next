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