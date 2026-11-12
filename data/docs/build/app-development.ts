import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * App Development: three React Native apps, week by week, built on the
 * my-mobile-app repo from Setup (Expo with Expo Router, running in Expo Go
 * on the student's phone).
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

function tabsTask(tabs: string, stack: string): BuildTask {
  return {
    id: "tabs",
    title: "Start clean: tabs and empty screens",
    why: "Clear out the starter app and put your own navigation in place: every screen exists, so you can tap through the whole app before it does anything.",
    branch: "feat/navigation",
    prompt: `I just ran npm run reset-project, so src/app is empty apart from a starter index. Using Expo Router, set up bottom tabs for: ${tabs}, each with a title, an icon from @expo/vector-icons and a placeholder screen. ${stack} Explain how the file names in src/app turn into screens and tabs.`,
    steps: [
      { text: "Move the starter app out of the way (it's kept in an app-example folder, so you can still look at it):", code: "npm run reset-project" },
      { text: "Start Expo and open the app on your phone:", code: "npx expo start" },
    ],
    understand: ["Which file decides that a screen is a tab, and which one is a stack screen on top?", "What does _layout.tsx do?", "How does a screen get the id of the item it shows?"],
    check: [{ text: "On your phone, tap every tab and open the stack screen. Each one shows its placeholder, and Back works." }],
    debug: ["The phone shows the old starter app: shake the phone (or press r in the terminal) to reload."],
    commit: "Add tabs and screens",
  }
}

function storageTask(what: string, screens: string[]): BuildTask {
  return {
    id: "storage",
    title: "Save it on the device",
    why: "Close the app, open it again — everything should still be there. AsyncStorage keeps data on the phone, with or without internet.",
    branch: "feat/storage",
    screens,
    prompt: `Using @react-native-async-storage/async-storage, write src/lib/storage.ts with typed functions to load and save ${what}, stored as JSON under versioned keys like “habits:v1”. Every read handles “nothing saved yet” and broken JSON without crashing. Then use it so the screens load on start and save on every change.`,
    steps: [{ text: "Install AsyncStorage with Expo's installer (it picks the version that matches your Expo):", code: "npx expo install @react-native-async-storage/async-storage" }],
    understand: ["Why does every key have :v1 on the end?", "What happens on the very first launch, when nothing is saved yet?", "Why put all storage code in one file?"],
    check: [{ text: "Add some data, close the app completely (swipe it away), and open it again — everything is still there." }, { text: "Turn on airplane mode — the app still works." }],
    debug: ["“AsyncStorage is null”: you installed it with npm instead of npx expo install, or didn't restart npx expo start afterwards."],
    commit: "Save data on the device",
  }
}

function notifyTask(prompt: string, screens: string[]): BuildTask {
  return {
    id: "notifications",
    title: "Notifications",
    why: "A nudge at the right moment is what makes people come back to an app.",
    branch: "feat/notifications",
    screens,
    prompt: `Using expo-notifications (local notifications only — no push server), ${prompt} Ask for permission politely the first time, and handle the user saying no.`,
    steps: [{ text: "Install it:", code: "npx expo install expo-notifications" }],
    understand: ["What's the difference between a local notification and a push notification?", "What does your app do if the user says no to notifications?"],
    check: [{ text: "Trigger it (set the time a minute ahead, or cross the limit) and lock your phone — the notification arrives." }],
    debug: ["Nothing arrives on Android: check the app's notification permission in your phone's Settings → Apps → Expo Go → Notifications."],
    commit: "Add notifications",
  }
}

const polishTask: BuildTask = {
  id: "polish",
  title: "Polish: icon, splash screen and empty states",
  why: "The first ten seconds decide whether people keep an app. A real icon, a splash screen and friendly empty states make it feel finished.",
  branch: "feat/polish",
  prompt: "Help me polish my Expo app: set the app name, icon and splash screen in app.json (tell me the image sizes I need), and review every screen for a friendly empty state (an icon, one line of text and a button to do the first thing). Also check text is at least 14 points and tap targets are at least 44 points.",
  steps: [{ text: "Make a 1024 × 1024 icon (Figma or Canva is fine) and save it in assets/images/, replacing icon.png and the splash image." }],
  understand: ["What does a good empty state need?", "Why do tap targets need to be at least 44 points?"],
  check: [{ text: "Clear the app's data (or delete and reinstall Expo Go's copy) and open it: the empty states guide you to the first action." }],
  commit: "Add icon, splash screen and empty states",
}

const apkTask: BuildTask = {
  id: "apk",
  title: "Build the installable APK",
  why: "Expo Go is for building. An APK is your real app: anyone with an Android phone can install it from a link.",
  branch: "chore/apk",
  prompt: "I'm building an Android APK with EAS Build (preview profile). Explain what eas.json's build profiles are, what an APK is compared to an AAB, and what happens on Expo's servers when I run the build.",
  steps: [{ text: "Follow Building → Deployment → Build an installable APK with EAS. It takes 10–20 minutes on Expo's servers.", code: "npx eas-cli@latest build -p android --profile preview" }],
  understand: ["Why does the build run on Expo's servers, not your laptop?", "Which settings in app.json end up in the APK?"],
  check: [{ text: "Open the build link on an Android phone, install the APK, and use the app — without Expo Go and without your laptop." }],
  debug: ["The build fails: open the build page on expo.dev and read the first red error in the log. Most often it's a missing icon file or a typo in app.json."],
  commit: "Add EAS build config",
}

function shipWeek(name: string, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: polish, build an installable APK, record a demo, and get ready for the final review.",
    tasks: [
      polishTask,
      apkTask,
      readmeTask({ name, sections: "a link to download the APK, screenshots from your phone, tech stack, how to run it with Expo Go, environment variables (names only)", demo: "walk through the main flow on your phone (or use your phone's own screen recorder: Android's Screen record quick setting, or iPhone's Control Centre → Screen Recording)", check: "The APK link, screenshots and demo video all open." }),
      finalReviewTask(doneWhen, "your app on a phone"),
    ],
    done: ["Icon, splash screen and empty states", "An installable APK, linked in the README", "The demo video is linked from the README", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* Habit tracker                                                       */
/* ------------------------------------------------------------------ */

const habitDone = ["Habits and streaks survive closing the app.", "The reminder fires at the chosen time.", "Works in airplane mode.", "An installable APK is linked in the README."]

const habitTracker: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, then replace the starter app with your own tabs and screens.",
    tasks: [
      planTask({
        parts: ["Screens — how a user moves between Today, Habits, Habit detail and Settings.", "Data — what you save on the device, and how a streak is worked out from check-in dates (not stored)."],
        questions: ["Why is the streak calculated instead of saved?", "What should happen if the user misses a day?"],
      }),
      tabsTask("Today, Habits and Settings", "Add a stack screen for Habit detail at habit/[id], opened from the Habits tab."),
    ],
    done: ["docs/plan.md in your own words", "Three tabs and the detail screen, with placeholders", mergedLine],
  },
  {
    intro: "Build the core: the habit form and list, the Today screen, and saving everything on the phone.",
    tasks: [
      {
        id: "habits",
        title: "Create and edit habits",
        why: "Everything starts with a habit. One form, used for both adding and editing.",
        branch: "feat/habits",
        screens: ["habits", "habit-form"],
        prompt: "On the Habits tab, list habits with a reusable HabitRow component (icon, colour dot, name, target per week). Add a + button that opens a form (name, icon from a small set, colour, target days per week 1–7) used for both adding and editing, with a clear message when the name is empty. Keep habits in React state for now, in a context so every tab can read them.",
        understand: ["Why a context, and which screens read it?", "How does the same form know whether it's adding or editing?"],
        check: [{ text: "Add three habits, edit one, delete one — the list updates each time." }],
        commit: "Add habit list and form",
      },
      {
        id: "today",
        title: "Today and check-ins",
        why: "The screen people open every day: tap once, and the habit's done.",
        branch: "feat/today",
        screens: ["today"],
        prompt: "Build the Today tab: today's date, then each habit with a big tap area to check in or undo, and “3 of 5 done” at the top. Store check-ins as { habitId, date: “YYYY-MM-DD” } in the same context. Write src/lib/streaks.ts with a pure function that returns the current streak from a habit's check-in dates, with unit tests (npx expo install jest-expo jest, then npm test).",
        understand: ["Why is the date stored as YYYY-MM-DD text?", "Walk through your streak function for check-ins on Mon, Tue and Thu, if today is Thursday.", "Why is it a pure function?"],
        check: [{ text: "Check in two habits: the count goes up. Undo one: it goes down." }, { text: "Run your streak tests:", code: "npm test", expect: "they pass" }],
        commit: "Add Today screen and streaks",
      },
      storageTask("habits and check-ins", ["today", "habits"]),
    ],
    done: ["Add, edit and delete habits", "Check in on Today, with streaks", "Everything survives closing the app", mergedLine],
  },
  {
    intro: "Add the detail screen with its calendar, daily reminders, and make the whole app behave offline.",
    tasks: [
      {
        id: "detail",
        title: "Habit detail and calendar",
        why: "Seeing a month of green days is what keeps people going.",
        branch: "feat/detail",
        screens: ["detail"],
        prompt: "Build habit/[id]: the habit's name, current streak, best streak, this week's progress against its target, and a monthly calendar where checked-in days are filled with the habit's colour. Add buttons to move between months.",
        understand: ["How do you work out which day of the week the month starts on?", "Where does this screen get its data?"],
        check: [{ text: "Open a habit with a few check-ins: those days are filled on the calendar, and the streak matches Today." }],
        commit: "Add habit detail with calendar",
      },
      notifyTask("let the user pick a daily reminder time on the Settings tab (with an on/off switch), and schedule one daily notification at that time, saved in storage. Changing the time replaces the old notification.", ["settings"]),
    ],
    done: ["Habit detail with a calendar and streaks", "A daily reminder at the chosen time", "Everything works in airplane mode", mergedLine],
  },
  shipWeek("Habit tracker", habitDone),
]

/* ------------------------------------------------------------------ */
/* Expense manager                                                     */
/* ------------------------------------------------------------------ */

const expenseDone = ["Logging an expense takes three taps plus typing the amount.", "Totals and the chart always agree.", "Budget alerts fire once per threshold per month.", "APK linked in the README."]

const expenseManager: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, then replace the starter app with your own tabs and screens.",
    tasks: [
      planTask({
        parts: ["Screens — Home, the Add expense modal, Reports and Budget, and how you get from one to another.", "Data — how expenses and budgets are saved, and why totals are always calculated from the expenses."],
        questions: ["How will you make logging an expense take only three taps?", "Why store the amount as a whole number of paise?"],
      }),
      tabsTask("Home, Reports and Budget", "Add Add expense as a modal screen (presentation: “modal”) opened by a + button on Home."),
    ],
    done: ["docs/plan.md in your own words", "Three tabs and the Add expense modal, with placeholders", mergedLine],
  },
  {
    intro: "Build the core: the fastest possible Add expense, the Home screen with this month's spending, and saving on the phone.",
    tasks: [
      {
        id: "add-expense",
        title: "Add an expense, fast",
        why: "If logging takes more than a few seconds, people stop doing it. Speed is the feature.",
        branch: "feat/add-expense",
        screens: ["add"],
        prompt: "Build the Add expense modal: a big amount display with a number keypad (store paise as a whole number), category chips (Food, Travel, Shopping, Bills, Fun, Other), an optional note, a date that defaults to today, and Save. Make AmountInput and CategoryChips reusable components. Format money in rupees with Intl.NumberFormat(“en-IN”). Keep expenses in a context for now.",
        understand: ["Why paise as a whole number?", "Count the taps to log ₹120 for Food. Can you make it fewer?"],
        check: [{ text: "Log an expense in three taps plus the amount. It shows as ₹120, not 120 or ₹120.00000001." }],
        commit: "Add the Add expense modal",
      },
      {
        id: "home",
        title: "Home: this month",
        why: "The screen that answers “how much have I spent, and how much is left?”",
        branch: "feat/home",
        screens: ["home"],
        prompt: "Build Home: this month's total and remaining budget with a progress bar, then expenses grouped by day (newest first) with a total per day. Tap an expense to edit it in the same modal, long-press to delete with a confirm. Put the calculations in src/lib/totals.ts as pure functions with unit tests.",
        understand: ["Why are totals calculated every time instead of saved?", "How do you group expenses by day?"],
        check: [{ text: "Add expenses on two different days: they're grouped under each day, and the totals add up." }],
        commit: "Add Home screen",
      },
      storageTask("expenses and the monthly budget", ["home"]),
    ],
    done: ["Log, edit and delete expenses", "Home shows this month by day, with totals", "Everything survives closing the app", mergedLine],
  },
  {
    intro: "Add the reports chart, the budget with alerts, and make every error friendly.",
    tasks: [
      {
        id: "reports",
        title: "Reports chart",
        why: "A chart shows in one glance what a list never will: where the money actually goes.",
        branch: "feat/reports",
        screens: ["reports"],
        prompt: "Build Reports: a month picker and a pie or bar chart of spending by category, using react-native-gifted-charts, with a list below showing each category's amount and percentage. The numbers come from the same functions in src/lib/totals.ts as Home.",
        steps: [{ text: "Install the chart library and what it needs:", code: "npx expo install react-native-svg\nnpm install react-native-gifted-charts" }],
        understand: ["Why must Reports use the same total functions as Home?", "How would someone who can't see colours read your chart?"],
        check: [{ text: "Add up the category amounts by hand: they match the month total on Home." }],
        commit: "Add reports chart",
      },
      notifyTask("on the Budget tab let the user set a monthly limit, and after each new expense send a notification when spending first crosses 80% and 100% of it — once per threshold per month (save which ones you've sent).", ["budget"]),
    ],
    done: ["A category chart that agrees with Home", "Budget alerts at 80% and 100%, once each per month", mergedLine],
  },
  shipWeek("Expense manager", expenseDone),
]

