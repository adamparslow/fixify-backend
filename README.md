# Fixify Backend
Various tools designed to help improve spotify. 

## Local Setup Instructions
1.  Run ```npm install```

2. Create a ```.env.local.json``` file with the following fields
    ```
    {
        "spotify": {
            "client_id": "",
            "client_secret": "",
            "api_url": ""
        },
        "fixify": {
            "redirect_uri": "/auth/callback",
            "frontend_uri": ""
        }
    }
    ```

3. Create a ```.env.prod.json``` with the same structure

     
## Deployment
Run `firebase deploy` to deploy to firebase

May need to run `firebase init` first. 
