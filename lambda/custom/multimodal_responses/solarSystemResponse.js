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

const SolarSystemDirective = require('../documents/solarSystem');

module.exports = handlerInput => {
  const directive = SolarSystemDirective();

  const attributes = handlerInput.attributesManager.getSessionAttributes() || {};
  const { location, previousLocation } = attributes;

  if (previousLocation && previousLocation[previousLocation.length - 1] !== location) {
    attributes.previousLocation.push(location);
  }

  attributes.location = 'solar system';
  handlerInput.attributesManager.setSessionAttributes(attributes);

  return handlerInput.responseBuilder
    .addDirective(directive)
    .speak('Heading to the solar system. Where would you like to explore next?')
    .getResponse();
};
