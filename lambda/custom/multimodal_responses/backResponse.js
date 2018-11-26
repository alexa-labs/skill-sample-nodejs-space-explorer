/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const planetDirective = require('../documents/planet');
const solarSystemDirective = require('../documents/solarSystem');
const solarSystemZoneDirective = require('../documents/solarSystemZone');
const karaoke = require('../documents/transcript');

module.exports = handlerInput => {
  const sA = handlerInput.attributesManager.getSessionAttributes();
  const previous = sA.previousLocation;
  let directive;

  if (previous.length) {
    const loc = previous.pop();
    let cleanedLoc = loc;

    switch (loc) {
      case 'apod':
        directive = karaoke(sA.imageResource);
        cleanedLoc = 'your random space image';
        break;
      case 'solar system':
        directive = solarSystemDirective();
        cleanedLoc = 'the solar system';
        break;
      case 'inner':
      case 'outer':
        directive = solarSystemZoneDirective(loc);
        cleanedLoc = `the ${loc} solar system`;
        break;
      default:
        directive = planetDirective(loc);
        break;
    }

    handlerInput.attributesManager.setSessionAttributes({
      previousLocation: previous,
      location: loc
    });
    
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      return handlerInput.responseBuilder.addDirective(directive).getResponse();
    } else {
      return handlerInput.responseBuilder
        .speak(`Okay. Heading back to ${cleanedLoc}.`)
        .getResponse();
    }
  }
  if (previous) {
    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t go back any further. If you would like to exit, say "exit".')
      .reprompt(
        'If you would like to exit, say "exit". Or ask to visit a planet in the solar system.'
      )
      .getResponse();
  }

  handlerInput.attributesManager.setSessionAttributes({
    previousLocation: [],
    location: 'solar system'
  });

  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder.addDirective(solarSystemDirective()).getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak('Okay. Heading back to the solar system. Where would you like to explore? You can ask me to take you anywhere in our solar system. Try, "take me to Mercury."')
      .reprompt('Where would you like to explore?')
      .getResponse();
  }
};
