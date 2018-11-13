# Splash Screen View

<img src='images/familyphoto-splash.jpg' alt='Alexa Devices Family | Splash Screen' />

## Overview

The splash screen is displayed when first opening the skill. It is intended to mask the loading of the solar system images. It is using a clever combination of a Frame, Image and hidden ScrollView with Text. A SpeakItem directive with a delay is used to initiate the scrolling of the hidden view, which causes the opacity of the Frame and Image to be set at 0, revealing the solar system below while speaking an additional phrase.

### Layout Notes

- This is a temporary solution until animation commands are implemented.
- See [Solar System View](https://quip-amazon.com/gdEpAcbg3pCA) for additional details.

## Layout

- [/lambda/custom/documents/landing.js](../lambda/custom/documents/landing.js)

## Packages Used

None.

## Components Used

- Frame
- Image
- Text
  - SpeakItem directive to read the text.

## Variations

None.
