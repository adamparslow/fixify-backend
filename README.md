# Fixify
Various tools designed to help improve spotify. 

## Local Setup Instructions
1.  Run 
    ```
    npm install
    ```
    in both the root directory and the ```frontend``` directory

2. Create a ```.env``` file with the following fields: 
    ```
    CLIENT_ID=from Spotify 
    CLIENT_SECRET=from Spotify
    REDIRECT_URI={yoururl}/auth/callback
    SPOTIFY_API_URL=https://api.spotify.com/vi
    ```
     
## Deployment onto Glitch
1. (First time only) run 
    ```
    npx glitcheroo setup-target
    ```
    from glitch console. 
2. From root directory, run 
    ```
    npm run deploy
    ```
3. (First time only) Copy in the link to your glitch repo.
4. Log into glitch, open a terminal and run 
    ```
    npm run build
    ```
    from the ```frontend``` folder. 

