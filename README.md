# Skill Sample Nodejs Space Explorer

<img src="https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png" />

Alexa Presentation Language (APL) gives developers the ability to create rich, engaging and unique visual experiences for users. This skill is meant to be an example of how to use the language, the capabilities of APL, and how to think about and develop true, multi-modal experiences for Alexa-enabled devices with a screen.

## APL 1.1 Release Updates

With the release of APL 1.1, Space Explorer has been updated to demonstrate a number of new features, including:

- Video
- Animations
- Alexa Vector Graphics (AVG)
- Alexa Responsive Layouts

### Animations

A new animation package has been created to facilitate reuse of the same animation framework across all pages. This drastically reduces the amount of code written, allows parameterization of custom animations, and maintains a consistent feel across the skill. See [soft-stagger.json](packages/soft-stagger.json) for the code behind how this was achieved.

### AVG

Because of the dynamic nature of APL responses, a graphics package was built to serve vector graphics for the atmosphere data on larger screens. See [atmosphere-graphics.json](packages/atmosphere-graphics.json) for an example of an AVG package.

### Alexa Responsive Layouts

Alexa Responsive Layouts are pre-made layouts built by Amazon to work across all device categories and viewport sizes. Including these eliminates several lines of code and conditional statements throughout the skill. It also alleviates the need to update the skill every time a new device comes online. Visit the Alexa Design Guide's [Responsive Components](https://developer.amazon.com/docs/alexa-design/background.html) section for more information and usage.

## Quicklinks

- [Tenets](#design-tenets)
- [Voice Navigation](#voice-navigation-supported-utterances)
- [Views](#views)
- [Data](#data)
- [Documentation](#documentation)

## Design Tenets

### Be Voice-Forward, but not Voice-Only

- Anything a user can touch should have a voice counterpart. However, everything said in voice does not need a touch input.
- What Alexa says should be relevant to what she shows and vice versa.
- Users will likely alternate between looking at a device and looking away throughout the experience. Be sure the voice flow and screen flow are comprehensive on their own and complimentary together. Screens should provide additional context when Alexa is speaking.

### Honor User Modality

If a user speaks to Alexa, then Alexa should respond with voice. If a user touches the screen, then Alexa should not respond with voice.

### Emphasize Patterns & Consistency

Adherence to common patterns will reduce cognitive overhead for users.

## Development Tenents

### Reusability

Don't create new layouts for each new page. Reuse where possible and make components as flexible as possible.

### Logical Structure

Don't make the code unnecessarily complex, but break things up where it makes sense for reusability.

## Voice Navigation (_Supported Utterances_)

### Exploring

Visit any planet in the Solar System by saying:

- _Alexa, **take me to** Mars._
- _Alexa, **go to** Venus._
- _Alexa, **show me** Neptune._

Throughout the skill, you can return to your previous destination by saying:

- _Alexa, **go back**._

### Learning

Once you've arrived at a planet, you can learn more about it by saying:

- _Alexa, number one._
- _Alexa, tell me about it._
- _Alexa, how big is it?_
- _Alexa, how far away is it?_
- _Alexa, what's in its atmosphere?_
- _Alexa, how many moons does it have?_

### Astronomy Pictures

You can view a random image from the Astronomy Picture of the Day archives by saying:

- _Alexa, show me a random image._
- _Alexa, show me a space image._

If you're curious about it, say:

- _Alexa, tell me about it._

### Learn more

Curious about other things in our solar system? Try saying:

- _Alexa, tell me about the Kuiper Belt._
- _Alexa, how much bigger is Uranus than Neptune?_
- _Alexa, tell me about Saturn's rings._
- _Alexa, what happened to Pluto?_

## Views

Space Explorer uses a number of page templates to create engaging experiences for users. The goal is to reuse and be flexible, rather than create new layouts for each viewport class.

A single page template exists for each primary view within the skill. Layouts were authored with Large Landscape Hubs as the starting point, then responsive breakpoints were added for larger and smaller devices (Extra Large TV, Medium Landscape Hub, Small Round Hub). When the layout for a particular device varied significantly, an alternative device-specific template was authored, such as the Solar System View on a Small Round Hub.

### Solar System View

[Solar System View](docs/solar_system_view.md)

### Horizontal Image List View

[Horizontal Image List View](docs/horizontal_image_list_view.md)

### Planet Details

[Planet Details View](docs/planet_details_view.md)

### Transcript View

[Transcript View](docs/transcript_view.md)

### Size

[Size View](docs/size_view.md)

### Distance

[Distance View](docs/distance_view.md)

### Atmosphere

[Atmosphere View](docs/atmosphere_view.md)

## Data

The data for this skill is self-contained for training purposes. This was done to ensure you could easily view, edit, and test our sample skill without any issues or added complexity from API keys. We recommend finding or creating an API for data when building skills for distribution in the Skills Store.

## Documentation

### Technical Documentation

[https://developer.amazon.com/docs/alexa-presentation-language/apl-overview.html](https://developer.amazon.com/docs/alexa-presentation-language/apl-overview.html)

## License

This library is licensed under the Amazon Software License.
