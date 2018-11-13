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
const data = require('../data/planets.json');
const TranscriptDirective = require('../documents/transcript');

const ObjectRingHandler = Handler('ObjectRings', handlerInput => {
  let speech = '';
  const attributes = handlerInput.attributesManager.getSessionAttributes();
  const location =
    handlerInput.requestEnvelope.request.intent.slots.celestial_object.value || attributes.location;

  if (location) {
    const { rings } = data[location.toLowerCase()];
    speech = !rings ? `${location} doesn't have a ring system.` : '';
  } else {
    speech = "Hmm. I don't know that one.";
  }

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== location
  ) {
    attributes.previousLocation.push(location);
  }

  if (!attributes.previousLocation) {
    attributes.previousLocation = ['solar system'];
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (speech) {
    return handlerInput.responseBuilder.speak(speech).getResponse();
  }
  return handlerInput.responseBuilder
    .addDirective(
      TranscriptDirective(
        {
          image: `https://s3-us-west-2.amazonaws.com/ddg-skill/assets/rings_${location.toLowerCase()}.jpg`,
          description: data[location.toLowerCase()].rings,
          source: 'NASA'
        },
        `${location.toUpperCase()} · RINGS`
      )
    )
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
});

module.exports = ObjectRingHandler;
