    Specification Document
Installable Staff Reservation Book PWA
The Friendly Bear Sofia
1. Purpose

Build a private staff reservation book as an installable web app inside the website admin area.

The app must live at:

/admin/bookings

It must work like a very simple digital version of the restaurant reservation book.

It is for staff and owner use, not for customers.

The goal is:

Click table row.
Write reservation inline.
See reservation in the correct time position.
Edit by clicking.
Delete if needed.
Allow overlaps.
Work offline.
Sync safely.
Never silently overwrite another personâ€™s changes.

The app should be simple enough that staff can use it without training.

2. Core product idea

The app is a day based booking grid.

The left side shows table numbers.

The top shows time from:

12:00 to 22:00

Each row is one restaurant table.

Each reservation appears inside the row where it was created.

The reservation visually starts according to its time and has a default width of:

3.5 hours

Example reservation display:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday

If there is no note:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369

The table number is not written in the reservation because the staff already clicked the table row.

3. App type

The app must be an installable PWA.

It should behave like an app on PC, tablet, and phone, but it should still be delivered through the website.

The app needs a web app manifest, icons, start URL, standalone display mode, and production HTTPS. MDN describes the manifest as the file that tells the browser how the PWA should appear and behave, and notes that installable PWAs require a manifest and secure delivery through HTTPS or local development environments.

The app also needs a service worker so that the app shell can load while offline. MDN describes offline PWA operation as being enabled by adding a service worker that can cache resources and intercept fetch requests.

4. Route structure

Main route:

/admin/bookings

Login route:

/admin/bookings/login

Settings route:

/admin/bookings/settings

Conflict review route:

/admin/bookings/conflicts

Integration settings route:

/admin/bookings/integrations

The user should never see the booking app without login.

If the user is not logged in, redirect to:

/admin/bookings/login
5. Relationship with current website and CMS

The current website CMS remains for public and marketing content.

Existing CMS models include:

BusinessProfile
ReservationSettings
ModuleToggles
Page
MenuCategory
MenuItem
Promotion
ReviewSnippet
TouristLandingPage

The staff reservation book must not be treated like normal CMS content.

Reservations are operational data.

The new booking app should use Supabase tables dedicated to operational reservations, tables, staff users, settings, integrations, and offline sync.

ReservationSettings in the existing CMS can still control public website buttons, WhatsApp, phone links, and external booking links.

The real staff booking book lives in Supabase.

6. Authentication

Use Supabase Auth for login.

Supabase Auth should be used for staff login, and Supabase Row Level Security should protect data access from the browser. Supabase documents that RLS should be enabled on exposed tables and can be combined with Supabase Auth for browser to database security.

The app must support:

one Supabase project
multiple staff accounts
one restaurant now
future support for more restaurants

Recommended structure:

auth.users
staff_profiles
restaurants
restaurant_memberships

Each staff account is one Supabase Auth user.

Each user has a staff profile.

Each staff profile can belong to one or more restaurants.

7. Premade staff accounts

There must be 5 premade accounts.

These accounts are created during setup.

Recommended account labels:

owner
admin
staff_1
staff_2
staff_3

Do not hardcode real passwords in frontend code.

The setup script should either:

generate strong temporary passwords

or read them from:

environment variables

The owner/admin receives the passwords privately.

The app must allow the admin to reset passwords later.

8. Roles

The system should support simple roles.

Role	Permissions
owner	Everything
admin	Settings, tables, staff accounts, reservations
manager	Reservations, conflict review, connected tables
staff	Add, edit, delete reservations
viewer	View only

Only owner and admin can change table numbers and booking settings.

The first version can use only:

owner
admin
staff

but the database should allow the full role list.

9. Main screen layout

The main screen is a booking grid.

It contains:

top date bar
previous day arrow
next day arrow
table number column on the left
time row on the top
reservation grid

The layout must work on:

PC
tablet
phone
10. Table numbers

The table numbers appear in the left column.

Initial table numbers:

1
2
3
4
5
6
7
8
9
10
11
12
13
14
31
32
33
34
40
41
50
51
52
54

The table numbers must be editable from admin settings.

The left table column must stay visible when scrolling horizontally.

This means that if staff scrolls to the right to later times, the table numbers remain fixed.

11. Time row

The time row appears at the top.

The visible reservation time range is:

12:00 to 22:00

The top time row must stay visible when scrolling vertically.

This means that if staff scrolls down through table rows, the time labels remain fixed.

Recommended settings:

