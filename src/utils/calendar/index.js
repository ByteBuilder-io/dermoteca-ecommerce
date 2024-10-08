const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "./src/utils/calendar/token.json");
const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "./src/utils/calendar/credentials.json"
);

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth, date) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date(date).toISOString(),
    timeMax: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  // console.log("Upcoming 10 events:");
  // events.map((event, i) => {
  //   const start = event.start.dateTime || event.start.date;
  //   console.log(`${start} - ${event.summary}`);
  // });

  return events;
}

/**
 * Creates an event on the users calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function createEvent(auth, properties, title) {
  const calendar = google.calendar({ version: "v3", auth });
  const startDate = properties.find(
    (property) => property.name === "start"
  ).value;
  const endDate = properties.find((property) => property.name === "end").value;
  const attendee = properties.find(
    (property) => property.name === "attendee"
  ).value;

  const event = {
    summary: "Cita dermoteca",
    location: "800 Howard St., San Francisco, CA 94103",
    description: title,
    start: {
      dateTime: startDate,
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: endDate,
      timeZone: "America/Mexico_City",
    },
    // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: [{ email: attendee }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  console.log({
    summary: "Cita dermoteca",
    location: "800 Howard St., San Francisco, CA 94103",
    description: title,
    start: {
      dateTime: startDate,
      timeZone: "America/Mexico_City",
    },
    end: {
      dateTime: endDate,
      timeZone: "America/Mexico_City",
    },
    // recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: [{ email: attendee }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  });

  calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary",
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      console.log("Event created: %s", event);
    }
  );
}

export async function getEvents(date) {
  return authorize()
    .then((auth) => listEvents(auth, date))
    .catch(console.error);
}

export async function setEvent(properties, title) {
  authorize()
    .then((auth) => createEvent(auth, properties, title))
    .catch(console.error);
}
