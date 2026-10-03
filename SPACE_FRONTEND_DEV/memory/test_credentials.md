# Test Credentials — Spaces Hm (Hotel Owner Platform)

> Authentication is **fully mocked / front-end only** in this scaffold. There is no backend.

## Sign In (Login screen)
- **Business Email:** any valid email works. Prefilled default: `owner@grandregent.com`
- **Password:** any non-empty value works (the field is `required`, so it must not be blank). e.g. `Secret123!`
- Clicking **"Enter Business Account"** simulates auth and routes to the Dashboard with the demo hotel session.

## Sign Up (Registration wizard)
- All fields are optional for the scaffold flow; you can click **Next** / **Submit** through the 3 steps.
- On submit, a session is generated from whatever hotel name was entered (falls back to "Grand Regent Hotel").

## Resulting Dashboard session (demo)
- Hotel Name: `Grand Regent Hotel`
- Merchant ID: `MER-4820-GR` (login) or a randomly generated `MER-####-NEW` (signup)