opening_start_time: 12:00
last_bookable_start_time: 22:00
visible_end_time: 22:00
slot_step_minutes: 15
default_reservation_duration_minutes: 210

210 minutes equals 3.5 hours.

12. Date navigation

At the top of the app, show a date selector in this format:

DD/MM/YYYY

There must be two small arrows:

previous day
next day

Clicking the date opens a date picker.

Changing the date loads the book for that day.

The selected date should be remembered locally so reopening the app returns to the last viewed date, unless the date is old. If the last viewed date is old, default to today.

13. Visual style

Do not copy the colors from the screenshot.

Use normal, clean, calm colors.

Recommended style:

Element	Style
Page background	very light grey
Grid background	white
Alternating rows	white and very light blue grey
Sticky left table column	white or very light grey
Sticky top time row	white
Reservation block	calm blue or neutral slate
Connected table reservation	same color with stronger border
Warning	soft amber
Sync issue	soft red outline
Text	dark grey or dark slate

The app should look simple and operational.

It should not look like a heavy dashboard.

14. Reservation format

The visible reservation text must be:

Ð§Ð§:ÐœÐœ | Ð±Ñ€Ð¾Ð¹ Ð´ÑƒÑˆÐ¸ | Ð˜Ð¼Ðµ | Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½ | Ð‘ÐµÐ»ÐµÐ¶ÐºÐ°

Example:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday

Without note:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369

The text must stay compact.

Do not show table number inside the reservation text.

Do not show status text.

Do not show customer facing labels.

Do not show unnecessary badges in the normal view.

15. Inline reservation input

When staff clicks on a row, the app must create an inline input inside that row.

There should not be a complicated popup form.

The inline input contains only:

time
number of people
name
phone
note

The table is determined automatically from the clicked row.

The form must not ask for table number.

Inline input visual format:

[17:30] | [4 Ð´ÑƒÑˆÐ¸] | [Lazar Popov] | [0644910369] | [birthday]

Required fields:

time
number of people
name
phone

Optional field:

note

When saved, it becomes:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday
16. Adding a reservation

Steps:

Staff clicks a table row.
Inline input appears in that row.
Time is prefilled from the clicked horizontal position.
Staff enters number of people, name, phone, and optional note.
Staff presses Enter or clicks Save.
Reservation appears at the correct time position.
Reservation has a default visual width of 3.5 hours.

The selected table is saved internally, but the staff does not type it.

17. Editing a reservation

When staff clicks an existing reservation, it becomes editable inline or opens a very small inline edit bubble.

The edit UI allows only:

change time
change number of people
change name
change phone
change note
delete reservation

There should be no normal status workflow.

There should be no complex modal unless absolutely needed on small mobile screens.

18. Deleting a reservation

Deleting should be simple.

When staff clicks delete, ask for a quick confirmation:

Delete this reservation?

Then remove it from the visible book.

Internally, use soft delete:

deleted_at
deleted_by

This protects the restaurant from mistakes.

Deleted reservations should not appear in the normal book.

Admin can view deleted reservations later if needed.

19. No reservation statuses

The app must not use operational statuses like:

booked
confirmed
arrived
seated
finished
cancelled
no_show

This app must feel like the physical book.

There can be hidden technical sync states, but they should not become part of the normal restaurant workflow.

Allowed hidden technical sync states:

synced
pending_create
pending_update
pending_delete
sync_conflict
sync_failed

These are only for offline safety and support.

The normal reservation still looks like:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday
20. Reservation duration and positioning

Each reservation appears visually based on its start time.

Example:

17:30

starts at the 17:30 position.

Default duration:

3.5 hours

So:

17:30

ends visually at:

21:00

Admin can change the default duration in settings.

The internal record stores:

start_time
duration_minutes
end_time

The display text still shows only the start time.

21. Overlapping reservations

Overlapping reservations are allowed.

This is important.

The app must behave like Google Calendar in this way.

If two reservations overlap on the same table, both are valid.

Example:

Table 5

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369
18:00 | 2 Ð´ÑƒÑˆÐ¸ | Maria | 0888123456

Both reservations should appear.

The app must not block overlaps.

The app must not treat overlaps as database conflicts.

The app must display overlapping reservations clearly.

Recommended display behavior:

same row
same time area
slightly stacked or narrowed
both clickable
no data lost
22. Warning when there is a later reservation

When staff creates or edits a reservation, the app should check if there is another reservation later on the same table.

If yes, show a small warning.

The warning should say:

