
## Overview

```
AS A coding boot camp student
I WANT to take a timed quiz on JavaScript fundamentals that stores high scores
SO THAT I can gauge my progress compared to my peers
```

## Index

<!-- <details><summary></summary> -->

1. [Overview](#overview)
2. [Acceptance Criteria](#criteria)
4. [Technologies](#technologies)
6. [Resources](#resources)

## Functional/Features Implemented

1. Alert: A window alert is presented to inform the user why the game ended (either "Out of Time. Game over" or "No More Questions. Game over").
2. Question Timer: Rather than advance to next question when an answer is selected, a question timer has been set to 2 seconds. When a user selects an answer, the result ("Correct" or "Wrong" is displayed) for 2 seconds so the user can see the answer on the same page as the question then the game advances to the next question.
3. Negative Scores: If the user is inside 10 seconds then selects a wrong answer the score could be negative because of the 10 second deduction.
4. EventListner - added event listener inside function after element was created since that element didn't exist at initial loading of the page.
5. Add/remove hover CSS style on answers using single function & bracket notation to pass "add"/"remove" as a parameter appended to "element.classList["add" or "remove"]"
6. Validation: When on the save score page, if the user doesn't save the score but clicks the "View High Scores" link, a window confirm popup appears to confirm that they don't want to save it.

## Criteria

```
GIVEN I am taking a code quiz
WHEN I click the start button
THEN a timer starts and I am presented with a question
WHEN I answer a question
THEN I am presented with another question
WHEN I answer a question incorrectly
THEN time is subtracted from the clock
WHEN all questions are answered or the timer reaches 0
THEN the game is over
WHEN the game is over
THEN I can save my initials and my score
```

## Website Preview - Video Preview

<img src="https://media.giphy.com/media/vyRpm5Rk0Ab5LBYt8T/giphy-downsized-large.gif" width="100%" height="425"/>

## Technologies

1. HTML
2. CSS
3. GitHub (website hosting and source code management)

## Resources

1. GitHub Repo: <https://github.com/stevecalla/web-quiz>

2. GitHub Hosted URL: <https://stevecalla.github.io/web-quiz/>

3. Project Manager: [Steve Calla](https://github.com/stevecalla)