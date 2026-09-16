FORMA

Master Product & Technical Specification

Version: 1.0
Initial Application Target: Forma v0.1.0
Platform: Progressive Web Application
Primary Target: Mobile
Secondary Target: Desktop
Project Type: Personal Nutrition, Fitness, Workout, and Progress Tracker

---

1. PROJECT OVERVIEW

Forma is a mobile-first Progressive Web Application for tracking nutrition, workouts, body progress, and fitness goals from one application.

The application combines:

- Nutrition tracking
- Calorie tracking
- Macro tracking
- Food logging
- Barcode scanning
- Weight tracking
- Exercise discovery
- Workout routines
- Live workout tracking
- Personal records
- Progress analytics

Later versions may add:

- Recipes
- Pantry
- Hydration
- Fasting
- Body measurements
- Progress photos
- Advanced insights
- Nutrition-label scanning
- AI meal recognition
- AI workout generation
- AI fitness assistance

Forma is initially intended for personal use.

However, the architecture must support multiple users from the beginning.

Every user-owned record must therefore be associated with its owner.

Forma must not copy proprietary Bitalyze source code, branding, artwork, text, or other protected assets.

Research from existing fitness applications may be used to understand common functionality and user experience patterns.

---

2. PROJECT IDENTITY

Application Name:

Forma

Tagline:

Nutrition. Training. Progress.

Initial Version:

0.1.0

Internal naming:

Application:
Forma

Repository:
forma

Frontend:
forma-frontend

Backend:
forma-backend

Database:
forma

PWA Name:
Forma

PWA Short Name:
Forma

---

3. CORE PRODUCT PRINCIPLES

Forma should follow these principles.

3.1 No Artificial Feature Locks

Forma does not contain:

- Free plans
- Pro plans
- Subscription paywalls
- Artificial daily logging limits
- Artificial barcode limits
- Premium workout features

If a feature exists in Forma, the user can use it.

External services may have their own technical or usage limits.

---

3.2 Mobile First

Forma must primarily feel like a mobile application.

The primary design target should be approximately:

360px to 430px width.

Desktop support must remain fully functional.

Desktop layouts may expand navigation and information density.

---

3.3 PWA First

Forma must be installable as a Progressive Web Application.

It should support:

- Home-screen installation
- Standalone display
- Application icons
- Splash screen
- Service worker
- Offline caching
- Update handling
- Responsive layouts

---

3.4 Offline Friendly

Core functionality should continue working without internet access whenever possible.

Examples:

- View cached dashboard
- Log food
- Log weight
- View routines
- Start workouts
- Record sets
- Finish workouts
- Browse cached exercises

Offline changes should synchronize after connectivity returns.

---

3.5 User Confirmation

Forma must never treat uncertain automated estimates as confirmed facts.

This especially applies to:

- AI meal recognition
- Nutrition-label OCR
- Serving-size estimates
- AI-generated workouts
- Imported nutrition information

The user should be able to review and correct information before saving it.

---

4. TECHNOLOGY STACK

Frontend

React

Vite

Tailwind CSS

Lucide Icons

Recharts

React Router

Axios

PWA service worker

IndexedDB

---

Backend

Node.js

Express.js

Prisma ORM

Zod validation

JWT-based authentication or secure Supabase-backed authentication

Rate limiting

Helmet

CORS configuration

---

Database

PostgreSQL

Hosted using Supabase.

---

File Storage

Supabase Storage.

Potential storage:

- Profile photos
- Progress photos
- Recipe photos
- Meal photos

Private personal content must use protected storage.

---

5. EXTERNAL DATA SOURCES

5.1 Workout Guide

Forma may integrate:

@bryllim/workout-guide

Purpose:

- Exercise database
- Exercise names
- Exercise metadata
- Equipment information
- Muscle information
- Exercise illustrations

The project currently provides hundreds of exercises and SVG exercise frames.

Forma must comply with the applicable licenses.