Ð¡Ð»ÐµÐ´ X Ñ‡Ð°ÑÐ° Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.

or:

Ð¡Ð»ÐµÐ´ X Ð¼Ð¸Ð½ÑƒÑ‚Ð¸ Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.

Examples:

Ð¡Ð»ÐµÐ´ 30 Ð¼Ð¸Ð½ÑƒÑ‚Ð¸ Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.
Ð¡Ð»ÐµÐ´ 1 Ñ‡Ð°Ñ Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.
Ð¡Ð»ÐµÐ´ 2 Ñ‡Ð°ÑÐ° Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.
Ð¡Ð»ÐµÐ´ 2 Ñ‡Ð°ÑÐ° Ð¸ 30 Ð¼Ð¸Ð½ÑƒÑ‚Ð¸ Ð¸Ð¼Ð° Ñ€ÐµÐ·ÐµÑ€Ð²Ð°Ñ†Ð¸Ñ.

English fallback:

There is a reservation in X hours.

The warning is informational only.

It must not block saving.

It must not prevent overlaps.

The calculation should be:

next reservation start time minus current reservation start time

or, if preferred in settings:

next reservation start time minus current reservation end time

The setting should be called:

next_reservation_warning_mode

Allowed values:

from_start_time
from_end_time

Default:

from_start_time
23. Phone call suggestion

If a phone system is connected, the app should suggest the current or last caller number.

Behavior:

If there is an active phone call, suggest the active caller number.
If there is no active phone call, suggest the last caller number.
If no phone data exists, leave the phone field empty.
Staff can accept, change, or ignore the suggestion.

The reservation form should show the suggestion subtly.

Example:

Use current caller: 0644910369

The phone system should be implemented as a separate adapter/module.

Do not hardcode one phone provider into the reservation form.

Suggested table:

phone_call_events

Fields:

id
restaurant_id
phone_number
call_started_at
call_ended_at
status
source
created_at

Allowed statuses:

active
ended
missed
24. Connected tables for large groups

Sometimes staff connects tables for a larger group.

The app must support one reservation attached to multiple tables.

Example:

17:30 | 10 Ð´ÑƒÑˆÐ¸ | Ivan Petrov | 0888123456 | birthday

Internally this can be connected to:

tables 5, 6, 7

Visually, it should appear as one big rectangle across the connected table rows.

The reservation text remains:

17:30 | 10 Ð´ÑƒÑˆÐ¸ | Ivan Petrov | 0888123456 | birthday

The table numbers are visible from the left row labels.

They are not written inside the reservation.

25. Copy paste behavior for connected tables

If staff copy pastes the same reservation into multiple rows, the app should detect that it is probably one connected table reservation.

Detection can use:

same date
same time
same people count
same name
same phone
same note
created very close in time

The app should ask:

Connect these tables into one reservation?

If staff accepts, the separate pasted entries become one reservation connected to multiple tables.

If staff rejects, they remain separate overlapping reservations.

26. Row adjustment for connected tables

If connected table rows are already next to each other, do not adjust anything.

Best case:

0 visual adjustments

If the connected tables are not next to each other, the app should visually group them with the fewest possible row movements.

Important rule:

Do not change the real table numbers.
Do not change the real table assignment.
Only adjust the visual order for the current day view.

If rows are visually adjusted, highlight them.

Highlight behavior:

soft amber outline
small message: Rows visually grouped for connected reservation
temporary highlight for 3 seconds

Admin should be able to turn this behavior on or off.

Setting:

auto_group_connected_tables

Default:

true
27. Mobile behavior

The app must work on phones.

The main grid should still be available, but it must be touch friendly.

Mobile requirements:

large tap targets
sticky table number column
sticky time row
fast inline editing
horizontal scrolling
vertical scrolling
no tiny buttons
27.1 Reservation indicator outside visible area

On mobile, if the user is scrolled horizontally and there are reservations outside the visible area, show a small bubble with an arrow.

Example:

â†’ 3

Meaning:

There are 3 reservations not visible to the right.

If there are reservations hidden to the left:

â† 2

The bubble should be small and not annoying.

It should appear near the side where hidden reservations exist.

Clicking it scrolls toward the hidden reservations.

27.2 Mobile view modes

The default should be grid mode.

Optional helpful modes:

grid mode
today list mode
single table mode

Grid mode is the main product.

Today list mode can show all reservations in time order.

Single table mode can show one selected table.

These modes should not replace the main grid.

28. Upcoming reservation preparation popup