/* ------------------------------------------------------------------ */
/* Food ordering app                                                   */
/* ------------------------------------------------------------------ */

const foodDone = ["Cart total matches item prices × quantity + add-ons.", "The cart survives closing the app.", "Status updates without restarting the app.", "APK linked in the README."]

const foodOrdering: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, start the mock API, then replace the starter app with your own tabs and screens.",
    tasks: [
      planTask({
        parts: ["Screens — Menu, Item detail, Cart, Order status and Orders, and how you get from one to another.", "Data — what comes from the API, what lives in the cart on the phone, and how the total is worked out."],
        questions: ["Why does the cart live on the phone, not on the server?", "What should the app show when the API can't be reached?"],
      }),
      {
        ...tabsTask("Menu, Cart and Orders", "Add stack screens for Item detail at item/[id] and Order status at order/[id]."),
        steps: [
          { text: "Create mock/db.json from Reference → Sample data. Start the mock API in its own terminal — it must keep running:", code: "npx json-server mock/db.json --port 4000 --host 0.0.0.0" },
          { text: "Check EXPO_PUBLIC_API_URL in .env is http://YOUR-WIFI-ADDRESS:4000 (Environment & secrets showed you how). Then move the starter app aside and start Expo:", code: "npm run reset-project\nnpx expo start" },
        ],
      },
    ],
    done: ["docs/plan.md in your own words", "The mock API runs and your phone can reach it", "Three tabs and two stack screens, with placeholders", mergedLine],
  },
  {
    intro: "Build the core: the menu from the API, the item screen, and a cart that survives a restart.",
    tasks: [
      {
        id: "menu",
        title: "Menu and item detail",
        why: "The menu is the shop window. It comes from the API, so it needs loading and error states from the start.",
        branch: "feat/menu",
        screens: ["menu", "item"],
        prompt: "Write src/lib/api.ts with a typed fetch helper that uses EXPO_PUBLIC_API_URL and throws a friendly error when the network fails. Build Menu: category chips, a search box and item cards (image, name, price), with loading, empty and error (with Retry) states. Build item/[id]: image, description, add-ons with checkboxes, a quantity stepper, and Add to cart showing the line total.",
        understand: ["Why does your phone need your laptop's Wi-Fi address, not localhost?", "What does the user see when the API is down?"],
        check: [{ text: "The menu loads on your phone. Stop the mock API: the error state shows. Start it, tap Retry: the menu is back." }],
        debug: ["Network request failed: the phone and laptop must be on the same Wi-Fi, json-server must run with --host 0.0.0.0, and .env must use your laptop's address. Restart Expo after changing .env."],
        commit: "Add menu and item detail",
      },
      {
        id: "cart",
        title: "Cart, saved on the phone",
        why: "The cart is the one thing that must never be wrong: the total, and that it's still there after the app closes.",
        branch: "feat/cart",
        screens: ["cart"],
        prompt: "Make a cart context with add, change quantity and remove, where a cart line is { menuItemId, quantity, addOns }. Build the Cart tab: lines with steppers, add-on names, and a total worked out by a pure function in src/lib/cart.ts (price + add-ons, × quantity) with unit tests. Save the cart with AsyncStorage on every change and load it on start.",
        steps: [{ text: "Install AsyncStorage:", code: "npx expo install @react-native-async-storage/async-storage" }],
        understand: ["Walk through your total for 2 × ₹180 biryani with a ₹40 raita add-on.", "The same item with different add-ons: one cart line or two? Why?"],
        check: [{ text: "Add three items with add-ons, close the app, open it again: the cart and its total are still right." }],
        commit: "Add cart",
      },
    ],
    done: ["The menu loads from the API, with loading and error states", "A correct cart that survives a restart", mergedLine],
  },
  {
    intro: "Check out, track the order live, and keep a history — with friendly offline errors everywhere.",
    tasks: [
      {
        id: "checkout",
        title: "Checkout and live status",
        why: "The moment of truth: send the order, then show its progress without the user doing anything.",
        branch: "feat/checkout",
        screens: ["checkout", "status"],
        prompt: "Add a checkout form on the Cart tab (name, 10-digit phone, address) with clear messages per field. POST the order to /orders on my mock API with status “placed”, clear the cart, save the order id in history, and open order/[id]. There, poll GET /orders/:id every 5 seconds and show the four steps (placed, preparing, out for delivery, delivered), stopping the polling when it's delivered or the screen closes.",
        understand: ["Why must polling stop when the screen closes?", "What happens if the network drops during checkout?"],
        check: [{ text: "Place an order, then change its status with the curl command in Reference → Sample data: within 5 seconds the next step lights up on your phone." }],
        commit: "Add checkout and live order status",
      },
      {
        id: "history",
        title: "Order history and offline errors",
        why: "Past orders on the phone, and an app that stays calm when the internet doesn't.",
        branch: "feat/history",
        screens: ["orders"],
        prompt: "Build the Orders tab from the saved order ids (newest first, with date, total and status), each opening order/[id]. Then review every screen for what happens offline, and show a small banner instead of crashing or spinning forever.",
        understand: ["Where is the history stored, and why there?", "What does each screen do with no internet?"],
        check: [{ text: "Turn on airplane mode and use every tab: nothing crashes, and you're told what's wrong." }],
        commit: "Add order history and offline handling",
      },
    ],
    done: ["Checkout with validation", "Order status updates by itself", "Order history, and friendly offline errors", mergedLine],
  },
  shipWeek("Food ordering app", foodDone),
]