Attribution must be included under:

Settings → About → Open Source Licenses.

Forma should reference Workout Guide exercise identifiers instead of unnecessarily duplicating its visual assets in the database.

---

6. FOOD DATA

Forma should use a hybrid food-data system.

Source A

Forma food database.

Used for:

- Common foods
- User-created foods
- Frequently used foods
- Filipino foods
- Saved products

Source B

Open Food Facts.

Primarily used for:

- Packaged products
- Barcode lookup
- Brand information
- Serving information
- Nutrition information

External information should be normalized before Forma uses it.

---

7. APPLICATION NAVIGATION

Primary mobile navigation:

Home

Nutrition

Quick Add

Workout

Progress

The center Quick Add control should be visually distinct.

Example:

Home | Nutrition | + | Workout | Progress

---

8. QUICK ADD

Quick Add provides rapid access to common logging actions.

Initial actions:

Add Food

Log Weight

Start Workout

Future actions:

Add Water

Start Fast

Add Measurement

Progress Photo

The menu should only display functionality currently supported by the installed Forma version.

---

9. ONBOARDING

New users should complete onboarding before entering the main dashboard.

Steps:

Welcome

Personal Information

Goal

Activity Level

Nutrition Target

Finish

---

10. PERSONAL INFORMATION

Collect only information needed for Forma functionality.

Possible fields:

Name

Date of birth

Height

Current weight

Preferred units

Sex when required by selected metabolic formulas

Users should understand why formula-related information is requested.

---

11. FITNESS GOAL

Supported initial goals:

Lose Weight

Maintain Weight

Gain Weight

Users should provide:

Current weight

Target weight

Desired rate of change

Forma calculates suggested energy targets.

Users must be allowed to override calculated targets.

---

12. ACTIVITY LEVEL

Possible levels:

Sedentary

Lightly Active

Moderately Active

Very Active

Extremely Active

Activity multipliers must be documented in the code.

---

13. BMR

Forma may calculate Basal Metabolic Rate using an established equation such as Mifflin-St Jeor.

The calculation should be implemented as a dedicated utility rather than embedded directly inside UI components.

---

14. TDEE

TDEE should be estimated from:

BMR × activity multiplier

Forma must clearly describe TDEE as an estimate.

---

15. NUTRITION TARGET

Users should have targets for:

Calories

Protein

Carbohydrates

Fat

Fiber

Targets may initially be automatically suggested.

Every target should also support manual configuration.

---

16. DASHBOARD

The Home dashboard provides today's overview.

Primary information:

Calories consumed

Calories remaining

Protein

Carbohydrates

Fat

Today's workout

Current weight

Quick actions

Future dashboard information:

Water

Steps

Streak

Fasting

Insights

---

17. CALORIE DISPLAY

Example:

1,542 / 2,100 kcal

558 remaining

Forma must handle calorie values consistently across:

Dashboard

Food diary

Recipes

History

Insights

---

18. MACRO DISPLAY

Show progress for:

Protein

Carbohydrates

Fat

Fiber

Example:

Protein

92 / 130 g

Progress indicators must include text values.

Color must not be the only way progress is communicated.

---

19. NUTRITION DIARY

The Nutrition screen represents daily food consumption.

Initial meal groups:

Breakfast

Lunch

Dinner

Snacks

Each section displays:

Food

Serving

Calories

Optional macro summary

Users can:

Add food

Edit entry

Delete entry

Change quantity

Move entry between meals

---

20. DATE NAVIGATION

Users must be able to navigate between diary dates.

Examples:

Previous Day

Today

Next Day

Calendar selection

Future dates should not accidentally be treated as consumed food.

---

21. FOOD SEARCH

Food search should search:

Forma foods

Recently used foods

Favorite foods

Custom foods

External foods when appropriate

Search results should prioritize likely matches.

---

22. RECENT FOODS

Frequently repeated foods should be easy to log.

Example:

Recent

Chicken Breast

White Rice

