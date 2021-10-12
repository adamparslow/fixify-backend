# Fixify Backend
Various tools designed to help improve spotify. 

## Local Setup Instructions
1.  Run ```npm install```

2. Create a ```.env``` file with the following fields: 
    ```
    CLIENT_ID=from Spotify 
    CLIENT_SECRET=from Spotify
    REDIRECT_URI={yoururl}/auth/callback
    SPOTIFY_API_URL=https://api.spotify.com/vi
    FRONTEND_URI={yourfrontendurl}
    ```

## Firebase Deployment
### `gcloud` Setup
1. Follow the following link: [gcloud Setup](https://cloud.google.com/sdk/docs/quickstart#deb)

2. Run `gcloud init` from repo, select `fixify-backend`
     
## Deployment
Run `npm run deploy` to deploy to google cloud
