# Escape From Earth Backend

[![Build Status](https://travis-ci.org/theParadox42/EFE-Backend.svg?branch=auth)](https://travis-ci.org/theParadox42/EFE-Backend)

This is the backend part of [escape from earth](https://escapefromearth.tk) that handles the community section of it. Changes are currently underway. `v1` is the version in use, but is about to be deprecated. `v2` is about to be released and brings a lot of great changes including user authentication, liking, disliking, and flagging levels, plus security boosts. The versions are available at [escape-from-earth.herokuapp.com/v1 OR v2](escape-from-earth.herokuapp.com)  

A api documentation is not released, so if you feel like you want to understand it, just contact me and I can guide you from there.  

You are welcome to submit an issue or open up a pull request if you want.

Feel free to contact me [here](https://paradox42.tech/p/contact) if you have any questions or concerns.

## Setting Up On a Local Device
 - Clone or download however desired onto a computer, with a terminal  
 - Make sure `node.js` and `npm` are installed  
 - Run `npm install`  
 - Create a file called `.env`  
 - Fill that file with the following info
```txt
DB=test_db
DB_USER=[EFE Mongo Atlas Username]
DB_PASS=[EFE Mongo Atlas Password]
PORT=3000
SECRET=W&@tEv%r_&ecR#t+Y0u.C{0O$e,I%-gR8!
ACCESS_CONTROL_ALLOW_ORIGIN=*
```