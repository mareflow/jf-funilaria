# Git Auto-Sync Rule

Whenever any file in this repository is created, modified, or deleted:
1. Always run git add, commit with a concise descriptive message in Portuguese, and push directly to `origin main`.
2. Use the persistent credentials already configured in `.git/config` so it executes seamlessly without any interactive prompt or error.
3. Path configuration: always ensure the git binary path is included:
   `$env:PATH = "C:\Users\Lenovo\AppData\Local\GitHubDesktop\app-3.6.7\resources\app\git\cmd;C:\Users\Lenovo\AppData\Local\GitHubDesktop\app-3.6.7\resources\app\git\mingw64\bin;" + $env:PATH`
4. Command template:
   `git add -A ; git commit -m "<mensagem clara>" ; git push origin main`
