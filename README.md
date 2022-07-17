
## Overview

```
As a coding boot camp student I want to take a timed quiz on JavaScript fundamentals that stores high scores so that I can gauge my progress compared to my peers
```

## Index

<!-- <details><summary></summary> -->

1. [Overview](#overview)
2. [Features](#features)
3. [Future Enhancements](#future-enhancements)
2. [Acceptance Criteria](#acceptance-criteria)
4. [Technologies](#technologies)
6. [Resources](#resources)

## Features

1. Scoring: Based on the demo provided, the final score is represented by the final time remaining at the end of the game. Note that for each incorrect answer 10 seconds is deducted from the time so it is possible not to finish all questions in the time alloted resulting in a time of 0 regardless of the number of correct answers. It's also possible to have a negative score if an incorrect answer occurs in the final 10 seconds (decrementing the time therefore score below 0).
2. Negative Scores: If the user is inside 10 seconds then selects a wrong answer the score could be negative because of the 10 second deduction. It was decided to allow negative scores to penalize last second incorrect answers.
3. Game Time: Total game time was set at 100 seconds vs 75 seconds as indicated in the demo to allow 10 second per question.
4. End of Game: At the end of the game the player is notified why the game ended (either "Out of Time. Game over" or "No More Questions. Game over").
5. Question Timer: Rather than advance to next question when an answer is selected as in the demo, a question timer has been set to 2 seconds. When a user selects an answer, the result is displayed ("Correct" or "Wrong") so the user can see the answer on the same page. After 2 seconds, the game advances to the next question.
6. EventListener: The event listener for each answer selection was placed inside a function after creating the element since the answer element didn't exist at initial loading of the page, and the event listener won't work properly as a global.
7. Hover: The hover styling is added using a single function that receives a parameter used to determine if hover should be added or removed via bracket on the "element.classList["add" or "remove"] rather than a method for each.
8. Exit Game or Score Page Validation: When on the question or save score page, if the user clicks the "View High Scores" link while playing the game or without saving the score, respectively, a popup appears to confirms if the users wants to exit the game or save the score.
9. Correct/Incorrect Answer: Added a green checkmark emoji for correct answers and a red cross mark emoji for incorrect answers.
10. Sticky Hover Mobile: Researched and implemented media query to address sticky hover issue on mobile devices. It works for my iPhone 7 and iPad but is not guaranteed to work across all devices.
11. Sound Effect: Plays a sound effect for a correct and incorrect answer respectively.
12. Page Router: Create a page router function to move from page to page to eliminate duplicate code for each page change.
13. Local Storage: Local storage is set/retreived at the time it is necessary rather than on page load or refresh so as to consolidate that code.

## Future Enhancements

1. Scoring: Build a scoring system that includes points for correct answers (compared to current system based on time only).
2. Answer Timing: Display correct answers at the end of the game rather than during the game.
3. Answer History: Provide the player with a summary of the game history for the current game, all games and high scoring games.
4. Next Button: Allow the player to click a button to advance to the next question (rather than using a timer or automatically moving the player forward).
5. Back Button: Allow the player to click a back button to visit previously answered questions.
6. Additional Resources: Provide a link to educational resources (e.g. MDN) for each question respectively.
7. Sound Effects: Add features to allow player to control volume, select alternative sounds and/or store the sound preference to local storage.
8. Page Router: Use anchor tags (<a>) to link to appropriate pages such as the high score page link (which would then show the page in the URL).
9. Google Speaker Icons: Utilized google speaker volume up and volume off icons. The challenge was that these icons flashed when initially presented on the question page. After multiple attempts using various versions/hacks of preload links in the header (the google icon code doesn't include preload unfortunately for icons) and seeking solutions, the decision was made to cloak the icon on the home page so that it loaded and prevented flash behavior on the quesition page. This is clearly not best practice so additional research will be done or these icons will be swapped for another option.

## Acceptance Criteria

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

## Website Preview - GIF Preview

<img src="https://media.giphy.com/media/Q8ADsZ8BhVIBepMghO/giphy-downsized-large.gif" width="100%" height="425"/>

## Technologies

1. HTML
2. CSS
3. GitHub (website hosting and source code management)

## Resources

1. GitHub Repo: <https://github.com/stevecalla/web-quiz>

2. GitHub Hosted URL: <https://stevecalla.github.io/web-quiz/>

3. Project Manager: [Steve Calla](https://github.com/stevecalla)

4. Question Source: [Interviewbit.com](https://www.interviewbit.com/javascript-mcq/)
