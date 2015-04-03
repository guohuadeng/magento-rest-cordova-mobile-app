# Crosswalk android

1. Download: [Android(ARM + x86)](https://download.01.org/crosswalk/releases/crosswalk/android/stable/11.40.277.7/crosswalk-11.40.277.7.zip)

2. Create project:

```
[path]/bin/create Kikuu com.kikuu.android Kikuu
```

3. Add plugins:

```
npm install -g plugman # If not installed

cd Kikuu

plugman install --platform android --project . --plugin https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git

plugman install --platform android --project . --plugin https://github.com/wildabeast/BarcodeScanner.git
```

4. run

```
./bootstrap
```