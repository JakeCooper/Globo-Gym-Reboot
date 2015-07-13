# Globo-Gym-Reboot
A sample scheduling program using the MEAN stack.

# How to install?

```
git clone http://www.Github.com/JakeCooper/Globo-Gym-Reboot.git
```

```
npm install
```

node_modules should be created successfully, and all the dependencies should be imported.

Install nodemon if you don't already have it installed globally

```
npm install nodemon -g
```

```
npm run-script dev
```
## Know Issues

1. Due to both time constraints and limited compatibility for some browsers. Globo Gym operates best on Google Chrome
2. The logout button some times does not redirect to log the user out once clicked. This can happen if it is clicked too soon after the user has logged in. Going manually to localhost:4000/logout or Globogym.me/logout is always successful. 
3. On the live version, the circular button to open the profile sometimes takes a few seconds to load.
4. On some screen sizes, the logout button on the bottom of the user sidebar is not visible. If you zoom out your screen it will be visible.
5. You are currently able to the same room back to back, meaning that even though you cannot book a room for 3 hours directly you can book a room for 2 hours then immediately book it again for one hour. We suggest to ban users that abuse this issue.
