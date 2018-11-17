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

const Handler = require('../helpers/handler');
const exploreResponse = require('../multimodal_responses/exploreResponse');

const planets = [
  'the sun',
  'mercury',
  'venus',
  'earth',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune'
];

const aboutResponse = require('../multimodal_responses/aboutResponse');
const sizeResponse = require('../multimodal_responses/sizeResponse');
const distanceResponse = require('../multimodal_responses/distanceResponse');
const atmosphereResponse = require('../multimodal_responses/atmosphereResponse');
const satellitesResponse = require('../multimodal_responses/satellitesResponse');

const ordinalResponses = [
  null,
  aboutResponse,
  sizeResponse,
  distanceResponse,
  atmosphereResponse,
  satellitesResponse
];

const OrdinalRequestHandler = Handler('OrdinalIntent', handlerInput => {
  const slot = handlerInput.requestEnvelope.request.intent.slots.number.value;
  const { location } = handlerInput.attributesManager.getSessionAttributes();

  if (location === 'solar system' && planets[slot]) {
    return exploreResponse(handlerInput, planets[slot]);
  }
  if (location === 'inner' && planets[slot] && slot <= 4) {
    return exploreResponse(handlerInput, planets[slot]);
  }
  if (location === 'outer' && planets[parseInt(slot, 10) + 4] && slot <= 4) {
    return exploreResponse(handlerInput, planets[parseInt(slot, 10) + 4]);
  }
  if (location !== 'apod' && ordinalResponses[slot]) {
    if (slot === 2) {
      return ordinalResponses[slot](handlerInput, location, 'earth', null);
    }

    if (slot === 3) {
      return ordinalResponses[slot](handlerInput, location, 'the sun', null);
    }

    return ordinalResponses[slot](handlerInput, location);
  }
  return handlerInput.responseBuilder.speak("I'm sorry, I can't do that right now.").getResponse();
});

module.exports = OrdinalRequestHandler;
