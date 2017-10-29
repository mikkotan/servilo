# ![Servilo](resources/banner.png)

# Servilo

Servilo is a mobile application to find restaurants for users as well as a content manager for restaurant owners.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Things needed first:
* NodeJS
* Ionic
* Cordova
* Android SDK
* Gradle

## Installation Steps for Mac OSX and Linux

  #### NodeJS
  * _Installing NodeJS for Mac OSX_
    * Open your terminal and update your homebrew `brew update`
    * Install nodejs using `brew install node`
    * Try running `npm -v` and you should see something like this `5.4.2`, and `node -v` and should see something like this         `v8.2.2`
  * _Installing NodeJS for Linux_
    * Open your terminal and install NodeJS and npm by running `sudo apt-get install nodejs npm`
    * Try running `node -v` and `npm -v` if you have installed it successfully
    * If you are running a 64-bit version of Ubuntu, you'll need to install the 32-bit libraries since Android is only 32-bit at the moment. `$ sudo apt-get install ia32-libs` If you are on Ubuntu 13.04 or greater, `ia32-libs` has been removed. You can use the following packages instead: `$ sudo apt-get install lib32z1 lib32ncurses5 lib32bz2-1.0`

  #### Ionic

  * Open your terminal and start by installing cordova by running `sudo npm install -g cordova`. Cordova is a dependency of Ionic
  * Install ionic by running `sudo npm install -g ionic`
  * Try running `cordova -v` and `ionic -v` to test if you have successfully installed

  #### Android SDK and Gradle

  * For Android SDK and Gradle we suggest you to download Android Studio, both Android SDK and Gradle will be included along with Android Studio. You may download it here:
    * [For Mac OSX](https://developer.android.com/studio/index.html#mac-bundle).
    * [For Linux](https://dl.google.com/dl/android/studio/ide-zips/3.0.0.18/android-studio-ide-171.4408382-linux.zip).

## Installation Steps for Windows
  ### NodeJS
  
  * Download the windows installer from the [NodeJS web site](https://nodejs.org/en/download/).
  * Run the installer (the `.msi` file you've downloaded)
  * Follow the prompts of the installer
  * Restart your computer. You won't be able to run NodeJS until you restart your computer.
  * Open your terminal and test NodeJS by running `node -v` and `npm -v`
  
  ### Ionic
  
  * Open your terminal and start by installing Cordova by running `npm install -g cordova`.
  * Install Ionic by running `npm install -g ionic`.
  * Try running `cordova -v` and `ionic -v` in your terminal and see if you've installed it successfully.
  
  ### Android SDK and Gradle
  
  * For Android SDK and Gradle we suggest you to download Android Studio, both Android SDK and Gradle will be included along with Android Studio. You may download it [here](https://developer.android.com/studio/index.html).
  
## Running Locally


## Built With
  * Ionic
  * AngularJS
  * NodeJS
  * Firebase
  
## Authors
