<h1 align="center">🤖 DiCoBo 🤖</h1>

<p align="center">
    <img alt="Size" src="https://img.shields.io/github/languages/code-size/ballaual/DiCoBo">
    <img alt="Stars" src="https://img.shields.io/github/stars/ballaual/DiCoBo">
    <img alt="Fork" src="https://img.shields.io/github/forks/ballaual/DiCoBo">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/ballaual/DiCoBo">
    <img alt="License" src="https://img.shields.io/github/license/ballaual/DiCoBo">
</p>


## Overview

* [Permissions](#set-the-correct-permissions)
* [Requirements](#Requirements)
* [Server installation guide](#Server-installation-instructions)
* [Edit .env](#edit-env-file)
* [Contributing](#Contributing)
* [Contact](#author--contact)
* [License](#License)

## Set the correct permissions

When inviting the Bot make sure it has the following OAuth Scopes set in the Discord Developer Portal.

> bot<br>
> applications.commands<br>
> Manage Roles<br>
> Manage Channels<br>
> Read Messages/View Channels<br>
> Send Messages<br>
> Send Messages in Threads<br>
> Manage Messages<br>
> Embed Links<br>
> Attach Files<br>
> Read Message History<br>
> Use External Emojis<br>
> Add Reactions<br>
> Connect<br>
> Speak<br>
> Move Members<br>
> Use Voice Activity<br>

Please make sure to set some relevant permissions on your server, to avoid trolls and griefing.<br>
1. Open your server settings
2. Navigate to Integrations -> DiCoBo
3. Set permissions for @everyone
4. You should deny at least the following commands to @everyone: clear, log, reload, registerchannel, unregisterchannel
5. You may add permissions to a moderation rules to these command
6. The lvsv command is handled in background to be used only by the server owner

## Requirements
1. Nodejs>=18.5.0: **[Download](https://nodejs.org/en/download)**
2. Git: **[Download](https://git-scm.com)**
3. Discord Bot Token: **[Get it here](https://discord.com/developers/applications)**
4. Discord Bot CLIENT_ID: **[Get it here](https://discord.com/developers/applications)**

## Server installation instructions

* Windows

<details>
<summary>using CMD</summary>

1. Open CMD using `WIN + R` and type `cmd` and hit `ENTER`
2. Run `git clone https://github.com/ballaual/DiCoBo.git`
3. Run `cd DiCoBo`
4. Run `npm i` to install the required modules
5. Copy or Rename `.env_example` to `.env`
6. Edit `.env` - see [here](#edit-env-file)
7. Run `npm start` to start the bot

* Update the bot: `npm run update`
</details>

<details>
<summary>without using CMD</summary>

1. Download latest release from [here](https://github.com/ballaual/DiCoBo/releases/latest)
2. Unzip the files using WinRAR or any other package manager
3. Navigate into the folder `DiCoBo`
4. Execute `install.bat` to install the required modules
5. Copy or Rename `.env_example` to `.env`
6. Edit `.env` - see [here](#edit-env-file)
7. Execute `startbot.bat` to start the bot

* Update the bot: Execute `update.bat`
</details>

* Linux

<details>
<summary>Debian >=10</summary>

1. As root: Create a new user `useradd -m -s /bin/bash dicobo`
2. Login as dicobo using `su - dicobo`
3. Run `git clone https://github.com/ballaual/DiCoBo.git`
4. Run `cd DiCoBo`
5. Run `npm i` to install the required modules
6. Run `cp .env_example .env`
7. Edit `.env` using nano or vim - see [here](#edit-env-file)
8. Run `npm start` to start the bot

* Update the bot: `npm run update`
</details>

<details>
<summary>using systemd</summary>

1. Follow the guide from Debian installation guide until step 7
2. As root: Navigate to systemd's folder using `cd /etc/systemd/system/`
3. Create a new file called `dicobo.service`
4. Insert following code  

>[Unit]<br>
>Description=DiCoBo Discordbot<br>
>After=network.service<br>
><br>
>[Service]<br>
>User=dicobo<br>
>Group=dicobo<br>
>Type=simple<br>
>WorkingDirectory=/home/dicobo/DiCoBo/<br>
>ExecStart=node .<br>
>RestartSec=15<br>
>Restart=always<br>
><br>
>[Install]<br>
>WantedBy=multi-user.target<br>

5. Run `systemctl daemon-reload` to reload systemd's configs
6. Run `systemctl enable dicobo` to enable autostart
7. Run `systemctl start dicobo` to start the bot
  
Note: Now the bot will always run in background and will automatically start when you restart the whole machine.<br>
To stop the bot run `systemctl stop dicobo`<br>
To disable the autostart run `systemctl disable dicobo`

* Update the bot: `cd /home/dicobo/DiCoBo/ && npm run update`
</details>

## Edit the .env file
Please make sure to fill every field marked with <b>*needed</b> because they are mandatory for the main functions of the bot! Otherwise the bot won't start and / or might crash at some point if these information are missing.

* Needed fields
> - token<br>
> - botID<br>
> - adminID<br>
> - oauthv2Link<br>
> - githubLink<br>
> - logChannel

* Optional fields
> - ytcookie

## Contributing
1. [Fork this repository](https://github.com/ballaual/DiCoBo/fork)
2. Clone your fork: `git clone https://github.com/your-username/DiCoBo.git`
3. Create your feature branch: `git checkout -b <branch-name>`
4. Commit your changes: `git commit -m <commit message>`
5. Push to the branch: `git push -u origin <branch-name>`
6. Submit a pull request

## Author & Contact
* [Ballaual](https://github.com/ballaual) - [Discord](https://discord.com/users/475642657490599937) - alex@ballaual.de

## License
Released under the [MIT License](https://github.com/ballaual/DiCoBo/blob/master/LICENSE)

## Contributors ✨

Thanks goes to these wonderful people!

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ballaual"><img src="https://avatars.githubusercontent.com/u/38478976?v=4?s=100" width="100px;" alt="Ballaual"/><br /><sub><b>Ballaual</b></sub></a><br /><a href="https://github.com/ballaual/DiCoBo/commits?author=ballaual" title="Code">💻</a> <a href="https://github.com/ballaual/DiCoBo/commits?author=ballaual" title="Tests">⚠️</a> <a href="#ideas-ballaual" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-ballaual" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Justdom22"><img src="https://avatars.githubusercontent.com/u/109627807?v=4?s=100" width="100px;" alt="Justdom22"/><br /><sub><b>Justdom22</b></sub></a><br /><a href="#ideas-Justdom22" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
