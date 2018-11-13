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

  if (!previous) {
    handlerInput.attributesManager.setSessionAttributes({
      previousLocation: [],
      location: 'solar system'
    });

    return handlerInput.responseBuilder.addDirective(solarSystemDirective()).getResponse();
  }

  if (previous.length) {
    const loc = previous.pop();

    switch (loc) {
      case 'apod':
        directive = karaoke(sA.imageResource);
        break;
      case 'solar system':
        directive = solarSystemDirective();
        break;
      case 'inner':
      case 'outer':
        directive = solarSystemZoneDirective(loc);
        break;
      default:
        directive = planetDirective(loc);
        break;
    }

    handlerInput.attributesManager.setSessionAttributes({
      previousLocation: previous,
      location: loc
    });

    return handlerInput.responseBuilder.addDirective(directive).getResponse();
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

  return handlerInput.responseBuilder.addDirective(solarSystemDirective()).getResponse();
};
