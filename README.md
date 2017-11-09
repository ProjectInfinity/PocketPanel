# PocketPanel [WIP]

Links will come here shortly. In the meantime enjoy some placeholder text because neither the forums nor the panel GUI is up yet.

## What is PocketPanel?

PocketPanel is both a wrapper and a web-based graphical user interface to control your Minecraft Pocket Edition server.

The wrapper is completely free to use and open source, the Web Interface has a free hosted version with premium options available for power users. Running standalone provides you with (currently) all features available in PocketPanel in form of console commands, some features are expected to only be available where there is a interface to work with.

## Installation

### Ubuntu / Debian

#### Install dependencies

### CentOS / RHEL
-- Coming soon --

- - -

### macOS
-- Coming soon --

- - -

### Windows

#### Install dependencies

Ensure NodeJS is installed and is at least version 8.0 or above.

To check your installed NodeJS version, press Windows + R and type `cmd` in the text field.
Once CMD has opened, type `node -v` in your CMD window. If installed it should show you something similar to the following output:

```cmd
C:\Users\Alex>node -v
v8.1.4
```

If the window shows a version lower than 8.0 or if it says `'node' is not recognized as an internal or external command, operable program or batch file.` then you have to install NodeJS version 8.

Go to the following page and download NodeJS, you can choose either the `LTS` or `Current` version. Both will work.

<https://nodejs.org/en/>

Once installed, open up CMD like mentioned earlier and type `node -v` to ensure NodeJS is recognized.

#### Get PocketPanel
Next download the source code for the wrapper, you can either do this by downloading the repository as a ZIP archive or by cloning it (recommended).

If you have git installed (download it here <https://git-scm.com/download/win>) and it is available in your path, open up CMD by pressing Windows + R and typing in cmd. Once opened navigate to where you want PocketPanel to be located, then proceed by typing `git clone https://github.com/ProjectInfinity/PocketPanel.git`

Alternatively you can download the repository as a ZIP archive by clicking the following link:
<https://github.com/ProjectInfinity/PocketPanel/archive/master.zip>

Once downloaded, extract it where you want PocketPanel to be located and proceed to the next step.

#### Running PocketPanel

In your CMD window, ensure you are in the directory of PocketPanel and type `npm install` to install the PocketPanel dependencies. This may take a minute or two, so don't cancel it.

Once completed you may type `npm start` to run PocketPanel.
PocketPanel runs in the foreground so make sure you do not close the window as that will also close your server. This may change in the future.

- - -

### BSD

Follow the Linux instructions for guidance. If you're using BSD I hope you're familiar enough with the operating system to run a NodeJS program.

- - -

## Caveats

Since PocketPanel is incredibly early in development it is **not** ready to be seriously used by anyone yet. If you really wish to try it out however, it is recommended to take a backup of your server and copy all the files into a folder called `server` inside the main PocketPanel folder.

Like mentioned above, **you are required** to copy all your currently working server files into a folder called `server` in the main PocketPanel folder.

Another thing you need to make sure is that the PocketMine PHAR file is located inside the `server` folder and is called `PocketMine-MP.phar`.