Egg

Banana

This avoids unnecessary repeated searches.

---

23. FAVORITE FOODS

Users can favorite foods.

Favorite foods receive a dedicated filter or section.

---

24. CUSTOM FOOD

Users can manually create foods.

Required information:

Name

Serving amount

Serving unit

Calories

Optional:

Protein

Carbohydrates

Fat

Fiber

Brand

Barcode

Custom foods belong to the user unless explicitly converted into system data.

---

25. FOOD SERVINGS

Foods should support flexible quantities.

Examples:

100 g

150 g

1 serving

2 servings

1 piece

250 ml

Nutrition values must scale mathematically with quantity.

---

26. BARCODE SCANNER

Forma should support packaged-food barcode scanning.

Workflow:

Open scanner

↓

Camera permission

↓

Detect barcode

↓

Extract UPC/EAN

↓

Search local cache

↓

Search Open Food Facts when necessary

↓

Normalize product information

↓

Display nutrition

↓

User selects quantity

↓

User confirms

↓

Log food

The barcode itself must not be treated as nutritional information.

It is only an identifier.

---

27. UNKNOWN BARCODE

If no product exists:

Product not found.

Forma should offer:

Create Food

Scan Again

Cancel

The user may manually create the product and associate the barcode with it.

---

28. EXERCISE LIBRARY

Workout Guide should provide the initial exercise-reference library.

Users can browse exercises.

Filters may include:

Muscle

Equipment

Exercise type

Search term

---

29. EXERCISE CARD

Exercise cards should display:

Exercise name

Illustration

Primary muscle

Equipment

Favorite status when implemented

Cards must remain lightweight enough for mobile scrolling.

---

30. EXERCISE DETAILS

Exercise details should include:

Exercise name

Exercise demonstration

Primary muscles

Secondary muscles when available

Equipment

Instructions when available

Add to Routine

Add to Workout

---

31. EXERCISE DEMONSTRATION

Workout Guide provides multiple SVG frames for supported exercises.

Forma may animate them sequentially.

Example:

Frame 1

↓

Frame 2

↓

Frame 3

↓

Frame 2

↓

Frame 1

Repeat.

Users should be able to pause animation when appropriate.

Reduced-motion preferences should be respected.

---

32. ROUTINES

Users can create reusable workout routines.

Examples:

Push

Pull

Legs

Upper Body

Lower Body

Full Body

Users can create any custom name.

---

33. CREATE ROUTINE

Fields:

Routine name

Optional description

Exercises

Exercise order

Exercises should support drag-and-drop reordering where accessible alternatives are also available.

---

34. ROUTINE EXERCISES

Each routine exercise may contain:

Exercise reference

Target sets

Target reps

Optional target weight

Rest duration

Notes

Order

---

35. START WORKOUT

A workout may start:

From a routine

Or

As an empty workout

Starting a routine creates a new workout session.

The original routine must remain unchanged unless the user explicitly edits the routine.

---

36. ACTIVE WORKOUT

Active workout should display:

Workout name

Elapsed time

Exercises

Sets

Reps

Weight

Rest timer

Previous performance

Notes

Finish Workout

---

37. WORKOUT SET

Typical strength set:

Set number

Weight

Repetitions

Completion state

Example:

SET | KG | REPS

1 | 50 | 10

2 | 55 | 8

3 | 55 | 7

---

38. SET TYPES

Future support may include:

Normal

Warm-up

Drop Set

Failure Set

Forma v0.1.0 may begin with normal working sets only.

---

39. PREVIOUS PERFORMANCE

When repeating an exercise, Forma should show previous performance.

Example:

Previous

50 kg × 10

55 kg × 8

55 kg × 7

This allows users to progressively overload without manually checking history.

---

40. REST TIMER

Exercises may define default rest duration.

Example:

90 seconds.

Completing a set can automatically start the rest timer.

Controls:

Pause

Resume

+15 seconds

Skip

