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
const SatellitesDirective = require('../documents/satellites');

module.exports = (handlerInput, location, speak = true) => {
  const info = data[location.toLowerCase()].satellites;

  let speech = `${location} has a total of ${info.total} moon${
    info.total === 1 ? '' : 's'
  }. Of those, ${info.interesting.length}${
    info.interesting.length > 1 ? ' are' : ' is'
  } of interest: `;

  info.interesting.forEach((item, i) => {
    speech +=
      i < info.interesting.length - 1 || info.interesting.length === 1
        ? `${item.label}, `
        : `and ${item.label}.`;
  });

  if (info.total === 0) {
    speech = `${location} has no moons.`;
  }

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
      .addDirective(SatellitesDirective(location.toLowerCase()))
      .speak(speak && speech)
      .getResponse();
  } else {
    return handlerInput.responseBuilder
      .speak(speech)
      .getResponse();
  }
};
