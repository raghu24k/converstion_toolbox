---
description: How to install Apache Maven on Windows
---

# Install Apache Maven on Windows

Follow these steps to install Maven, which is required to run the Java backend.

## 1. Download Maven
1. Visit the [Maven Download Page](https://maven.apache.org/download.cgi).
2. Scroll down to "Files".
3. Click on the `Binary zip archive` link (e.g., `apache-maven-3.9.6-bin.zip`).

## 2. Extract Maven
1. Once downloaded, extract the zip file to a permanent location.
   - Recommended: `C:\Program Files\Maven`
   - You should end up with a folder like `C:\Program Files\Maven\apache-maven-3.9.6`.

## 3. Configure Environment Variables
1. Press `Win + S` and search for **"Edit the system environment variables"**.
2. Click on the **"Environment Variables..."** button.
3. **Set JAVA_HOME** (if not already set):
   - Under "System variables", click **New**.
   - Variable name: `JAVA_HOME`
   - Variable value: Path to your Java installation (e.g., `C:\Program Files\Java\jdk-17`).
4. **Update Path**:
   - Under "System variables", find the `Path` variable and select it.
   - Click **Edit**.
   - Click **New**.
   - Paste the path to the Maven `bin` folder (e.g., `C:\Program Files\Maven\apache-maven-3.9.6\bin`).
   - Click **OK** on all windows.

## 4. Verify Installation
1. Open a new Command Prompt or PowerShell window.
2. Run the following command:
   ```powershell
   mvn -version
   ```
3. You should see output showing the Maven version and Java version.
