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

module.exports = (handlerInput, destination, speak = true) => {
  const attributes = handlerInput.attributesManager.getSessionAttributes() || {};
  const { location } = attributes;
  let text = `Okay. Approaching ${destination}.`;

  if (location !== 'solar system' && location !== undefined) {
    const loc = location === 'apod' ? 'your random image' : location;

    text = `Okay. Leaving ${
      loc === 'inner' || loc === 'outer' ? `the ${location} solar system` : location
    } and heading to ${destination}.`;
  }

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  attributes.location = destination;
  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder
      .speak(speak && text)
      .addDirective(planetDirective(destination))
      .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(`${text} What would you like to learn? You can ask me how big it is, how far away it is, what its atmosphere is made of, and how many moons it has. Or, you can just ask me to tell you about it.`)
      .reprompt('What would you like to learn?')
      .getResponse();
  }
};
