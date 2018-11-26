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

const TranscriptDirective = require('../documents/transcript');

const data = require('../data/planets.json');

module.exports = (handlerInput, shouldSpeak = true) => {
  const moon = data.earth.satellites.interesting[0];

  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const { location } = attributes;

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  attributes.location = 'the moon';
  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder
      .addDirective(
        TranscriptDirective(
          {
            image: moon.image,
            source: 'NASA',
            title: moon.label,
            description: moon.description
          },
          'EARTH · THE MOON'
        )
      )
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'transcript_document',
        commands: [
          {
            type: 'SpeakItem',
            componentId: shouldSpeak ? 'imageText' : 'doNothing',
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
      .speak(moon.description)
      .getResponse();
  }
};
