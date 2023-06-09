<h1 align="center">🤖 DiCoBo 🤖</h1>

<p align="center">
    <img alt="Size" src="https://img.shields.io/github/languages/code-size/ballaual/DiCoBo">
    <img alt="Stars" src="https://img.shields.io/github/watchers/ballaual/DiCoBo">
    <img alt="Fork" src="https://img.shields.io/github/forks/ballaual/DiCoBo">
    <img alt="Stars" src="https://img.shields.io/github/stars/ballaual/DiCoBo">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/ballaual/DiCoBo">
    <img alt="License" src="https://img.shields.io/github/license/ballaual/DiCoBo">
</p>


## Overview

* [Permissions](#set-the-correct-permissions)
* [Requirements](#Requirements)
* [Server installation guide](#Server-installation-instructions)
* [Edit config file](#edit-the-config-file)
* [Contributing](#Contributing)
* [Contact](#author--contact)
* [License](#License)

## Set the correct permissions

When inviting the Bot make sure it has the following OAuth Scopes set in the Discord Developer Portal.

> bot<br>
> applications.commands<br>
> Manage Roles<br>
> Manage Channels<br>
> Kick Members<br>
> Ban Members<br>
> Manage Nicknames<br>
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

## Requirements
1. Nodejs>=18.15.0: **[Download](https://nodejs.org/en/download)**
2. Git: **[Download](https://git-scm.com)**
3. Discord Bot Token: **[Get it here](https://discord.com/developers/applications)**
4. Discord Bot ClientId: **[Get it here](https://discord.com/developers/applications)**

## Server installation instructions

* Windows

<details>
<summary>using CMD</summary>

1. Open CMD using `WIN + R` and type `cmd` and hit `ENTER`
2. Run `git clone https://github.com/ballaual/DiCoBo.git`
3. Run `cd DiCoBo`
4. Run `npm i` to install the required modules
5. Run `cd config` to navigate into the config folder
6. Copy or Rename `config.json.example` to `config.json`
7. Edit `config.json` - see [here](#edit-the-config-file)
8. Run `cd ..` to navigate into the root folder of the bot
9. Run `npm start` to start the bot

* To update the bot run `npm run update`
</details>

<details>
<summary>without using CMD</summary>

1. Download latest release from [here](https://github.com/ballaual/DiCoBo/releases/latest)
2. Unzip the files using WinRAR or any other package manager
3. Navigate into the folder `DiCoBo\scripts`
4. Execute `install.bat` to install the required modules
5. Navigate into the folder `DiCoBo\config`
6. Copy or Rename `config.json.example` to `config.json`
7. Edit `config.json` - see [here](#edit-the-config-file)
8. Navigate into the folder `DiCoBo\scripts`
9. Execute `startbot.bat` to start the bot

* To update the bot execute the `update.bat`
</details>

* Linux

<details>
<summary>Debian >=10</summary>

1. As root: Create a new user `useradd -m -s /bin/bash DiCoBo`
2. Login as DiCoBo using `su - DiCoBo`
3. Run `git clone https://github.com/ballaual/DiCoBo.git`
4. Run `cd DiCoBo`
5. Run `npm i` to install the required modules
6. Run `cd config` to navigate into the config folder
7. Run `cp config.json.example config.json`
8. Edit `config.json` using nano or vim - see [here](#edit-the-config-file)
9. Run `cd ..` to navigate into the root folder of the bot
10. Run `npm start` to start the bot

* To update the bot run `npm run update`
</details>

<details>
<summary>using systemd</summary>

1. Follow the guide from Debian installation guide until step 7
2. As root: Navigate to systemd's folder using `cd /etc/systemd/system/`
3. Create a new file called `DiCoBo.service`
4. Insert following code  

>[Unit]<br>
>Description=DiCoBo Discordbot<br>
>After=network.service<br>
><br>
>[Service]<br>
>User=DiCoBo<br>
>Group=DiCoBo<br>
>Type=simple<br>
>WorkingDirectory=/home/DiCoBo/DiCoBo/<br>
>ExecStart=node .<br>
>RestartSec=15<br>
>Restart=always<br>
><br>
>[Install]<br>
>WantedBy=multi-user.target<br>

5. Run `systemctl daemon-reload` to reload systemd's configs
6. Run `systemctl enable DiCoBo` to enable autostart
7. Run `systemctl start DiCoBo` to start the bot
  
Note: From now on the bot will always run in background and will automatically start when the machine gets rebooted.<br>
To stop the bot run `systemctl stop DiCoBo`<br>
To disable the autostart run `systemctl disable DiCoBo`

* Update the bot: `cd /home/DiCoBo/DiCoBo/scripts && npm run update`
</details>

## Edit the config file
Please make sure to fill every field marked as <b>*required</b> because they are mandatory for the main functions of the bot! Otherwise the bot won't start and / or might crash at some point if these information are missing.

* Required values
> - token<br>
> - clientId<br>
> - ownerId<br>
> - invite<br>
> - github<br>
> - paypal

* Optional values
> - ytcookie
> - A tutorial video for ytcookie can be found [here](https://www.youtube.com/watch?v=iQnpef9LgVM)


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
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