Before an upcoming reservation, the app should show a popup reminding staff to prepare the table or connected tables.

Example:

Prepare tables 5, 6, 7 for 10 people.

For one table:

Prepare table 4 for 4 people.

This reminder should be based on reservations for the selected day.

Default reminder time:

15 minutes before reservation

Admin can change it.

Setting:

prepare_popup_minutes_before

Default:

15

The popup should include:

time
table or tables
number of people
name
phone
note if present

Example:

17:15 reminder

17:30 | 10 Ð´ÑƒÑˆÐ¸ | Ivan Petrov | 0888123456 | birthday
Prepare tables 5, 6, 7 for 10 people.

Staff can dismiss it.

Do not show the same popup repeatedly after it has been dismissed on the same device.

29. Offline behavior

The app must keep working without internet.

It must not show a blank screen if internet is lost.

It must not lose reservations created offline.

Use:

service worker
IndexedDB
local mutation queue
client generated UUIDs
Supabase sync when online

Offline app shell:

HTML
CSS
JavaScript
icons
basic fallback screen

Offline data cache:

selected date
today
previous day
next day
last opened days
tables
settings
current staff profile
pending mutations

When offline, staff can:

view cached booking days
create reservations
edit locally available reservations
delete locally available reservations
move reservations
create connected table reservations

The UI should show:

Offline. Changes are saved on this device and will sync when internet returns.
30. Sync behavior

Supabase Realtime should be used while online so that changes from other staff devices appear live. Supabase documents that Realtime Postgres Changes can listen to database inserts, updates, and deletes through client subscriptions.

Offline sync must be handled by the app.

Realtime is not enough for offline safety.

The app needs a local mutation queue.

Each local change is stored as a mutation.

Mutation fields:

mutation_id
restaurant_id
device_id
staff_profile_id
operation
entity_type
entity_id
base_version
payload
created_at
sync_attempts
last_sync_attempt_at
sync_state

Allowed operations:

create
update
delete
connect_tables
disconnect_tables

Allowed sync states:

pending
syncing
synced
failed
conflict
31. No silent overwrites

The app must never silently overwrite another personâ€™s change.

Each reservation must have:

id
version
updated_at
updated_by
last_mutation_id

Every update must include:

base_version

Example:

I edited version 4.

The server accepts the update only if the current reservation is still version 4.

If the current reservation is already version 5, the server must not overwrite it.

Instead, create a sync conflict.

32. Offline overlap behavior

Because overlapping reservations are allowed, two people creating reservations at the same time is not a conflict.

Scenario:

Staff A is offline.
Staff B is offline.
Both create a reservation for table 4 at 19:00.
Both return online.

Correct result:

Both reservations sync.
Both appear in the book.
They are displayed as overlapping calendar style reservations.
Nothing is deleted.
Nothing is overwritten.

This is allowed.

33. Real conflict behavior

A conflict exists only when the same reservation record is edited in incompatible ways.

Scenario:

Staff A edits Lazar reservation while offline.
Staff B edits the same Lazar reservation while offline.
Both return online.

Correct result:

First valid update syncs.
Second outdated update becomes sync conflict.
The app keeps both versions.
Admin or manager chooses what to keep.

Conflict screen should show:

server version
local unsynced version
who changed what
when it was changed
buttons to keep server, keep local, or manually merge
34. External reservation systems

The data should be reusable and informative.

The system must allow future external reservation sources.

Examples:

website form
Google reservation integration
phone system
third party booking system
manual import

External reservations should appear in the same book.

External reservations should still use the same simple display format:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday

They can have a small hidden or optional source marker in admin details, but the normal book should remain clean.

Each external reservation should store:

source
external_source_id
external_reservation_id
raw_payload
last_imported_at

If an external update changes a reservation that staff also edited manually, do not overwrite silently.

Create a sync conflict.

35. Admin settings

Route:

/admin/bookings/settings

Only owner and admin can access.

Settings page must allow:

change table numbers
change table order
activate or deactivate tables
change opening start time
change last bookable start time
change visible end time
change default reservation duration
change time slot step
change next reservation warning mode
change preparation popup timing
turn auto connected table grouping on or off
manage staff accounts
reset staff passwords
manage external integrations

This page should be simple.

It should not look like a CMS.

36. Database model

Every major table must include:

restaurant_id

This makes the app reusable for another restaurant.