Forma should avoid unnecessary background behavior that browsers cannot reliably provide.

---

41. WORKOUT DURATION

Forma records:

Started at

Finished at

Duration

The timer should be derived from timestamps rather than relying exclusively on a continuously incrementing counter.

---

42. WORKOUT VOLUME

For weighted exercises:

Set Volume = Weight × Repetitions

Workout Volume = Sum of applicable completed sets

Bodyweight and special exercise types may require different handling.

Forma should not invent meaningless volume values for exercises where the calculation does not apply.

---

43. FINISH WORKOUT

Workout summary:

Duration

Exercises

Completed sets

Total volume when applicable

Personal records

Optional notes

Example:

Workout Complete

1h 08m

6 Exercises

18 Sets

6,420 kg Volume

2 Personal Records

---

44. WORKOUT HISTORY

History displays completed workouts.

Information:

Date

Routine/workout name

Duration

Exercise count

Set count

Volume when applicable

Selecting a workout opens complete details.

---

45. PERSONAL RECORDS

Forma should automatically detect applicable strength records.

Possible records:

Highest Weight

Most Repetitions at Weight

Estimated 1RM

Volume PR

Records should only compare compatible exercise data.

---

46. ESTIMATED 1RM

Forma may support an established estimated one-repetition-maximum formula.

The selected equation must be documented.

Estimated 1RM must clearly be labeled as estimated.

---

47. WEIGHT TRACKING

Users can log body weight.

Fields:

Weight

Date

Optional note

The system displays:

Current weight

Starting weight

Target weight

Total change

Trend

---

48. WEIGHT CHART

Progress should show weight over time.

Possible ranges:

7 Days

30 Days

3 Months

6 Months

1 Year

All

The chart should avoid implying precision unsupported by sparse measurements.

---

49. PROGRESS DASHBOARD

Initial sections:

Weight

Nutrition

Strength

Workout Consistency

Later:

Measurements

Photos

Hydration

Steps

Fasting

---

50. NUTRITION ANALYTICS

Possible metrics:

Average daily calories

Average protein

Average carbohydrates

Average fat

Calorie-target adherence

Protein-target adherence

Logged days

---

51. WORKOUT ANALYTICS

Possible metrics:

Workouts per week

Total sets

Total training volume

Most trained exercises

Strength trend

Personal records

Workout duration

---

52. OFFLINE ARCHITECTURE

Forma should not become unusable when connectivity disappears.

Use:

Service Worker

Cache Storage

IndexedDB

The local system may store pending mutations.

Example:

Offline food log

↓

IndexedDB

↓

Pending synchronization

↓

Internet restored

↓

Backend synchronization

↓

Local record reconciled

---

53. SYNCHRONIZATION

Offline-created records should receive client-generated identifiers where appropriate.

Synchronization must avoid duplicate entries.

Records should track enough information to detect conflicts.

Potential metadata:

id

updatedAt

createdAt

syncStatus

clientMutationId

---

54. PWA INSTALLATION

Forma should provide:

Web manifest

Icons

Theme metadata

Standalone mode

Service worker

Install support

Appropriate splash behavior

The app must still function normally when opened in a standard browser.

---

55. RESPONSIVE DESIGN

Mobile:

Bottom navigation

Single-column content

Touch-friendly controls

Desktop:

Sidebar navigation may replace bottom navigation.

Content may use multiple columns.

Desktop must not simply stretch the mobile UI across the screen.

---

56. ACCESSIBILITY

Forma must support:

Semantic HTML

Keyboard navigation

Visible focus indicators

Form labels

Image alt text

Screen-reader-friendly buttons

Adequate contrast

Large touch targets

Reduced motion

Accessible validation messages

Color-independent status communication

---

57. LOADING STATES

Use skeleton placeholders where appropriate.

Do not expose partially loaded content in ways that cause distracting layout shifts.

Skeletons should resemble the dimensions of actual content.

---

58. EMPTY STATES

