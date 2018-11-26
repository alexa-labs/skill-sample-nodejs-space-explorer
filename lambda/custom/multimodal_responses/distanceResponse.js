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

const DistanceDirective = require('../documents/distance');
const data = require('../data/planets.json');

module.exports = (handlerInput, object1, object2 = 'the sun', text, speak = true) => {
  const distance = data[object1.toLowerCase()].distance - data[object2.toLowerCase()].distance;
  const speech =
    text ||
    `${object1}'s orbit is ${Math.abs(distance)} miles from ${
      object2 === 'the sun' ? object2 : `${object2}'s orbit`
    }`;

  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== attributes.location
  ) {
    attributes.previousLocation.push(attributes.location);
  }

  handlerInput.attributesManager.setSessionAttributes(attributes);

  if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
    return handlerInput.responseBuilder
      .speak(speak && speech)
      .addDirective(DistanceDirective(object1.toLowerCase(), object2.toLowerCase()))
      .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(speech)
      .getResponse();
  }
};
