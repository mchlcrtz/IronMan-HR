# TeamGroot-HR
> Welcome to the Save Gudetama typing game! 
>
> Play against yourself and beat your highscore or play online in multiplayer mode.

## About this project
This app was build during HackReactor's 15th NYC cohort. Our Team took over the project as legacy code, which has been built by another group the week before. Our team added a few features during one week.

## What existed
The functionality of the game itself existed already. MultiPlayer was possible, but more than 2 players online would crash the app. Also the UI/UX was unintuitive.

## What we added
- The ability to choose Single or MultiPlayer.
- Allowing multiple rooms to host matches at the same time
- Random player matching functionality
- Challenging another user that is online
- Different modes for single player (easy, medium, difficult)
- Design improvements
- Bug fixes

## Our Team
  - __Product Owner__: Laurents Mohr https://github.com/laurentsmohr
  - __Scrum Master__: Michael Cortez https://github.com/mchlcrtz
  
## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> In MultiPlayer: You see other players in the lobby. You can either ask for random player matching or click on an online user, which will 
send a challenge request to that user. If the other user accepts, the game will start. In random player matching, the game starts as soon as another player is found.
> In Single Player you can set the difficulty level. Easier difficulties will have shorter words than harder difficulties.


## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```
__Starting the Server:__
```sh
npm start
```
__Running Webpack/Starting Dev Environment:__
```sh
npm react-dev
```

### Suggestions for where to go from here - take or leave!
- Design improvements
- Button to toggle background music on/off
- Chat functionality
- Authentication for data persistence of user's high scores. (Currently anyone can log-in with any username.)
- PowerUps
- Different themes
- Different languages