Every data-dependent page should have a useful empty state.

Example:

No workouts yet.

Create your first routine or start an empty workout.

Actions should be obvious.

---

59. ERROR HANDLING

Do not use browser:

alert()

confirm()

prompt()

Use Forma components:

Toast

Inline error

Modal

Error state

Sensitive destructive actions require explicit confirmation.

---

60. AUTHENTICATION

Although Forma initially serves one primary user, architecture must support multiple users.

Possible authentication:

Email

Password

Sessions/tokens must be handled securely.

Passwords must never be stored in plain text.

---

61. AUTHORIZATION

Every user-owned backend resource must verify ownership.

Example:

A user must never retrieve another user's:

Food logs

Weight

Workouts

Photos

Goals

Measurements

AI conversations

Ownership checks must occur server-side.

---

62. DATA VALIDATION

Frontend validation improves UX.

Backend validation provides security and integrity.

Backend validation is mandatory.

Use Zod schemas for request validation.

---

63. PRIVACY

Forma may eventually contain sensitive personal information.

Collect only data required by enabled functionality.

Provide clear explanations for:

Health-related information

Camera access

Photo storage

External APIs

AI processing

---

64. DATA EXPORT

Future versions should allow users to export personal data.

Potential formats:

JSON

CSV

Export categories:

Nutrition

Weight

Workouts

Measurements

Fasting

Hydration

---

65. DATA DELETION

Users should eventually be able to:

Delete individual records

Delete progress photos

Delete food history

Delete workout history

Delete account

Account deletion should remove or properly anonymize associated personal information according to the intended deployment requirements.

---

66. INITIAL DATABASE ENTITIES

Core:

User

Profile

Goal

Food

FoodLog

FavoriteFood

Routine

RoutineExercise

Workout

WorkoutExercise

WorkoutSet

PersonalRecord

WeightLog

---

67. FUTURE DATABASE ENTITIES

Recipe

RecipeIngredient

PantryItem

BodyMeasurement

ProgressPhoto

WaterLog

FastingSession

Achievement

UserAchievement

AIConversation

AIMessage

---

68. FOOD MODEL

Conceptual structure:

Food

id

ownerId nullable for shared/system foods

externalId

barcode

name

brand

servingAmount

servingUnit

calories

protein

carbohydrates

fat

fiber

source

createdAt

updatedAt

Source examples:

FORMA

USER

OPEN_FOOD_FACTS

---

69. FOOD LOG MODEL

FoodLog

id

userId

foodId

date

mealType

quantity

servingMultiplier

caloriesSnapshot

proteinSnapshot

carbohydratesSnapshot

fatSnapshot

fiberSnapshot

createdAt

updatedAt

Nutrition snapshots are important.

If the original Food record changes later, historical diary totals should not unexpectedly change.

---

70. EXERCISE REFERENCES

Forma should avoid unnecessarily copying the entire Workout Guide dataset into PostgreSQL.

RoutineExercise and WorkoutExercise may store a stable external exercise identifier.

Example:

exerciseSource

exerciseId

exerciseNameSnapshot

This protects workout history if external metadata changes.

---

71. WORKOUT MODEL

Workout

id

userId

routineId nullable

name

startedAt

finishedAt

notes

status

createdAt

updatedAt

Possible status:

ACTIVE

COMPLETED

CANCELLED

---

72. WORKOUT EXERCISE MODEL

WorkoutExercise

id

workoutId

exerciseSource

exerciseId

exerciseNameSnapshot

order

notes

---

73. WORKOUT SET MODEL

WorkoutSet

id

workoutExerciseId

setNumber

weight

repetitions

completed

completedAt

createdAt

updatedAt

Future fields may support additional set types.

---

74. GOAL MODEL

Goal

userId

goalType

targetWeight

calorieTarget

proteinTarget

carbohydrateTarget

fatTarget

fiberTarget

activityLevel

weeklyWeightRate

createdAt

updatedAt

---

