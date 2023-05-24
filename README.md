Server List for MultiFPS - Multiplayer first person shooter project template 
Game utilizing this server list can be tested here: http://desnetware.net/?S=D_MultiFPS#

## Overview ##

This app runs server builds of MultiFPS, stores properties of those running games, such as: map, gamemode, current connected players, session name,
and sends this data to clients that request it, so their game can recreate this as server list, then they can select game and will be automatically connected to it.

## Install ##

1. Install nodejs on machine that You will be running this app
2. Make server build of MultiFPS and place it in /build folder
3. Open config file in /config/default.json
4. For host paste Your VM ip, or leave localhost as it is if You want to run this app locally on your machine
For executable name paste name of server build executable file with which we placed in folder /build in step 1 with extension name
5. Run app
6. Now app is ready and listens for clients request's

