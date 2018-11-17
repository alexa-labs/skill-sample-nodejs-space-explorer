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

const data = require('../data/planets.json');
const TranscriptDirective = require('../documents/transcript');

module.exports = (handlerInput, planet, speak = true) => {
  const { about } = data[planet];

  about.image = about.images[Math.floor(Math.random() * about.images.length)];

  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== planet
  ) {
    attributes.previousLocation.push(attributes.location);
  }

  attributes.location = planet;
  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder
      .addDirective(TranscriptDirective(about, `${planet.toUpperCase()} · OVERVIEW`))
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'transcript_document',
        commands: [
          {
            type: 'SpeakItem',
            componentId: speak ? 'imageText' : 'doNothing',
            highlightMode: 'line',
            align: 'center'
          },
          {
            type: 'Scroll',
            componentId: 'scrollContainer',
            distance: -10000
          }
        ]
      })
      .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(about.description)
      .reprompt('What else would you like to learn?')
      .getResponse();
  }
};
