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

const SolarSystemDirective = require('../documents/launch');
// const SolarSystemDirective = require('../documents/test');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    handlerInput.attributesManager.setSessionAttributes({
      location: 'solar system',
      previousLocation: [],
      imageResource: null
    });

    return handlerInput.responseBuilder
      .addDirective(SolarSystemDirective())
      .addDirective({
        type: 'Alexa.Presentation.APL.ExecuteCommands',
        token: 'splash-screen',
        commands: [
          {
            type: 'SpeakItem',
            componentId: 'splashScroller',
            highlightMode: 'line',
            align: 'center',
            delay: 2000
          }
        ]
      })
      .speak(
        'Welcome to our solar system. It is made up of a star, eight planets and countless smaller bodies.'
      )
      .getResponse();
  }
};

module.exports = LaunchRequestHandler;