export const appBuilds: Record<string, ProjectBuild> = {
  "habit-tracker": habitTracker,
  "expense-manager": expenseManager,
  "food-ordering": foodOrdering,
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

const phone = (title: string, nav: string[], active: number, blocks: ProjectScreen["mock"]["blocks"]): ProjectScreen["mock"] => ({ frame: "phone", title, nav, active, blocks })

const habitTabs = ["Today", "Habits", "Settings"]
const expenseTabs = ["Home", "Reports", "Budget"]
const foodTabs = ["Menu", "Cart", "Orders"]

export const appScreens: Record<string, ProjectScreen[]> = {
  "habit-tracker": [
    {
      id: "today",
      name: "Today",
      purpose: "The screen people open every day: tap a habit to check it in.",
      shows: ["Today's date and “3 of 5 done”", "A big tap area per habit", "Streaks on each habit"],
      week: 2,
      mock: phone("Today", habitTabs, 0, [{ kind: "stat", label: "Thursday, 12 March", value: "3 of 5", caption: "done today" }, { kind: "list", items: [{ title: "Read 20 pages", meta: "🔥 12-day streak", done: true }, { title: "Drink 2L water", meta: "🔥 5-day streak", done: true }, { title: "Gym", meta: "3 of 4 this week" }, { title: "Practise DSA", meta: "🔥 2-day streak" }] }]),
    },
    {
      id: "habits",
      name: "Habits",
      purpose: "Every habit, with a + to add one.",
      shows: ["A row per habit: icon, colour and target", "Tap to open, + to add"],
      week: 2,
      mock: phone("Habits", habitTabs, 1, [{ kind: "list", items: [{ title: "📚 Read 20 pages", right: "7×/wk" }, { title: "💧 Drink 2L water", right: "7×/wk" }, { title: "🏋️ Gym", right: "4×/wk" }, { title: "💻 Practise DSA", right: "5×/wk" }] }]),
    },
    {
      id: "habit-form",
      name: "Add or edit a habit",
      purpose: "One form for new habits and changes to old ones.",
      shows: ["Name, icon and colour", "Target days per week", "A message if the name is empty"],
      week: 2,
      mock: phone("New habit", habitTabs, 1, [{ kind: "form", title: "", fields: ["Name", "Icon", "Colour", "Days per week (1–7)"], button: "Save habit" }]),
    },
    {
      id: "detail",
      name: "Habit detail",
      purpose: "One habit's month: filled days, current and best streak.",
      shows: ["Current and best streak", "This week against the target", "A monthly calendar"],
      week: 3,
      mock: phone("Read 20 pages", habitTabs, 1, [{ kind: "kpis", items: [{ label: "Streak", value: "12" }, { label: "Best", value: "21" }] }, { kind: "bars", title: "March", values: [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1], labels: ["1", "", "", "", "5", "", "", "", "", "10", "", "", "", "14"] }]),
    },
    {
      id: "settings",
      name: "Settings",
      purpose: "Pick the time for the daily reminder.",
      shows: ["Reminders on or off", "The reminder time"],
      week: 3,
      mock: phone("Settings", habitTabs, 2, [{ kind: "list", items: [{ title: "Daily reminder", right: "On" }, { title: "Reminder time", right: "8:00 pm" }] }]),
    },
  ],
  "expense-manager": [
    {
      id: "home",
      name: "Home",
      purpose: "This month at a glance: spent, left, and every expense by day.",
      shows: ["Spent this month and budget left", "A budget progress bar", "Expenses grouped by day, with a + button"],
      week: 2,
      mock: phone("March", expenseTabs, 0, [{ kind: "stat", label: "Spent this month", value: "₹8,420", caption: "₹1,580 left of ₹10,000" }, { kind: "list", title: "Today · ₹410", items: [{ title: "Lunch", meta: "Food", right: "₹180" }, { title: "Auto", meta: "Travel", right: "₹90" }, { title: "Chai & snacks", meta: "Food", right: "₹140" }] }]),
    },
    {
      id: "add",
      name: "Add expense",
      purpose: "Log spending in seconds: amount, category, save.",
      shows: ["A big amount and keypad", "Category chips", "Optional note and date"],
      week: 2,
      mock: phone("Add expense", expenseTabs, 0, [{ kind: "stat", label: "Amount", value: "₹120" }, { kind: "search", placeholder: "Note (optional)", chips: ["Food", "Travel", "Shopping", "Bills", "Fun"] }, { kind: "form", title: "", fields: [], button: "Save" }]),
    },
    {
      id: "reports",
      name: "Reports",
      purpose: "Where the money went this month, by category.",
      shows: ["A month picker", "A chart by category", "Amount and percentage per category"],
      week: 3,
      mock: phone("Reports", expenseTabs, 1, [{ kind: "bars", title: "March by category", values: [3200, 1900, 1500, 1100, 720], labels: ["Food", "Travel", "Shop", "Bills", "Fun"] }, { kind: "list", items: [{ title: "Food", right: "₹3,200 · 38%" }, { title: "Travel", right: "₹1,900 · 23%" }] }]),
    },
    {
      id: "budget",
      name: "Budget",
      purpose: "Set the monthly limit — and get a warning before you hit it.",
      shows: ["The monthly limit", "Alerts at 80% and 100%"],
      week: 3,
      mock: phone("Budget", expenseTabs, 2, [{ kind: "form", title: "Monthly budget", fields: ["Limit (₹)"], button: "Save" }, { kind: "list", items: [{ title: "Alert at 80%", right: "On" }, { title: "Alert at 100%", right: "On" }] }]),
    },
  ],
  "food-ordering": [
    {
      id: "menu",
      name: "Menu",
      purpose: "Browse the restaurant's menu by category, or search it.",
      shows: ["Category chips and search", "Item cards with image, name and price", "Loading and error states"],
      week: 2,
      mock: phone("Spice Route", foodTabs, 0, [{ kind: "search", placeholder: "Search the menu", chips: ["Biryani", "Starters", "Breads", "Drinks"] }, { kind: "cards", items: [{ title: "Chicken biryani", meta: "Serves 1", badge: "₹180" }, { title: "Paneer tikka", meta: "6 pieces", badge: "₹220" }] }]),
    },
    {
      id: "item",
      name: "Item detail",
      purpose: "Choose add-ons and quantity, then add to the cart.",
      shows: ["Image and description", "Add-ons", "Quantity and the line total"],
      week: 2,
      mock: phone("Chicken biryani", foodTabs, 0, [{ kind: "list", title: "Add-ons", items: [{ title: "Raita", right: "+₹40", done: true }, { title: "Extra gravy", right: "+₹30" }] }, { kind: "form", title: "Quantity: 2", fields: [], button: "Add to cart · ₹440" }]),
    },
    {
      id: "cart",
      name: "Cart",
      purpose: "Everything you're ordering, with a total you can trust.",
      shows: ["Lines with quantity steppers and add-ons", "The total", "Checkout"],
      week: 2,
      mock: phone("Cart", foodTabs, 1, [{ kind: "list", items: [{ title: "2 × Chicken biryani", meta: "+ Raita", right: "₹440" }, { title: "1 × Paneer tikka", right: "₹220" }] }, { kind: "stat", label: "Total", value: "₹660" }]),
    },
    {
      id: "checkout",
      name: "Checkout",
      purpose: "Where to send it — checked before the order goes.",
      shows: ["Name, phone and address", "A message per invalid field"],
      week: 3,
      mock: phone("Checkout", foodTabs, 1, [{ kind: "form", title: "Deliver to", fields: ["Name", "Phone (10 digits)", "Address"], button: "Place order · ₹660" }]),
    },
    {
      id: "status",
      name: "Order status",
      purpose: "Watch the order move — without refreshing.",
      shows: ["Four steps that light up as the status changes", "Updates every few seconds"],
      week: 3,
      mock: phone("Order #1042", foodTabs, 2, [{ kind: "list", items: [{ title: "Placed", meta: "7:42 pm", done: true }, { title: "Preparing", meta: "7:45 pm", done: true }, { title: "Out for delivery", meta: "On the way" }, { title: "Delivered" }] }]),
    },
    {
      id: "orders",
      name: "Orders",
      purpose: "Past orders, kept on the phone.",
      shows: ["Newest first: date, total and status", "Tap to open the status"],
      week: 3,
      mock: phone("Orders", foodTabs, 2, [{ kind: "list", items: [{ title: "Order #1042", meta: "Today · 3 items", right: "₹660" }, { title: "Order #1031", meta: "8 Mar · 2 items", right: "₹410" }] }]),
    },
  ],
}
