
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## How to Fix Image Upload (CORS Error)

You are seeing a CORS error because Firebase Storage needs to be configured to accept uploads from your web application's domain.

**Please follow these steps to fix the issue:**

1.  **Open the Google Cloud Shell** by clicking the terminal icon in the top-right corner of the Google Cloud Console.

2.  **Make sure you are in the correct project** by running this command (replace `[YOUR_PROJECT_ID]` with your actual project ID):
    ```sh
    gcloud config set project [YOUR_PROJECT_ID]
    ```

3.  **Apply the CORS configuration** to your Firebase Storage bucket by running the following command. This command uses the `cors.json` file in this directory. (Replace `[YOUR_PROJECT_ID]` again).

    ```sh
    gsutil cors set cors.json gs://[YOUR_PROJECT_ID].appspot.com
    ```
    *Your bucket name is typically `your-project-id.appspot.com`.*

After running this command, the image upload functionality should work correctly. This is a one-time setup.
