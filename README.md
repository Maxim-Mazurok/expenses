## Maxim Mazurok Fork log / todo list:
- [x] Replaced `@material` with `@material-ui`
- [ ] Better categories:
  - [x] Added icons and colors for "Tech", "Taxi" and "Education"
  - [ ] Add ability to set icons and colors from interface/google sheets
  - [ ] Make categories transaction type specific
- [ ] Multi-currency support (basic)
  - [x] If account name does not contain `(usd)` in the name, it's considered 
  to be UAH (₴) in interface
  - [ ] Additional changes made to my own spreadsheet, will publish later when 
  it'll support more currencies
- [x] Added `REACT_APP_GOOGLE_CLIENT_ID` environment variable support. Create 
your own app at [console.cloud.google.com/apis](https://console.cloud.google.com/apis)
- [ ] Track income
  - [x] Specify negative values in amount field (temporary workaround)
  - [ ] DO it the right way
- [ ] Track bank fees (as an optional field for transaction)
- [ ] Track transfers (in a one special? transaction)
- [ ] Tests
  - [ ] Fix existing tests (`Cannot read property 'load' of undefined` in 
  `window.gapi.load(...`) 
  - [ ] Unit tests
  - [ ] Integration tests
- [ ] Migrate to TS
  - [x] All code now in TS 
  - [ ] Add code style linter
- [ ] Fix standalone login on iOS by using 
[pwacompat](https://github.com/GoogleChromeLabs/pwacompat)
- [ ] DB options
  - [ ] Use MongoDB for speed, flexibility and [Decimal](https://docs.mongodb.com/manual/core/shell-types/#numberdecimal) + [typeorm](https://github.com/typeorm/typeorm) + GraphQL + [vesper](https://github.com/vesper-framework/vesper)
- [ ] Provide as a full SAAS solution
- [ ] Add true full offline support
- [ ] Implement user's [onboarding](./ONBOARDING.md) on first start
  - [ ] At the end of it, there should be dedicated configure/login page
  - [ ] Handle no `clientId` or `spreadsheetId` edge case
  - [ ] Provide ability to set `clientId` and `spreadsheetId` from front-end (temporary)
  - [ ] Add nodejs/express function to save `clientId` and `spreadsheetId` from front-end to the backend `.env` file
- [ ] Display current and previous month expense/income on the dashboard
- [ ] Add `window.gapi.auth2.getAuthInstance().signOut();` to the settings page (like in Telegram, for example)
- [ ] Load more transactions, as user scrolls (they are already loaded, just show them)
- [ ] One transaction can be done from multiple accounts (for example, paying for groceries and using some bonuses to cover part of the expense)
- [ ] Add dark theme
- [ ] Add lending/borrowing features
  - [ ] Let user link returned money transaction to loaned money transaction. Same for reimbursements.
  This is required to correctly check that all reimbursable payments were actually reimbursed.
  Current approach: add reimbursable expenses to reimbursable income and verify that it's zero.
  But this is not always the case (currency exchange rate changed, or I was reimbursed more than expected).
---

💰Expenses is a 
[progressive web application](https://developers.google.com/web/progressive-web-apps/) 
on top of [Google Sheets](https://developers.google.com/sheets/) 📉 written in 
[React](https://facebook.github.io/react/) ⚛️. It is only a static HTML that 
works great on mobile 📱 and can be deployed anywhere.

Check out the [demo](https://demo-expenses.chodounsky.net) but please be 
considerate and don't break it for others.

![Delete expense](doc/delete-expense.gif)

It was inspired by the 
[expense-manager](https://github.com/mitul45/expense-manager) by mitul45 and it 
uses the [material web components](https://material.io/components/) and 
[material icons](https://material.io/icons/).

## Features

* Multiple accounts
  * Checking, savings, joint, etc.
* Categories
* [Google Sheet](https://docs.google.com/spreadsheets/d/1Lz1_gHIgCKPKhJpFerq9PoNy-TIst7eLZ5plQi5Prv0/edit?usp=sharing) 
as a backend
  * Great privacy and access control.
  * Don't share sensitive data with 3rd party.
  * Unlimited analysis up to your sheet skill.
* Works great on mobile
  * Progressive Web App. Loads quickly and works as a standalone app.
* Beautiful material design
  * Better than native ;)
* Recurring expenses
  * Totally doable with [Zapier](http://zapier.com/).
* Monthly summary
  * This month. Last month. You immediately know how you doing.

## Get started

You will need a somewhat recent version of [Node](https://nodejs.org/en/) and a 
place to deploy static HTML under a custom domain (does not have to be top 
level). To get the full offline support with service workers you'll need 
HTTPS – [CloudFlare](https://cloudflare.com) works fine or you can use your 
own certificate.

1) make a copy of [Expense Sheet](https://docs.google.com/spreadsheets/d/1Lz1_gHIgCKPKhJpFerq9PoNy-TIst7eLZ5plQi5Prv0/edit?usp=sharing) 
to your drive `File -> Make a copy...`
2) note the id of your new sheet (it's part of the URL)
3) clone and build the app:


```
REACT_APP_SHEET_ID=<replace with your sheet id> npm run build
```

4) copy the content of `build` folder to your server

### Recurring Expenses

Zapier is a service for connecting apps and automating your workflows. And it 
can be used to add recurring expenses with the 
[Google Sheets Integrations](https://zapier.com/zapbook/google-sheets/).

Select a trigger – it could be every month, week, or based on anything else.

Use the `Create Spreadsheet Row` integration and select your expense sheet and 
fill it with the desired values. Easy.

![Zapier setup for recurring expenses](doc/zapier.png)

### Sharing

Adding another person (for example your partner) to the app is easy – you just 
give them access to the expense sheet in Google Sheets.

After that, they have the same access as you are and can add expenses through 
the same URL.