75. API STRUCTURE

Potential API:

/api/v1/auth

/api/v1/profile

/api/v1/goals

/api/v1/foods

/api/v1/food-logs

/api/v1/barcodes

/api/v1/routines

/api/v1/workouts

/api/v1/weight

/api/v1/progress

Future:

/api/v1/recipes

/api/v1/pantry

/api/v1/fasting

/api/v1/water

/api/v1/ai

---

76. BARCODE API FLOW

Frontend should not depend directly on an external food API for core application behavior.

Preferred architecture:

Forma Frontend

↓

Forma Backend

↓

Cache/database lookup

↓

Open Food Facts when required

↓

Normalize

↓

Return Forma food format

This gives Forma control over validation, caching, error handling, and future provider changes.

---

77. RECIPES

Target: v0.2.

Users create recipes from foods.

Recipe:

Name

Description

Servings

Ingredients

Optional photo

Instructions

Nutrition is calculated from ingredients.

---

78. RECIPE NUTRITION

Total Recipe Nutrition:

Sum of ingredient nutrition.

Per Serving:

Total Nutrition ÷ Number of Servings.

Users must be able to change serving count.

---

79. PANTRY

Target: v0.2.

Pantry item:

Food

Quantity

Unit

Optional expiration date

Optional note

Pantry may eventually power recipe recommendations.

---

80. HYDRATION

Target: v0.2.

Users set a daily water target.

Quick amounts:

+250 ml

+500 ml

Custom

Dashboard displays:

Consumed

Goal

Remaining

---

81. FASTING

Target: v0.2.

Possible fasting presets:

16:8

18:6

20:4

Custom

Fasting session:

Start

Target end

Actual end

Duration

Status

---

82. BODY MEASUREMENTS

Target: v0.2.

Potential measurements:

Waist

Chest

Hips

Arms

Thighs

Other custom measurements

Users should not be forced to track measurements they do not care about.

---

83. PROGRESS PHOTOS

Target: v0.2.

Progress photos should:

Use private storage

Include date

Optionally associate weight

Support deletion

Avoid public URLs

---

84. ACHIEVEMENTS

Target: v0.2.

Potential achievements:

First Food Log

First Workout

First Personal Record

7-Day Logging Streak

30-Day Logging Streak

10 Workouts

50 Workouts

100 Workouts

Achievements should encourage consistency without punishing users for missing days.

---

85. ADVANCED INSIGHTS

Forma should calculate deterministic insights before introducing AI.

Examples:

7-day calorie average

Protein target adherence

Weight trend

Workout frequency

Training volume trend

Strength progression

These calculations should be reproducible.

---

86. AI PRINCIPLE

AI is an enhancement layer.

Core Forma functionality must continue working without AI.

AI should never be responsible for basic arithmetic that Forma can calculate deterministically.

---

87. AI MEAL RECOGNITION

Target: v0.3.

Workflow:

Camera

↓

Meal image

↓

Vision analysis

↓

Detected foods

↓

Estimated portions

↓

Nutrition lookup

↓

User review

↓

Correction

↓

Save

Results must clearly indicate that visual serving-size estimates may be inaccurate.

---

88. NUTRITION LABEL OCR

Target: v0.3.

Workflow:

Take photo

↓

OCR

↓

Parse nutrition text

↓

Display detected values

↓

User verifies

↓

Save custom food

Never silently save OCR results without review.

---

89. AI WORKOUT GENERATOR

Target: v0.3.

Inputs may include:

Goal

Experience

Training days

Workout duration

Equipment

Preferred muscles

Limitations supplied by user

AI returns structured data.

The backend validates the structure before creating a routine.

---

90. PERSONAL ASSISTANT

Target: v0.3.

Forma may provide an assistant focused on application-supported fitness and nutrition tasks.

Potential context:

Today's calories

Macro targets

Logged meals

Weight trend

Workout history

Routines

Pantry

The assistant should receive only information necessary for the request.

