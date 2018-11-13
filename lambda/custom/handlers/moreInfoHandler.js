/*
 * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 * 
 * Licensed under the Amazon Software License (the License).
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 * http: //aws.amazon.com/asl/
 * 
 * or in the license file accompanying this file. This file is distributed
 * on an AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const Handler = require('../helpers/handler');
const AboutResponse = require('../multimodal_responses/aboutResponse');

const planets = [
  'the sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto'
];

const MoreInfoRequestHandler = Handler('MoreInfo', handlerInput => {
  const { location } = handlerInput.attributesManager.getSessionAttributes();

  if (location === 'apod' || location === 'the moon') {
    return handlerInput.responseBuilder
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'transcript_document',
        commands: [
          {
            type: 'SpeakItem',
            componentId: 'imageText',
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
  }
  if (planets.indexOf(location) !== -1) {
    return AboutResponse(handlerInput, location);
  }
  return handlerInput.responseBuilder.speak("I'm sorry, I don't know that one.").getResponse();
});

module.exports = MoreInfoRequestHandler;
