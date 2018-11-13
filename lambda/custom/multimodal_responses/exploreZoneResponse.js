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

const ExploreZoneDirective = require('../documents/solarSystemZone');

module.exports = (handlerInput, zone, speak = true) => {
  const cleanedZone = zone.search('inner') !== -1 ? 'inner' : 'outer';

  const attributes = handlerInput.attributesManager.getSessionAttributes();

  if (
    attributes.previousLocation &&
    attributes.previousLocation[attributes.previousLocation.length - 1] !== attributes.location
  ) {
    attributes.previousLocation.push(attributes.location);
  }

  if (!attributes.previousLocation) {
    attributes.previousLocation = ['solar system'];
  }

  attributes.location = cleanedZone;

  handlerInput.attributesManager.setSessionAttributes(attributes);

  return handlerInput.responseBuilder
    .addDirective(ExploreZoneDirective(cleanedZone))
    .speak(
      speak && `Welcome to the ${cleanedZone} solar system. Which planet would you like to visit?`
    )
    .getResponse();
};