---

91. HEALTH DATA INTEGRATION

Direct Health Connect integration is not part of Forma v0.1.0.

PWA platform restrictions may prevent the same integration available to native Android applications.

Initial step tracking may therefore be:

Manual

or

Imported through another supported method.

A native wrapper may be considered later if health-platform integration becomes important.

---

92. FEATURES EXCLUDED FROM INITIAL SCOPE

Do not build these during v0.1.0:

Community

Followers

Social feed

Coach accounts

Client management

Leaderboards

Subscription system

Paywalls

Premium plans

Event preparation

AI meal recognition

AI assistant

AI workout generation

Nutrition OCR

Complex health-platform synchronization

These features must not delay the core application.

---

93. FORMA v0.1.0

Required features:

PWA foundation

Authentication

Onboarding

Profile

Goals

BMR/TDEE calculations

Calorie target

Macro targets

Dashboard

Nutrition diary

Food search

Recent foods

Favorite foods

Custom foods

Serving calculations

Barcode scanner

Open Food Facts integration

Weight logging

Weight chart

Workout Guide integration

Exercise browsing

Exercise details

Exercise demonstrations

Routines

Routine builder

Active workout

Sets

Reps

Weight

Rest timer

Previous performance

Workout completion

Workout history

Volume calculations

Personal records

Basic progress analytics

Responsive mobile interface

Desktop support

Basic offline functionality

Synchronization

Settings

About

Open-source attribution

---

94. FORMA v0.2.0

Planned:

Recipes

Recipe builder

Recipe nutrition

Pantry

Hydration

Fasting

Body measurements

Progress photos

Expanded analytics

Achievements

Streaks

Improved offline support

---

95. FORMA v0.3.0

Planned:

Nutrition-label OCR

AI meal recognition

AI workout generation

AI recipe suggestions

Personal fitness assistant

Advanced insights

AI features must be optional.

---

96. FUTURE POSSIBILITIES

Potential future development:

Native Android wrapper

Health Connect integration

Automatic steps

Wearable integration

Event preparation

Workout import/export

Nutrition import/export

Additional exercise sources

Custom exercises

Custom exercise illustrations

More advanced strength analytics

---

97. SETTINGS

Settings should eventually contain:

Profile

Goals

Nutrition Targets

Units

Appearance

Offline Data

Privacy

Data Export

Account

About

Open Source Licenses

---

98. UNITS

Support:

Metric

and eventually:

Imperial

Metric examples:

kg

g

cm

ml

Imperial examples:

lb

oz

ft/in

Conversions must occur through centralized utilities.

---

99. APPEARANCE

Forma should support:

Light

Dark

System

Theme selection should persist.

The interface should remain readable in every supported theme.

---

100. APPLICATION UPDATE UX

Because Forma is a PWA, service-worker updates should be handled deliberately.

When a new version is ready:

Forma may display:

"An update is available."

Actions:

Update

Later

Updating must avoid destroying unsynchronized local records.

---

101. CAMERA PERMISSIONS

Camera access may be requested for:

Barcode scanning

Future nutrition-label scanning

Future meal recognition

Future progress photos

Forma should request camera permission only when a camera-dependent feature is actually opened.

---

102. PERFORMANCE

Forma should prioritize fast startup on mobile devices.

Avoid unnecessarily loading:

Entire exercise asset collections

Large chart libraries on screens that do not need them

AI modules during initial load

Full food databases into browser memory

Use lazy loading where appropriate.

---

103. EXERCISE ASSET CACHING

Frequently used Workout Guide illustrations may be cached.

Do not necessarily precache every exercise illustration during initial installation.

Potential strategy:

Application shell

↓

Core assets

↓

Recently viewed exercises

↓

Routine exercises

↓

Offline cache

This keeps the initial PWA installation smaller.

---

104. FOOD CACHING

Cache:

Recently used foods

Favorites

Custom foods

Recent barcode results

This allows common logging actions to remain available offline.

