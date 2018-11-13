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

const HelpRequestHandler = Handler('AMAZON.HelpIntent', handlerInput => {
  const { location } = handlerInput.attributesManager.getSessionAttributes();
  let speech;
  let respeech;

  switch (location) {
    case 'apod':
      speech = 'I can tell you about the image. Try, "Tell me about it."';
      respeech =
        'You can also ask to explore a planet, or learn something else about the solar system. Try, "Tell me about the Oort Cloud."';
      break;
    case 'the sun':
      speech =
        'I can give you an overview of the sun, or tell you about its size. Try, "How big is it?".';
      respeech = 'You can also ask to explore a planet, or view a random space image';
      break;
    case 'mercury':
    case 'venus':
    case 'earth':
    case 'mars':
    case 'jupiter':
    case 'saturn':
    case 'uranus':
    case 'neptune':
    case 'pluto':
      speech =
        'You can ask for an overview of the planet or information about size, distance, the atmosphere or its moons. Try, "Tell me about it," or, "How big is it?".';
      respeech = 'You can also ask to explore another planet, or view a random space image';
      break;
    default:
      speech =
        'I can take you almost anywhere you want to go in our solar system. Try "Take me to Saturn," or, "I\'d like to explore Saturn".';
      respeech =
        'You can also ask me specific things about the planets, like, "Tell me about Saturn\'s rings."';
      break;
  }

  return handlerInput.responseBuilder
    .speak(speech)
    .reprompt(respeech)
    .addConfirmIntentDirective()
    .getResponse();
});

module.exports = HelpRequestHandler;