36.1 restaurants
id
name
slug
timezone
is_active
created_at
updated_at
36.2 staff_profiles
id
auth_user_id
display_name
role
is_active
created_at
updated_at
36.3 restaurant_memberships
id
restaurant_id
staff_profile_id
role
is_active
created_at
updated_at
36.4 restaurant_tables
id
restaurant_id
table_number
display_label
area
capacity_min
capacity_max
sort_order
is_active
notes
created_at
updated_at

Initial table_number values:

1
2
3
4
5
6
7
8
9
10
11
12
13
14
31
32
33
34
40
41
50
51
52
54
36.5 booking_settings
id
restaurant_id
opening_start_time
last_bookable_start_time
visible_end_time
default_duration_minutes
slot_step_minutes
next_reservation_warning_mode
prepare_popup_minutes_before
auto_group_connected_tables
allow_connected_table_reservations
created_at
updated_at

Default values:

opening_start_time: 12:00
last_bookable_start_time: 22:00
visible_end_time: 22:00
default_duration_minutes: 210
slot_step_minutes: 15
next_reservation_warning_mode: from_start_time
prepare_popup_minutes_before: 15
auto_group_connected_tables: true
allow_connected_table_reservations: true
36.6 reservations
id
restaurant_id
reservation_date
start_time
end_time
duration_minutes
party_size
customer_name
customer_phone
customer_email
customer_language
note
source
external_source_id
external_reservation_id
created_by
updated_by
version
last_mutation_id
sync_origin_device_id
deleted_at
deleted_by
created_at
updated_at

No operational status field is needed for the simple book.

If a status field exists for technical reasons, it must not drive the staff workflow.

36.7 reservation_tables

This connects one reservation to one or more tables.

id
restaurant_id
reservation_id
table_id
created_at

A normal reservation has one row.

A connected table reservation has multiple rows.

36.8 reservation_activity_log
id
restaurant_id
reservation_id
action
old_value
new_value
performed_by
performed_at
device_id
mutation_id

Examples of actions:

created
updated_time
updated_people
updated_name
updated_phone
updated_note
deleted
connected_tables
disconnected_tables
resolved_conflict
36.9 sync_conflicts
id
restaurant_id
reservation_id
mutation_id
local_payload
server_payload
base_version
server_version
created_by
device_id
resolved_by
resolved_at
resolution
created_at
updated_at

Allowed resolutions:

keep_server
keep_local
manual_merge
discard_local
36.10 external_reservation_sources
id
restaurant_id
provider_name
provider_type
is_enabled
last_sync_at
settings
created_at
updated_at
36.11 phone_call_events
id
restaurant_id
phone_number
call_started_at
call_ended_at
status
source
created_at
37. Server side rules

The database must allow overlapping reservations.

Do not create a database rule that blocks overlapping times.

Do create server protection against stale updates.

Recommended approach:

all create/update/delete operations go through Supabase RPC functions

RPC examples:

create_reservation
update_reservation
soft_delete_reservation
apply_reservation_mutation
resolve_sync_conflict

update_reservation must require:

reservation_id
base_version
payload
mutation_id

The function checks:

current version equals base_version

If yes:

apply update
increase version by 1
write activity log
return success

If no:

create sync_conflict
return conflict
38. Realtime behavior

When online, all staff should see changes live.

Examples:

Staff A adds reservation.
Staff B sees it appear.

Staff A edits phone number.
Staff B sees it update.

Staff A deletes reservation.
Staff B sees it disappear.

Admin changes table list.
Staff screens update.

Subscribe to changes for:

reservations
reservation_tables
restaurant_tables
booking_settings
sync_conflicts

Only subscribe to the selected restaurant.

Only load the selected date first.

Do not load all historical reservations on startup.

39. Local storage strategy

Use IndexedDB for offline data.

Local stores:

restaurants
staff_profile
restaurant_tables
booking_settings
reservations_by_date
reservation_tables_by_date
pending_mutations
dismissed_prepare_popups
local_ui_state

Do not rely on localStorage for full booking data.

localStorage can be used only for small things like:

device_id
last_selected_date
last_view_mode
40. PWA manifest

Create:

manifest.webmanifest

Recommended values:

{
  "name": "The Friendly Bear Bookings",
  "short_name": "Bookings",
  "start_url": "/admin/bookings",
  "scope": "/admin/bookings",
  "display": "standalone",
  "background_color": "#f5f5f4",
  "theme_color": "#334155",
  "icons": [
    {
      "src": "/icons/bookings-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/bookings-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

Every page inside the app should reference the manifest.

41. Service worker behavior

The service worker should cache:

app shell
main CSS
main JS
icons
offline fallback

It should not blindly cache all Supabase API responses.

Booking data should be stored intentionally in IndexedDB.

Network strategy:

Resource	Strategy
app shell	cache first
static assets	stale while revalidate
booking data	app controlled IndexedDB plus Supabase sync
auth calls	network first
offline fallback	cache first

If the app cannot reach the network, it continues with local data.

42. Performance requirements

The app must be optimized for PC, tablet, and phone.

Rules:

load selected day first
cache recent days only
avoid heavy widgets
avoid unnecessary animations
use CSS sticky for table column and time row
keep DOM small
use virtualization if table count grows
batch sync operations
debounce drag and resize actions
avoid full page reloads

The first screen should open quickly even on a tablet.

The booking grid should remain smooth when scrolling.

43. Error handling and no crash behavior

The requirement is:

The app should never crash during normal use.

Implementation requirements:

global error boundary
safe fallback screen
safe empty state
safe loading state
retry failed sync
autosave inline input locally
do not lose unsaved form input on network loss
do not show blank page
do not block staff from working if Supabase is temporarily unavailable

If an error happens, show:

Something went wrong, but your local booking data is safe. Refresh or continue offline.

If Supabase is unavailable, show:

Server unavailable. Changes are saved on this device and will sync later.
44. Security requirements

Enable RLS on all exposed Supabase tables.

No public unauthenticated access to operational booking data.

Rules:

not logged in means no booking data
staff can only access restaurants where they have membership
viewer cannot write
staff can create, edit, and delete reservations
admin can change settings and staff accounts
owner can do everything

Never expose Supabase service role keys in frontend code.

Sensitive admin actions should use secure server routes or Supabase functions.

45. Data reuse and modularity

The app must be reusable for another restaurant.

No hardcoded restaurant specific logic except initial seed data.

Everything restaurant specific should come from:

restaurants
restaurant_tables
booking_settings
restaurant_memberships

The following must be configurable:

restaurant name
timezone
table numbers
opening time
closing time
visible time range
reservation duration
slot step
warning behavior
preparation popup timing
connected table behavior
46. User interface details
46.1 Sticky left column

The table number column must always remain visible.

Use CSS sticky behavior.

The table column should be wide enough for:

54

and possible future labels like:

Terrace 1
46.2 Sticky time row

The time row must always remain visible.

It should not feel like a separate table row visually.

It should feel like a timeline header.

46.3 Alternating rows

Rows should alternate subtly.

Example:

row 1: white
row 2: very light blue grey
row 3: white
row 4: very light blue grey

This helps staff see where they are adding a reservation.

46.4 Reservation block text

Reservation block text should fit inside the block.

If it is too long:

truncate visually
show full text on click or long press
46.5 Click targets

Buttons and reservations must be easy to tap.

Minimum mobile tap target:

44px height where possible
47. Acceptance criteria

The MVP is accepted only if all conditions below are true.

The app exists at /admin/bookings.
The app can be installed as a PWA.
Staff can log in with Supabase.
Five premade accounts exist.
One Supabase project supports multiple staff accounts.
Admin can change table numbers.
The initial table numbers are 1 to 14, 31 to 34, 40, 41, 50, 51, 52, 54.
The book shows table numbers on the left.
The book shows time from 12:00 to 22:00.
The left table column stays visible while scrolling right.
The time row stays visible while scrolling down.
The date selector uses DD/MM/YYYY.
Previous day arrow works.
Next day arrow works.
Clicking a table row creates an inline reservation input.
The inline input has only time, people, name, phone, and optional note.
The form does not ask for table number.
The reservation display is 17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday.
The note is optional.
The reservation appears at the correct time.
The reservation has default visual width of 3.5 hours.
Clicking a reservation allows editing.
Deleting a reservation is possible.
There are no operational statuses like arrived, seated, confirmed, cancelled, or no show.
Overlapping reservations are allowed.
Overlapping reservations are displayed like calendar events.
The warning tells staff there is another reservation in X hours or X minutes.
The warning does not block saving.
The app opens while offline.
Staff can create reservations while offline.
Staff can edit cached reservations while offline.
Staff can delete cached reservations while offline.
Offline reservations sync when internet returns.
Two new overlapping offline reservations both sync successfully.
The same reservation edited by two people does not overwrite silently.
Sync conflicts are visible for admin or manager review.
Connected tables can show one large rectangle.
Copy pasted same reservation can be converted into one connected table reservation.
Rows visually adjusted for connected tables are highlighted.
Mobile shows an arrow bubble when reservations exist outside the visible horizontal area.
Before an upcoming reservation, a popup tells staff to prepare the table or tables for the number of people.
The app does not show a blank screen after errors.
The app does not lose local changes if Supabase is unavailable.
The app can be reused for another restaurant using restaurant_id.
48. Build order for Codex

Build in this order.

1. Supabase schema
2. Supabase Auth setup
3. RLS policies
4. Seed restaurant
5. Seed table numbers
6. Seed 5 staff accounts
7. Basic login page
8. Main /admin/bookings route
9. Date selector
10. Sticky table column
11. Sticky time row
12. Booking grid
13. Inline create reservation
14. Reservation display block
15. Inline edit reservation
16. Delete reservation
17. Overlap display
18. Next reservation warning
19. Admin settings for tables and times
20. PWA manifest
21. Service worker
22. IndexedDB local cache
23. Offline mutation queue
24. Sync to Supabase
25. Version based conflict handling
26. Supabase Realtime subscriptions
27. Connected table reservations
28. Copy paste connected table detection
29. Mobile hidden reservation arrow bubble
30. Upcoming preparation popup
31. External source data structure
32. Error boundary and no blank screen fallback
49. Important implementation rules

Do not add unnecessary complexity.

Do not add customer booking flow.

Do not add reservation statuses.

Do not block overlapping reservations.

Do not ask staff to type the table number.

Do not silently overwrite changes.

Do not hardcode real passwords in frontend code.

Do not rely only on frontend checks for update conflicts.

Do not make the UI look like a complex admin dashboard.

Do keep it simple like the paper book.

50. Final expected result

The final result is a private installable staff booking app at:

/admin/bookings

Staff log in.

They see a simple reservation book.

Tables are on the left.

Times are on top.

They click a row and write:

17:30 | 4 Ð´ÑƒÑˆÐ¸ | Lazar Popov | 0644910369 | birthday

The app places the reservation at the correct time.

The table is known from the row.

Reservations can overlap.

The app warns if another reservation is coming in X hours or minutes.

Large groups can use connected tables and appear as one big rectangle.

On mobile, hidden reservations to the side are indicated with a small arrow bubble.

Before an upcoming reservation, the app tells staff to prepare the correct table or tables.

The app works offline.

When internet returns, it syncs safely.

If two people changed the same reservation, nothing is overwritten silently.

The interface stays simple, but the backend is strong enough for multiple staff accounts, external integrations, offline mode, and future reuse by another restaurant.

51. Implementation TODOs

These TODOs refine the reservation book experience after the first MVP pass. They should keep the product simple, fast, and close to the feeling of a physical booking book.

51.1 Add logo and daily summary to the top bar

Status: Done.

Goal:

Staff should immediately see which booking book they are using and how busy the selected day is.

Behavior:

Show The Friendly Bear logo in the top area of the booking app.

Show a compact daily summary for the selected date:

number of reservations
total number of people

Example:

12 reservations
48 people

Rules:

The summary should count active, non-deleted reservations only.

The people total should sum party_size across active reservations for the selected date.

For connected table reservations, count the reservation once, not once per table.

Keep the top bar simple and compact.

Do not make it look like a dashboard card.

On mobile, the logo and summary should fit without pushing the date controls off screen.

51.2 Show vertical hidden reservation bubbles

Status: Done.

Goal:

Staff should know when there are reservations above or below the currently visible table rows.

Behavior:

If reservations exist in rows below the visible scroll area, show a small down bubble near the lower side of the grid.

Example:

down arrow 5

Meaning:

There are 5 reservations in table rows below the current visible area.

If reservations exist in rows above the visible scroll area, show a small up bubble near the upper side of the grid.

Example:

up arrow 3

Meaning:

There are 3 reservations in table rows above the current visible area.

Rules:

Count reservations, not empty rows.

Only count reservations outside the visible vertical area.

Keep the bubble small and calm.

The bubble should work together with the existing left and right hidden reservation bubbles.

Clicking the bubble should scroll toward the hidden reservations.

51.3 Show who created and updated each reservation in the backend/admin view

Status: Done.

Goal:

Admin and owner should be able to see which staff account created or last changed a reservation.

Data that must be stored:

created_by
updated_by
created_at
updated_at

Admin/backend display should show:

reservation details
created by staff display name
created by staff role
created by auth user email when available through a secure backend context
created time
last updated by staff display name
last updated time
device_id or mutation_id when relevant

Rules:

Do not show this information in the normal booking block.

Show it in an admin detail view, audit view, backend SQL view, or RPC result.

reservation_activity_log must also record who created, edited, deleted, connected tables, disconnected tables, or resolved conflicts.

51.4 Open today near the current time and show a current-time line

Status: Done.

Goal:

When staff open today's book, the timeline should naturally start near the current time instead of always starting at the far left.

Behavior:

When the selected date is today, automatically scroll the timeline so the current time is visible.

Do this on first load, after login, and when staff changes the selected date back to today.

Show a thin red dashed vertical line at the current time position.

The line should update as time passes.

Rules:

Do not keep force-scrolling while staff are actively working.

Do not show the current-time line for past or future dates.

The line is informational only.

It must not block clicks, inline editing, scrolling, or dragging.

51.5 Add a small person icon next to party size

Status: Done.

Goal:

The number of people should be easier to scan at a glance.

Behavior:

Show a small person icon next to the party size in reservation blocks.

Show the same small person icon next to the party size field in the inline editor.

Example visual meaning:

person icon 4

Rules:

Do not change the saved reservation text.

Do not change the backend data format.

The reservation text remains:

17:30 | 4 души | Lazar Popov | 0644910369 | birthday

The icon should be small and calm.

It should not look like a status badge.

Use an accessible label for screen readers.

On narrow mobile screens, keep the icon visible and allow longer text to truncate.

51.6 Move Settings, Conflicts, Integrations, and Sign out below the book

Status: Superseded.

Current decision:

Settings, Conflicts, Integrations, and Sign out are shown from the compact three-dot menu in the top bar.

There should be no sticky footer and no bottom footer menu in the main booking screen.

Goal:

The main screen should feel like a clean reservation book, not like a heavy app dashboard.

Behavior:

Remove the sticky bottom footer behavior.

Place Settings, Conflicts, Integrations, and Sign out below the booking grid content.

Staff should reach these links by scrolling to the bottom.

The footer links should only become reachable after staff have scrolled past the last table row.

This means the booking grid/table list should complete first, and only then should the footer links appear.

Rules:

The links should remain easy to find.

They should not stay fixed on screen while staff are using the grid.

51.7 Make the table header and table column narrower

Status: Done.

Goal:

The booking grid should give more horizontal space to the timeline and reservations.

Behavior:

Reduce the width of the left table number column and its header.

The column must still fit current table numbers, including:

1
14
54

Rules:

Keep the column readable on desktop, tablet, and mobile.

Keep the sticky left-column behavior.

Future longer table labels can be handled by settings/admin UI, but the normal booking view should stay compact.

51.8 Add 15 minutes of visual breathing room before 12:00

Status: Done.

Goal:

The first visible time should not feel pressed directly against the table column.

Behavior:

Add a small visual gutter before 12:00.

Default gutter:

15 minutes

The visible timeline should have a little space before the 12:00 label and reservation area.

Rules:

The gutter is visual breathing room only.

It should not make 11:45 a normal bookable time unless settings explicitly allow that.

Clicking inside the gutter should prefill 12:00 or the nearest valid bookable time.

51.9 Keep overlapping reservations on the same vertical level

Status: Done.

Goal:

Overlapping reservations should stay visually close to the physical-book feeling and should not make the table row look taller or messy.

Behavior:

When two or more reservations overlap on the same table, do not offset them downward.

Keep overlapping reservation blocks on the same vertical level within the row.

Use horizontal narrowing, subtle side-by-side placement, z-index, or another compact calendar-style treatment so each reservation remains clickable.

Rules:

Do not increase the table row height because of overlaps.

Do not hide or delete overlapping reservations.

Do not block overlaps.

Do not treat overlaps as sync conflicts.

Connected-table reservations should still remain visually clear and clickable.

51.10 Keep multiple open devices in sync

Status: Done.

Goal:

If the booking book is open on a PC and a phone at the same time, a reservation created, edited, or deleted on one device should appear on the other device without a manual page reset.

Behavior:

Use Supabase Realtime for fast live updates when the project publication is configured.

Also refresh the selected booking day periodically as a fallback.

Current fallback interval:

8 seconds

Refresh again when the browser tab or installed PWA becomes visible.

Rules:

Only refresh the selected day.

Do not load all historical reservations.

Do not interrupt inline editing.

Do not depend only on Realtime because phone networks, browser sleep, or Supabase publication settings can delay live events.