---

105. DATA INTEGRITY

Historical records should preserve snapshots.

Examples:

Food nutrition snapshot

Exercise name snapshot

Routine/workout name

This prevents historical information from unexpectedly changing when reference data changes.

---

106. SECURITY REQUIREMENTS

At minimum:

Secure authentication

Password hashing where passwords are backend-managed

Authorization

Zod validation

Rate limiting

Helmet

Restricted CORS

Environment variables

No secrets in frontend bundle

Private storage for sensitive photos

Parameterized/ORM database access

Safe error responses

Production logging without sensitive payload leakage

---

107. ENVIRONMENT VARIABLES

Potential backend environment:

DATABASE_URL

JWT_SECRET

SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

OPEN_FOOD_FACTS configuration when required

Future AI provider credentials

Secrets must never use the Vite public environment-variable prefix.

---

108. PROJECT STRUCTURE

Recommended root:

forma/

frontend/

backend/

README.md

Frontend:

src/

components/

pages/

features/

hooks/

services/

utils/

store/

assets/

Backend:

src/

controllers/

routes/

services/

middleware/

validators/

utils/

prisma/

---

109. FEATURE-BASED ORGANIZATION

As Forma grows, large functionality should be grouped by domain.

Example:

features/

nutrition/

workouts/

progress/

profile/

offline/

This is preferable to placing hundreds of unrelated components in one folder.

---

110. DESIGN DIRECTION

Forma should feel:

Clean

Focused

Modern

Calm

Mobile-native

Data-rich without feeling crowded

Avoid copying Bitalyze's exact visual identity.

Forma should develop its own:

Logo

Color system

Typography

Cards

Navigation

Charts

Exercise presentation

Empty states

Illustrations

---

111. FORMA BRAND DIRECTION

The name Forma suggests:

Form

Shape

Structure

Progress

Physical development

Consistency

The visual identity can therefore use simple geometric forms and movement/progress concepts.

The branding should work equally well for nutrition and training.

Avoid branding Forma exclusively around:

Weight loss

Bodybuilding

Dieting

This keeps the application broad.

---

112. DEVELOPMENT RULE

Do not implement future features simply because their database models already exist in this specification.

Development follows release scope.

Current target:

FORMA v0.1.0

Complete the core tracking experience before moving to v0.2.0.

---

113. v0.1.0 SUCCESS CONDITION

Forma v0.1.0 is successful when a user can:

Install Forma

Create an account

Complete onboarding

Set a fitness goal

Receive or configure nutrition targets

Log meals

Search foods

Scan packaged foods

Track calories and macros

Log body weight

Browse exercises

View exercise demonstrations

Create workout routines

Perform and record workouts

Track sets, repetitions, and weight

View previous workout performance

Track workout history

Identify applicable personal records

View basic nutrition, weight, and strength progress

Use core functionality from a phone

Continue important logging actions during temporary internet loss

Return the next day and use Forma as their primary personal nutrition and workout tracker.

Only after this condition is satisfied should Forma development prioritize v0.2.0.

---

114. LONG-TERM PRODUCT DIRECTION

Forma should eventually answer three questions clearly:

NUTRITION

"What have I eaten, and how does it compare with my goals?"

TRAINING

"What am I training, what did I do previously, and am I progressing?"

PROGRESS

"How has my body and performance changed over time?"

Future AI should add a fourth:

GUIDANCE

"What useful action can I take based on my actual Forma data?"

Every major feature should support at least one of these purposes.

---

115. SOURCE OF TRUTH

This Master Specification is the primary product reference for Forma.

When implementation decisions conflict with undocumented assumptions, this specification should take priority until explicitly revised.

Changes to:

Core behavior

Navigation

Database relationships

Feature scope

External integrations

Privacy behavior

Release requirements

should be reflected in the Master Specification.

Forma should be built deliberately from this specification rather than allowing temporary implementation decisions to silently become permanent product requirements.